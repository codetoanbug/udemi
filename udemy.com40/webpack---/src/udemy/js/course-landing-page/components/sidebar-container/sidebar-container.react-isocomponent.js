import {ClientSideRender} from '@udemy/design-system-utils';
import {TextSkeleton} from '@udemy/react-reveal-components';
import {SmartBarSpacer} from '@udemy/smart-bar';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observable, action, computed} from 'mobx';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {UI_REGION} from 'browse/ui-regions';
import BuyForTeam from 'course-landing-page/components/buy-for-team/buy-for-team.react-component';
import {GiftCourseStore} from 'course-landing-page/components/gift-this-course/gift-course.mobx-store';
import injectCourseLandingPageContext from 'course-landing-page/components/inject-course-landing-component-context';
import IntroductionAsset from 'course-landing-page/components/introduction-asset/introduction-asset.react-isocomponent';
import {PurchaseSectionContainerSkeleton} from 'course-landing-page/components/purchase-section/components/purchase-section-container-skeleton.react-component';
import {PURCHASE_SECTION_VARIATION} from 'course-landing-page/components/purchase-section/constants';
import {PurchaseSectionContainer} from 'course-landing-page/components/purchase-section/purchase-section-container.react-component';
import {TAB_CONTEXT_KEY, TABS} from 'course-landing-page/components/purchase-team-tabs/constants';
import {SliderMenu} from 'course-landing-page/components/slider-menu/slider-menu.react-component';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import snakeToCamelCase from 'utils/case-change/snake-to-camel-case';
import {isomorphic} from 'utils/isomorphic-rendering';

import {ReactCLPSubscriptionContext} from '../../clp-subscription-context';
import styles from './sidebar-container.less';
import SidebarPositionManagerStore from './sidebar-position-manager.mobx-store';

@isomorphic
@injectCourseLandingPageContext('sidebar_container', true)
@observer
export default class SidebarContainer extends React.Component {
    static propTypes = {
        componentProps: PropTypes.shape({
            addToCart: PropTypes.object,
            introductionAsset: PropTypes.object,
            purchaseSection: PropTypes.object,
        }).isRequired,
        store: PropTypes.instanceOf(CourseLandingComponentsStore).isRequired,
        sidebarPositionManagerStore: PropTypes.instanceOf(SidebarPositionManagerStore),
        giftCourseStore: PropTypes.instanceOf(GiftCourseStore),
        course: PropTypes.shape({
            id: PropTypes.number.isRequired,
            url: PropTypes.string.isRequired,
        }).isRequired,
        showPreviewAsset: PropTypes.bool,
        asyncFeatureContext: PropTypes.instanceOf(Promise).isRequired,
        persistentSearch: PropTypes.bool,
    };

    static defaultProps = {
        sidebarPositionManagerStore: null,
        giftCourseStore: null,
        showPreviewAsset: true,
        persistentSearch: false,
    };

    static contextType = ReactCLPSubscriptionContext;

    constructor(props) {
        super(props);
        this.componentProps = observable(
            {
                sliderMenu: null,
                priceText: null,
                purchaseInfo: null,
                buyButton: null,
                buyForTeam: null,
                dealBadge: null,
                discountExpiration: null,
                redeemCoupon: null,
                ...props.componentProps,
            },
            {
                sliderMenu: observable.ref,
                priceText: observable.ref,
                purchaseInfo: observable.ref,
                buyButton: observable.ref,
                buyForTeam: observable.ref,
                dealBadge: observable.ref,
                discountExpiration: observable.ref,
                redeemCoupon: observable.ref,
            },
        );
    }

    componentDidMount() {
        const componentsToPopulate = [
            'slider_menu',
            'buy_button',
            'deal_badge',
            'discount_expiration',
            'price_text',
            'incentives',
            'purchase',
            'redeem_coupon',
            'money_back_guarantee',
            'base_purchase_section',
            'purchase_tabs_context',
            'lifetime_access_context',
            'available_coupons',
            'gift_this_course',
        ];
        if (this.props.componentProps.purchaseSection.purchase_options_style !== 'hardrule') {
            componentsToPopulate.push('buy_for_team');
        }
        this.props.store.getOrPopulate(componentsToPopulate).then(this.updateComponentProps);
    }

