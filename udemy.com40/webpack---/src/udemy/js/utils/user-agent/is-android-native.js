import getIsMobileApp from './get-is-mobile-app';
import getOSName from './get-os-name';

export default function isAndroidNative() {
    return getIsMobileApp() && getOSName() === 'android';
}
