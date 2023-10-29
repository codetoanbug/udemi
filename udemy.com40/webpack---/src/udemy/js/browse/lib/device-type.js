import hoistStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';
import React from 'react';

import getRequestData from 'utils/get-request-data';

export const DEVICE_TYPE_DESKTOP = 'desktop';
export const DEVICE_TYPE_MOBILE = 'mobile';
const SUPPORTED_DEVICE_TYPES = [DEVICE_TYPE_DESKTOP, DEVICE_TYPE_MOBILE];

export const deviceTypeProps = {
    deviceType: PropTypes.oneOf(SUPPORTED_DEVICE_TYPES).isRequired,
};

export function getDeviceType(deviceType) {
    const udRequest = getRequestData();
    if (!deviceType && udRequest.isMobile !== undefined) {
        deviceType = udRequest.isMobile ? DEVICE_TYPE_MOBILE : DEVICE_TYPE_DESKTOP;
    }
    return deviceType;
}

export default function deviceType(WrappedComponent) {
    const EnhancedComponent = ({deviceType, ...props}) => {
        deviceType = getDeviceType(deviceType);

        return <WrappedComponent {...props} deviceType={deviceType || DEVICE_TYPE_DESKTOP} />;
    };

    EnhancedComponent.propTypes = {
        deviceType: PropTypes.oneOf(SUPPORTED_DEVICE_TYPES),
    };

    EnhancedComponent.defaultProps = {
        deviceType: undefined,
    };

    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    EnhancedComponent.displayName = `DeviceType(${displayName})`;

    return hoistStatics(EnhancedComponent, WrappedComponent);
}
