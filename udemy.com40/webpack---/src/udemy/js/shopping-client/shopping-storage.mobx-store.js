import {action, observable, runInAction, toJS, when} from 'mobx';

import {attachFrontendTrackingIds} from 'browse/tracking';
import getConfigData from 'utils/get-config-data';
import udApi, {getHttpCacheHeaders} from 'utils/ud-api';
import udExpiringLocalStorage from 'utils/ud-expiring-local-storage';
import udMe from 'utils/ud-me';
import udPerf from 'utils/ud-performance';

import commandQueue from './command-queue';
import config from './config';

export default function shoppingStorage() {
    /*
     * Internal State
     */
    const now = new Date();
    const expirationDate = new Date(now.setDate(now.getDate() + 30));
    const localStorage = udExpiringLocalStorage(
        'shoppingCartStorage',
        'storage-1.0',
        expirationDate,
    );

    const defaultState = {
        etag: null,
        credit: {
            amount: 0,
        },
        discounts: [],
        lists: {
            cart: [],
            express: [],
            saved_for_later: [],
            wishlist: [],
        },
        unseenCounts: {
            cart: 0,
            express: 0,
            saved_for_later: 0,
            wishlist: 0,
        },
        userId: null,
        availableCoupons: [],
    };
    const state = observable({...(localStorage.get('state') || defaultState)});
    const queue = commandQueue();
    const status = observable.box(config.storage.status.notReady);

    /*
     * Datastore Api
     */

    const storage = {
        credit: state.credit,
        discounts: state.discounts,
        lists: state.lists,
        status,
        availableCoupons: state.availableCoupons,
    };

    storage.fetch = () => {
        if (!getConfigData().features.shopping_cart || (!state.userId && !state.etag)) {
            runInAction(() => {
                storage.status.set(config.storage.status.ready);
            });
            return Promise.resolve(true);
        }

        udPerf.start('_cartApi');
        const params = new URLSearchParams(window.location.search);

        return makeDeferredRequest({
            method: 'get',
            url: config.urls.cartAPI,
            params: Object.fromEntries(params),
        })
            .then(
                action(() => {
                    udPerf.end('_cartApi');
                    storage.status.set(config.storage.status.ready);
                }),
            )
            .catch(
                action(() => {
                    storage.status.set(config.storage.status.unAvailable);
                }),
            );
    };

    storage.addItems = (listName, items, extraContext) => {
        const request = {
            method: 'post',
            url: buildSessionUrl(listName),
            data: {
                buyables: items.map((item) => item.buyable),
                context: extraContext,
            },
        };

        function buildBuyablePairs(buyable) {
            return {
                id: buyable.id,
                buyable_object_type: buyable.buyable_object_type,
            };
        }

        function resolveConflicts(req, results) {
            const serverBuyables = results[listName].map((item) => buildBuyablePairs(item.buyable));
            const isInResults = ({id, buyable_object_type: type}) => {
                return !!serverBuyables.find((buyable) => {
                    return buyable.id === id && buyable.buyable_object_type === type;
                });
            };
            req.data.buyables = req.data.buyables.filter(
                (buyable) => !isInResults(buildBuyablePairs(buyable)),
            );
            return req.data.buyables.length === 0;
        }

        return makeDeferredRequest(request, resolveConflicts);
    };

    storage.removeItem = (listName, item) => {
        const buyable = item.buyable;
        const request = {
            method: 'delete',
            params: {
                boId: buyable.id,
                boType: buyable.buyable_object_type,
            },
            url: buildSessionUrl(listName),
        };

        function resolveConflicts(req, results) {
            const serverBuyables = (results[listName] || []).map((item) => item.buyable);
            const findType = req.params[config.urlParams.buyableObjectType];
            const findId = req.params[config.urlParams.buyableObjectId];
            const existing = serverBuyables.find((buyable) => {
                return buyable.buyable_object_type === findType && buyable.id === findId;
            });
            return !existing;
        }
        return makeDeferredRequest(request, resolveConflicts);
    };

    storage.applyDiscounts = (codes) => {
        function resolveConflicts(req, results) {
            const resultCodes = results.discount_attempts.map((c) => c.code);
            const existing = codes.every((code) => resultCodes.includes(code));
            return Boolean(existing);
        }

        return makeDeferredRequest(
            {
                method: 'post',
                data: {
                    codes,
                },
                url: buildSessionUrl('discounts'),
            },
            resolveConflicts,
        );
    };

    storage.removeDiscounts = (codes) =>
        makeDeferredRequest({
            method: 'delete',
            params: {
                codes: codes.join(','),
            },
            url: buildSessionUrl('discounts'),
        });

    /*
     * This call occurs outside of all other modifications; we want it to complete ASAP.
     */
    storage.clearDiscounts = () =>
        makeRequest({
            method: 'delete',
            url: buildSessionUrl('discounts'),
        });

    /*
     * Checkout
     */
    storage.createExpressCheckoutSession = (items, codes) => {
        const request = {
            method: 'post',
            data: {
                buyables: items.map((item) => item.buyable),
            },
            url: config.urls.expressCheckoutAPI,
        };
        if (codes) {
            request.data.codes = codes;
        }
        return makeRequest(request);
    };

    /*
     * Internal Functions
     */

    const transformResponse = action((response) => {
        if (response.headers && response.headers.etag !== state.etag) {
            runInAction(() => {
                state.etag = response.headers.etag;
            });
        }
        return response;
    });

    const updateStateOnSuccess = action((response) => {
        if (!response || !response.data) {
            return Promise.resolve(false);
        }

        state.discounts.clear();
        state.discounts.replace(response.data.discount_attempts);

        state.credit.amount = response.data.user.id ? response.data.user.credit.amount : 0;
        state.availableCoupons = response.data.available_coupon_info?.coupons || [];

        config.shoppingListTypes.forEach((listName) => {
            state.lists[listName].clear();
            const list = response.data[listName];
            if (list) {
                attachFrontendTrackingIds(list.map((item) => item.buyable));
            }
            state.lists[listName].replace(response.data[listName]);
            state.unseenCounts[listName] = response.data[`${listName}_unseen_count`] || 0;
        });

        localStorage.set('state', toJS(state));
        return Promise.resolve(true);
    });

    function createShoppingError(httpError) {
        return Promise.reject({
            get canBeResolved() {
                return httpError.response.status === 412 || httpError.response.status === 409;
            },
            httpResponse: httpError.response,
            refetchedData: httpError.response.data,
        });
    }

    function makeDeferredRequest(request, conflictResolver) {
        function commandResolver(command, requestError) {
            if (!requestError.canBeResolved) {
                command.actions.reject(requestError);
                return;
            }

            const conflictsResolved = conflictResolver(request, requestError.refetchedData);

            if (conflictsResolved) {
                updateStateOnSuccess(requestError.refetchedData);
                command.actions.resolve(true);
            } else {
                command.actions.retry(requestError);
            }
        }
        return queue.add(() => makeRequest(request), commandResolver);
    }

    function makeRequest(request) {
        updateHeaders(request);

        return udApi
            .request(request)
            .then(transformResponse)
            .catch((httpError) => {
                transformResponse(httpError.response);
                throw httpError;
            })
            .then(updateStateOnSuccess, createShoppingError);
    }

    function buildSessionUrl(resourceName) {
        return `${config.urls.cartAPI}${resourceName.replace(/_/g, '-')}/`;
    }

    when(
        () => !udMe.isLoading,
        () => {
            runInAction(() => {
                state.userId = udMe.id;
                storage.fetch();
            });
        },
    );

    function updateHeaders(request) {
        // Update headers
        request.headers = request.headers || {};
        if (request.method.toLowerCase() === 'get') {
            // enable HTTP caching
            request.headers = {...request.headers, ...getHttpCacheHeaders()};
            request.params = {...request.params, sessionState: state.etag || ''};
        } else if (state.etag) {
            request.headers['If-Match'] = state.etag;
        }
    }

    /* Fetch the cart every 90 minutes in the case of a stale tab
       This prevents issue with adding to cart after being inactive on a tab
       on a Udemy page due to stale cart session (ie. SessionOutdated)
     */
    setInterval(() => {
        storage.fetch();
    }, 5400000);

    return storage;
}
