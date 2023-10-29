import {Tracker} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {ReactCLPSubscriptionContext} from 'course-landing-page/clp-subscription-context';
import {SubscriptionLearnMoreEvent} from 'subscription-management/settings/subscription-page-events';

import '../purchase-section-container.less';

@observer
export default class SubscriptionRedirectSection extends React.Component {
    static propTypes = {
        uiRegion: PropTypes.string.isRequired,
    };

    static contextType = ReactCLPSubscriptionContext;

    @autobind
    learnMoreClickHandler() {
        Tracker.publishEvent(
            new SubscriptionLearnMoreEvent(
                this.context?.subscriptionPlan?.subscriptionPlan.id,
                this.context?.subscriptionPlan?.subscriptionPlan.productType,
                this.props.uiRegion,
            ),
        );
    }

    render() {
        const subscriptionContext = this.context?.subscriptionContext;
        if (!subscriptionContext) {
            return null;
        }
        return (
            <>
                <Button
                    styleName="buy-button"
                    data-purpose="subscription-redirect-button"
                    udStyle="primary"
                    componentClass="a"
                    href={subscriptionContext.cta.url}
                >
                    {subscriptionContext.cta.text}
                </Button>
                <div
                    styleName="redirect-text"
                    className="ud-text-sm"
                    data-purpose="subscription-redirect-explanation"
                >
                    {interpolate(
                        gettext('This course is included in your %(title)s subscription'),
                        {title: subscriptionContext.title},
                        true,
                    )}
                </div>
                {this.context?.subscriptionContext.learn_more_url && (
                    <a
                        className="ud-heading-sm"
                        data-purpose="subscription-learn-more-link"
                        href={subscriptionContext.learn_more_url}
                        onClick={this.learnMoreClickHandler}
                    >
                        {gettext('Learn more')}
                    </a>
                )}
            </>
        );
    }
}
