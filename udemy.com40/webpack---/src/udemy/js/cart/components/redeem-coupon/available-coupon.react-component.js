import {onEnterAndSpace} from '@udemy/design-system-utils';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer, PropTypes as MobxPropTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './available-coupon.less';

@observer
export default class AvailableCoupon extends React.Component {
    static propTypes = {
        coupons: MobxPropTypes.arrayOrObservableArrayOf(
            PropTypes.shape({
                code: PropTypes.string,
                rate: PropTypes.string,
                savings_type: PropTypes.string,
                savings_value: PropTypes.string,
            }),
        ),
        currentCodes: MobxPropTypes.arrayOrObservableArrayOf(PropTypes.string),
        onApplyCoupon: PropTypes.func.isRequired,
    };

    static defaultProps = {
        coupons: [],
        currentCodes: [],
    };

    getCouponDetail(displayedCoupons) {
        if (displayedCoupons[0].savings_type == 'volume_min_qty') {
            return (
                <div>
                    {gettext('Buy')}{' '}
                    <span
                        className={styles['coupon-savings-percent']}
                        data-purpose="coupon-savings-value"
                    >
                        {interpolate(
                            gettext('%(savings_value)s or more'),
                            {savings_value: displayedCoupons[0].savings_value},
                            true,
                        )}
                    </span>{' '}
                    {gettext('courses and take')}{' '}
                    <span
                        className={styles['coupon-savings-percent']}
                        data-purpose="coupon-savings-percent"
                    >
                        {interpolate(
                            gettext('an extra %(rate)s off'),
                            {rate: displayedCoupons[0].rate},
                            true,
                        )}
                    </span>
                </div>
            );
        }
        return (
            <div>
                <span
                    className={styles['coupon-savings-percent']}
                    data-purpose="coupon-savings-percent"
                >
                    {interpolate(
                        gettext('Extra %(rate)s off'),
                        {rate: displayedCoupons[0].rate},
                        true,
                    )}
                </span>{' '}
                {gettext('courses')}
            </div>
        );
    }

    render() {
        const displayedCoupons = this.props.coupons.filter(
            (c) => !this.props.currentCodes.includes(c.code),
        );
        if (displayedCoupons.length == 0) {
            return null;
        }
        return (
            <div className={styles['available-coupon-container']}>
                <div className={styles['coupon-detail']}>
                    {this.getCouponDetail(displayedCoupons)}
                    <div
                        className={classNames(
                            'ud-clp-available-coupon-code',
                            styles['available-coupon-code'],
                        )}
                        data-toggle="tooltip"
                        title={this.props.coupons[0].code}
                    >
                        {displayedCoupons[0].code}
                    </div>
                </div>
                <div className={styles['apply-code-wrapper']}>
                    <Button
                        udStyle="ghost"
                        size="medium"
                        className={classNames(
                            'ud-clp-apply-available-coupon-code',
                            styles.pointer,
                            styles['apply-button'],
                            'ud-link-underline',
                        )}
                        typography="ud-text-md"
                        onKeyDown={(e) =>
                            onEnterAndSpace(this.props.onApplyCoupon(this.props.coupons)(e))
                        }
                        onClick={() => this.props.onApplyCoupon(this.props.coupons)}
                        role="button"
                        tabIndex={0}
                    >
                        {gettext('Apply')}
                    </Button>
                </div>
            </div>
        );
    }
}

@observer
export class AvailableCouponWithCouponStore extends React.Component {
    static propTypes = AvailableCoupon.propTypes;
    static defaultProps = AvailableCoupon.defaultProps;

    @autobind
    applyCoupon() {
        this.props.couponStore.setCode(this.props.coupons[0].code);
        this.props.couponStore.applyInputCode();
    }

    render() {
        return (
            <AvailableCoupon
                {...this.props}
                currentCodes={this.props.couponStore.currentCodes || []}
                onApplyCoupon={this.applyCoupon}
            />
        );
    }
}
