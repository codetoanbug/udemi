import {useUDData} from '@udemy/ud-data';
import React from 'react';

/** MarketplaceOnly conditional wrapper.
 *
 *  @remarks
 *  This component uses the `@udemy/ud-data` package.
 *  If the config data for the site this is rendering on is the general Marketplace experience and not a Udemy For Business
 *  site, it will return the `children` of this wrapper component. Otherwise, it will return `null`.
 */
export const MarketplaceOnly = ({children}: React.ComponentPropsWithoutRef<'div'>) => {
    const {Config: udConfig} = useUDData();

    // To avoid potential "Uncaught Invariant Violation: MarketplaceOnly(...): Nothing was returned from render." errors
    // make sure we return something, at least a null value or empty Fragment, particularly when we are in a loading state
    return !udConfig.brand.has_organization ? <>{children}</> : null;
};
