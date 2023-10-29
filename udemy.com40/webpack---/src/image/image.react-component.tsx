import {injectIsAboveTheFold} from '@udemy/design-system-utils';
import React from 'react';

type ImageDimensionType = number | 'unset';

export interface ImageProps
    extends Omit<React.ComponentPropsWithoutRef<'img'>, 'crossOrigin' | 'width' | 'height'> {
    /**
     * Alt text is required for A11Y. Set it to an empty string for "decoration-only" images.
     * See https://github.com/evcohen/eslint-plugin-jsx-a11y for more details.
     */
    alt: string;
    /**
     * If true, the image is only loaded once it's in the viewport. This will override
     * any value provided by a wrapping `AboveTheFoldProvider`
     *
     * @deprecated use `img` `loading` prop instead
     */
    lazy?: boolean;
    /**
     * Width and height should be set to the intrinsic size of the image, in pixels.
     * Use CSS to adjust the rendered size if needed. If the intrinsic size is not
     * easy to determine, then set these to `unset`. Setting width and height enables
     * the browser avoid reflow once the image is loaded.
     * {@link ImageDimensionType| ImageDimensionType}
     */
    width?: ImageDimensionType;
    /**
     * Width and height should be set to the intrinsic size of the image, in pixels.
     * Use CSS to adjust the rendered size if needed. If the intrinsic size is not
     * easy to determine, then set these to `unset`. Setting width and height enables
     * the browser avoid reflow once the image is loaded.
     */
    height?: ImageDimensionType;
    /**
     * Provided by an injected `<AboveTheFoldProvider />`.
     *
     * @remarks
     *
     * Do not use this directly. To load the image lazily, pass `loading="lazy"` instead.
     */
    isAboveTheFold?: boolean;
}

/**
 * ### Image component.
 *
 * Renders an `<img>` element.
 *
 * @remarks
 *
 * There are three methods for controlling whether the image is
 * {@link https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading loaded lazily}.
 * In order of decreasing precedence:
 *
 * 1. Use the
 *    {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Img standard `loading` attribute}.
 * 2. Use the `lazy` prop (deprecated in favor of `loading` attribute).
 * 3. Wrap the component in an `AboveTheFoldProvider`.
 */
@injectIsAboveTheFold
export class Image extends React.Component<ImageProps> {
    static defaultProps = {
        isAboveTheFold: false,
    };

    loadingAttribute = (): HTMLImageElement['loading'] => {
        if (this.props.loading) {
            return this.props.loading;
        }

        if (this.props.lazy !== undefined) {
            return this.props.lazy ? 'lazy' : 'eager';
        }

        return this.props.isAboveTheFold ? 'eager' : 'lazy';
    };

    render() {
        const {isAboveTheFold, lazy, loading, ...props} = this.props;

        const imageProps = {
            ...props,
            loading: this.loadingAttribute(),
            height: this.props.height === 'unset' ? undefined : this.props.height,
            width: this.props.width === 'unset' ? undefined : this.props.width,
        };

        /* eslint-disable react/forbid-elements, jsx-a11y/alt-text */
        /* react/forbid-elements forbids img so that everyone uses this component instead,
         * but of course this component itself needs to render an img.
         * jsx-a11y/alt-text is not actually disabled. Alt is a required prop, and passed
         * to img through this.imageProps. ESLint just isn't smart enough to parse this.
         */
        return <img {...imageProps} />;
        /* eslint-enable react/forbid-elements, jsx-a11y/alt-text */
    }
}
