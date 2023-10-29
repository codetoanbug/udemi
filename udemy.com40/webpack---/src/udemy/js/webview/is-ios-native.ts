import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';
import getOSName from 'utils/user-agent/get-os-name';

export function isiOSNative() {
    return getIsMobileApp() && getOSName() === 'ios';
}
