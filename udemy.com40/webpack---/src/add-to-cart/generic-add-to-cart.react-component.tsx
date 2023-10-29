import classNames from 'classnames';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {whenBrazeReady} from '@udemy/braze';
import {Appboy} from '@udemy/braze';
import {ClickEvent, Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {Button, ButtonProps} from '@udemy/react-core-components';
import {captureException} from '@udemy/sentry';
import {serverOrClient} from '@udemy/shared-utils';
import {shoppingConfig, couponUrlHandler, ShoppingClient} from '@udemy/shopping';
import {useUDData} from '@udemy/ud-data';

import {AddToCartEvent, CartErrorDisplayEvent} from '../events';
import {CartBuyable} from '../types/cart-buyable';
import {addToCartConfig} from './config';

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

export const Notification = ({
    notification,
    notificationStyle,
}: {
    notification: string;
    notificationStyle: string;
}) => <>{notification && <span className={notificationStyle}>{notification}</span>}</>;

export const ButtonInternalState = ({
    buttonContent,
    isAdding,
    isReady,
    loader,
}: {
    buttonContent: string;
    isAdding: boolean;
    isReady: boolean;
    loader?: JSX.Element;
}) => (
    <>
        {!isReady || (isAdding && loader)}
        {!isAdding && buttonContent}
    </>
);

export interface GenericAddToCartProps {
    addToCartContext?: {
        fbt_add_to_cart: boolean;
    };
    addToCartSuccessModal?: unknown;
    allowAddToCartSuccessModal?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buttonClass?: React.ElementType<any>;
    buttonStyleProps?: ButtonProps;
    buyables?: CartBuyable[];
    cartButtonClassesAdd?: string;
    cartButtonClassesGoToCart?: string;
    cartButtonTextAdd?: string;
    cartButtonTextGoToCart?: string;
    disabled?: boolean;
    forceGoToCart?: boolean;
    forceSuccessModalOnMobile?: boolean;
    loader?: JSX.Element;
    notificationStyle?: string;
    onAddRedirectUrl?: string;
    onRequestFinish?: () => void;
    onRequestStart?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shoppingClient: typeof ShoppingClient | any; // any type is for Monolith compatibility
    showCartSuccessModal?: () => void;
}

export const GenericAddToCart = observer(
    ({
        addToCartContext,
        addToCartSuccessModal,
        allowAddToCartSuccessModal = true,
        buttonClass = Button,
        buttonStyleProps = {},
        buyables = [],
        cartButtonClassesAdd = '',
        cartButtonClassesGoToCart = '',
        cartButtonTextAdd,
        cartButtonTextGoToCart,
        disabled = false,
        forceGoToCart = false,
        forceSuccessModalOnMobile = false,
        loader,
        notificationStyle = '',
        onAddRedirectUrl = addToCartConfig.urls.cartPage,
        onRequestFinish = noop,
        onRequestStart = noop,
        shoppingClient,
        showCartSuccessModal = noop,
    }: GenericAddToCartProps) => {
        const udData = useUDData();
        const {gettext, interpolate, ngettext} = useI18n();
        // instead of @observable isAdding = false;
        const [isAdding, setIsAdding] = React.useState<boolean>(false);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [notification, setNotification] = React.useState<any | null>(null);

        const [screenreaderMessage, setScreenreaderMessage] = React.useState<string>('');

        function hasBuyables() {
            return !disabled && shoppingClient.lists.cart.hasBuyables(buyables);
        }

        function trackClick() {
            if (hasBuyables()) {
                // Track 'Go to cart' click event -- currently only capturing the first buyable if users
                // select 'Add all to cart' in bundle unit
                const buyable = buyables[0];
                if (buyable) {
                    Tracker.publishEvent(
                        new ClickEvent({
                            componentName: 'goToCart',
                            trackingId: buyable?.frontendTrackingId || buyable?.tracking_id,
                            relatedObjectId: buyable?.id,
                            relatedObjectType: 'course',
                        }),
                    );
                }
                return;
            }
            // TODO Remove conditional logic after making `frontendTrackingId` required.
            let fireEvent = true;
            buyables.forEach((buyable: CartBuyable) => {
                if (!buyable.frontendTrackingId && !buyable.tracking_id) {
                    fireEvent = false;
                }
            });
            if (fireEvent) {
                Tracker.publishEvent(
                    new AddToCartEvent({
                        buyables: buyables.map((buyable) => ({
                            type: buyable.buyable_object_type,
                            id: buyable.id,
                            trackingId: buyable.frontendTrackingId || buyable.tracking_id,
                        })),
                    }),
                );
            }
        }

        function sendBrazeEvent() {
            whenBrazeReady((appboy: Appboy) => {
                const {me: udMe} = udData;
                if (udMe.is_authenticated) {
                    return;
                }

                if (appboy.isPushPermissionGranted()) {
                    // Only trigger event for the first course added to the cart
                    // if the same visitor adds multiple courses to their cart
                    if (shoppingClient.lists.cart.isEmpty) {
                        const courseInCart = buyables.map((buyable) => {
                            return buyable.id;
                        });

                        appboy.logCustomEvent('UserCartAbandonment', {
                            courses_in_cart: courseInCart,
                        });
                    }
                }
            });
        }

        function goToCart() {
            serverOrClient.global.location.href = addToCartConfig.urls.cartPage;
        }

        function addCodes() {
            const params = new URLSearchParams(serverOrClient.global.location.search);
            const codes = couponUrlHandler(params).get();
            const newCodes = codes.filter(
                (code: string) => !shoppingClient.discounts.codes.includes(code),
            );

            return new Promise((resolve) => {
                shoppingClient.applyDiscounts(newCodes);
                return resolve(true);
            });
        }

        function onAddSuccess() {
            setIsAdding(false);
            setNotification(null);
            return addCodes();
        }

        function onAddFail() {
            setIsAdding(false);
            setNotification(addToCartConfig.errors(gettext).failAddToCart);
            Tracker.publishEvent(
                new CartErrorDisplayEvent({
                    buyables: buyables.map((buyable) => ({
                        type: buyable.buyable_object_type,
                        id: buyable.id,
                        trackingId: buyable.frontendTrackingId,
                    })),
                    action: 'add',
                    uiRegion: 'add_to_cart',
                }),
            );
            onRequestFinish();
            return Promise.reject(new Error('Add to cart failed.'));
        }

        function buttonContent() {
            if (hasBuyables()) {
                return cartButtonTextGoToCart || gettext('Go to cart');
            }

            if (shoppingClient.status.get() === shoppingConfig.storage.status.unAvailable) {
                return addToCartConfig.errors(gettext).cartUnavailableShort;
            }

            return cartButtonTextAdd || gettext('Add to cart');
        }

        function additionalClassNames() {
            return hasBuyables() ? cartButtonClassesGoToCart : cartButtonClassesAdd;
        }

        function addItems() {
            const {request: udRequest} = udData;
            setIsAdding(true);
            onRequestStart();

            setTimeout(
                action(() => {
                    if (isAdding) {
                        setNotification(addToCartConfig.errors(gettext).stillWorking);
                    }
                }),
                addToCartConfig.timing.addToCartSlow,
            );
            return shoppingClient
                .addToList('cart', buyables, addToCartContext)
                .then(onAddSuccess, onAddFail)
                .then(
                    action(() => {
                        onRequestFinish();

                        if (udRequest.isMobile) {
                            if (forceSuccessModalOnMobile) {
                                showCartSuccessModal();
                            } else {
                                serverOrClient.global.location.href = onAddRedirectUrl;
                            }
                        } else if (allowAddToCartSuccessModal) {
                            showCartSuccessModal();
                        } else {
                            setScreenreaderMessage(
                                interpolate(
                                    ngettext(
                                        '%(cartCount)s item added to cart.',
                                        '%(cartCount)s items added to cart.',
                                        buyables.length,
                                    ),
                                    {
                                        cartCount: buyables.length,
                                    },
                                    true,
                                ),
                            );
                            if (forceGoToCart) {
                                serverOrClient.global.location.href = onAddRedirectUrl;
                            }
                        }
                    }),
                )
                .catch((e: unknown) => {
                    captureException(e);
                });
        }

        // onClick handler
        function onClick() {
            trackClick();
            sendBrazeEvent();

            return hasBuyables() ? goToCart() : addItems();
        }

        const status = shoppingClient.status.get();
        const isReady = !disabled && status === shoppingConfig.storage.status.ready;
        const isDisabled =
            !isReady || status === shoppingConfig.storage.status.unAvailable || isAdding;

        const buttonInternalState = (
            <ButtonInternalState
                isReady={isReady}
                isAdding={isAdding}
                buttonContent={buttonContent()}
                loader={loader}
            />
        );

        const buttonProps = {
            'data-testid': 'add-to-cart-button',
            // GoogleTagManager code depends on the `.add-to-cart` class for third party paid acquisition
            className: classNames('add-to-cart', additionalClassNames()),
            disabled: isDisabled,
            onClick: onClick,
            style: {width: '100%'},
            ...buttonStyleProps,
        };

        const button = React.createElement(buttonClass, buttonProps, buttonInternalState);

        return (
            <div data-purpose="add-to-cart">
                {button}
                {addToCartSuccessModal}
                <Notification notification={notification} notificationStyle={notificationStyle} />
                <div role="status" className="ud-sr-only" data-purpose="screen-reader-message">
                    {screenreaderMessage}
                </div>
            </div>
        );
    },
);

(GenericAddToCart as React.FC).displayName = 'GenericAddToCart';
