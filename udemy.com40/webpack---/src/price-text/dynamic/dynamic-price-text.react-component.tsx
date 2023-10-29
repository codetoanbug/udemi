import React from 'react';

import {DynamicCurrency} from '../../currency/dynamic-currency.react-component';
import {BasePriceText, PriceTextProps} from '../base-price-text.react-component';

/**
 * ### DynamicPriceText
 *
 * @remarks
 * This component formats a numeric price amount into price string with currency
 * symbol at runtime. If you need to calculate prices on the frontend (e.g. the
 * shopping cart computes the total of all items in the cart), then use this
 * component.
 *
 * If your price does not change, prefer `StaticPriceText` as it is the more
 * lightweight component.
 */
export const DynamicPriceText = (props: PriceTextProps) => (
    <BasePriceText {...props} currencyComponent={DynamicCurrency} />
);
