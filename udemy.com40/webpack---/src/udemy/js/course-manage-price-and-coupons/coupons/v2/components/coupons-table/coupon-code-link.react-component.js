import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {Modal, ModalTrigger} from '@udemy/react-dialog-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import udLink from 'utils/ud-link';

import CourseCoupon from '../../../coupons.mobx-model';
import CopyButton from '../copy-button.react-component';
import './coupon-code-link.less';

@observer
export default class CouponCodeLink extends Component {
    static propTypes = {
        coupon: PropTypes.instanceOf(CourseCoupon).isRequired,
        courseUrl: PropTypes.string.isRequired,
        label: PropTypes.string,
    };

    static defaultProps = {
        className: '',
        label: gettext('Share coupon'),
    };

    @observable isCouponCodeCopied = false;

    @autobind
    @action
    onCopySuccess() {
        this.isCouponCodeCopied = true;
    }

    @autobind
    @action
    onCopyError() {
        this.isCouponCodeCopied = false;
    }

    renderSuccessMessage() {
        if (this.isCouponCodeCopied) {
            return (
                <p styleName="success-text" data-purpose="coupon-code-link-success-text">
                    <SuccessIcon color="inherit" label={false} styleName="success-icon" />
                    {gettext('Link copied to clipboard')}
                </p>
            );
        }
    }

    render() {
        const {coupon, courseUrl, label, ...props} = this.props;

        let couponUrl = new URL(udLink.to(courseUrl));
        couponUrl.searchParams.set('couponCode', coupon.code);
        couponUrl = couponUrl.toString();

        return (
            <ModalTrigger
                trigger={
                    <CopyButton
                        data-clipboard-text={couponUrl}
                        data-purpose="coupon-code-link"
                        onClick={this.showModal}
                        onSuccess={this.onCopySuccess}
                        onError={this.onCopyError}
                        title={gettext(
                            'Get a shareable link to your course with this coupon code applied to it',
                        )}
                        {...props}
                    >
                        {label}
                    </CopyButton>
                }
                renderModal={(props) => (
                    <Modal {...props} title={gettext('Link for Coupon')}>
                        <FormGroup
                            label={gettext('Link for Coupon')}
                            labelProps={{className: 'ud-sr-only'}}
                        >
                            <TextInput readOnly={true} value={couponUrl} />
                        </FormGroup>
                        {this.renderSuccessMessage()}
                    </Modal>
                )}
            />
        );
    }
}
