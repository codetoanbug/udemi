import React, {useState} from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {
    DesktopHeader as MarketplaceHeader,
    DesktopHeaderProps,
} from '../desktop/desktop-header.react-component';
import {createUFBContext} from './create-ufb-context';
import {LoggedOutHeader} from './logged-out-header.react-component';

export interface UFBDesktopHeaderProps extends DesktopHeaderProps {
    isLoggedIn: boolean;
}

export const UFBDesktopHeader = (props: UFBDesktopHeaderProps) => {
    const udData = useUDData();
    const i18n = useI18n();
    const [ufbContext] = useState(() => createUFBContext(udData, i18n));

    if (!props.isLoggedIn) {
        return <LoggedOutHeader {...props} ufbContext={ufbContext} />;
    }

    return <MarketplaceHeader {...props} ufbContext={ufbContext} />;
};
