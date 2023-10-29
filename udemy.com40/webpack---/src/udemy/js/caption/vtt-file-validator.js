/*
 * Module defines WebVTT file format validator.
 * This validator is supposed to operate on strings.
 * Intended use: front end file format validation before uploading to S3
 */

import {isCueTextEmpty, isSeparatorInCueText} from './vtt-parser';

export const errorStrings = {
    BAD_TIME_OFFSET: [
        'Malformed time offset.',
        gettext(
            'One or more of the caption entries has incorrectly formatted timing information.\n\n' +
                'Please fix the caption entry:',
        ),
    ],
    NO_CONTENT: ['The file is empty.', gettext('The file is empty.')],
    MISSING_WEBVTT_HEADER: [
        'Missing WEBVTT header.',
        gettext(
            'The file is missing the WEBVTT header which is required for valid vtt files.\n' +
                'Please add WEBVTT to the first line of the file.',
        ),
    ],
    MISSING_TIMINGS: [
        'Missing timings.',
        gettext(
            'One or more of the caption entries has text but no times. ' +
                'Each caption entry should have a start time, end time and some text in the following format:' +
                '\n\n00:03:00.000 --> 00:05:00.000\nSome text...\n\nPlease add times for the text:',
        ),
    ],
    MISSING_TRACK_TEXT: [
        'Missing track text.',
        gettext(
            'One of the caption entries has times but no text. ' +
                'Each caption entry should have a start time, end time and some text in the following format:' +
                '\n\n00:05:00.000 --> 00:03:00.000\nSome text...' +
                '\n\nPlease add text or remove the caption entry:',
        ),
    ],
    EMPTY_TRACK_TEXT: [
        'Invalid content.',
        gettext(
            'One of the caption entries has markup and no text.' +
                'Each caption entry should have a start time, end time and some text in the following format:' +
                '\n\n00:05:00.000 --> 00:03:00.000\nSome &lt;b&gt;text&lt;/b&gt;...' +
                '\n\nPlease add text or remove the caption entry:',
        ),
    ],
    NO_CUE_BLOCKS: [
        'No cue blocks.',
        gettext(
            'There are no recognisable caption entries in the file. ' +
                'Each caption entry should have a start time, end time and some text in the following format:' +
                '\n\n00:05:00.000 --> 00:03:00.000\nSome text...',
        ),
    ],
    SINGLE_TIMING_END_BEFORE_START: [
        'Malformed cue: end time offset not bigger than start time offset.',
        gettext(
            'One of the caption entries has an end time that is earlier than the start time.' +
                '\n\nPlease fix the following caption entry so that the end time is later than the start time:',
        ),
    ],
    LAST_START_TIME_BIGGER_THAN_VIDEO_LENGTH: [
        "Last cue's start time offset bigger than the video length.",
        gettext(
            'The last caption entry has a start time that is later than the end of the video.' +
                '\n\nPlease fix this caption entry by updating the start time to be earlier than the end of the video ' +
                'or by removing it completely:',
        ),
    ],
    SEPARATOR_IN_TRACK_TEXT: [
        'A timing separator (-->) is in the track text.',
        gettext(
            'One of the caption entries has a timing separator (-->) in the track text.' +
                '\n\nPlease remove the timing separator from the following caption entry:',
        ),
    ],
};

export class ValidationError extends Error {
    constructor(message, translatedMessage, code, block) {
        super(message);
        this.translated = translatedMessage;
        this.code = code;
        this.block = block;
    }

    name = 'ValidationError';

    static getErrorForCode(errorCode, block = '') {
        const [message, translatedMessage] = errorStrings[errorCode];
        return new ValidationError(message, translatedMessage, errorCode, block);
    }
}

const containsAlphaRegex = /[a-z]/i;
function saferParseFloat(string) {
    // Returns NaN if alpha characters exist so that hexadecimal notation can't be used.
    if (containsAlphaRegex.test(string)) {
        return NaN;
    }
    return Number(string);
}

function saferParseInt(string) {
    return Math.floor(saferParseFloat(string));
}

/**
 * Parses time stamps like HH:MM:SS.YYY into milliseconds.
 */
const msRegex = /\.\d{3}$/;
const parseTimeOffset = (timeOffset, faultyBlock) => {
    const timeUnits = timeOffset.split(':').reverse();

    // A timing cue should always end with [seconds(2)].[milliseconds(3)]
    // https://www.w3.org/TR/webvtt1/#cue-timings-and-settings-parsing
    if (!msRegex.test(timeUnits[0])) {
        throw ValidationError.getErrorForCode('BAD_TIME_OFFSET', faultyBlock);
    }

    let totalMilliseconds = 0;
    // Get (int) milliseconds from seconds.milliseconds substring.
    const seconds = saferParseFloat(timeUnits[0]);
    if (Number.isNaN(seconds)) {
        throw ValidationError.getErrorForCode('BAD_TIME_OFFSET', faultyBlock);
    }
    totalMilliseconds += seconds * 1000;

    // Get (int) milliseconds from minutes substring.
    if (!timeUnits[1]) {
        // NOTE it probably isn't a valid VTT time offset if there aren't minutes but we don't care.
        return totalMilliseconds;
    }
    const minutes = saferParseInt(timeUnits[1], 10);
    if (Number.isNaN(minutes) || minutes < 0 || minutes > 59) {
        throw ValidationError.getErrorForCode('BAD_TIME_OFFSET', faultyBlock);
    }
    totalMilliseconds += minutes * 60000;

    // Get (int) milliseconds from hours substring
    if (!timeUnits[2]) {
        return totalMilliseconds;
    }

    const hours = saferParseInt(timeUnits[2], 10);
    if (Number.isNaN(hours)) {
        throw ValidationError.getErrorForCode('BAD_TIME_OFFSET', faultyBlock);
    }
    totalMilliseconds += hours * 3600000;
    return totalMilliseconds;
};

