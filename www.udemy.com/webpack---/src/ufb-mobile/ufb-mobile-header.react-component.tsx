import React, {useState} from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {HeaderStoreProps} from '../header.mobx-store';
import {MobileHeader as MarketplaceHeader} from '../mobile/mobile-header.react-component';
import {UfbContext} from '../types/ufb-context';
import {LoggedOutHeader as UFBHeader} from '../ufb-desktop/logged-out-header.react-component';
import {createUFBContext} from './create-ufb-context';

export interface UFBMobileHeaderProps extends HeaderStoreProps {
    isLoggedIn: boolean;
    useLangPrefixedUrls?: boolean;
}

export const UFBMobileHeader = (props: UFBMobileHeaderProps) => {
    const udData = useUDData();
    const i18nApi = useI18n();
    const [ufbContext] = useState<UfbContext>(() => createUFBContext(udData, i18nApi));
    const {isLoggedIn} = props;

    if (!isLoggedIn) {
        return <UFBHeader {...props} ufbContext={ufbContext} />;
    }

    return <MarketplaceHeader {...props} ufbContext={ufbContext} />;
};
