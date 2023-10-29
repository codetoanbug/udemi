import Observer from '@researchgate/react-intersection-observer';
import {ClientSideRender} from '@udemy/design-system-utils';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import {SmartBarSpacer} from '@udemy/smart-bar';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useContext, useState} from 'react';

import {UI_REGION} from 'browse/ui-regions';
import {ReactCLPSubscriptionContext} from 'course-landing-page/clp-subscription-context';
import AddToCart from 'course-landing-page/components/add-to-cart/add-to-cart.react-isocomponent';
import {CacheableBuyButton} from 'course-landing-page/components/buy-button/buy-button.react-isocomponent';
import {BaseClcPriceText} from 'course-landing-page/components/price-text/base-clc-price-text.react-component';
import {PriceTextComponentContextProps} from 'course-landing-page/components/price-text/price-text-props';
import {PURCHASE_OPTION_TYPES} from 'course-landing-page/components/purchase-section/constants';
import {TAB_CONTEXT_KEY, TABS} from 'course-landing-page/components/purchase-team-tabs/constants';
import PrimaryHookButton from 'course-landing-page/components/purchase-team-tabs/primary-hook-button.react-component';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {CLPEventTrackingContext} from 'course-landing-page/event-tracking';
import {FeatureContext, useAsyncFeature} from 'course-landing-page/feature-context';
import {
    AddToCartContext,
    BuyButtonContext,
    PurchaseTabsContext,
    SubscriptionCTAContext,
} from 'course-landing-page/types/clc-contexts';
import {SubscriptionCTA} from 'subscription-browse/components/subscription-cta/subscription-cta.react-component';
import {SubscriptionPlanPropType} from 'subscription-browse/graphql/subscription-plan-adapter';
import {SubscribeFromPageCookie} from 'subscription-browse/utils';
import serverOrClient from 'utils/server-or-client';

import Lead from './_parts/lead.react-component';
import styles from './slider-menu.less';

interface SliderMenuComponentProps {
    data: {
        badge_family: string;
        title: string;
        num_reviews: number;
        is_free_seo_exp: boolean;
        num_students: number;
        rating: number;
        is_coding_exercises_badge_eligible: boolean;
        showCodingExercisesBadge?: boolean;
    };
}

export interface SliderMenuProps {
    componentProps: {
        sliderMenu?: SliderMenuComponentProps;
        buyButton?: BuyButtonContext;
        priceText?: PriceTextComponentContextProps;
        addToCart?: AddToCartContext;
    };
    store: CourseLandingComponentsStore;
    eventTrackingContext?: CLPEventTrackingContext | null;
    courseId: number;
    asyncFeatureContext: Promise<FeatureContext>;
    persistentSearch?: boolean;
}

interface SliderMenuComponentContextProps {
    data:
        | (PriceTextComponentContextProps['data'] & {
              courseId: number;
          })
        | null;
}

