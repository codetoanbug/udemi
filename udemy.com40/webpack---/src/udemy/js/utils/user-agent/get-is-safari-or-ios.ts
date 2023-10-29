import UAParser from 'ua-parser-js';

import getOSName from 'utils/user-agent/get-os-name';

// This is very much a temporary solution that relies on user agent -
// "Browser identification based on detecting the user agent string
// is unreliable and is not recommended, as the user agent string is user configurable"
// Please refer to MDN docs for more information:
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent
export function getIsSafariOrIOS(uaParser: UAParser.UAParserInstance): boolean {
    const browserName = uaParser.getBrowser().name ?? '';
    const isSafari = browserName.toLowerCase().includes('safari');
    const isIOS = getOSName() === 'ios';
    return isSafari || isIOS;
}
