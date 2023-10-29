import DeleteIcon from '@udemy/icons/dist/close.ud-icon';
import {MarketplaceOnly} from '@udemy/react-brand-components';
import {Button, ButtonProps, IconButton} from '@udemy/react-core-components';
import {getConfigData, noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {CartOptIn} from 'cart-opt-in/cart-opt-in.react-component';
import AvailableCoupon from 'cart/components/redeem-coupon/available-coupon.react-component';
import {MODES, ModesKeys} from 'cart/components/redeem-coupon/constants';
import {CouponForm} from 'cart/components/redeem-coupon/coupon-form.react-component';
import CouponStore from 'cart/components/redeem-coupon/coupon.mobx-store';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import styles from './redeem-coupon.less';

interface ValidCodeProps {
    removeCoupon: () => void;
    code: string;
    isInCheckoutPane?: boolean;
}

export const ValidCode = observer(
    ({removeCoupon, code, isInCheckoutPane = false}: ValidCodeProps) => {
        const translatedText = interpolate(
            gettext('<b>%(couponCode)s</b> is applied'),
            {couponCode: code},
            true,
        );

        return (
            <p
                data-purpose="code"
                className={classNames(styles.code, {
                    [styles['code-in-checkout-pane']]: isInCheckoutPane,
                })}
            >
                <IconButton
                    className={styles['code-icon-button']}
                    udStyle="ghost"
                    onClick={removeCoupon}
                >
                    <DeleteIcon
                        label={false}
                        color={isInCheckoutPane ? 'neutral' : 'info'}
                        size="small"
                    />
                </IconButton>
                <span
                    className={styles['code-text']}
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'redeem-coupon:code-text',
                        html: translatedText,
                        dataPurpose: 'code-text',
                    })}
                />
            </p>
        );
    },
);

interface EnableCouponInputModeButtonProps {
    onClick: () => void;
    buttonProps: ButtonProps;
}

export const EnableCouponInputModeButton = observer(
    ({onClick, buttonProps}: EnableCouponInputModeButtonProps) =>
        !getConfigData().brand.has_organization ? (
            <Button
                type="submit"
                onClick={onClick}
                size="medium"
                udStyle="secondary"
                data-purpose="no-coupon-button"
                {...buttonProps}
            >
                {gettext('Apply Coupon')}
            </Button>
        ) : null,
);

// Move to available coupon when typescript conversion happens
export interface StackableCouponProps {
    code: string;
    rate: string;
    savings_type: string;
    savings_value: string;
}

export interface RedeemCouponProps {
    className?: string;
    couponStore?: CouponStore;
    enableCouponInputModeButtonProps?: ButtonProps;
    enterInputModeClick?: () => void;
    showCartOptIn?: boolean;
    showCouponInputModeButton?: boolean;
    showTitle?: boolean;
    titleLabel?: string;
    removeCouponCodeClick: (code: string) => () => void;
    inputOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    inputOnSubmit: () => void;
    inputIsDisabled?: boolean;
    currentMode: typeof MODES[ModesKeys];
    currentCodes: string[];
    showStackableCoupons?: boolean;
    stackableCoupons?: StackableCouponProps[];
    onApplyStackableCoupon?: (coupon: StackableCouponProps[]) => void;
    submittedCode: string;
    inputCode: string;
    error: string;
    isInCheckoutPane?: boolean;
}

export const RedeemCoupon = observer(
    ({
        className,
        couponStore,
        enableCouponInputModeButtonProps = {},
        enterInputModeClick = noop,
        showCartOptIn = false,
        showCouponInputModeButton = false,
        showTitle = true,
        titleLabel = gettext('Promotions'),
        removeCouponCodeClick,
        inputOnChange,
        inputOnSubmit,
        inputIsDisabled = false,
        currentMode,
        currentCodes,
        showStackableCoupons = false,
        stackableCoupons = [],
        onApplyStackableCoupon = noop,
        submittedCode,
        inputCode,
        error,
        isInCheckoutPane = false,
    }: RedeemCouponProps) => {
        return (
            <MarketplaceOnly>
                <div className={className}>
                    <div className={styles['add-coupon-button']}>
                        {showCouponInputModeButton && currentMode !== MODES.OFF && (
                            <EnableCouponInputModeButton
                                onClick={enterInputModeClick}
                                buttonProps={enableCouponInputModeButtonProps}
                            />
                        )}
                    </div>
                    {showTitle && (
                        <p className={classNames('ud-heading-md', styles.title)}>{titleLabel}</p>
                    )}
                    {currentCodes.length > 0 && (
                        <div className={styles.codes}>
                            {currentCodes.reverse().map((code: string, index: number) => (
                                <ValidCode
                                    key={index}
                                    removeCoupon={removeCouponCodeClick(code)}
                                    code={code}
                                    isInCheckoutPane={isInCheckoutPane}
                                />
                            ))}
                        </div>
                    )}
                    {showCartOptIn && couponStore && <CartOptIn couponStore={couponStore} />}
                    {showStackableCoupons && stackableCoupons.length > 0 && (
                        <AvailableCoupon
                            data-purpose="available-coupon"
                            coupons={stackableCoupons}
                            currentCodes={currentCodes}
                            onApplyCoupon={onApplyStackableCoupon}
                        />
                    )}
                    {[MODES.INPUT, MODES.PENDING].includes(currentMode) && (
                        <CouponForm
                            onChange={inputOnChange}
                            onSubmit={inputOnSubmit}
                            disabled={inputIsDisabled}
                            error={error}
                            submittedCode={submittedCode}
                            inputCode={inputCode}
                            currentMode={currentMode}
                            isInCheckoutPane={isInCheckoutPane}
                        />
                    )}
                </div>
            </MarketplaceOnly>
        );
    },
);
