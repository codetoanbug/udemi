import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import ExpressCheckoutButton from 'course-landing-page/components/express-checkout-button/express-checkout-button.react-component';
import injectCourseLandingPageData from 'course-landing-page/components/inject-course-landing-component-context';
import {isomorphic} from 'utils/isomorphic-rendering';

@observer
class BaseBuyButton extends React.Component {
    static propTypes = {
        buy_url: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        size: PropTypes.string,
        style: PropTypes.string,
        enrollment_disabled: PropTypes.bool,
        event_type: PropTypes.string.isRequired,
        payment_data: PropTypes.shape({
            buyableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            buyableType: PropTypes.string,
        }),
        eventTrackingContext: PropTypes.shape({
            courseTrackingId: PropTypes.string,
        }),
    };

    static defaultProps = {
        size: 'large',
        style: undefined,
        enrollment_disabled: false,
        payment_data: {},
        eventTrackingContext: {},
    };

    componentDidMount() {
        this.setIsMounted();
    }

    @observable isMounted = false;

    @action
    setIsMounted() {
        this.isMounted = true;
    }

    get buyable() {
        return {
            id: this.props.payment_data.buyableId,
            type: this.props.payment_data.buyableType,
            trackingId: this.props.eventTrackingContext.courseTrackingId,
        };
    }

    render() {
        const isDisabled = !this.isMounted || this.props.enrollment_disabled;

        return (
            <ExpressCheckoutButton
                bsStyle={this.props.style === undefined ? 'brand' : this.props.style}
                buttonText={this.props.text}
                checkoutUrl={this.props.buy_url}
                isDisabled={isDisabled}
                size={this.props.size}
                // eventing system
                clickEventData={{
                    buyable: this.buyable,
                    eventType: this.props.event_type,
                }}
            />
        );
    }
}

const BuyButton = isomorphic(injectCourseLandingPageData('buy_button', true)(BaseBuyButton));
export default BuyButton;

export const CacheableBuyButton = injectCourseLandingPageData(
    'buy_button',
    true,
)(({button, eventTrackingContext}) => (
    <BaseBuyButton {...button} eventTrackingContext={eventTrackingContext} />
));
