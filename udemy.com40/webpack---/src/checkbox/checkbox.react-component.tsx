import CollapseMinus from '@udemy/icons/dist/collapse-minus.ud-icon';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import React from 'react';

import {ToggleInput, ToggleInputProps} from '../toggle-input/toggle-input.react-component';

const CheckboxState = {
    CHECKED: true,
    UNCHECKED: false,
    INDETERMINATE: 'indeterminate',
} as const;

type CheckboxStateKeys = keyof typeof CheckboxState;
/**
 * The potential state values of a Checkbox component.
 *
 * @privateRemarks
 * The JavaScript array `CheckboxState` is exposed as `Checkbox.STATE` */
export type CheckboxStateValues = typeof CheckboxState[CheckboxStateKeys];

/** The React props interface for the Checkbox component. */
export interface CheckboxProps
    extends Omit<ToggleInputProps, 'checked' | 'fakeInput' | 'inputType'> {
    /**
     * The checked state for the component.
     * @see {@link CheckboxStateValues}
     */
    checked?: CheckboxStateValues;
}

/**
 * The Checkbox component.
 *
 * @privateRemarks
 * Renders a "fakeInput" (TickIcon or CollapseMinus) as a visual representation
 * of the checkbox state.
 *
 * The real mechanism for the checkbox is an internal {@link ToggleInput} component.
 */
export const Checkbox = ({size = 'small', checked, ...props}: CheckboxProps) => {
    const iconSizeMap = {small: 'xsmall', large: 'small'};
    let fakeInput = (
        <TickIcon
            className="ud-fake-toggle-input ud-fake-toggle-checkbox"
            color="inherit"
            size={iconSizeMap[size]}
            label={false}
        />
    );
    if (checked === 'indeterminate') {
        fakeInput = (
            <CollapseMinus
                className="ud-fake-toggle-input ud-fake-toggle-indeterminate-checkbox"
                color="inherit"
                size={iconSizeMap[size]}
                label={false}
            />
        );
        checked = false;
    }
    return (
        <ToggleInput
            {...props}
            checked={checked}
            size={size}
            fakeInput={fakeInput}
            inputType="checkbox"
        />
    );
};

// Static property to be available externally
Checkbox.STATE = CheckboxState;
