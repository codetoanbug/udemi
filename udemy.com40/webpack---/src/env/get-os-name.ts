import {serverOrClient} from './server-or-client';

// Adapted from https://stackoverflow.com/questions/9514179/how-to-find-the-operating-system-version-using-javascript
export function getOSName() {
    const userAgent = serverOrClient.global.navigator.userAgent,
        platform = serverOrClient.global.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = [
            'iPhone',
            'iPad',
            'iPod',
            'iPhone Simulator',
            'iPad Simulator',
            'iPod Simulator',
        ];
    let os = 'other';

    // OS names should be all lower case for backwards compatibility
    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'mac os';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'ios';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'windows';
    } else if (/Android/.test(userAgent)) {
        os = 'android';
    } else if (/Linux/.test(platform)) {
        os = 'linux';
    }

    return os;
}
