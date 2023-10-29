/* eslint-disable @typescript-eslint/naming-convention */
import {getUniqueId} from '@udemy/design-system-utils';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useState} from 'react';

import {checkFormGroup} from '../form-group/check-form-group';

// Note: ToggleInput CSS is served up via the react-form-components.global.css file;

/** The React props interface for the ToggleInput component. */
export interface ToggleInputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
    /** The "fake" input to render signifying the state of the actual input element. */
    fakeInput: React.ReactNode;
    /** The type of toggle input to render. */
    inputType: 'checkbox' | 'radio';
    /**
     * The side of the Toggle input.
     *
     * @defaultValue 'small'
     */
    size?: 'small' | 'large';
}

/**
 * ### The ToggleInput component.
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
 * This is a helper component, used to implement checkboxes and radio buttons.
 * You should use the {@link Checkbox} and {@link Radio} components instead of using this directly.
 */
export const ToggleInput = Object.assign(
    observer(({size = 'small', ...props}: ToggleInputProps) => {
        const {children, className, fakeInput, inputType, ...inputProps} = props;
        const [uniqueId] = useState(() => getUniqueId(inputType));
        const id = inputProps.id ?? uniqueId;

        checkFormGroup('ToggleInput', props, 'FormGroup udStyle="fieldset"', false);

        return (
            <label
                className={classNames(className, 'ud-toggle-input-container', {
                    'ud-toggle-input-disabled': inputProps.disabled,
                    'ud-text-sm': size === 'small',
                    'ud-text-md': size === 'large',
                })}
                htmlFor={id}
            >
                <input
                    {...inputProps}
                    className="ud-sr-only ud-real-toggle-input"
                    id={id}
                    type={inputType}
                />
                {fakeInput}
                {children}
            </label>
        );
    }),
    {displayName: 'ToggleInput'},
);
