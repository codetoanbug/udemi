import {serverOrClient} from '@udemy/shared-utils';

export class CheckoutReferrerHelper {
    private static readonly checkoutReferrerUrlSessionKey = 'checkoutReferrerURL';

    static saveCheckoutReferrer() {
        (serverOrClient.global as Window).sessionStorage.setItem(
            CheckoutReferrerHelper.checkoutReferrerUrlSessionKey,
            new URL(location.href).pathname,
        );
    }

    static goToCheckoutReferrer() {
        const checkoutReferrer = (serverOrClient.global as Window).sessionStorage.getItem(
            CheckoutReferrerHelper.checkoutReferrerUrlSessionKey,
        );
        (serverOrClient.global as Window).location.href = checkoutReferrer ?? '/cart';
    }
}
