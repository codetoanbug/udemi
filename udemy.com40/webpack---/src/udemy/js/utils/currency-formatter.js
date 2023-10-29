/* This file is maintained for backwards compatibility.
 * New location is the @udemy/system-utils package. See:
 * https://github.com/udemy/frontends/blob/main/packages/shared-utils/src/i18n/currency-formatter.js
 * */
import {DEFAULT_CURRENCY, DEFAULT_LOCALE, DEFAULT_SCALE, formatCurrency} from '@udemy/shared-utils';

export {DEFAULT_CURRENCY, DEFAULT_LOCALE, DEFAULT_SCALE};

// eslint-disable-next-line import/no-default-export
export default formatCurrency;
