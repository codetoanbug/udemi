/* This file is maintained for backwards compatibility.
 * New location is the @udemy/system-utils package. See:
 * https://github.com/udemy/frontends/blob/main/packages/shared-utils/src/data/get-request-data.js
 * */
import {mergeRequestKeysFromQueryString, getRequestData} from '@udemy/shared-utils';

// Allow manual testing by adding values to udRequest via the page URL.
// Prior to being wrapped in an external module, the code in this function
// ran at import time.
mergeRequestKeysFromQueryString();

export default getRequestData;
