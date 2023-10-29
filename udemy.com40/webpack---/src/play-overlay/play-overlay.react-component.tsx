import PlayOverlayIcon from '@udemy/icons/dist/play-overlay.ud-icon';
import classNames from 'classnames';
import React from 'react';

// Note: PlayOverlay CSS is served up via the react-structure-components.global.css file;

/** React props interface for the `PlayOverlay` component */
export interface PlayOverlayProps extends Pick<React.HTMLAttributes<HTMLSpanElement>, 'className'> {
    /** The size of the `PlayOverlayIcon` rendered. */
    size?: 'xlarge' | 'xxlarge';
}

/**
 * ### The PlayOverlay component.
 *
 * @remarks
 * This component is used to render a play icon on top of an image.
 *
 * This component requires global CSS.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-structure-components/dist/react-structure-components.global.css';`
 */
export const PlayOverlay = ({size = 'xlarge', className}: PlayOverlayProps) => (
    <span className={classNames('ud-play-overlay', className)}>
        <PlayOverlayIcon
            label={false}
            className="ud-focus-visible-target"
            color="inherit"
            size={size}
        />
    </span>
);
