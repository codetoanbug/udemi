import {Switch} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CourseCoupon from '../../../coupons.mobx-model';

@observer
export default class EnableCouponToggler extends Component {
    static propTypes = {
        className: PropTypes.string,
        coupon: PropTypes.instanceOf(CourseCoupon).isRequired,
        course: PropTypes.object.isRequired,
    };

    static defaultProps = {
        className: '',
    };

    @autobind
    onChange(event) {
        this.props.coupon.updateIsEnabledByInstructor(event.target.checked);
    }

    render() {
        const promotionsEnabled = this.props.course.features.promotions_create;
        const isPaid = this.props.course.is_paid;
        const canBeEnabled = this.props.coupon.canBeEnabled && isPaid && promotionsEnabled;
        const isEnabled = this.props.coupon.isEnabled && isPaid && promotionsEnabled;
        let label;
        if (isEnabled) {
            label = gettext('Enabled');
        } else {
            label = gettext('Disabled');
        }
        return (
            <Switch
                checked={isEnabled}
                className={this.props.className}
                data-purpose="enable-coupon-toggler"
                disabled={!canBeEnabled || this.props.coupon.isUpdating}
                onChange={this.onChange}
                size="large"
            >
                <span className="ud-sr-only">{label}</span>
            </Switch>
        );
    }
}
