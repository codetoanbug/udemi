import {useEffect, useState} from 'react';

import {tokens, mediaQueryRemToPx} from '@udemy/styles';

import {useEventListener} from '../use-event-listener';
import {makeHoC} from '../utils/make-hoc';

export type DeviceType = typeof DEVICE_TYPE_DESKTOP | typeof DEVICE_TYPE_MOBILE | null;
export const DEVICE_TYPE_DESKTOP = 'desktop';
export const DEVICE_TYPE_MOBILE = 'mobile';

// Breakpoints definitions
// https://www.figma.com/file/gleznOxM0zbvg6FskKds7CxC/Udemy-Lite-%5Bbase%5D
const breakpoints = {
    sm: mediaQueryRemToPx(tokens['breakpoint-sm-max']), // 700
};

function getDeviceType(width: number | null): DeviceType {
    if (width === null) {
        return null;
    }
    if (width <= breakpoints.sm) {
        return 'mobile';
    }
    return 'desktop';
}

function getWindowWidthSafe() {
    if (typeof window === 'undefined') {
        return null;
    }
    return window.innerWidth;
}

export function useDeviceType(): DeviceType {
    const [deviceType, setDeviceType] = useState(getDeviceType(getWindowWidthSafe()));

    const handler = () => setDeviceType(getDeviceType(getWindowWidthSafe()));

    useEventListener('resize', handler);

    // invoke once when client loads
    useEffect(handler, []);

    return deviceType;
}

export const withDeviceType = makeHoC(() => {
    const deviceType = useDeviceType();
    return {
        deviceType,
    };
});
