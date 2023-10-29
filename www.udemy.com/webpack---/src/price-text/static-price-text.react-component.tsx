import {StaticPriceText as DesignSystemStaticPriceText} from '@udemy/react-merchandising-components';

import {withPriceTextTracking} from './with-price-text-tracking.react-component';

/**
 * ### StaticPriceText
 *
 * @remarks
 * This component expects the  price strings from the backend.
 * If your price does not change, prefer this component over
 * `DynamicPriceText` as it is the more lightweight component.
 */

export const StaticPriceText = withPriceTextTracking(DesignSystemStaticPriceText);
