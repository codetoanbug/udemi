import React, {useState} from 'react';

import {
    CheckedState,
    CheckedStateProps,
    CheckedStateChangeEvent,
} from './checked-state.react-component';

/** Event handler interface for `CheckedStateCheckbox` */
export type CheckedStateCheckboxChangeEventHandler = (
    event: CheckedStateChangeEvent,
    inputMethod?: 'KEYBOARD',
) => void;

/** React props interface for `CheckedStateCheckbox` */
interface CheckedStateCheckboxProps {
    /** Unique id string applied to the `CheckedState` `span` tag */
    id: string;
    /** Flag to determine if toggle should be unchecked on hitting the Esc key  */
    closeOnEscape?: boolean;
    /** Flag to determine if `CheckedStateCheckbox` is checked */
    checked?: boolean | null;
    /** default checked state for the `CheckedStateCheckbox` component */
    defaultChecked?: boolean;
    /** On checked state change handler for `CheckedStateCheckbox` */
    onChange?: CheckedStateCheckboxChangeEventHandler;
    /** Custom component to use for the actual `CheckedState` component.
     *
     *  @remarks
     *  Allows consuming apps to inject their own version of `CheckedState`.
     */
    checkedStateComponent?: React.ComponentType<CheckedStateProps>;
    /** Classname prop */
    className?: string;
}

/** The `CheckedStateCheckbox` component. A toggle that is mostly invisible to the user.  */
export const CheckedStateCheckbox = ({
    closeOnEscape = false,
    checked: isPropsChecked = null,
    defaultChecked = false,
    checkedStateComponent: CheckedStateComponent = CheckedState,
    ...props
}: CheckedStateCheckboxProps) => {
    // Updating defaultChecked prop will not update checked state
    const [isStateChecked, setIsStateChecked] = useState(defaultChecked);

    const handleChange = (event: CheckedStateChangeEvent) => {
        event.target.dataset.checked = event.target.dataset.checked ? '' : 'checked';
        setIsStateChecked(!!event.target.dataset.checked);
        props.onChange?.(event);
    };

    const handleEscape = (inputDOMNode: HTMLSpanElement) => {
        if (inputDOMNode.dataset.checked) {
            inputDOMNode.dataset.checked = '';
            setIsStateChecked(false);
            props.onChange?.({target: inputDOMNode}, 'KEYBOARD');
        }
    };

    const isChecked = isPropsChecked !== null ? isPropsChecked : isStateChecked;

    return (
        <CheckedStateComponent
            {...props}
            data-type="checkbox"
            data-checked={isChecked ? 'checked' : ''}
            onChange={handleChange}
            onEscape={closeOnEscape ? handleEscape : undefined}
        />
    );
};
