import {useI18n, I18nApi} from '@udemy/i18n';
import React from 'react';

type I18nFunctions = Pick<I18nApi, 'gettext' | 'interpolate'>;

const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;

// STYLE and PRECISION are still referenced in JavaScript, thus we are doing `as const`, then later `keyof typeof`, `typeof` etc
const STYLE = {
    HUMAN: 'human',
    HUMAN_COMPACT: 'humanCompact',
    TIMESTAMP: 'timestamp',
} as const;

const PRECISION = {
    HOURS: 'hours',
    MINUTES: 'minutes',
    SECONDS: 'seconds',
} as const;

const formats: Record<
    DurationStyleValues,
    (numSeconds: number, durationOptions: DurationProps, i18nFunctions: I18nFunctions) => string
> = {
    [STYLE.HUMAN]: formatHumanDuration,
    [STYLE.HUMAN_COMPACT]: formatHumanCompactDuration,
    [STYLE.TIMESTAMP]: formatTimestampDuration,
};

type DurationStyleKeys = keyof typeof STYLE;
type DurationStyleValues = typeof STYLE[DurationStyleKeys];
type DurationPrecisionKeys = keyof typeof PRECISION;
type DurationPrecisionValues = typeof PRECISION[DurationPrecisionKeys];

/**
 * Interface for formatting duration strings in the Duration component
 * @internal
 */
interface DurationProps extends React.ComponentPropsWithoutRef<'span'> {
    /** The number of seconds to format into a readable string */
    numSeconds: number;
    /** The style to apply to Duration string formatting
     *  @defaultValue `human` - the "human friendly" format
     */
    presentationStyle?: DurationStyleValues;
    /** The precision to apply to Duration formatting.  Emphasizes hours, minutes, seconds.
     *  @defaultValue `minutes`
     */
    precision?: DurationPrecisionValues;
}

/** An interface for an object containing all possible string formatting options for Duration  */
interface TimeTemplates {
    hms: string;
    hm: string;
    m: string;
    ms: string;
    s: string;
}

/**
 *  Display an approximate duration with hour or minute precision.
 *
 *  @remarks
 *  This component allows displaying time in one of three formats:
 *  - a human-readable version, used for course or lecture length display
 *  - a compact human-readable version
 *  - an exact timestamp (with second precision), used for the video player.
 */
export const Duration = ({
    numSeconds,
    presentationStyle = STYLE.HUMAN,
    precision = PRECISION.MINUTES,
    ...extraProps
}: DurationProps) => {
    const {gettext, interpolate} = useI18n();

    return (
        <span {...extraProps}>
            {formatDuration({numSeconds, presentationStyle, precision}, {gettext, interpolate})}
        </span>
    );
};

Duration.displayName = 'Duration';
Duration.STYLE = STYLE;
Duration.PRECISION = PRECISION;

/** Formatter function that uses the same interface as `Duration` component. */
export function formatDuration(
    {numSeconds, presentationStyle = STYLE.HUMAN, precision = PRECISION.MINUTES}: DurationProps,
    i18nFunctions: I18nFunctions,
) {
    const roundedNumSeconds = Math.floor(numSeconds);

    return formats[presentationStyle](
        roundedNumSeconds,
        {
            numSeconds,
            presentationStyle,
            precision,
        },
        i18nFunctions,
    );
}

/**
 * Returns a formatted duration in a "compact human friendly" format.
 * @internal
 *
 * @param roundedNumSeconds - number of seconds to format
 * @param durationProps - {@link DurationProps} for precision
 *
 * @returns a string in `h m s` format. Ex: "1h 3m 2s"`
 */
function formatHumanCompactDuration(
    roundedNumSeconds: number,
    {precision}: DurationProps,
    {gettext, interpolate}: I18nFunctions,
) {
    const seconds = roundedNumSeconds % SECONDS_IN_MINUTE;
    const minutes = Math.floor(roundedNumSeconds / SECONDS_IN_MINUTE) % MINUTES_IN_HOUR;
    const hours = Math.floor(roundedNumSeconds / (SECONDS_IN_MINUTE * MINUTES_IN_HOUR));
    const timeTemplates: TimeTemplates = {
        // define complete templates for more translation context
        hms: gettext('%(hours)sh %(minutes)sm %(seconds)ss'),
        hm: gettext('%(hours)sh %(minutes)sm'),
        m: gettext('%(minutes)sm'),
        ms: gettext('%(minutes)sm %(seconds)ss'),
        s: gettext('%(seconds)ss'),
    };
    const templateKeys = [];
    const formatKwargs = {hours, minutes, seconds};

    if (hours) {
        templateKeys.push('h');
    }
    // (minutes or hours exists) OR (zero minutes but precision=minutes)
    if (minutes || hours || (!minutes && precision === PRECISION.MINUTES)) {
        templateKeys.push('m');
    }
    if (precision === PRECISION.SECONDS) {
        templateKeys.push('s');
    }

    const timeText: string = timeTemplates[templateKeys.join('') as keyof TimeTemplates];
    return interpolate(timeText.replace(/ /g, '\u00A0'), formatKwargs, true);
}

/**
 * Returns a formatted duration in "human friendly" format.
 * @internal
 *
 * @param roundedNumSeconds - number of seconds to format
 * @param durationProps - {@link DurationProps} for precision
 *
 * @returns a string in `hr min` format. Ex: "16hr 40min"`
 */
function formatHumanDuration(
    roundedNumSeconds: number,
    {numSeconds, precision}: DurationProps,
    {gettext, interpolate}: I18nFunctions,
) {
    const hoursText = gettext('%(hours)shr');
    const minutesText = gettext('%(minutes)smin');
    const hoursAndMinutesText = gettext('%(hours)shr %(minutes)smin');
    let minutes = Math.round(roundedNumSeconds / 60);
    let hours = Math.floor(minutes / 60);
    if (!hours) {
        if (!minutes && numSeconds) {
            // Normally we're passed *some* duration, and don't want to display '0min' in those
            // cases, so we 'round up' to show '1min'. If we've literally been passed '0' as a
            // duration though it's fine to show '0min'.
            minutes = 1;
        }
        return interpolate(minutesText, {minutes}, true);
    }
    if (precision === PRECISION.HOURS) {
        // Round to the nearest half hour.
        hours = Math.round(minutes / 30) / 2;
        return interpolate(hoursText, {hours}, true);
    }
    minutes = minutes % 60;
    if (!minutes) {
        // This is questionable, as it displays a lack of precision.
        return interpolate(hoursText, {hours}, true);
    }
    return interpolate(hoursAndMinutesText, {hours, minutes}, true);
}

/**
 * Returns a formatted timestamp duration.
 * @internal
 *
 * @param roundedNumSeconds - number of seconds to format
 *
 * @returns a string in `HH:MM:SS` format. Ex: "1:01:39"
 */
function formatTimestampDuration(roundedNumSeconds: number) {
    const seconds = roundedNumSeconds % SECONDS_IN_MINUTE;
    const minutes = Math.floor(roundedNumSeconds / SECONDS_IN_MINUTE) % MINUTES_IN_HOUR;
    const hours = Math.floor(roundedNumSeconds / (SECONDS_IN_MINUTE * MINUTES_IN_HOUR));

    const padLeadingZero = (number: number) => (number < 10 ? `0${number}` : `${number}`);

    if (hours === 0) {
        return `${minutes}:${padLeadingZero(seconds)}`;
    }
    return `${hours}:${padLeadingZero(minutes)}:${padLeadingZero(seconds)}`;
}