/**
 * Validates WebVTT files: header and cues
 * @param fileContents is a string
 * @param lastCueCallback if present is expected to accept and process the last
 * cue. It is expected to throw an exception if the cue times are wrong
 * according to it's rules.
 * @throws Error
 */
export default (fileContents, context) => {
    if (fileContents.length === 0) {
        throw ValidationError.getErrorForCode('NO_CONTENT');
    }
    // console.log('fileContents', fileContents);

    // Matches at least 2 newlines: CRLF, CR or LF.
    const blockRegexp = /(?:\r\n|\n){2,}/;
    // matches a single newline: CRLF, CR or LF
    const cueRegexp = /\r\n|\n/;
    // checks for '-->' surrounded by one or more spaces
    const timingsRegexp = /\b[ \t]+-->[ \t]+\b/;

    const [headerBlock, ...bodyBlocks] = fileContents.split(blockRegexp);
    // console.log('Header', headerBlock);
    // console.log('Body', bodyBlocks);

    if (headerBlock.indexOf('WEBVTT') === -1) {
        throw ValidationError.getErrorForCode('MISSING_WEBVTT_HEADER');
    } else {
        // There can be metadata in the header as well. For example:
        // Kind: captions
        // Language: en
        // but we don't validate these.
        const firstLine = headerBlock.split(cueRegexp)[0];
        if (!/^\ufeff?WEBVTT(:?$|[ \t])/.test(firstLine)) {
            // We have a bad header case
            throw ValidationError.getErrorForCode('MISSING_WEBVTT_HEADER');
        }
    }

    let lastCue = {startOffset: -1, endOffset: -1};
    bodyBlocks.forEach((bodyBlock) => {
        if (bodyBlock.length === 0) {
            return;
        }
        // console.log('bodyBlock', bodyBlock);
        if (/^NOTE|STYLE|REGION/.test(bodyBlock)) {
            // not a cue; continue
            return;
        }
        // Body block contains (roughly):
        // - identifier (optional)
        // - timings
        // - payload
        const bodyBlockLines = bodyBlock.split(cueRegexp);
        // console.log('bodyBlockLines', bodyBlockLines);

        let timings = null;
        let payload = null;

        if (timingsRegexp.test(bodyBlockLines[0])) {
            // No cue identifier.
            timings = bodyBlockLines[0];
            payload = bodyBlockLines.slice(1);
        } else if (timingsRegexp.test(bodyBlockLines[1])) {
            // Zeroth item is the identifier. We're not interested in it.
            timings = bodyBlockLines[1];
            payload = bodyBlockLines.slice(2);
        }
        // console.log('timings', timings);
        // console.log('payload', payload);

        if (!timings || timings.length === 0) {
            throw ValidationError.getErrorForCode('MISSING_TIMINGS', bodyBlock);
        }
        if (!payload || payload.length === 0 || !payload[0].trim()) {
            throw ValidationError.getErrorForCode('MISSING_TRACK_TEXT', bodyBlock);
        }
        if (isCueTextEmpty(payload[0])) {
            throw ValidationError.getErrorForCode('EMPTY_TRACK_TEXT', bodyBlock);
        }
        if (isSeparatorInCueText(payload[0])) {
            // Illegal as per spec https://w3c.github.io/webvtt/#file-structure
            throw ValidationError.getErrorForCode('SEPARATOR_IN_TRACK_TEXT', bodyBlock);
        }

        let [startOffset, endOffsetDirty] = timings.split(timingsRegexp);

        // console.log('startOffset', startOffset);
        // console.log('endOffsetDirty', endOffsetDirty);

        // Remove any formatting directives from the end of endOffset.
        let [endOffset] = endOffsetDirty.split(/[ \t]/);
        // console.log('endOffset', endOffset);

        startOffset = parseTimeOffset(startOffset, bodyBlock);
        endOffset = parseTimeOffset(endOffset, bodyBlock);

        if (startOffset >= endOffset) {
            throw ValidationError.getErrorForCode('SINGLE_TIMING_END_BEFORE_START', bodyBlock);
        }

        lastCue = {startOffset, endOffset};
    });

    if (context && context.video_length && lastCue.startOffset > context.video_length * 1000) {
        throw ValidationError.getErrorForCode(
            'LAST_START_TIME_BIGGER_THAN_VIDEO_LENGTH',
            bodyBlocks[bodyBlocks.length - 1],
        );
    }
};
