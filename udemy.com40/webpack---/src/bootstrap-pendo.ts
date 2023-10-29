import {getConfigData, getRequestData, udMe} from '@udemy/shared-utils';

import {injectPendo} from './snippet';
import {Pendo} from './types';

export function bootstrapPendo(): Pendo | undefined {
    if (typeof window === 'undefined') {
        return;
    }

    const udConfig = getConfigData();
    const appKey = '2d920dba-1b8c-45fb-62b5-571980bcd610';
    const signingKeyName = udConfig.env === 'PROD' ? 'udem-udem-2jisI' : 'udem-udem-rHQg2';

    injectPendo(appKey);

    const udRequest = getRequestData();
    const me = udMe();

    //is ub user
    if (me?.is_authenticated) {
        // This function creates anonymous visitor IDs in Pendo unless you change the visitor id field to use your app's values
        // This function uses the placeholder 'ACCOUNT-UNIQUE-ID' value for account ID unless you change the account id field to use your app's values
        // Call this function after users are authenticated in your app and your visitor and account id values are available
        // Please use Strings, Numbers, or Bools for value types.
        window.pendo.initialize({
            jwt: udRequest.signed_pendo_payload,
            signingKeyName: signingKeyName,
        });
    }

    return window.pendo;
}
