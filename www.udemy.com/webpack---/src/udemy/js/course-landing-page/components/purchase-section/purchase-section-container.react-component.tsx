import {Tracker, ClickEvent} from '@udemy/event-tracking';
import {mediaQueryPxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {withMatchMedia} from 'base-components/responsive/match-media.react-component';
import {ReactCLPSubscriptionContext} from 'course-landing-page/clp-subscription-context';
import {GiftCourseStore} from 'course-landing-page/components/gift-this-course/gift-course.mobx-store';
import {GiftThisCourseComponentContextProps} from 'course-landing-page/components/gift-this-course/gift-this-course.react-component';
import {IncentivesData} from 'course-landing-page/components/incentives/incentives.react-component';
import {MoneyBackGuaranteeComponentContextProps} from 'course-landing-page/components/money-back-guarantee/money-back-guarantee.react-component';
import {BaseClcPriceText} from 'course-landing-page/components/price-text/base-clc-price-text.react-component';
import {PriceTextComponentContextProps} from 'course-landing-page/components/price-text/price-text-props';
import {TABS} from 'course-landing-page/components/purchase-team-tabs/constants';
import PurchaseTeamTabs from 'course-landing-page/components/purchase-team-tabs/purchase-team-tabs.react-component';
import {
    CouponStore,
    RedeemCouponComponentContextProps,
} from 'course-landing-page/components/redeem-coupon/coupon.mobx-store';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {CLPEventTrackingContext} from 'course-landing-page/event-tracking';
import {FeatureContext, FeatureContextProvider} from 'course-landing-page/feature-context';
import {DynamicCTAState} from 'course-landing-page/types/experiment-state';
import {isConsumerSubscription} from 'subscription-browse/utils';

import {PURCHASE_OPTION_TYPES, PURCHASE_SECTION_VARIATION} from './constants';
import {FreePurchaseSection} from './sections/free-purchase-section.react-component';
import StandardPurchaseSection from './sections/standard-purchase-section.react-component';
import {SubscriptionPurchaseSection} from './sections/subscription-purchase-section.react-component';
import SubscriptionRedirectSection from './sections/subscription-redirect-section.react-component';

import './purchase-section-container.less';

interface PurchaseTabsContext {
    selectedPurchaseOption: string;
    buttonText: string;
    primaryLink: string;
    selectedTab: string;
    enableSubsCtaAuthModal?: boolean;
}

/**
 * Props that are passed in from the component context
 */
export interface PurchaseSectionComponentContextProps {
    default_purchase_option: keyof typeof PURCHASE_OPTION_TYPES;
    is_course_paid: boolean;
    purchase_options_style?: 'hardrule' | 'blocklist';
    style_money_back_guarantee?: string;
    style_full_lifetime_access?: string;
    isDarkModeEnabledOnCTAButtons?: boolean;
}

export interface PurchaseSectionContainerProps {
    /**
     * Props that are passed in from a component context
     */
    componentProps: {
        purchaseSection: PurchaseSectionComponentContextProps;
        purchaseInfo: {
            isValidStudent: boolean;
            purchaseDate: string | null;
        };
        priceText: PriceTextComponentContextProps;
        redeemCoupon: RedeemCouponComponentContextProps;
        incentives: IncentivesData;
        moneyBackGuarantee: MoneyBackGuaranteeComponentContextProps;
        giftThisCourse: GiftThisCourseComponentContextProps;
    };
    store?: CourseLandingComponentsStore;
    couponStore?: CouponStore;
    giftCourseStore?: GiftCourseStore;
    variation: Lowercase<keyof typeof PURCHASE_SECTION_VARIATION>;
    course: {
        id: number;
        url: string;
    };
    uiRegion: string;
    eventTrackingContext?: CLPEventTrackingContext;
    isMobile: boolean;
    asyncFeatureContext: Promise<FeatureContext>;
}

/* CLP has custom breakpoints, see course-landing-page/_base/tokens.less */
@withMatchMedia({isMobile: `(max-width: ${mediaQueryPxToRem(1079)}rem)`})
@observer
export class PurchaseSectionContainer extends React.Component<PurchaseSectionContainerProps> {
    static defaultProps = {
        variation: PURCHASE_SECTION_VARIATION.DEFAULT,
    };

    static contextType = ReactCLPSubscriptionContext;

    readonly state: Readonly<DynamicCTAState> = {
        personalPlanDynamicCTAEnabled: false,
    };

    @action
    componentDidMount() {
        const asyncFeatureContext = this.props.asyncFeatureContext;
        this.isMounted = true;
        if (asyncFeatureContext) {
            asyncFeatureContext.then((context) => {
                if (context.personalPlanDynamicCTA) {
                    // eslint-disable-next-line react/no-set-state
                    this.setState({
                        personalPlanDynamicCTAEnabled: context.personalPlanDynamicCTA.enabled,
                    });
                }
            });
        }
    }

    hasClickedTeamsTab = false;
    // used to ensure subscription impression is not fired again when user toggles between purchase options
    isSubscriptionImpressionTracked = false;
    @observable isMounted = false;

    getPurchaseTabsContext(): PurchaseTabsContext | null {
        return this.props.store?.contexts.get('purchase_tabs_context');
    }

    @autobind
    @action
    handleTabChange(tabId: string) {
        const context = this.getPurchaseTabsContext();
        context && (context.selectedTab = tabId);

        if (tabId === TABS.TEAMS && !this.hasClickedTeamsTab) {
            Tracker.publishEvent(
                new ClickEvent({
                    componentName: 'CLPPurchaseSectionTeamsTab',
                }),
            );
            this.hasClickedTeamsTab = true;
        }
    }

    @autobind renderPriceText({className}: {className: string}) {
        const priceText = this.props.componentProps.priceText;
        const clcStore = this.props.store;

        const componentContext = {data: null};

        if (clcStore) {
            const purchaseContext = clcStore.contexts.get('purchase');
            if (purchaseContext?.data) {
                componentContext.data = {
                    ...purchaseContext.data,
                };
            }
        }
        if (!componentContext.data || !priceText?.data?.is_enabled) {
            return null;
        }
        return (
            <div className={className} styleName="purchase-panel-price-text">
                <BaseClcPriceText
                    className="standard-purchase-panel__price-text-container"
                    discountPriceClassName="standard-purchase-panel__discount-price-text"
                    percentDiscountClassName="standard-purchase-panel__percent_discount-text"
                    componentContext={componentContext}
                    discount_text_size="md"
                    eventTrackingContext={this.props.eventTrackingContext}
                />
            </div>
        );
    }

    renderTabs() {
        if (this.isMounted) {
            const purchaseTabsContext = this.getPurchaseTabsContext();
            if (purchaseTabsContext) {
                const uiRegion = `${this.props.uiRegion}.tab0`;
                const {
                    selectedTab,
                    buttonText,
                    primaryLink,
                    enableSubsCtaAuthModal,
                } = purchaseTabsContext;
                const secondaryStyling = this.props.componentProps.purchaseSection
                    .isDarkModeEnabledOnCTAButtons
                    ? 'primary'
                    : 'secondary';
                const isPaid = this.props.componentProps.purchaseSection.is_course_paid;
                const subscriptionType = this.context.subscriptionPlan?.subscriptionPlan
                    ?.productType;
                const {
                    default_purchase_option: defaultPurchaseOption,
                    style_full_lifetime_access: styleFullLifetimeAccess,
                    style_money_back_guarantee: styleMoneyBackGuarantee,
                } = this.props.componentProps.purchaseSection;
                const isDefaultPurchaseOptionTransactional = this.state
                    .personalPlanDynamicCTAEnabled
                    ? false
                    : defaultPurchaseOption === PURCHASE_OPTION_TYPES.transactional.name;
                const subscriptionPurchaseSection = (
                    <SubscriptionPurchaseSection
                        uiRegion={uiRegion}
                        courseId={this.props.course.id}
                        enableSubsAuthModal={enableSubsCtaAuthModal}
                        udStyle={isDefaultPurchaseOptionTransactional ? secondaryStyling : 'brand'}
                    />
                );
                const transactionalPurchaseSection = (
                    <StandardPurchaseSection
                        isPaid={isPaid}
                        isConsumerSubsAware={isConsumerSubscription(subscriptionType)}
                        styleFullLifetimeAccess={styleFullLifetimeAccess}
                        styleMoneyBackGuarantee={styleMoneyBackGuarantee}
                        showBuyNowButton={false}
                        udStyle={isDefaultPurchaseOptionTransactional ? 'brand' : secondaryStyling}
                        {...this.props}
                    />
                );

                const firstPurchaseOption = isDefaultPurchaseOptionTransactional
                    ? transactionalPurchaseSection
                    : subscriptionPurchaseSection;

                const secondPurchaseOption = isDefaultPurchaseOptionTransactional
                    ? subscriptionPurchaseSection
                    : transactionalPurchaseSection;

                return (
                    <PurchaseTeamTabs
                        primaryLink={primaryLink}
                        onChange={this.handleTabChange}
                        selectedTab={selectedTab}
                        buttonText={buttonText}
                    >
                        <div>
                            {firstPurchaseOption}
                            <div
                                className="ud-text-xs dark-bg-text purchase-section-separator"
                                styleName="separator"
                            >
                                {gettext('or')}
                            </div>
                            {secondPurchaseOption}
                        </div>
                    </PurchaseTeamTabs>
                );
            }
        }
        return null;
    }

    renderFree() {
        return <FreePurchaseSection {...this.props} />;
    }

    renderStandard() {
        return <StandardPurchaseSection isPaid={true} {...this.props} />;
    }

    renderConsumerSubs() {
        return (
            <>
                <h3
                    className="ud-heading-md"
                    styleName="consumer-subs-title"
                    data-purpose="consumer-subs-title"
                >
                    {interpolate(
                        gettext('Included in %(title)s'),
                        {title: this.context?.subscriptionContext?.title},
                        true,
                    )}
                </h3>
                <SubscriptionRedirectSection uiRegion={this.props.uiRegion} />
            </>
        );
    }

    renderPurchaseSectionContainer() {
        const isPaid = this.props.componentProps.purchaseSection.is_course_paid;

        if (!isPaid) {
            return this.renderFree();
        }

        if (
            this.context?.subscriptionContext &&
            this.context?.subscriptionPlan?.isPersonalPlanSubscriber
        ) {
            return this.renderConsumerSubs();
        }
        const hasSubscriptionOfferings =
            this.context?.subscriptionContext && this.context?.subscriptionPlan?.subscriptionPlan;
        if (hasSubscriptionOfferings) {
            return this.renderTabs();
        }

        return this.renderStandard();
    }

    render() {
        return (
            <FeatureContextProvider asyncFeatureContext={this.props.asyncFeatureContext}>
                <div styleName="purchase-section-container">
                    {this.renderPurchaseSectionContainer()}
                </div>
            </FeatureContextProvider>
        );
    }
}
