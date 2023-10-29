import {AxiosResponse, AxiosRequestConfig, AxiosError} from 'axios';
import {action, observable, runInAction, toJS, IObservableArray, computed} from 'mobx';

import {generateTrackingId} from '@udemy/event-tracking';
import {udExpiringLocalStorage, udPerformance} from '@udemy/shared-utils';
import {udApi, getHttpCacheHeaders} from '@udemy/ud-api';

import {ShoppingItem, Discount, Buyable} from '../types/shopping-types';
import {CommandQueue, DeferredCommand} from './command-queue';
import {shoppingConfig} from './config';

export interface ShoppingError {
    canBeResolved: boolean;
    httpResponse: AxiosResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetchedData: any;
}

interface ItemApiResults {
    cart: ShoppingItem[];
    express: ShoppingItem[];
    saved_for_later: ShoppingItem[];
    wishlist: ShoppingItem[];
}

interface DiscountApiResults {
    discount_attempts: Discount[];
}

interface StorageState {
    etag: string | null;
    credit: {
        amount: number;
    };
    discounts: IObservableArray<Discount>;
    lists: {
        cart: IObservableArray<ShoppingItem>;
        express: IObservableArray<ShoppingItem>;
        saved_for_later: IObservableArray<ShoppingItem>;
        wishlist: IObservableArray<ShoppingItem>;
    };
    unseenCounts: {
        cart: number;
        express: number;
        saved_for_later: number;
        wishlist: number;
    };
    userId: number | null;
    availableCoupons: unknown[];
}

export type ListName = keyof StorageState['lists'];

