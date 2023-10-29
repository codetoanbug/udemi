import React from 'react';

import {
    AddToCartProps,
    AddToCart as AddToCartTempMigration,
    CartBuyable,
} from '@udemy/cart-temp-migration';

import {BundleUnit} from '../bundle-unit/bundle-unit.react-component';

/** Note: This is the same implementation as react-discovery-units/src/add-to-cart/add-to-cart.react-component.tsx
 * to break the BundleUnit circular dependency
 **/
export const AddToCart = (props: AddToCartProps) => {
    const renderBundleUnit = (buyables: CartBuyable[]) => {
        if (buyables?.[0]) {
            return (
                <BundleUnit
                    pageType="cartSuccessModal"
                    pageObjectId={buyables[0].id}
                    titleTypography="ud-heading-lg"
                    forceGoToCart={true}
                    allowAddToCartSuccessModal={false}
                />
            );
        }
        return null;
    };
    return <AddToCartTempMigration {...props} renderBundleUnit={renderBundleUnit} />;
};
