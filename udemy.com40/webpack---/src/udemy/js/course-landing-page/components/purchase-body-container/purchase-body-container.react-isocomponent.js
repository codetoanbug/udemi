import {ClientSideRender} from '@udemy/design-system-utils';
import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {UI_REGION} from 'browse/ui-regions';
import {GiftCourseStore} from 'course-landing-page/components/gift-this-course/gift-course.mobx-store';
import injectCourseLandingPageContext from 'course-landing-page/components/inject-course-landing-component-context';
import {PurchaseSectionContainerSkeleton} from 'course-landing-page/components/purchase-section/components/purchase-section-container-skeleton.react-component';
import WishlistStore from 'course-landing-page/components/wishlist/wishlist.mobx-store';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {CourseLandingPageStore} from 'course-landing-page/course-landing-page.mobx-store';
import snakeToCamelCase from 'utils/case-change/snake-to-camel-case';
import {isomorphic} from 'utils/isomorphic-rendering';

import {ReactCLPSubscriptionContext} from '../../clp-subscription-context';
import {PurchaseSectionContainer} from '../purchase-section/purchase-section-container.react-component';

@isomorphic
@injectCourseLandingPageContext('purchase_body_container', true)
@observer
export default class PurchaseBodyContainer extends React.Component {
    static propTypes = {
        componentProps: PropTypes.shape({
            addToCart: PropTypes.object,
        }).isRequired,
        clpStore: PropTypes.instanceOf(CourseLandingPageStore),
        store: PropTypes.instanceOf(CourseLandingComponentsStore).isRequired,
        wishlistStore: PropTypes.instanceOf(WishlistStore),
        giftCourseStore: PropTypes.instanceOf(GiftCourseStore),
        course: PropTypes.shape({
            id: PropTypes.number.isRequired,
            url: PropTypes.string.isRequired,
        }).isRequired,
        asyncFeatureContext: PropTypes.instanceOf(Promise).isRequired,
    };

    static defaultProps = {
        clpStore: null,
        wishlistStore: null,
        giftCourseStore: null,
        rawComponentProps: null,
    };

    static contextType = ReactCLPSubscriptionContext;

    constructor(props) {
        super(props);
        this.componentProps = observable({
            addToCart: null,
            priceText: null,
            purchaseInfo: null,
            dealBadge: null,
            discountExpiration: null,
            redeemCoupon: null,
            giftThisCourse: null,
            purchaseSection: null,
            ...props.componentProps,
        });
    }

    componentDidMount() {
        if (!this.props.clpStore) {
            this.props.store
                .getOrPopulate([
                    'add_to_cart',
                    'price_text',
                    'deal_badge',
                    'discount_expiration',
                    'redeem_coupon',
                    'gift_this_course',
                    'base_purchase_section',
                    'purchase_tabs_context',
                    'lifetime_access_context',
                ])
                .then(this.updateComponentProps);
        }
    }

    @observable componentProps;
    @observable isLoading = true;

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
        const {componentProps, clpStore, ...restProps} = this.props;
        const isLoading = clpStore ? clpStore.isLoading : this.isLoading;
        const purchaseSectionComponentProps = clpStore
            ? {...componentProps, ...clpStore.purchaseBodyComponentProps}
            : this.componentProps;
        return (
            <Provider courseId={this.props.course.id}>
                <ClientSideRender
                    placeholder={<PurchaseSectionContainerSkeleton hasIncentives={false} />}
                    uiRegion={UI_REGION.PURCHASE_SECTION}
                >
                    {isLoading || this.context?.subscriptionPlan?.isLoading ? (
                        <PurchaseSectionContainerSkeleton hasIncentives={false} />
                    ) : (
                        <div data-purpose="purchase-section">
                            <PurchaseSectionContainer
                                componentProps={purchaseSectionComponentProps}
                                uiRegion={UI_REGION.PURCHASE_SECTION}
                                {...restProps}
                            />
                        </div>
                    )}
                </ClientSideRender>
            </Provider>
        );
    }
}
