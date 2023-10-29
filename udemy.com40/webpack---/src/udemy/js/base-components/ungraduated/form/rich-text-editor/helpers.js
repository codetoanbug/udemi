import {MATH_OPEN_MARK, MATH_CLOSE_MARK} from 'ud-mathjax/constants';

import {FEATURES} from './constants';

// Copied from django.core.validators:URLValidator.
const URL_SCHEMES = ['http', 'https', 'ftp', 'ftps'];

// Used to cache feature detection results.
const BROWSER_FEATURES = {};

// This is adapted from the prosemirror-view `readHTML` method.
// If we need to create a DOM node, but we don't need to render it, then it's safer to
// use a detached document. If we set innerHTML to something like
// <img onload="alert(':(){ :|:& };:')" src="http://valid-src.jpg">
// via the main document, the `onload` executes, whereas via a detached document, it doesn't.
// Note the same issue occurs when creating a jQuery element from an HTML string.
//
// If we need to render a DOM node, then we use the main document, since certain events,
// e.g. 'mousedown', do not work via a detached document.
let detachedDoc = null;

export function getFeaturesForTheme(theme) {
    return FEATURES[theme];
}

export function isBrowserFeatureAvailable(feature) {
    if (BROWSER_FEATURES[feature] === undefined) {
        switch (feature) {
            case 'UPLOAD_API':
                // https://github.com/axios/axios/blob/v0.16.1/lib/adapters/xhr.js#L155
                BROWSER_FEATURES[feature] = 'upload' in XMLHttpRequest.prototype;
                break;
            case 'DROP_EVENT':
                // https://css-tricks.com/drag-and-drop-file-uploading/
                BROWSER_FEATURES[feature] =
                    'ondrop' in getDetachedDoc().createElement('div') && 'FileReader' in window;
                break;
            default:
                throw new Error(`Unknown browser feature: ${feature}`);
        }
    }
    return BROWSER_FEATURES[feature];
}

export function getDetachedDoc() {
    if (!detachedDoc) {
        detachedDoc = document.implementation.createHTMLDocument('title');
    }
    return detachedDoc;
}

export function hasAllFeatures(featureSet, featureStringOrSubset) {
    if (typeof featureStringOrSubset === 'string') {
        return featureSet.has(featureStringOrSubset);
    }
    for (const feature of featureStringOrSubset) {
        if (!featureSet.has(feature)) {
            return false;
        }
    }
    return true;
}

export function htmlToText(html) {
    if (!html) {
        return '';
    }
    const div = getDetachedDoc().createElement('div');
    div.innerHTML = html;
    return div.textContent;
}

export function getAnchorTooltipTrigger(target, container) {
    let currentTarget = target;
    while (currentTarget) {
        const tagName = (currentTarget.tagName || '').toLowerCase();
        if (currentTarget === container || tagName === 'img') {
            // <AnchorTooltip /> is not shown when <ImageEditor /> is clicked.
            return false;
        }
        if (tagName === 'a') {
            return currentTarget;
        }
        currentTarget = currentTarget.parentNode;
    }
    return null;
}

export function validateHref(href, validatedData, error, required, gettext) {
    if (required && !href) {
        error.href = gettext('This field is required.');
    } else if (href && href.startsWith('mailto:')) {
        // check mailto: url for basic email validity
        const email = href.split(':')[1];
        if (email.match(/.+@.+\...+/)) {
            validatedData.href = href;
        } else {
            error.href = gettext('Enter a valid URL.');
        }
    } else if (href && !href.startsWith('/')) {
        // URL is absolute, not relative.
        const requiredPartOfURL = /([\w-]{1,63}\.[a-zA-Z-]{2,63}|(?:\d{1,3}\.){3}\d{1,3})/g;
        if (!href.match(requiredPartOfURL)) {
            error.href = gettext('Enter a valid URL.');
        } else {
            const scheme = href.split('://')[0];
            if (scheme === href) {
                // URL does not have a scheme. Default to http.
                // google.com -> http://google.com
                validatedData.href = `http://${href}`;
            } else if (!URL_SCHEMES.includes(scheme.toLowerCase())) {
                error.href = gettext('Enter a valid URL.');
            }
        }
    }
}

export function unwrapMathContent(mathContent) {
    let unwrappedContent = mathContent.trim();
    if (unwrappedContent.startsWith(MATH_OPEN_MARK)) {
        unwrappedContent = unwrappedContent.slice(MATH_OPEN_MARK.length);
    }
    if (unwrappedContent.endsWith(MATH_CLOSE_MARK)) {
        unwrappedContent = unwrappedContent.slice(0, -MATH_CLOSE_MARK.length);
    }
    return unwrappedContent;
}

export function wrapMathContent(mathContent) {
    return `${MATH_OPEN_MARK}${mathContent}${MATH_CLOSE_MARK}`;
}
