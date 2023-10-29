import {pxToRem} from '@udemy/styles';
import classNames from 'classnames';
import React from 'react';

import {Image, ImageProps} from '../image/image.react-component';

// Note: Avatar CSS is served up via the react-core-components.global.css file;

const SIZES = {
    // Image size in pixels, image size in rem, typography class for initials, typography class for icons.
    small: [32, `${pxToRem(32)}rem`, 'ud-heading-sm', 'ud-heading-sm'],
    medium: [48, `${pxToRem(48)}rem`, 'ud-heading-md', 'ud-heading-md'],
    large: [64, `${pxToRem(64)}rem`, 'ud-heading-xl', 'ud-heading-xl'],
};

/** Default size of Avatar image */
export const DEFAULT_SRC_KEY = 'image_75x75';

/** An AvatarUser is the data model for a user associated with a specific Avatar instance */
export interface AvatarUser {
    /** Unique id for AvatarUser */
    id?: number;
    /** Display name of user associated with the Avatar instance*/
    display_name?: string;
    /** Initials of the name of the user associated with Avatar instance */
    initials?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [image_keys: string]: any;
}

interface AvatarBaseProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The component uses `props.user[srcKey]` as its src.
     * By default it uses image_75x75.
     */
    srcKey?: string;
    /** Size of the Avatar rendering */
    size?: 'small' | 'medium' | 'large';
    /**  Flag to control lazy loading of the Avatar image */
    lazy?: boolean;
    /** Set to DISPLAY_NAME if the avatar is rendered by itself.
     * It sets the alt text to user.display_name.
     * Set to NONE if the avatar is rendered next to the user's name,
     * as the alt text would be redundant in this case.
     */
    alt: 'NONE' | 'DISPLAY_NAME';
}

interface AvatarIconProps extends AvatarBaseProps {
    /** Icon element if Avatar is using an icon vs a user */
    icon: React.ReactElement;
}

interface AvatarUserProps extends AvatarBaseProps {
    /** Associated AvatarUser with an Avatar */
    user: AvatarUser;
}

export type AvatarProps = AvatarIconProps | AvatarUserProps;

/**
 *
 * Avatar Component
 */
export const Avatar = ({
    size = 'large',
    lazy,
    alt: altChoice,
    srcKey = DEFAULT_SRC_KEY,
    className,
    ...restProps
}: AvatarProps) => {
    const [imagePixelSize, imageRemSize, initialsSize, iconSize] = SIZES[size];
    const style = {width: imageRemSize, height: imageRemSize};

    if ('icon' in restProps) {
        return (
            <div style={style} className={classNames(className, 'ud-avatar', iconSize)}>
                {React.cloneElement(restProps.icon, {size})}
            </div>
        );
    }

    const {user, ...props} = restProps;
    const src: string = user[srcKey] ?? '';
    const alt = altChoice === 'DISPLAY_NAME' ? user.display_name ?? '' : '';

    if (src.includes('anonymous') && user?.initials) {
        return (
            <div
                {...props}
                aria-label={alt || undefined}
                aria-hidden={alt ? undefined : true}
                style={style}
                className={classNames(className, 'ud-avatar', initialsSize)}
                data-purpose="display-initials"
            >
                {user.initials}
            </div>
        );
    }

    // Only define the loading prop if lazy is defined
    let loading: ImageProps['loading'];
    if (lazy !== undefined) {
        loading = lazy ? 'lazy' : 'eager';
    }

    return (
        <Image
            {...props}
            src={src}
            alt={alt}
            className={classNames(className, 'ud-avatar', 'ud-avatar-image')}
            width={imagePixelSize as number}
            height={imagePixelSize as number}
            style={style}
            loading={loading}
        />
    );
};
