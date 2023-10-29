import {withFunnelLogContextProvider} from '@udemy/funnel-tracking';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import PURCHASE_PRICE_TYPES from 'base-components/price-text/constants';
import StaticPriceText from 'base-components/price-text/static-price-text.react-component';
import injectCourseLandingPageData from 'course-landing-page/components/inject-course-landing-component-context';

import getPriceTextData from './helpers';

@inject('funnelLogContextStore')
@observer
class InternalBaseClcPriceText extends React.Component {
    static propTypes = {
        componentContext: PropTypes.shape({
            data: PropTypes.object.isRequired,
        }),
        pricing_result: PropTypes.object,
        discount_text_size: PropTypes.string,
        show_percent_discount: PropTypes.bool,
        course_id: PropTypes.number,
        className: PropTypes.string,
        discountPriceClassName: PropTypes.string,
        listPriceClassName: PropTypes.string,
        percentDiscountClassName: PropTypes.string,
        eventTrackingContext: PropTypes.object,
        funnelLogContextStore: PropTypes.object,
    };

    static defaultProps = {
        componentContext: undefined,
        pricing_result: undefined,
        discount_text_size: undefined,
        show_percent_discount: true,
        course_id: undefined,
        className: undefined,
        discountPriceClassName: undefined,
        listPriceClassName: undefined,
        percentDiscountClassName: undefined,
        eventTrackingContext: undefined,
        funnelLogContextStore: undefined,
    };

    constructor(props) {
        super(props);
        this.props.funnelLogContextStore.updateContext({
            context: 'landing-page',
            subcontext: 'landing-page',
        });
    }

    @autobind
    onView() {
        const context = this.props.componentContext.data;
        const pricingResult = context.pricing_result;
        let funnelCourse = {
            id: context.course_id,
            price: context.list_price.amount,
        };
        if (pricingResult && pricingResult.has_discount_saving) {
            const priceString =
                pricingResult.price.amount === 0
                    ? pricingResult.price.amount
                    : pricingResult.price.price_string;
            const funnelDiscountContext = {
                discount: {price: {price_string: priceString}},
                discount_price: pricingResult.price,
            };

            funnelCourse = Object.assign(funnelCourse, funnelDiscountContext);
        }
        this.props.funnelLogContextStore.logAction('discount-price-logged', [funnelCourse]);
    }

    render() {
        const {
            componentContext,
            className,
            discountPriceClassName,
            listPriceClassName,
            percentDiscountClassName,
        } = this.props;
        const context = (componentContext && componentContext.data) || this.props;
        const {
            showDiscountPrice,
            isValidStudent,
            listPrice,
            listPriceString,
            discountPrice,
            discountPriceString,
        } = getPriceTextData(context);
        const pricingResult = componentContext ? context.pricing_result : this.props.pricing_result;

        if (isValidStudent) {
            return null;
        }

        const eventTrackingContext =
            this.props.eventTrackingContext || context.eventTrackingContext || {};

        return (
            <div>
                <StaticPriceText
                    className={classNames(className, 'ud-clp-price-text')}
                    discountPrice={discountPrice}
                    discountPriceClassName={classNames(
                        discountPriceClassName,
                        'ud-clp-discount-price',
                        `ud-heading-${this.props.discount_text_size || 'lg'}`,
                    )}
                    discountPriceString={discountPriceString}
                    listPrice={listPrice}
                    listPriceClassName={classNames(
                        listPriceClassName,
                        'ud-clp-list-price',
                        'ud-text-sm',
                    )}
                    listPriceString={listPriceString}
                    onView={this.onView}
                    priceServeTrackingId={pricingResult.price_serve_tracking_id}
                    percentDiscount={
                        showDiscountPrice ? pricingResult.discount_percent_for_display : null
                    }
                    percentDiscountClassName={classNames(
                        percentDiscountClassName,
                        'ud-clp-percent-discount',
                        'ud-text-sm',
                    )}
                    showPercentDiscount={this.props.show_percent_discount && showDiscountPrice}
                    trackingEventContext={{
                        buyableId:
                            (componentContext &&
                                componentContext.data &&
                                componentContext.data.course_id) ||
                            this.props.course_id,
                        priceType: PURCHASE_PRICE_TYPES.individual_buyable,
                        buyableType: 'course',
                        buyableTrackingId: eventTrackingContext.courseTrackingId,
                    }}
                />
            </div>
        );
    }
}

export const BaseClcPriceText = withFunnelLogContextProvider()(InternalBaseClcPriceText);

const CacheablePriceText = injectCourseLandingPageData('purchase')(
    observer(({...props}) => {
        if (!props.componentContext) {
            return null;
        }
        return <BaseClcPriceText {...props} />;
    }),
);
export default CacheablePriceText;
