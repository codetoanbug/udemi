import {useEffect, useState} from 'react';

import {tokens, mediaQueryRemToPx} from '@udemy/styles';

import {useEventListener} from '../use-event-listener';
import {makeHoC} from '../utils/make-hoc';

export type Breakpoint = null | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// Breakpoints definitions
// https://www.figma.com/file/gleznOxM0zbvg6FskKds7CxC/Udemy-Lite-%5Bbase%5D
const dswBreakpoints: Record<string, number> = {
    sm: mediaQueryRemToPx(tokens['breakpoint-sm-max']), // 700
    md: mediaQueryRemToPx(tokens['breakpoint-md-max']), // 981
    lg: mediaQueryRemToPx(tokens['breakpoint-lg-max']), // 1201
    xl: mediaQueryRemToPx(tokens['breakpoint-xl-max']), // 1340
    xxl: 999999, // no maximum size
};

function getBreakpoint(width: number | null, breakpoints: Record<number, string>): string | null {
    if (width === null) {
        return null;
    }

    const breakpointKeys = Object.keys(breakpoints);

    const foundBreakpoint = breakpointKeys.find((breakpointKey: string) => {
        const breakpoint = parseInt(breakpointKey);
        if (width <= breakpoint) {
            return breakpoints[breakpoint as keyof typeof breakpoints];
        }
    });

    // if no breakpoint found, just return the largest value from `breakpoints`
    if (foundBreakpoint === undefined) {
        const lastBreakpoint =
            breakpoints[
                breakpointKeys[breakpointKeys.length - 1] as unknown as keyof typeof breakpoints
            ];
        return lastBreakpoint;
    }

    return breakpoints[foundBreakpoint as unknown as keyof typeof breakpoints];
}

// Helper function for optimization and consistency
const invertAndSort = (obj: Record<string, number>): Record<number, string> =>
    Object.fromEntries(
        Object.entries(obj)
            .map(([k, v]) => [v, k])
            .sort(),
    );
export function useBreakpoint(customBreakPoints: Record<string, number>): string;

export function useBreakpoint(): Breakpoint;

export function useBreakpoint(breakpoints: Record<string, number> = dswBreakpoints) {
    const [responsiveSize, setResponsiveSize] = useState<Breakpoint | string>(null);

    // Invert and sort defined breakpoint map for performance and accurancy
    const breakpointsInverted: Record<number, string> = invertAndSort(breakpoints);

    const handler = () => setResponsiveSize(getBreakpoint(window.innerWidth, breakpointsInverted));

    useEventListener('resize', handler);

    // invoke once when client loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(handler, []);

    return responsiveSize;
}

export const withBreakpoint = makeHoC(() => {
    const breakpoint = useBreakpoint();
    return {
        breakpoint,
    };
});
