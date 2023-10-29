/**
 * Warning: this is no longer the canonical version of this module/file.
 *
 * The canonical code is now published in `@udemy/shopping`
 *
 * Avoid updating this file as it may be removed soon. If you need to make changes
 * then please remove this file and update all references to point to the version
 * published in the package above. Apply your changes to the version in that package.
 **/

import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, extendObservable} from 'mobx';

import {whenBrazeReady} from 'braze/ud-braze';
import {WishlistEvent} from 'browse/events';
import ShoppingClientStore from 'shopping-client/shopping-client.mobx-store';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';

import {WISHLIST_DEFAULT_STATE, WISHLIST_LOADING_STATE, WISHLIST_FINISHED_STATE} from './constants';

export default class WishlistStore {
    constructor(course, window) {
        extendObservable(this, {
            wishlistProcessState: WISHLIST_DEFAULT_STATE,
            isWishlisted: this._getIsWishlisted(course.id),
        });
        this.window = window;
        this.course = course;
        this.searchParams = new URLSearchParams(this.window.location.search);
        this.buyables = {
            buyable_object_type: 'course',
            id: this.course.id,
        };
    }

    @autobind
    _getIsWishlisted(courseId) {
        return ShoppingClientStore.lists.wishlist.items.some(
            (item) => item.buyable.id === courseId,
        );
    }

    @autobind
    @action
    _setIsWishlisted() {
        this.isWishlisted = true;
        // Update the original course object so that the client/server wishlist states are equal
        this.course.is_wishlisted = true;
    }

    @autobind
    @action
    _clearIsWishlisted() {
        this.isWishlisted = false;
        this.course.is_wishlisted = false;
    }

    @autobind
    @action
    _setWishlistProcessState(nextState) {
        this.wishlistProcessState = nextState;
    }

    @autobind
    _buildNextUrl() {
        this.searchParams.set('xref', 'wish');
        this.searchParams.set('courseId', this.course.id);
        const url = `${this.window.location.href.split('?')[0]}?${this.searchParams.toString()}`;

        return url;
    }

    @autobind
    _authUrl() {
        const nextUrl = this._buildNextUrl();
        const returnUrl = this.window.location.href;

        if (udMe.id) {
            return nextUrl;
        }

        return udLink.toAuth({
            showLogin: false,
            nextUrl,
            returnUrl,
            source: 'course_landing_page',
            responseType: 'html',
        });
    }

    @autobind
    logWishlistClickEvent() {
        Tracker.publishEvent(
            new WishlistEvent({
                id: this.course.id,
                trackingId: this.course.frontendTrackingId || this.course.tracking_id,
            }),
        );
        whenBrazeReady((appboy) => {
            if (appboy.isPushPermissionGranted()) {
                appboy.logCustomEvent('Wishlist', {course_id: this.course.id});
            }
        });
    }

    @autobind
    _addToWishlist() {
        this._setIsWishlisted();
        this._setWishlistProcessState(WISHLIST_LOADING_STATE);
        this.logWishlistClickEvent();
        return ShoppingClientStore.addToList('wishlist', {buyable: this.buyables})
            .then(
                action(() => {
                    this._setWishlistProcessState(WISHLIST_FINISHED_STATE);
                    return Promise.resolve();
                }),
            )
            .catch(
                action((error) => {
                    this._clearIsWishlisted();
                    this._setWishlistProcessState(WISHLIST_DEFAULT_STATE);
                    throw error;
                }),
            );
    }

    @autobind
    _removeFromWishlist() {
        this._clearIsWishlisted();
        this._setWishlistProcessState(WISHLIST_LOADING_STATE);

        return ShoppingClientStore.removeFromList('wishlist', {buyable: this.buyables})
            .then(
                action(() => {
                    this._setWishlistProcessState(WISHLIST_FINISHED_STATE);
                    return Promise.resolve();
                }),
            )
            .catch(
                action((error) => {
                    this._setIsWishlisted();
                    this._setWishlistProcessState(WISHLIST_DEFAULT_STATE);
                    throw error;
                }),
            );
    }

    @autobind
    _getHasWishlistIntent() {
        return this.searchParams.get('xref') === 'wish';
    }

    @autobind
    @action
    toggleWishlist() {
        const authUrl = this._authUrl();

        if (!udMe.id) {
            this.window.location.href = authUrl;
        } else if (!this.apiRequestIsLoading) {
            const toggle = this.isWishlisted ? this._removeFromWishlist : this._addToWishlist;
            this._setWishlistProcessState(WISHLIST_DEFAULT_STATE);
            return toggle();
        }
    }

    @autobind
    removeWishlistIntent() {
        if (!this._getHasWishlistIntent()) {
            return;
        }
        this.searchParams.delete('xref');
        this.searchParams.delete('courseId');
        this.window.history.replaceState(
            {},
            '',
            `${this.window.location.pathname}?${this.searchParams.toString()}`,
        );
    }

    @computed
    get apiRequestIsLoading() {
        return this.wishlistProcessState === WISHLIST_LOADING_STATE;
    }
}
