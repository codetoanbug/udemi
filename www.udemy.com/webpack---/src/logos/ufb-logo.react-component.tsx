import {Image} from '@udemy/react-core-components';
import {useUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import React from 'react';

import styles from './ufb-logo.module.less';

/**
 *  The UFBLogo (Udemy For Business Logo).
 *
 *  @remarks
 *  This component uses the `@udemy/ud-data` package.
 *  If the UFB organization this is rendering for has no logo, it will render the brand title instead.
 *
 */
export const UFBLogo = () => {
    const {Config: udConfig} = useUDData();

    if (typeof udConfig.brand.organization !== 'boolean' && !udConfig.brand.organization.has_logo) {
        return (
            <div className={classNames('ud-heading-md', styles['brand-title'])}>
                {udConfig.brand.title}
            </div>
        );
    }
    return (
        <Image
            src={udConfig.brand.logo_url_2x}
            alt={udConfig.brand.title}
            width="unset"
            height="unset"
            data-purpose="ufb-logo"
            className={styles.logo}
        />
    );
};
