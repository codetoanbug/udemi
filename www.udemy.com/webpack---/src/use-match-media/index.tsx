import React, {useState, useEffect, useMemo} from 'react';

import {tokens} from '@udemy/styles';

export {matchMediaMock} from './match-media-mock';

const breakpointPrefix = 'breakpoint-';
const breakpointKeys = Object.keys(tokens)
    .filter((key) => key.startsWith(breakpointPrefix))
    .map((key) => key.substring(breakpointPrefix.length));

type FilterBreakpointKeys<TSet> = TSet extends `breakpoint-${infer T}` ? T : never;

// The (string & {}) is a workaround to prevent the entire type being widened to string
// See https://stackoverflow.com/a/61048124/5732806
// eslint-disable-next-line @typescript-eslint/ban-types
export type MediaQueryString = FilterBreakpointKeys<keyof typeof tokens> | (string & {});

export const normalizeMediaQuery = (mediaQueryStringOrKey: MediaQueryString) => {
    if (breakpointKeys.includes(mediaQueryStringOrKey)) {
        const maxOrMinWidth = mediaQueryStringOrKey.endsWith('-max') ? 'max-width' : 'min-width';
        const tokenKey = `${breakpointPrefix}${mediaQueryStringOrKey}` as keyof typeof tokens;
        const width = tokens[tokenKey];
        return `(${maxOrMinWidth}: ${width})`;
    }

    return mediaQueryStringOrKey as string;
};

/**
 * A hook that wraps the {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia | matchMedia API}.
 *
 * @param mediaQueryStringOrKey media query string or a breakpoint key
 * @returns result of media query match, or `null` server-side and on initial client-side render
 *
 * @remarks
 * Receives a media query string as the input and returns a boolean indicating
 * whether the media query string is matched.
 *
 * A media query string is either:
 * - a breakpoint key from the Design system {@link @udemy/styles | global tokens} without the `breakpoint-` prefix,
 *   e.g. `'mobile-max'`. This corresponds to `(max-width: @breakpoint-mobile-max)`.
 * - a media query string, e.g. `'(max-width: 42rem)'`. Note the parens. This syntax
 *   should only be used for custom media queries.
 *
 * This hook always returns `null` during server-side rendering because the matchMedia API does
 * not exist outside the context of a user agent. To avoid React component hydration mismatches,
 * this hook also returns `null` during the initial client-side render.
 */
export const useMatchMedia = (mediaQueryStringOrKey: MediaQueryString) => {
    const mediaQueryString = normalizeMediaQuery(mediaQueryStringOrKey);

    const mediaQueryList = useMemo(
        () => typeof window !== 'undefined' && window.matchMedia?.(mediaQueryString),
        [mediaQueryString],
    );

    // Return null on server and on initial render on client
    const [matches, setMatches] = useState<null | boolean>(null);

    const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
    };

    useEffect(() => {
        if (mediaQueryList) {
            setMatches(mediaQueryList.matches);

            // Use contemporary MediaQueryList API if available, fall back
            // to deprecated functions if necessary.
            if (mediaQueryList.addEventListener) {
                mediaQueryList.addEventListener('change', handleChange);
            } else {
                mediaQueryList.addListener(handleChange);
            }

            return () => {
                if (mediaQueryList.removeEventListener) {
                    mediaQueryList.removeEventListener('change', handleChange);
                } else {
                    mediaQueryList.removeListener(handleChange);
                }
            };
        }
    }, [mediaQueryString, mediaQueryList]);

    return matches;
};

/**
 * An HOC that provides boolean props corresponding to media query strings.
 *
 * @param mediaQueryStringMap an object binding prop names to media query strings
 *
 * @remarks
 * This HOC provides booleans corresponding to the keys of the mediaQueryStringMap to
 * its wrapped component.
 *
 * @see {@link useMatchMedia} for details on how the media query strings work. `withMatchMedia`
 * is implemented with `useMatchMedia`.
 */
export const withMatchMedia = (mediaQueryStringMap: Record<string, MediaQueryString>) => {
    return ((WrappedComponent: React.ComponentType) => (props: Record<string, unknown>) => {
        const mqlMap = Object.entries(mediaQueryStringMap).reduce(
            (acc, [key, mediaQueryString]) => ({
                ...acc,
                [key]: useMatchMedia(mediaQueryString),
            }),
            {},
        );

        return <WrappedComponent {...props} {...mqlMap} />;
    }) as ClassDecorator;
};
