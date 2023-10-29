import React from 'react';

import {Image, ImageProps} from '../image/image.react-component';

/** React prop interface for `Picture` component. */
export interface PictureProps extends ImageProps {
    /** An array of HTMLSourceElement values to map over and render in the `Picture` component. */
    sources: React.ComponentPropsWithoutRef<'source'>[];
    /** `className` forwarded to underlying Image component. */
    imgClassName?: string;
}

/**
 * ### Picture
 *
 * @remarks
 * A React wrapper for the HTML `<picture>` element.  Uses the {@link Image| Image} component for the `<img>` element.
 */
export const Picture = (props: PictureProps) => {
    const {sources, className, imgClassName, ...imgProps} = props;
    return (
        <picture className={className}>
            {props.sources.map(({...sourceProps}, index) => (
                <source key={index} {...sourceProps} />
            ))}
            <Image className={imgClassName} {...(imgProps as ImageProps)} />
        </picture>
    );
};
