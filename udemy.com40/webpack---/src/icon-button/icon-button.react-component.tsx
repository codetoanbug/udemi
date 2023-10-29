/* eslint-disable @typescript-eslint/naming-convention */
import classNames from 'classnames';
import React, {forwardRef} from 'react';

import {BaseIconProps} from '../base-icon/base-icon.react-component';
import {Button, ButtonProps} from '../button/button.react-component';

// Note: IconButton CSS is served up via the react-core-components.global.css file;

export type IconButtonProps = {
    /** Overlay Node to appear above icon, if desired.
     *  This is commonly used to create a "loading animation" overlay state.
     */
    overlaychildren?: React.ReactNode;
    /**
     * Optional `aria-label` text used to describe the purpose of the `IconButton.`
     *
     * @remarks
     * This is the preferred approach for a11y.  If you use this option, you should set your child
     * Icon component to have `label={false}` to prevent screen readers from speaking duplicative
     * aria labels.
     */
    'aria-label'?: string;
} & ButtonProps;

/**
 * ### IconButton
 *
 * A `Button` with integrated icon.
 *
 * @remarks
 *
 * `IconButton` forwards a `ref` to the rendered `Button` class component instance.
 */
export const IconButton = Object.assign(
    forwardRef<Button, IconButtonProps>(
        ({overlaychildren, size = 'large', ...buttonProps}: IconButtonProps, ref) => {
            const iconChild = React.Children.only(
                buttonProps.children,
            ) as React.ReactElement<BaseIconProps>;
            const iconProps: Omit<BaseIconProps, 'glyph' | 'label'> = {};
            if (iconChild && iconChild.props.size === undefined) {
                const iconMapping = {
                    xsmall: 'xsmall',
                    small: 'small',
                    medium: 'small',
                    large: 'medium',
                };
                iconProps.size = iconMapping[size] as BaseIconProps['size'];
            }
            return (
                <Button
                    {...buttonProps}
                    ref={ref}
                    size={size}
                    className={classNames(
                        'ud-btn-icon',
                        `ud-btn-icon-${size}`,
                        buttonProps.round ? 'ud-btn-icon-round' : null,
                        buttonProps.className,
                    )}
                >
                    {React.cloneElement(iconChild, iconProps)}
                    {overlaychildren}
                </Button>
            );
        },
    ),
    {displayName: 'IconButton'},
);
