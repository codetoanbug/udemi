import {DynamicPriceText as DesignSystemDynamicPriceText} from '@udemy/react-merchandising-components';

import {withPriceTextTracking} from './with-price-text-tracking.react-component';

/**
 * ### DynamicPriceText
 *
 * @remarks
 * This component requires `currencyformatter.js` to format a numeric price
 * amount into price string with currency symbol If you need to calculate
 * prices on the frontend (e.g. the shopping cart computes the total of all
 * items in the cart), then use this component.
 *
 * If your price does not change, prefer `StaticPriceText` as it is the more
 * lightweight component.
 */
export const DynamicPriceText = withPriceTextTracking(DesignSystemDynamicPriceText);
