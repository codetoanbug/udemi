import {useMatchMedia, withMatchMedia} from '@udemy/hooks';
import {tokens} from '@udemy/styles';
import React, {useState, useEffect, useMemo} from 'react';

// Versions from @udemy/hooks are preferred
export {useMatchMedia, withMatchMedia};

const breakpointPrefix = 'breakpoint-';
const breakpointKeys = Object.keys(tokens)
    .filter((key) => key.startsWith(breakpointPrefix))
    .map((key) => key.substring(breakpointPrefix.length));

export const normalizeToMediaQuery = (mediaQueryString: string) => {
    if (breakpointKeys.includes(mediaQueryString)) {
        const maxOrMinWidth = mediaQueryString.endsWith('-max') ? 'max-width' : 'min-width';
        const tokenKey = `${breakpointPrefix}${mediaQueryString}` as keyof typeof tokens;
        const width = tokens[tokenKey];
        return `(${maxOrMinWidth}: ${width})`;
    }

    return mediaQueryString;
};

/**
 * A custom hook that wraps the matchMedia API.
 *
 * @deprecated use `useMatchMedia` from `@udemy/hooks` instead.
 *
 * @param mediaQueryString media query string or a breakpoint
 * @returns denoting whether mediaQueryString matches
 *
 * @remarks
 * Receives a media query string as the input and returns a boolean denoting
 * whether the media query string is matched.
 *
 * A media query string is either:
 * - a breakpoint key from the Design system {@link @udemy/styles | global tokens},
 *   e.g. `'mobile-max'`. This corresponds to `(max-width: @breakpoint-mobile-max)`.
 * - a media query string, e.g. `'(max-width: 42em)'`. Note the parens. This syntax
 *   should only be used for custom media queries.
 *
 * This hook always returns false during SSR, since the matchMedia API does not exist.
 * On initial render client-side, it will return the result of the matchMedia query.
 * This might create a component hydration mismatch. To avoid such mismatches, use
 * `useMatchMedia` from `@udemy/hooks` instead.
 *
 * @privateRemarks
 * This hook is retained for cases where `useMatchMedia` was called with an option to
 * _always_ return a matchMedia result (or `false` server-side).
 */
export const useMatchMediaClientOnly = (mediaQueryStringOrKey: string) => {
    const mediaQueryString = normalizeToMediaQuery(mediaQueryStringOrKey);

    const mql = useMemo(
        () => typeof window !== 'undefined' && window.matchMedia(mediaQueryString),
        [mediaQueryString],
    );

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    const [matches, setMatches] = useState(!!(mql && mql.matches));

    useEffect(() => {
        // do not do anything if mql is falsy (during isomorphic rendering)
        if (!mql) {
            return;
        }
        const mqlListener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };
        setMatches(mql.matches);

        if (mql.addEventListener) {
            mql.addEventListener('change', mqlListener);
        } else {
            mql.addListener(mqlListener);
        }

        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener('change', mqlListener);
            } else {
                mql.removeListener(mqlListener);
            }
        };
    }, [mediaQueryString, mql]);

    return matches;
};

/**
 * An HOC that provides boolean props corresponding to media query strings.
 *
 * @deprecated use `withMatchMedia` from `@udemy/hooks` instead.
 *
 * @param mediaQueryStringMap an object binding prop names to media query strings
 *
 * @remarks
 * This HOC provides booleans corresponding to the keys of the mediaQueryStringMap to
 * its wrapped component.
 *
 * During server side rendering, all mediaMatch props will be `false` since the matchMedia
 * API does not exist. On initial render client-side, the props will reflect the result of the
 * matchMedia query. This might create a component hydration mismatch. To avoid such mismatches,
 * use `withMatchMedia` from `@udemy/hooks` instead.
 *
 * @see {@link useMatchMediaClientOnly} for details on how the media query strings work. `withMatchMedia`
 * uses this under the hood.
 *
 * @privateRemarks
 * This HOC is retained for cases where `withMatchMedia` was called with an option to
 * _always_ return a matchMedia result (or `false` server-side).
 */
const withMatchMediaClientOnly = (mediaQueryStringMap: Record<string, string>) => {
    return ((WrappedComponent: React.ComponentType) => (props: Record<string, unknown>) => {
        const mqlMap = Object.entries(mediaQueryStringMap).reduce(
            (acc, [key, mediaQueryString]) => ({
                ...acc,
                [key]: useMatchMediaClientOnly(mediaQueryString),
            }),
            {},
        );

        return <WrappedComponent {...props} {...mqlMap} />;
    }) as ClassDecorator;
};

// eslint-disable-next-line import/no-default-export
export default withMatchMediaClientOnly;
