import React from 'react';

import {useBreakpoint} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {DesktopHeader, DesktopHeaderProps} from './desktop/desktop-header.react-component';
import styles from './header.module.less';
import {MobileHeader} from './mobile/mobile-header.react-component';
import {createUFBContext as createDesktopUFBContext} from './ufb-desktop/create-ufb-context';
import {createUFBContext as createMobileUFBContext} from './ufb-mobile/create-ufb-context';

export type HeaderProps = DesktopHeaderProps;

export const Header = (props: HeaderProps) => {
    const udData = useUDData();
    const i18n = useI18n();
    const breakpoint = useBreakpoint({
        mobile: 800,
        desktop: 9999,
    });
    const ufbContext = React.useMemo(() => {
        if (!udData.Config.brand.has_organization) {
            return undefined;
        }

        return breakpoint === 'mobile'
            ? createMobileUFBContext(udData, i18n)
            : createDesktopUFBContext(udData, i18n);
    }, [udData, i18n, breakpoint]);

    return (
        <>
            {breakpoint !== 'desktop' && (
                <div className={styles['mobile-only']}>
                    <MobileHeader ufbContext={ufbContext} {...props} />
                </div>
            )}
            {breakpoint !== 'mobile' && (
                <div className={styles['desktop-only']}>
                    <DesktopHeader ufbContext={ufbContext} {...props} />
                </div>
            )}
        </>
    );
};
