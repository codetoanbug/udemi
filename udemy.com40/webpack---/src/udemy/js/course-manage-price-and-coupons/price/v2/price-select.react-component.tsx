import {Button} from '@udemy/react-core-components';
import {FormGroup, Select} from '@udemy/react-form-components';
import {inject, observer} from 'mobx-react';
import React from 'react';

import {showSuccessToast} from '../../../instructor/toasts';
import {noop} from '../../../utils/noop';
import {emptyInputValue} from '../../constants';
import {PriceStore, PriceTier} from '../price.mobx-store';
import {
    PRICE_SELECT_CHANGES_SAVED_SUCCESS_TEXT,
    PRICE_SELECT_CURRENCY_LABEL_TEXT,
    PRICE_SELECT_OPTED_INTO_DEALS_LABEL_TEXT,
    PRICE_SELECT_OPTED_OUT_DEALS_LABEL_TEXT,
    PRICE_SELECT_OPTION_FREE,
    PRICE_SELECT_OPTION_SELECT,
    PRICE_SELECT_OPTION_TIER_TEXT,
    PRICE_SELECT_PRICE_LABEL_TEXT,
    PRICE_SELECT_SAVE_BUTTON_TEXT,
} from './messages';
import {PricePopover} from './price-popover.react-component';

import './price-select.less';

/**
 * Unlike the currency select width, which is always 3 characters long,
 * the amount select width depends on the currency ("$20" is shorter than "¥2,400")
 * and the locale ("tier" is shorter than "przedział"). However, we can assume the last option
 * is the longest, since amounts are sorted smallest to largest. Therefore, by rendering
 * the last option in an invisible container in the dropdown button, we can ensure the dropdown
 * is wide enough to display all menu items without horizontal overflow.
 */

export interface AmountSelectControlProps {
    onChange?: (option: React.ChangeEvent<HTMLSelectElement>) => void;
    priceStore: PriceStore;
    instructorIsOptedIntoDeals: boolean;
}

export const AmountSelectControl = inject('priceStore')(
    observer(({onChange, priceStore, instructorIsOptedIntoDeals}: AmountSelectControlProps) => {
        const priceTiers: Array<PriceTier> = priceStore.getPriceTiersForCurrency(
            priceStore.form.data.currency,
        );
        let emptyOption = null;
        if (!priceStore.course.price_updated_date) {
            // Allow empty option if price has never been set.
            emptyOption = (
                <option key="empty" value={emptyInputValue}>
                    {PRICE_SELECT_OPTION_SELECT}
                </option>
            );
        }

        let freeOption = null;
        if (
            !priceStore.course.is_practice_test_course &&
            priceStore.course.num_published_practice_tests === 0
        ) {
            freeOption = (
                <option key="free" value={0}>
                    {PRICE_SELECT_OPTION_FREE}
                </option>
            );
        }
        const labelText = instructorIsOptedIntoDeals
            ? PRICE_SELECT_OPTED_INTO_DEALS_LABEL_TEXT
            : PRICE_SELECT_OPTED_OUT_DEALS_LABEL_TEXT;

        return (
            <label styleName="font-weight-bold">
                {labelText}
                <PricePopover instructorIsOptedIntoDeals={instructorIsOptedIntoDeals} />
                <Select
                    disabled={priceTiers.length === 0}
                    onChange={onChange}
                    value={priceStore.form.data.amount}
                >
                    {emptyOption}
                    {freeOption}
                    {priceTiers.map((priceTier) => (
                        <option key={priceTier.id} value={priceTier.amount}>
                            {priceTier.price_money}{' '}
                            {interpolate(
                                PRICE_SELECT_OPTION_TIER_TEXT,
                                [priceTier.price_tier_level],
                                false,
                            )}
                        </option>
                    ))}
                </Select>
            </label>
        );
    }),
);

export interface CurrencySelectControlProps {
    onChange?: (option: React.ChangeEvent<HTMLSelectElement>) => void;
    priceStore: PriceStore;
}
export const CurrencySelectControl = inject('priceStore')(
    observer(({onChange, priceStore}: CurrencySelectControlProps) => {
        return (
            <label styleName="font-weight-bold">
                {PRICE_SELECT_CURRENCY_LABEL_TEXT}
                <Select
                    disabled={priceStore.currencies.length === 0}
                    onChange={onChange}
                    value={priceStore.form.data.currency}
                >
                    {priceStore.currencies.map((currency) => (
                        <option key={currency} value={currency}>
                            {currency.toUpperCase()}
                        </option>
                    ))}
                </Select>
            </label>
        );
    }),
);

export interface PriceSelectProps {
    priceStore: PriceStore;
    instructorIsOptedIntoDeals: boolean;
}

export const PriceSelect = inject('priceStore')(
    observer(({priceStore, instructorIsOptedIntoDeals}: PriceSelectProps) => {
        const renderPriceErrors = (fieldName: string) => {
            if (!priceStore.form.errors || !priceStore.form.errors[fieldName]) {
                return null;
            }
            return priceStore.form.errors[fieldName].join(' ');
        };

        const validationState = priceStore.form.errors ? 'error' : 'neutral';
        const onAmountChange = (option: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedAmount = Number(option.target.value);
            priceStore.form.setData({amount: selectedAmount});
        };

        const onCurrencyChange = (option: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedCurrency = option.target.value;
            const form = priceStore.form;
            // @ts-expect-error to fix object is possibly undefined
            priceStore.loadPriceTiers().then(() => {
                const exchangedAmount = priceStore.exchangePriceTierAmount(
                    form.data.amount,
                    form.data.currency,
                    selectedCurrency,
                );
                form.setData({amount: exchangedAmount, currency: selectedCurrency});
            });
        };

        const onSubmit = (event: React.FormEvent) => {
            event.preventDefault();
            priceStore.form
                .submit()
                .then(() => {
                    showSuccessToast(PRICE_SELECT_CHANGES_SAVED_SUCCESS_TEXT);
                })
                .catch(noop);
        };

        return (
            <form onSubmit={onSubmit}>
                <FormGroup
                    data-purpose="price-select"
                    label={PRICE_SELECT_PRICE_LABEL_TEXT}
                    labelProps={{className: 'ud-sr-only'}}
                    validationState={validationState}
                    note={renderPriceErrors('non_field_errors')}
                    udStyle="fieldset"
                    styleName="price-select"
                >
                    <div styleName="btn-group">
                        <CurrencySelectControl
                            onChange={onCurrencyChange}
                            priceStore={priceStore}
                        />
                        <AmountSelectControl
                            onChange={onAmountChange}
                            priceStore={priceStore}
                            instructorIsOptedIntoDeals={instructorIsOptedIntoDeals}
                        />
                    </div>
                    <Button
                        data-purpose="price-form-submit-button"
                        disabled={!priceStore.form.canSubmit || priceStore.form.isSubmitting}
                        styleName="save-price-button"
                        type="submit"
                    >
                        {PRICE_SELECT_SAVE_BUTTON_TEXT}
                    </Button>
                </FormGroup>
            </form>
        );
    }),
);
