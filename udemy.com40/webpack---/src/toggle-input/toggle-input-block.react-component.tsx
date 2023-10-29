/* eslint-disable @typescript-eslint/naming-convention */
import {getUniqueId} from '@udemy/design-system-utils';
import classNames from 'classnames';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useContext, useState} from 'react';

import {checkFormGroup} from '../form-group/check-form-group';
import {ToggleInputProps} from './toggle-input.react-component';

// Note: ToggleInputBlock CSS is served up via the react-form-components.global.css file;

/** The React props interface for the ToggleInputBlock component. */
export interface ToggleInputBlockProps extends Omit<ToggleInputProps, 'size'> {
    /**
     * Flag to vertically align the content in the ToggleInput
     *
     * @defaultValue `false` in `ToggleInputBlock`
     */
    centerVertically?: boolean;
    /** Optional node to render beneath the `ToggleInputBlock` children */
    details?: React.ReactNode;
    /**
     * Experimental className to apply to the same div as `ud-toggle-input-block-outline`.
     * Use this to change the default color;
     *
     * @experimental
     *
     * @remarks
     *
     * This prop may be removed or change at any time, even in a minor release. Use only in
     * coordination with the Design System team.
     */
    xBorderClassName?: string;

    /**
     * Experimental slot for label content as an alternative to passing nodes
     * through as `children`. Unlike `children`, this node is _not_ wrapped in
     * a heading text class.
     *
     * @experimental
     *
     * @remarks
     *
     * This prop may be removed or change at any time, even in a minor release. Use only in
     * coordination with the Design System team.
     */
    xLabelContent?: React.ReactNode;
}

/**
 * ### The ToggleInputBlock component.
 * @internal
 *
 * @remarks
 * This component requires global CSS.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-form-components/dist/react-form-components.global.css';`
 *
 * @privateRemarks
 * This is a helper component, used to implement checkbox and radio button blocks.
 * You should use the {@link CheckboxBlock} and {@link RadioBlock} components instead of using this directly.
 */

export const ToggleInputBlock = observer(
    ({
        children,
        className,
        fakeInput,
        inputType,
        xLabelContent,
        xBorderClassName,
        centerVertically = false,
        details,
        ...inputProps
    }: ToggleInputBlockProps) => {
        const {$$udFormGroup} = useContext(MobXProviderContext);

        const [defaultId] = useState(getUniqueId(inputType));

        const id = inputProps.id ?? defaultId;

        checkFormGroup(
            'ToggleInputBlock',
            {$$udFormGroup, ...inputProps},
            'ToggleInputBlockFormGroup',
            false,
        );

        return (
            <label
                className={classNames(className, {
                    'ud-toggle-input-container': true,
                    'ud-toggle-input-block-container': true,
                    'ud-toggle-input-disabled': inputProps.disabled,
                    'ud-toggle-input-block-center-vertically': centerVertically,
                })}
                htmlFor={id}
            >
                <input
                    {...inputProps}
                    className="ud-sr-only ud-custom-focus-visible ud-real-toggle-input"
                    id={id}
                    type={inputType}
                />
                {fakeInput}
                <div className={classNames('ud-toggle-input-block-outline', xBorderClassName)} />
                {xLabelContent}
                {(children || details) && (
                    <div className="ud-heading-md">
                        {children}
                        {details && (
                            <div className="ud-text-sm ud-toggle-input-block-details">
                                {details}
                            </div>
                        )}
                    </div>
                )}
            </label>
        );
    },
);
