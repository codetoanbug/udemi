import * as vjsvtt from 'videojs-vtt.js';

export function parseVTT(vttData, onCue, onComplete, onError) {
    const parser = new vjsvtt.WebVTT.Parser(null, vjsvtt, vjsvtt.WebVTT.StringDecoder());
    parser.oncue = onCue;
    parser.onflush = onComplete;
    parser.onparsingerror = onError;
    parser.parse(vttData);
    parser.flush();
}

export function isCueTextEmpty(cueText) {
    // don't try to parse empty cue text, will return a null DOM
    if (!cueText.trim().length) {
        return true;
    }
    const htmlValue = vjsvtt.WebVTT.convertCueToDOMTree(window, cueText);
    const value = htmlValue.textContent.trim();
    return !value.length;
}

export function isSeparatorInCueText(cueText) {
    return /-->/.test(cueText);
}
