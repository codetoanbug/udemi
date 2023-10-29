import {Tracker} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {BuyNowEvent, EnrollNowEvent} from 'browse/events';
import {CheckoutReferrerHelper} from 'payment/checkout-referrer-helper';
import serverOrClient from 'utils/server-or-client';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';
import './styles.less';

@observer
export default class ExpressCheckoutButton extends Component {
    static propTypes = {
        bsStyle: PropTypes.string,
        buttonText: PropTypes.string,
        checkoutUrl: PropTypes.string.isRequired,
        isDisabled: PropTypes.bool,
        size: PropTypes.string,
        clickEventData: PropTypes.shape({
            buyable: PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                type: PropTypes.string,
                trackingId: PropTypes.string,
            }),
            eventType: PropTypes.string,
        }),
        className: PropTypes.string,
    };

    static defaultProps = {
        bsStyle: undefined,
        buttonText: undefined,
        isDisabled: false,
        size: 'large',
        className: null,
        clickEventData: {}, // todo make this required once all cases are covered
    };

    @autobind
    @action
    redirectsToCheckoutUrl() {
        // click tracking
        if (this.props.clickEventData) {
            this.fireClickEvent();
        }
        CheckoutReferrerHelper.saveCheckoutReferrer();
        if (udMe.id) {
            serverOrClient.global.location.href = this.props.checkoutUrl;
        } else {
            const signupUrl = udLink.to('join', 'signup-popup', {
                next: this.props.checkoutUrl,
            });
            serverOrClient.global.location.href = signupUrl;
        }
    }

    eventTypeToEvent = {
        enroll_now: EnrollNowEvent,
        buy_now: BuyNowEvent,
    };

    @autobind
    fireClickEvent() {
        const {buyable, eventType} = this.props.clickEventData;
        const Event = this.eventTypeToEvent[eventType];
        if (Event) {
            Tracker.publishEvent(new Event({buyable}));
        }
    }

    render() {
        const {bsStyle, buttonText = gettext('Buy now'), isDisabled, size, className} = this.props;
        return (
            <div>
                <Button
                    data-purpose="buy-this-course-button"
                    size={size}
                    udStyle={bsStyle === undefined ? 'brand' : bsStyle}
                    onClick={this.redirectsToCheckoutUrl}
                    styleName="btn--express-checkout"
                    className={className}
                    disabled={isDisabled || udMe.isLoading}
                >
                    {buttonText}
                </Button>
            </div>
        );
    }
}
