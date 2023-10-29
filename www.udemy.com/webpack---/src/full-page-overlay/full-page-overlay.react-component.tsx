import {Button, ButtonHtmlProps} from '@udemy/react-core-components';
import {tokens} from '@udemy/styles';
import classNames from 'classnames';
import React from 'react';

import styles from './full-page-overlay.module.less';

/**
 * Exit animation duration. To preserve the animation, JavaScript
 * waits for this duration before unmounting the content.
 *
 * @deprecated use `tokens['animation-duration-extrafast']`
 *
 * @privateRemarks
 * TODO: Remove when Dialog component migrated over to stop using.
 */
export const EXIT_ANIMATION_DURATION_MS = Number(
    tokens['animation-duration-extrafast'].replace('ms', ''),
);

/** Props for FullPageOverlay extend those of a {@link Button}. */
export interface FullPageOverlayProps extends ButtonHtmlProps {
    /** Optionally override the overlay's z-index. */
    zIndex?: number;
}

/**
 * The FulPageOverlay component
 *
 * @remarks
 * This component renders an overlay that covers the entire page.
 *
 * @privateRemarks
 * We assume that a {@link CheckedStateCheckbox} controls whether this component is shown.
 * Note that the `CheckedStateCheckbox` must have `className="ud-full-page-overlay-checkbox"`,
 * as we are using that to style how the overlay opens.
 */
export const FullPageOverlay = ({className, zIndex, ...props}: FullPageOverlayProps) => {
    // If cssToggleId is given, the overlay acts as a close button for browsers only.
    // The design should always include an actual close button for assistive technology.
    const unclickable = !props.cssToggleId && !props.onClick;

    return (
        <Button
            {...props}
            componentClass="div"
            role="presentation"
            className={classNames(
                styles['full-page-overlay'],
                {[styles.unclickable]: unclickable},
                className,
            )}
            style={zIndex !== null ? {zIndex} : {}}
            udStyle="link"
        />
    );
};
