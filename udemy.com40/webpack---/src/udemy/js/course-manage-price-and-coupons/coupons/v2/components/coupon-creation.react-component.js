import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CouponCreationModal from './coupon-creation-modal.react-component';

import './coupon-creation.less';

@inject('couponsStore')
@observer
export default class CouponCreation extends Component {
    static propTypes = {
        couponsStore: PropTypes.object.isRequired,
    };

    @autobind
    openCouponCreationModal() {
        this.props.couponsStore.openCouponCreationModal();
    }

    render() {
        if (this.props.couponsStore.isLoading) {
            // The isLoading will block from a previous render component. This will just prevent
            // data from being read before set.
            return null;
        }
        const couponsRemaining = this.props.couponsStore.couponMetadata.remaining_coupon_count;
        const disableCouponCreation = this.props.couponsStore.disableCouponCreation;

        return (
            <>
                <div styleName="create-coupon-container">
                    <p className="ud-heading-md">
                        {interpolate(gettext('%s coupons'), [this.props.couponsStore.currentMonth])}
                    </p>
                    <div styleName="coupons-remaining">
                        <p className="ud-text-lg" data-purpose="coupons-creation-remaining">
                            {disableCouponCreation
                                ? gettext('You cannot create coupons for a free course')
                                : couponsRemaining === 0
                                ? gettext(
                                      'You created all your coupons this month. ' +
                                          'To promote your course, use the referral link ' +
                                          'or any active coupon.',
                                  )
                                : ninterpolate(
                                      'You can create %s more coupon this month.',
                                      'You can create %s more coupons this month.',
                                      couponsRemaining,
                                  )}
                        </p>
                        {couponsRemaining > 0 && disableCouponCreation === false && (
                            <Button
                                styleName="create-coupon-button"
                                onClick={this.openCouponCreationModal}
                            >
                                {gettext('Create new coupon')}
                            </Button>
                        )}
                    </div>
                </div>
                <CouponCreationModal />
            </>
        );
    }
}