export class ShoppingStorage {
    private readonly defaultState: StorageState = {
        etag: null,
        credit: {
            amount: 0,
        },
        discounts: observable.array(),
        lists: {
            cart: observable.array(),
            express: observable.array(),
            saved_for_later: observable.array(),
            wishlist: observable.array(),
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
    private readonly now = new Date();
    private readonly expirationDate = new Date(this.now.setDate(this.now.getDate() + 30));
    readonly storage = udExpiringLocalStorage(
        'shoppingCartStorage',
        'storage-1.0',
        this.expirationDate,
    );
    private readonly state: StorageState = observable({
        ...(this.storage.get('state') ?? this.defaultState),
    });
    private readonly queue = new CommandQueue();
    readonly status = observable.box(shoppingConfig.storage.status.notReady);
    @observable private isShoppingCartFeatureEnabled = true;

    constructor() {
        /**
         * Fetch the cart every 90 minutes in the case of a stale tab
         * This prevents issue with adding to cart after being inactive on a tab
         * on a Udemy page due to stale cart session (ie. SessionOutdated)
         */
        setInterval(() => {
            this.fetch();
        }, 5400000);
    }

    @computed
    get credit() {
        return this.state.credit;
    }

    @computed
    get discounts() {
        return this.state.discounts;
    }

    @computed
    get lists() {
        return this.state.lists;
    }

    @computed
    get availableCoupons() {
        return this.state.availableCoupons;
    }

    @action
    setUserId(id: number) {
        this.state.userId = id;
        this.fetch();
    }

    @action
    setIsFeatureEnabled(isEnabled: boolean) {
        this.isShoppingCartFeatureEnabled = isEnabled;
    }

    fetch = () => {
        if (!this.isShoppingCartFeatureEnabled || (!this.state.userId && !this.state.etag)) {
            runInAction(() => {
                this.status.set(shoppingConfig.storage.status.ready);
            });
            return Promise.resolve(true);
        }

        const udPerf = udPerformance();
        udPerf.start('_cartApi');
        const params = new URLSearchParams(window.location.search);

        return this.makeDeferredRequest({
            method: 'get',
            url: shoppingConfig.urls.cartAPI,
            params: Object.fromEntries(params),
        })
            .then(
                action(() => {
                    udPerf.end('_cartApi');
                    this.status.set(shoppingConfig.storage.status.ready);
                }),
            )
            .catch(
                action(() => {
                    this.status.set(shoppingConfig.storage.status.unAvailable);
                }),
            );
    };

    addItems = (listName: ListName, items: ShoppingItem[], extraContext: unknown = {}) => {
        const request = {
            method: 'post',
            url: this.buildSessionUrl(listName),
            data: {
                buyables: items.map((item) => item.buyable),
                context: extraContext,
            },
        } as const;

        const buildBuyablePairs = (buyable: Buyable) => {
            return {
                id: buyable.id,
                buyable_object_type: buyable.buyable_object_type,
            };
        };

        const resolveConflicts = (req: AxiosRequestConfig, results: ItemApiResults) => {
            const serverBuyables = results[listName].map((item) => buildBuyablePairs(item.buyable));
            const isInResults = ({id, buyable_object_type: type}: Buyable) => {
                return !!serverBuyables.find((buyable) => {
                    return buyable.id === id && buyable.buyable_object_type === type;
                });
            };

            req.data.buyables = (req.data.buyables as Buyable[]).filter(
                (buyable) => !isInResults(buildBuyablePairs(buyable) as Buyable),
            );
            return req.data.buyables.length === 0;
        };

        return this.makeDeferredRequest(request, resolveConflicts);
    };

    removeItem = (listName: ListName, item: ShoppingItem) => {
        const buyable = item.buyable;
        const request = {
            method: 'delete',
            params: {
                boId: buyable.id,
                boType: buyable.buyable_object_type,
            },
            url: this.buildSessionUrl(listName),
        } as const;

        const resolveConflicts = (req: AxiosRequestConfig, results: ItemApiResults) => {
            const serverBuyables = (results[listName] ?? []).map((item) => item.buyable);
            const findType = req.params[shoppingConfig.urlParams.buyableObjectType];
            const findId = req.params[shoppingConfig.urlParams.buyableObjectId];
            const existing = serverBuyables.find((buyable) => {
                return buyable.buyable_object_type === findType && buyable.id === findId;
            });
            return !existing;
        };

        return this.makeDeferredRequest(request, resolveConflicts);
    };

    applyDiscounts = (codes: string[] = []) => {
        const resolveConflicts = (req: AxiosRequestConfig, results: DiscountApiResults) => {
            const resultCodes = results.discount_attempts.map((c) => c.code);
            const existing = codes.every((code) => resultCodes.includes(code));
            return Boolean(existing);
        };

        return this.makeDeferredRequest(
            {
                method: 'post',
                data: {
                    codes,
                },
                url: this.buildSessionUrl('discounts'),
            },
            resolveConflicts,
        );
    };

    removeDiscounts = (codes: string[]) =>
        this.makeDeferredRequest({
            method: 'delete',
            params: {
                codes: codes.join(','),
            },
            url: this.buildSessionUrl('discounts'),
        });

    /*
     * This call occurs outside of all other modifications; we want it to complete ASAP.
     */
    clearDiscounts = () =>
        this.makeRequest({
            method: 'delete',
            url: this.buildSessionUrl('discounts'),
        });

    /*
     * Checkout
     */
    createExpressCheckoutSession = (
        items: {buyable: Pick<Buyable, 'id' | 'buyable_object_type'>}[],
        codes: string[],
    ) => {
        const request: AxiosRequestConfig = {
            method: 'post',
            data: {
                buyables: items.map((item) => item.buyable),
            },
            url: shoppingConfig.urls.expressCheckoutAPI,
        };
        if (codes) {
            request.data.codes = codes;
        }

        return this.makeRequest(request);
    };

    private makeDeferredRequest(
        request: AxiosRequestConfig,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        conflictResolver?: (req: AxiosRequestConfig, refetchedData: any) => void,
    ) {
        const commandResolver = (
            command: DeferredCommand<boolean | ShoppingError>,
            requestError: ShoppingError,
        ) => {
            if (!requestError.canBeResolved) {
                command.actions.reject(requestError);
                return;
            }

            const conflictsResolved = conflictResolver?.(request, requestError.refetchedData);

            if (conflictsResolved) {
                this.updateStateOnSuccess(requestError.refetchedData);
                command.actions.resolve(true);
            } else {
                command.actions.retry(requestError);
            }
        };
        return this.queue.add(() => this.makeRequest(request), commandResolver);
    }

    private makeRequest(request: AxiosRequestConfig) {
        this.updateHeaders(request);

        return udApi
            .request(request)
            .then(this.transformResponse)
            .catch((httpError) => {
                this.transformResponse(httpError.response);
                throw httpError;
            })
            .then(this.updateStateOnSuccess, this.createShoppingError);
    }

    @action
    private transformResponse = (response: AxiosResponse) => {
        if (response.headers && response.headers.etag !== this.state.etag) {
            runInAction(() => {
                this.state.etag = response.headers.etag;
            });
        }
        return response;
    };

    private createShoppingError = (httpError: AxiosError) => {
        return Promise.reject<ShoppingError>({
            canBeResolved: httpError.response?.status === 412 || httpError.response?.status === 409,
            httpResponse: httpError.response,
            refetchedData: httpError.response?.data,
        });
    };

    private updateHeaders = (request: AxiosRequestConfig) => {
        // Update headers
        request.headers = request.headers || {};
        if (request.method?.toLowerCase() === 'get') {
            // enable HTTP caching
            request.headers = {...request.headers, ...getHttpCacheHeaders()};
            request.params = {...request.params, sessionState: this.state.etag || ''};
        } else if (this.state.etag) {
            request.headers['If-Match'] = this.state.etag;
        }
    };

    @action
    private updateStateOnSuccess = (response: AxiosResponse) => {
        if (!response || !response.data) {
            return Promise.resolve(false);
        }

        this.state.discounts.clear();
        this.state.discounts.replace(response.data.discount_attempts);

        this.state.credit.amount = response.data.user.id ? response.data.user.credit.amount : 0;
        this.state.availableCoupons = response.data.available_coupon_info?.coupons || [];

        (shoppingConfig.shoppingListTypes as ListName[]).forEach((listName) => {
            this.state.lists[listName].clear();
            const list: ShoppingItem[] = response.data[listName];
            if (list) {
                attachFrontendTrackingIds(list.map((item) => item.buyable));
            }
            this.state.lists[listName].replace(response.data[listName]);
            this.state.unseenCounts[listName] = response.data[`${listName}_unseen_count`] || 0;
        });

        this.storage.set('state', toJS(this.state));
        return Promise.resolve(true);
    };

    private buildSessionUrl(resourceName: string) {
        return `${shoppingConfig.urls.cartAPI}${resourceName.replace(/_/g, '-')}/`;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function attachFrontendTrackingIds(items: any[]) {
    // Utility method for attaching frontend tracking IDs to data from APIs
    items
        // We don't want to regenerate ID's for the item
        .filter((item) => !item.frontendTrackingId)
        .forEach((item) => {
            item.frontendTrackingId = generateTrackingId();
        });
}
