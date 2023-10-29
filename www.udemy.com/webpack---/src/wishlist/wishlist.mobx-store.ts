import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {whenBrazeReady, Appboy} from '@udemy/braze';
import {WishlistEvent} from '@udemy/browse-event-tracking';
import {Tracker} from '@udemy/event-tracking';
import {serverOrClient} from '@udemy/shared-utils';
import {UDDataMe, udLink} from '@udemy/ud-data';

import {ShoppingClient} from '../shopping-client/shopping-client-singleton';
import {CourseBuyable, ShoppingItem} from '../types/shopping-types';
import {WISHLIST_DEFAULT_STATE, WISHLIST_LOADING_STATE, WISHLIST_FINISHED_STATE} from './constants';

export class WishlistStore {
    wishlistSource: string;
    course: CourseBuyable;
    searchParams: URLSearchParams;
    buyable: CourseBuyable;
    udMe: UDDataMe;
    @observable wishlistProcessState: string = WISHLIST_DEFAULT_STATE;
    @observable isWishlisted: boolean;

    constructor(course: CourseBuyable, udMe: UDDataMe, wishlistSource = 'course_landing_page') {
        this.course = course;
        this.searchParams = new URLSearchParams(serverOrClient.global.location.search);
        this.buyable = {
            buyable_object_type: 'course',
            id: this.course.id,
        } as CourseBuyable;
        this.udMe = udMe;
        this.wishlistSource = wishlistSource;
        this.isWishlisted = this._getIsWishlisted(this.course.id);
    }

    @autobind
    _getIsWishlisted(courseId: number) {
        return ShoppingClient.lists.wishlist.items.some(
            (item: ShoppingItem) => item.buyable.id === courseId,
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
    _setWishlistProcessState(nextState: string) {
        this.wishlistProcessState = nextState;
    }

    @autobind
    _buildNextUrl() {
        this.searchParams.set('xref', 'wish');
        this.searchParams.set('courseId', this.course.id.toString());
        const url = `${
            serverOrClient.global.location.href.split('?')[0]
        }?${this.searchParams.toString()}`;

        return url;
    }

    @autobind
    _authUrl() {
        const nextUrl = this._buildNextUrl();
        const returnUrl = serverOrClient.global.location.href;

        if (this.udMe.is_authenticated && this.udMe.id) {
            return nextUrl;
        }

        return udLink.toAuth({
            showLogin: false,
            nextUrl,
            returnUrl,
            source: this.wishlistSource,
            responseType: 'html',
        });
    }

    @autobind
    logWishlistClickEvent() {
        Tracker.publishEvent(
            new WishlistEvent({
                id: this.course.id,
                trackingId: this.course.frontendTrackingId || this.course.tracking_id || '',
            }),
        );
        whenBrazeReady((appboy: Appboy) => {
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
        return ShoppingClient.addToList('wishlist', [this.buyable])
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

        return ShoppingClient.removeFromList('wishlist', {
            buyable: this.buyable,
        } as ShoppingItem)
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

        if (!this.udMe.is_authenticated || !this.udMe.id) {
            serverOrClient.global.location.href = authUrl;
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
        serverOrClient.global.history.replaceState(
            {},
            '',
            `${serverOrClient.global.location.pathname}?${this.searchParams.toString()}`,
        );
    }

    @computed
    get apiRequestIsLoading() {
        return this.wishlistProcessState === WISHLIST_LOADING_STATE;
    }
}
