/* eslint-disable @typescript-eslint/naming-convention */
import {Image, ImageProps} from '@udemy/react-core-components';
import {useUDLink} from '@udemy/ud-data';
import classNames from 'classnames';
import React from 'react';

import {ExpressiveIconName, ExpressiveIconFileMap} from './expressive-icon-name';
import styles from './expressive-icon.module.less';

/** React prop interface for the `ExpressiveIcon` component */
export interface ExpressiveIconProps extends Omit<ImageProps, 'alt'> {
    /** The name of the expressive icon to render */
    name: typeof ExpressiveIconName[number];
    /**
     * The size of the icon to render. Controls the `max-height` and `max-width`.
     *
     * @remarks
     * Sizing is as follows:
     * - `small` - constrains to 48px
     * - `medium` - constrains to 64px
     * - `large` - constrains to 96px
     * - `xlarge` - constrains to 112px
     *
     * @defaultValue `medium` in `ExpressiveIcon`
     */
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    /**
     * The color scheme of the icon to render.
     *
     * @remarks
     * - `light` - renders the light mode icon, and should only be used on our 100-200 color tokens
     * - `dark` - renders the dark mode icon, and should only be used on our 400-500 color tokens
     *
     * @defaultValue `light` in `ExpressiveIcon`
     */
    colorScheme?: 'light' | 'dark';
    /**
     * The base url for the CDN. This is used to construct the `srcSet` for the `Image` component.
     *
     * @defaultValue `https://s.udemycdn.com/design-system/expressive-icons/` via {@link `UDLinkAPI`} in `@udemy/ud-data`
     */
    cdnUrlBase?: string;
    /** Optional className to apply to the underlying `Image` component */
    className?: string;
}

/**
 *
 * @param cdnUrlBase - a string that is the base url for the CDN
 * @param name - the key of the ExpressiveIcon you want to render. @see {@link ExpressiveIconName}
 * @param colorCheme - the color scheme of the icon to render. @see {@link ExpressiveIconProps}
 * @returns string of the srcSet to pass to the `Image` @see {@link Image} component
 */
export const getExpressiveIconSrcSet = (
    name: typeof ExpressiveIconName[number],
    cdnUrlBase = '',
    colorScheme: ExpressiveIconProps['colorScheme'] = 'light',
) => {
    const fileName = ExpressiveIconFileMap.get(name);
    return `${cdnUrlBase}/${colorScheme}/1x/${fileName} 1x, ${cdnUrlBase}/${colorScheme}/2x/${fileName} 2x`;
};

/** Map used to set the `width` and `height` attributes of the `ExpressiveIcon` `<img />` tag */
const ExpressiveIconSideLengthMap = {
    small: 48,
    medium: 64,
    large: 96,
    xlarge: 112,
} as const;

/**
 * ### ExpressiveIcon
 *
 * @remarks
 * Branded images that are in a space between vector icons and illustrations.
 *
 * Renders an {@link Image Image} component with a `srcSet` attribute set up
 * to pull in 1x and 2x images from the CDN.
 */
export const ExpressiveIcon = ({
    name,
    colorScheme = 'light',
    size = 'medium',
    className,
    ...props
}: ExpressiveIconProps) => {
    const udLinkApi = useUDLink();

    const {
        cdnUrlBase = udLinkApi.toStorageStaticAsset('design-system/expressive-icons'),
        ...htmlProps
    } = props;
    const pictureSources = getExpressiveIconSrcSet(name, cdnUrlBase, colorScheme);

    return (
        <Image
            alt=""
            aria-hidden={true}
            srcSet={pictureSources}
            className={classNames(styles[size], className)}
            width={ExpressiveIconSideLengthMap[size]}
            height={ExpressiveIconSideLengthMap[size]}
            {...htmlProps}
        />
    );
};