export const SliderMenu = observer((props: SliderMenuProps) => {
    const personalPlanDynamicCTAEnabled =
        useAsyncFeature(props.asyncFeatureContext, 'personalPlanDynamicCTA')?.enabled ?? false;
    const matchSliderFooterToPrimaryCTAEnabled =
        useAsyncFeature(props.asyncFeatureContext, 'matchSliderFooterToPrimaryCTA')?.enabled ??
        false;
    const clpSubscriptionContext = useContext(ReactCLPSubscriptionContext);
    const context = getPurchaseTabsContext();
    const [shouldLowerSlider, setShouldLowerSlider] = useState(false);

    function getPurchaseTabsContext(): PurchaseTabsContext | null {
        if (!props.store) {
            return null;
        }
        return props.store.contexts.get('purchase_tabs_context');
    }

    function attachCourseTrackingIdToBuyables(buyables?: {frontendTrackingId?: string}[]) {
        if (buyables) {
            buyables.forEach((buyable) => {
                buyable.frontendTrackingId = props.eventTrackingContext?.courseTrackingId;
            });
        }
    }

    function ctaClickHandler() {
        SubscribeFromPageCookie.set('course_landing_page', props.courseId);
    }

    function handleTopMarkIntersection(entry: IntersectionObserverEntry) {
        const {top} = entry.boundingClientRect;

        // We want to lower the sliding menu if the header has lowered;
        // the header will lower when we scroll past the set mark.
        if (shouldLowerSlider && top >= 0) {
            setShouldLowerSlider(false);
        } else if (!shouldLowerSlider && top < 0) {
            setShouldLowerSlider(true);
        }
    }

    function renderSubscriptionOfferButton(
        subscriptionPlanAvailableForCourse: boolean,
        isSubscriptionPurchaseSelected: boolean,
        isSubscriber: boolean,
        isPaidCourse: boolean,
        subscriptionPlan?: SubscriptionPlanPropType,
    ) {
        /**
         * Render subscription button and use css to show/hide to prevent impression tracking from firing more than once when user toggles between purchase options
         */
        return (
            subscriptionPlanAvailableForCourse &&
            !isSubscriber &&
            isPaidCourse && (
                <div
                    data-purpose="subscription-cta-container"
                    className={classNames({
                        [styles['show-subscription-cta']]: isSubscriptionPurchaseSelected,
                        [styles['hide-subscription-cta']]: !isSubscriptionPurchaseSelected,
                    })}
                >
                    <SubscriptionCTA
                        className={classNames(styles['subscription-button'], styles['cta-button'])}
                        subtitleClassName="dark-bg-text"
                        includeTrialDaysOnCta={false}
                        offerCtaStyle={'brand'}
                        uiRegion={UI_REGION.SLIDER}
                        courseId={props.courseId}
                        courseTrackingId={props.eventTrackingContext?.courseTrackingId}
                        onCTAClick={ctaClickHandler}
                        plan={subscriptionPlan}
                    />
                </div>
            )
        );
    }

    function renderSubscriberButton(
        isSubscriptionPurchaseSelected: boolean,
        isSubscriber: boolean,
        cta?: SubscriptionCTAContext,
    ) {
        /*
         * Render Go to course button for active personal plan subscribers
         */
        const hidePersonalPlanSubscriptionCtaContainer =
            isSubscriptionPurchaseSelected && !isSubscriber;
        return (
            isSubscriber && (
                <div
                    data-purpose="pp-subscription-cta-container"
                    className={classNames({
                        [styles[
                            'show-pp-subscription-cta'
                        ]]: !hidePersonalPlanSubscriptionCtaContainer,
                        [styles[
                            'hide-pp-subscription-cta'
                        ]]: hidePersonalPlanSubscriptionCtaContainer,
                    })}
                >
                    <Button
                        className={classNames(
                            styles['pp-subscription-button'],
                            styles['cta-button'],
                        )}
                        data-purpose="subscription-redirect-button"
                        udStyle="primary"
                        componentClass="a"
                        href={cta?.url}
                    >
                        {cta?.text}
                    </Button>
                </div>
            )
        );
    }

    function renderTransactionalButton(
        componentContext: SliderMenuComponentContextProps,
        hideTransactionalCtaContainer: boolean,
        buyButtonProps?: BuyButtonContext,
    ) {
        const addToCartProps = {...props.componentProps.addToCart};
        const replaceBuyButton = buyButtonProps?.button.replace_with_add_to_cart;
        if (replaceBuyButton) {
            addToCartProps.cartButtonTextAdd = gettext('Buy this course');
        }
        if (addToCartProps?.is_enabled && serverOrClient.isClient) {
            attachCourseTrackingIdToBuyables(addToCartProps.buyables);
        }
        const {priceText} = props.componentProps;
        return (
            <div
                data-purpose="transactional-cta-container"
                className={classNames({
                    [styles['hide-transactional-cta-container']]: hideTransactionalCtaContainer,
                    [styles['show-transactional-cta-container']]: !hideTransactionalCtaContainer,
                })}
            >
                <div className={classNames(styles['price-text-container'])}>
                    {componentContext.data && priceText?.data?.is_enabled && (
                        <BaseClcPriceText
                            componentContext={componentContext}
                            discount_text_size="lg"
                            show_percent_discount={false}
                            className={classNames(styles['price-text'])}
                            listPriceClassName="slider-menu-list-price"
                            discountPriceClassName="slider-menu-discount-price"
                            eventTrackingContext={props.eventTrackingContext}
                        />
                    )}
                </div>
                <div className={classNames(styles['cta-button'])}>
                    {buyButtonProps?.button?.is_enabled &&
                        (!replaceBuyButton ? (
                            <CacheableBuyButton
                                button={{
                                    ...buyButtonProps?.button,
                                    style: matchSliderFooterToPrimaryCTAEnabled
                                        ? 'brand'
                                        : buyButtonProps?.button.style,
                                }}
                                eventTrackingContext={props.eventTrackingContext}
                            />
                        ) : (
                            addToCartProps?.is_enabled && <AddToCart {...addToCartProps} />
                        ))}
                </div>
            </div>
        );
    }

    function renderBuyButtonSection(
        componentContext: SliderMenuComponentContextProps,
        buyButtonProps?: BuyButtonContext,
    ) {
        // Derive subscription-related fields here
        const subscriptionPlan = clpSubscriptionContext?.subscriptionPlan;
        const subscriptionContext = clpSubscriptionContext?.subscriptionContext;
        const subscriptionPlanAvailableForCourse = !!(subscriptionPlan && subscriptionContext);
        const isSubscriptionPurchaseSelected = personalPlanDynamicCTAEnabled
            ? true
            : context?.selectedPurchaseOption === PURCHASE_OPTION_TYPES.subscription.name;
        const isSubscriber = !!subscriptionPlan?.isPersonalPlanSubscriber;

        // Derive transactional fields here
        const isPaidCourse = !!buyButtonProps?.button.is_paid;

        // Hide transactional option when subs is selected, user is subscriber, and course is not a free course
        // Also, hide transactional option while loading subs info to prevent PP subscribers from seeing purchase option
        const hideTransactionalCtaContainer =
            (((subscriptionPlanAvailableForCourse && isSubscriptionPurchaseSelected) ||
                subscriptionPlan?.isPersonalPlanSubscriber) &&
                isPaidCourse) ||
            subscriptionPlan?.isLoading;
        const subscriptionButton = renderSubscriptionOfferButton(
            subscriptionPlanAvailableForCourse,
            isSubscriptionPurchaseSelected,
            isSubscriber,
            isPaidCourse,
            subscriptionPlan?.subscriptionPlan,
        );
        const transactionalButton = renderTransactionalButton(
            componentContext,
            !!hideTransactionalCtaContainer,
            buyButtonProps,
        );
        const personalPlanSubscriptionButton = renderSubscriberButton(
            isSubscriptionPurchaseSelected,
            isSubscriber,
            subscriptionContext?.cta,
        );
        return (
            <>
                {subscriptionButton}
                {transactionalButton}
                {personalPlanSubscriptionButton}
            </>
        );
    }

    /**
     * If we add more content here increasing the height of this component,
     * adjust the rootMargin in the following places to prevent impression events from firing for elements
     * that are hidden under this slider menu:
     * course-landing-page/components/purchase-section/purchase-section-container.react-component.js
     * course-landing-page/components/purchase-section/sections/subscription-purchase-section.react-component.js
     */
    const {componentProps, store, eventTrackingContext, ...restProps} = props;
    const {sliderMenu, buyButton} = componentProps;
    const componentContext: SliderMenuComponentContextProps = {data: null};

    if (store) {
        const purchaseContext = store.contexts.get('purchase') as PriceTextComponentContextProps;
        if (purchaseContext?.data) {
            componentContext.data = {
                ...restProps,
                ...purchaseContext.data,
            };
        }
    }

    // This was implemented as a hotfix because the add coupon button on CLP was not updating with the clc store
    // a proper fix would be to have this logic at the sidebar container level and have all the containing
    // unaware of where they are getting their props from.
    let buyButtonProps: BuyButtonContext | undefined;
    if (props.store?.contexts.get('buy_button')) {
        buyButtonProps = props.store.contexts.get('buy_button');
    } else {
        buyButtonProps = buyButton;
    }

    // CLP Hightouch experiment
    const tabContext = props.store?.contexts.get('purchase_tabs_context');
    const primaryLink = tabContext?.primaryLink;

    if (!primaryLink) {
        return null;
    }

    return (
        <>
            <Observer onChange={handleTopMarkIntersection}>
                <span className={styles.mark} />
            </Observer>
            <div
                className={classNames('slider-menu__free-clp-overrides', styles['slider-menu'], {
                    [styles['slider-menu-lower']]: shouldLowerSlider && restProps.persistentSearch,
                })}
                data-purpose="slider-menu"
            >
                <SmartBarSpacer />
                <ClientSideRender
                    placeholder={<Loader block={true} size="large" />}
                    uiRegion={UI_REGION.SLIDER}
                >
                    <div className={classNames(styles['slider-menu-container'])}>
                        {sliderMenu?.data && <Lead {...sliderMenu.data} />}
                        {tabContext && tabContext[TAB_CONTEXT_KEY] === TABS.TEAMS ? (
                            <div className={classNames(styles['cta-button'])}>
                                <PrimaryHookButton
                                    link={primaryLink}
                                    placement="SliderMenu"
                                    buttonText={tabContext.buttonText}
                                />
                            </div>
                        ) : (
                            renderBuyButtonSection(componentContext, buyButtonProps)
                        )}
                    </div>
                </ClientSideRender>
            </div>
        </>
    );
});
(SliderMenu as React.SFC).displayName = 'SliderMenu';
