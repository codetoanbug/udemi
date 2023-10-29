import React from 'react';

import {Image, ImageProps} from '@udemy/react-core-components';
import {useUDData} from '@udemy/ud-data';

import {udemyLogoUrl} from './external/udemy-logo-urls';
import styles from './logo.module.less';
import {UfbContext} from './types/ufb-context';

interface LogoProps extends Omit<ImageProps, 'alt'> {
    ufbContext?: UfbContext;
}

export const Logo = ({ufbContext, ...imageProps}: LogoProps) => {
    const udData = useUDData();

    function renderMarketplaceLogo() {
        return <Image src={udemyLogoUrl} alt="Udemy" width={75} height={28} {...imageProps} />;
    }

    if (typeof window !== 'undefined' && window.location.hostname === 'www.udemy.com') {
        return renderMarketplaceLogo();
    }

    if (udData.isGlobalMeContextLoading) {
        return <div className={styles['logo-placeholder']} />;
    }

    return ufbContext?.logo ?? renderMarketplaceLogo();
};
