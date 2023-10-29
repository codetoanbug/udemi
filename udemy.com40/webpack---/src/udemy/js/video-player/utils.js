import 'utils/composed-path';
import UAParser from 'ua-parser-js';

const uaParser = new UAParser();

function getMajorVersion(versionString) {
    if (!versionString) {
        return;
    }

    const versionParts = versionString.match(/^[0-9]+/g);

    if (versionParts) {
        return versionParts[0];
    }
}

export const parsedUserAgent = {
    browser: uaParser.getBrowser(),
    os: uaParser.getOS(),
    device: uaParser.getDevice(),
};

export const parseSpriteImageLink = (imgLocation, basePath) => {
    const hashIndex = imgLocation.indexOf('#');
    if (hashIndex === -1) {
        return {
            src: imgLocation,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        };
    }

    const lsrc = imgLocation.substring(0, hashIndex);
    const hashString = imgLocation.substring(hashIndex + 1);
    if (hashString.substring(0, 5) !== 'xywh=') {
        return {
            src: basePath + lsrc,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        };
    }

    const data = hashString.substring(5).split(',');
    return {
        src: basePath + lsrc,
        x: +data[0],
        y: +data[1],
        w: +data[2],
        h: +data[3],
    };
};

// Calculate the major versions
parsedUserAgent.browser.majorVersion = getMajorVersion(parsedUserAgent.browser.version);
parsedUserAgent.os.majorVersion = getMajorVersion(parsedUserAgent.os.version);

// Shortcut for detecting mobile browsers
parsedUserAgent.isMobile = parsedUserAgent.device.type === 'mobile';

// Bugfix for iOS 13
// See https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
(() => {
    if (
        parsedUserAgent.os.name === 'Mac OS' &&
        window.navigator.platform === 'MacIntel' &&
        navigator.maxTouchPoints > 1
    ) {
        parsedUserAgent.os.name = 'iOS';
    }
})();