    @observable componentProps;
    @observable isLoading = true;

    positionToClassMap = {
        [SidebarPositionManagerStore.TOP]: '',
        [SidebarPositionManagerStore.STICKY]: 'fixed',
        [SidebarPositionManagerStore.BOTTOM]: 'inflow-bottom',
    };

    @computed
    get positionClass() {
        return this.positionToClassMap[this.props.sidebarPositionManagerStore?.position] || '';
    }

    @autobind
    @action
    updateComponentProps(componentProps) {
        this.componentProps.purchaseInfo = componentProps.base_purchase_section.purchaseInfo;
        this.componentProps.purchaseSection = componentProps.base_purchase_section.purchaseSection;
        Object.keys(componentProps).forEach((componentProp) => {
            const componentName = snakeToCamelCase(componentProp);
            const prop = componentProps[componentProp];
            if (prop) {
                this.componentProps[componentName] = prop;
            }
        });
        this.isLoading = false;
    }

    render() {
        const {componentProps: cp, sidebarPositionManagerStore, ...restProps} = this.props;
        const {introductionAsset, buyForTeam, purchaseTabsContext} = this.componentProps;

        return (
            <div className="sidebar-container-position-manager">
                <Provider courseId={this.props.course.id}>
                    <div
                        className={classNames(
                            'course-landing-page_sidebar-container',
                            styles[this.positionClass],
                            {[styles['with-persistent-search']]: restProps.persistentSearch},
                        )}
                        data-purpose="sidebar-container"
                    >
                        <SmartBarSpacer />
                        <div className={styles.content}>
                            <div className={styles['content-group']}>
                                {this.props.showPreviewAsset && (
                                    <div className={styles['introduction-asset']}>
                                        <IntroductionAsset {...introductionAsset} {...restProps} />
                                    </div>
                                )}
                                <ClientSideRender
                                    uiRegion={UI_REGION.PURCHASE_SECTION}
                                    placeholder={
                                        <PurchaseSectionContainerSkeleton
                                            className={styles['purchase-section']}
                                        />
                                    }
                                >
                                    {this.isLoading || this.context?.subscriptionPlan?.isLoading ? (
                                        <PurchaseSectionContainerSkeleton
                                            className={styles['purchase-section']}
                                        />
                                    ) : (
                                        <div className={styles['purchase-section']}>
                                            <PurchaseSectionContainer
                                                componentProps={this.componentProps}
                                                variation={PURCHASE_SECTION_VARIATION.SIDEBAR}
                                                uiRegion={`${UI_REGION.SIDEBAR}.${UI_REGION.PURCHASE_SECTION}`}
                                                {...restProps}
                                            />
                                        </div>
                                    )}
                                </ClientSideRender>
                            </div>
                            {buyForTeam?.data &&
                                buyForTeam.data.is_enabled &&
                                purchaseTabsContext[TAB_CONTEXT_KEY] !== TABS.TEAMS && (
                                    <div className={styles['content-group']}>
                                        <ClientSideRender
                                            uiRegion={UI_REGION.UB_ADVERTISEMENT}
                                            placeholder={
                                                <TextSkeleton
                                                    lineCountPerParagraph={3}
                                                    withTitle={true}
                                                    className={styles['buy-for-team']}
                                                />
                                            }
                                        >
                                            {this.isLoading ? (
                                                <TextSkeleton
                                                    lineCountPerParagraph={3}
                                                    withTitle={true}
                                                    className={styles['buy-for-team']}
                                                />
                                            ) : (
                                                <div className={styles['buy-for-team']}>
                                                    <BuyForTeam
                                                        {...buyForTeam.data}
                                                        {...restProps}
                                                    />
                                                </div>
                                            )}
                                        </ClientSideRender>
                                    </div>
                                )}
                        </div>
                    </div>

                    <div
                        className={classNames(
                            'course-landing-page_slider-menu-container',
                            styles[this.positionClass],
                        )}
                        data-purpose="slider-menu-container"
                    >
                        <SliderMenu componentProps={this.componentProps} {...restProps} />
                    </div>
                </Provider>
            </div>
        );
    }
}
