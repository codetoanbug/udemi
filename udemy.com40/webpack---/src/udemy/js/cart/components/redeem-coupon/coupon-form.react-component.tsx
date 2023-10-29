import {ButtonStyleType} from '@udemy/react-core-components';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {MODES, ModesKeys} from 'cart/components/redeem-coupon/constants';

import styles from './coupon-form.less';

interface CouponFormProps {
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    disabled?: boolean;
    error: string;
    submittedCode: string;
    inputCode: string;
    currentMode: typeof MODES[ModesKeys];
    isInCheckoutPane?: boolean;
}

export const CouponForm = observer(
    ({
        onChange,
        onSubmit,
        disabled = false,
        error,
        submittedCode,
        inputCode,
        currentMode,
        isInCheckoutPane = false,
    }: CouponFormProps) => {
        const submitButtonProps: {
            disabled: boolean;
            udStyle?: ButtonStyleType;
            className?: string;
        } = {
            disabled,
        };
        let submitButtonContent: React.ReactNode = gettext('Apply');
        if (isInCheckoutPane) {
            submitButtonProps.udStyle = 'brand';
            submitButtonProps.className =
                currentMode === MODES.PENDING
                    ? styles['submit-button-loading-in-checkout-pane']
                    : undefined;
            submitButtonContent =
                currentMode === MODES.PENDING ? <Loader size="small" /> : gettext('Apply');
        }

        return (
            <FormGroup
                label={gettext('Apply coupon')}
                labelProps={{className: 'ud-sr-only'}}
                className={styles['coupon-form-group']}
            >
                <TextInputForm
                    submitButtonContent={submitButtonContent}
                    disabled={currentMode === MODES.PENDING}
                    onChange={onChange}
                    onSubmit={onSubmit}
                    placeholder={error ? submittedCode : gettext('Enter Coupon')}
                    size={isInCheckoutPane ? 'small' : 'medium'}
                    value={inputCode}
                    dataPurposes={{
                        form: 'coupon-form',
                        input: 'coupon-input',
                        submit: 'coupon-submit',
                    }}
                    submitButtonProps={submitButtonProps}
                />
                {error && (
                    <p
                        data-purpose="coupon-form-error"
                        className={classNames('ud-text-xs', styles['code-error'])}
                    >
                        {error}
                    </p>
                )}
            </FormGroup>
        );
    },
);
