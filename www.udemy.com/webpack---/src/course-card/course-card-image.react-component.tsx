import {Image, ImageProps} from '@udemy/react-core-components';
import classNames from 'classnames';
import React, {createContext, useContext} from 'react';

import styles from './course-card-image.module.less';

const courseImageSizes = {
    small: {width: 64, height: 64},
    medium: {width: 240, height: 135},
    large: {width: 260, height: 145},
} as const;

/**
 * Context props for `CourseCardImage`.
 */
export interface CourseCardImageContextType {
    /** `className` applied to the course `<img>`. */
    className?: string;
    /** Corresponds to `size` prop. Prop takes precedent over context in `CourseCardImage`.  */
    size?: keyof typeof courseImageSizes;
}

/**
 * Context for `CourseCardImage`. Optionally provide this context in a card to
 * signal layout to `CourseCardImage` instances rendered by consumers.
 */
export const CourseCardImageContext = createContext<CourseCardImageContextType>({
    className: undefined,
    size: undefined,
});

/**
 * Props for `CourseCardImage` component.
 *
 * Includes all props from {@link @udemy/react-core-components#ImageProps | `ImageProps`}.
 */
export interface CourseCardImageProps extends Omit<ImageProps, 'alt' | 'size'> {
    /** `alt` for the image. Empty by default since the course image is decorative. */
    alt?: string;
    /** Preset image sizes, typically set by `CourseCard` parent component. Can be overwritten with this prop */
    size?: keyof typeof courseImageSizes;
    /** URL to square course image to be rendered with `small` size */
    srcSmallSquare: string;
    /** URL to square course image to be rendered with `small` size on 2x resolution displays */
    srcSmallSquare2x: string;
    /** URL to default course image */
    srcDefault: string;
    /** URL to default course image on 2x resolution displays*/
    srcDefault2x: string;
}

/**
 * Image for `CourseCard` component. Renders a square image when prop
 * `size` is `"small"`. Renders default image otherwise.
 *
 * @remarks
 *
 * `className` prop will be merged with built-in classes and applied to `Image`
 *
 * `Image` props `src`, `alt`, `srcSet`, `width`, `height` can be overwritten
 * manually via props, if necessary.
 */
export const CourseCardImage = ({
    size: sizeProp,
    className = '',
    srcSmallSquare,
    srcSmallSquare2x,
    srcDefault,
    srcDefault2x,
    ...props
}: CourseCardImageProps) => {
    const {size: courseCardSize, className: contextClassName} = useContext(CourseCardImageContext);
    const size = sizeProp ?? courseCardSize ?? 'medium';

    const src = size === 'small' ? srcSmallSquare : srcDefault;
    const src2x = size === 'small' ? srcSmallSquare2x : srcDefault2x;
    const imageSize = courseImageSizes[size];

    // Because the image is decorative, set an empty `alt` attribute.
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/alt
    return (
        <Image
            src={src}
            alt=""
            srcSet={`${src} 1x, ${src2x} 2x`}
            className={classNames(styles.image, contextClassName, className)}
            {...imageSize}
            {...props}
        />
    );
};
