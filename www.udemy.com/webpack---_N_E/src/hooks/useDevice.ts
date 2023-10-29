import {isDesktop, isMobile, isTablet} from 'react-device-detect';

export interface DeviceDetection {
    isMobile: boolean;
    isDesktop: boolean;
    isTablet: boolean;
}

export const useDevice = (): DeviceDetection => ({
    isMobile,
    isDesktop,
    isTablet,
});
