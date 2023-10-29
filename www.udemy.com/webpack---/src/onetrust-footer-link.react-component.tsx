import React, {useEffect, useRef, useState} from 'react';

import {Button} from '@udemy/react-core-components';
import {getServerOrClientUDData} from '@udemy/ud-data';

import {getIsMobileApp} from './external/get-is-mobile-app';
import {LinkProps} from './external/link.react-component';
import {whenOneTrustReady} from './ready';
import {OneTrust} from './types';

export const OneTrustFooterLink = (props: LinkProps) => {
    const [isShown, setIsShown] = useState(false);
    const [isUsMx, setIsUsMx] = useState(false);

    const refOneTrust = useRef<OneTrust>();
    useEffect(() => {
        whenOneTrustReady((OneTrust: OneTrust) => {
            refOneTrust.current = OneTrust;
            const configData = getServerOrClientUDData().Config;
            const geo = OneTrust.getGeolocationData();

            setIsUsMx(geo.country === 'US' && !configData.brand.has_organization);

            setIsShown(!getIsMobileApp());
        });
    }, [isUsMx]);

    if (!isShown) {
        return null;
    }

    return (
        <li data-testid="cookie-settings">
            <Button
                className="link white-link"
                typography="ud-text-sm"
                udStyle="link"
                data-purpose={props.data_purpose}
                onClick={() => refOneTrust.current?.ToggleInfoDisplay()}
            >
                {isUsMx ? props.text_us_mx : props.text}
            </Button>
        </li>
    );
};
