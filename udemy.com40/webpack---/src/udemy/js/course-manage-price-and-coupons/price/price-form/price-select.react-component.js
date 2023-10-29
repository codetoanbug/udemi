import {FormGroup} from '@udemy/react-form-components';
import {inject, observer} from 'mobx-react';
import React from 'react';

import {emptyInputValue} from '../../constants';
import BaseSelectControl from './base-select-control.react-component';
import PriceSubmitButton from './price-submit-button.react-component';
import './price-select.less';

/**
 * Unlike the currency select width, which is always 3 characters long,
 * the amount select width depends on the currency ("$20" is shorter than "¥2,400")
 * and the locale ("tier" is shorter than "przedział"). However, we can assume the last option
 * is the longest, since amounts are sorted smallest to largest. Therefore, by rendering
 * the last option in an invisible container in the dropdown button, we can ensure the dropdown
 * is wide enough to display all menu items without horizontal overflow.
 */
// eslint-disable-next-line react/prop-types
const AmountTitle = ({selectedOptionText, lastOptionText}) => (
    <span styleName="title-container">
        <span aria-hidden={true} styleName="title-spacer">
            {lastOptionText}
        </span>
        {selectedOptionText}
    </span>
);

const AmountSelectControl = inject('priceStore')(
    observer(({onChange, priceStore}) => {
        const priceTiers = priceStore.getPriceTiersForCurrency(priceStore.form.data.currency);
        let emptyOption = null;
        if (!priceStore.course.price_updated_date) {
            // Allow empty option if price has never been set.
            emptyOption = (
                <option key="empty" value={emptyInputValue}>
                    {gettext('Select')}
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
                    {gettext('Free')}
                </option>
            );
        }

        const renderTitle = (selectedOptionText) => {
            let lastOptionText;
            if (priceTiers.length === 0) {
                lastOptionText = selectedOptionText;
            } else {
                const lastPriceTier = priceTiers[priceTiers.length - 1];
                lastOptionText = (
                    <span>
                        {lastPriceTier.price_money}{' '}
                        {interpolate(gettext('(tier %s)'), [lastPriceTier.price_tier_level], false)}
                    </span>
                );
            }
            return (
                <AmountTitle
                    selectedOptionText={selectedOptionText}
                    lastOptionText={lastOptionText}
                />
            );
        };

        return (
            <BaseSelectControl
                disabled={priceTiers.length === 0}
                onChange={onChange}
                renderTitle={renderTitle}
                value={priceStore.form.data.amount}
            >
                {emptyOption}
                {freeOption}
                {priceTiers.map((priceTier) => (
                    <option key={priceTier.id} value={priceTier.amount}>
                        {priceTier.price_money}{' '}
                        {interpolate(gettext('(tier %s)'), [priceTier.price_tier_level], false)}
                    </option>
                ))}
            </BaseSelectControl>
        );
    }),
);

const CurrencySelectControl = inject('priceStore')(
    observer(({onChange, priceStore}) => {
        return (
            <BaseSelectControl
                disabled={priceStore.currencies.length === 0}
                onChange={onChange}
                value={priceStore.form.data.currency}
            >
                {priceStore.currencies.map((currency) => (
                    <option key={currency} value={currency}>
                        {currency.toUpperCase()}
                    </option>
                ))}
            </BaseSelectControl>
        );
    }),
);

const PriceSelect = inject('priceStore')(
    observer(({onAmountChange, onCurrencyChange, priceStore}) => {
        const renderPriceErrors = (fieldName) => {
            if (!priceStore.form.errors || !priceStore.form.errors[fieldName]) {
                return null;
            }
            return priceStore.form.errors[fieldName].join(' ');
        };

        const validationState = priceStore.form.errors ? 'error' : 'neutral';
        return (
            <FormGroup
                data-purpose="price-select"
                label={gettext('Price')}
                labelProps={{className: 'ud-sr-only'}}
                validationState={validationState}
                note={renderPriceErrors('non_field_errors')}
                udStyle="fieldset"
                styleName="price-select"
            >
                <div styleName="btn-group">
                    <div styleName="btn-group">
                        <FormGroup
                            label={gettext('Currency')}
                            labelProps={{className: 'ud-sr-only'}}
                            validationState={validationState}
                            note={renderPriceErrors('currency')}
                        >
                            <CurrencySelectControl onChange={onCurrencyChange} />
                        </FormGroup>
                        <FormGroup
                            label={gettext('Amount')}
                            labelProps={{className: 'ud-sr-only'}}
                            validationState={validationState}
                            note={renderPriceErrors('amount')}
                        >
                            <AmountSelectControl onChange={onAmountChange} />
                        </FormGroup>
                    </div>
                    <PriceSubmitButton />
                </div>
            </FormGroup>
        );
    }),
);

export default PriceSelect;
