import AlarmIcon from '@udemy/icons/dist/alarm.ud-icon';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import injectCourseLandingPageContext from 'course-landing-page/components/inject-course-landing-component-context';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {isomorphic} from 'utils/isomorphic-rendering';

import './discount-expiration.less';

@injectCourseLandingPageContext('discount_expiration')
@observer
export class BaseDiscountExpiration extends Component {
    static propTypes = {
        componentContext: PropTypes.object,
        discount_deadline_text: PropTypes.string,
        className: PropTypes.string,
    };

    static defaultProps = {
        componentContext: undefined,
        discount_deadline_text: undefined,
        className: undefined,
    };

    render() {
        const {componentContext} = this.props;

        if (!this.props.discount_deadline_text && !componentContext) {
            return null;
        }

        const discountDeadlineText = componentContext
            ? componentContext.data.discount_deadline_text
            : this.props.discount_deadline_text;
        const expirationText = interpolate(
            gettext('<b>%(deadline)s</b> left at this price!'),
            {deadline: discountDeadlineText},
            true,
        );

        return (
            <div
                className={this.props.className}
                styleName="discount-expiration"
                data-purpose="discount-expiration"
            >
                <AlarmIcon label="alarm" size="xsmall" styleName="icon" />
                <span
                    className="ud-text-sm"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'discount-expiration:expiration-text',
                        html: expirationText,
                    })}
                />
            </div>
        );
    }
}

const DiscountExpiration = isomorphic(BaseDiscountExpiration);
export default DiscountExpiration;
