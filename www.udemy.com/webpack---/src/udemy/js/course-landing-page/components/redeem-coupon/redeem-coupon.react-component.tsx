import {ButtonProps} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {MODES} from 'cart/components/redeem-coupon/constants';
import {RedeemCoupon as BaseRedeemCoupon} from 'cart/components/redeem-coupon/redeem-coupon.react-component';
import {injectCourseLandingPageContext} from 'course-landing-page/components/inject-course-landing-component-context';

import {CouponStore} from './coupon.mobx-store';
import './redeem-coupon.less';

interface RedeemCouponProps {
    className?: string;
    couponStore: CouponStore;
    is_paid?: boolean;
    enableCouponInputModeButtonProps?: ButtonProps;
    showCouponInputModeButton?: boolean;
    showTitle?: boolean;
    showStackableCoupons?: boolean;
}

@injectCourseLandingPageContext('redeem_coupon')
@observer
export class RedeemCoupon extends React.Component<RedeemCouponProps> {
    static defaultProps = {
        is_paid: true,
        enableCouponInputModeButtonProps: {},
        showCouponInputModeButton: true,
        showTitle: false,
        showStackableCoupons: false,
    };

    constructor(props: RedeemCouponProps) {
        super(props);
        this.store = props.couponStore;
    }

    @action
    componentDidMount() {
        this.store = this.props.couponStore;
        this.store.initialize();
    }

    @observable store: CouponStore;

    @autobind
    removeCouponCode(code: string) {
        return this.store?.removeCouponCode(code);
    }

    @autobind
    inputOnChange({target}: React.ChangeEvent<HTMLInputElement>) {
        this.store.setCode(target.value);
    }

    @autobind
    inputOnSubmit() {
        this.store.applyInputCode();
    }

    render() {
        if (
            !this.props.is_paid ||
            !this.store ||
            this.store.hasAlreadyPurchased ||
            this.store.currentMode === MODES.OFF
        ) {
            return null;
        }

        return (
            <BaseRedeemCoupon
                className={this.props.className}
                enableCouponInputModeButtonProps={this.props.enableCouponInputModeButtonProps}
                showCouponInputModeButton={this.props.showCouponInputModeButton}
                showTitle={this.props.showTitle}
                showStackableCoupons={this.props.showStackableCoupons}
                currentMode={this.store.currentMode}
                currentCodes={this.store.currentCodes}
                enterInputModeClick={this.store.enterInputMode}
                removeCouponCodeClick={this.removeCouponCode}
                inputOnChange={this.inputOnChange}
                inputOnSubmit={this.inputOnSubmit}
                inputIsDisabled={!this.store.allowSubmit}
                error={this.store.error}
                submittedCode={this.store.submittedCode}
                inputCode={this.store.inputCode}
            />
        );
    }
}
