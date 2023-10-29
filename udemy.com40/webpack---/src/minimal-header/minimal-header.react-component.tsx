import {UFBLogo, UDEMY_RELATIVE_LOGO_URLS} from '@udemy/react-brand-components';
import {Image} from '@udemy/react-core-components';
import {useUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import React from 'react';

import styles from './minimal-header.module.less';

/** React props interface for the MinimalHeader component. */
export interface MinimalHeaderProps extends React.ComponentPropsWithoutRef<'div'> {
    /**
     * Although typed as any `JSX.Element`, this really should only be an instance of
     * the {@link Meter} component.  If specified, this will appear at the bottom of
     * the MinimalHeader.
     */
    progressBar?: JSX.Element;
    /** Customizes how the logo is rendered. E.g. `(Component, props) => <Component {...props} />`. */
    renderLogo?: (
        Component: React.ComponentType,
        props: Record<string | number | symbol, unknown>,
    ) => React.ReactElement;
}

/** The MinimalHeader component. */
export const MinimalHeader = ({
    progressBar,
    renderLogo = (
        Component: React.ComponentType,
        props: Record<string | number | symbol, unknown>,
    ) => <Component {...props} />,
    children,
    ...htmlProps
}: MinimalHeaderProps) => {
    const {Config: udConfig} = useUDData();

    const getLogo = () => {
        if (udConfig.brand.has_organization) {
            return renderLogo(UFBLogo, {});
        }

        return renderLogo(Image as unknown as React.ComponentType, {
            src: UDEMY_RELATIVE_LOGO_URLS.udemyLogoUrl,
            alt: 'Udemy',
            width: 75,
            height: 28,
            className: styles['marketplace-logo'],
            lazy: false,
        });
    };

    return (
        <div className={styles['header-wrapper']}>
            <div {...htmlProps} className={classNames(styles.header, htmlProps.className)}>
                {getLogo()}
                {children}
            </div>
            {progressBar}
        </div>
    );
};
