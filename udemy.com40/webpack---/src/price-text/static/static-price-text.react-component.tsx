import React from 'react';

import {StaticCurrency} from '../../currency/static-currency.react-component';
import {BasePriceText, PriceTextProps} from '../base-price-text.react-component';

/**
 * ### StaticPriceText
 *
 * @remarks
 * This component expects the  price strings from the backend.
 * If your price does not change, prefer this component over
 * `DynamicPriceText` as it is the more lightweight component.
 */
export const StaticPriceText = (props: PriceTextProps) => (
    <BasePriceText {...props} currencyComponent={StaticCurrency} />
);
