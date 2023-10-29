import React, {createContext, useContext, useEffect, useState, useRef} from 'react';

import {
    CheckedState,
    CheckedStateProps,
    CheckedStateChangeEvent,
    CheckedStateChangeEventHandler,
} from './checked-state.react-component';

/** React Context Interface for the CheckedState Radio Group */
interface RadioGroupContextInterface {
    /** handler to set the selected radio group id on change */
    setSelectedId: (id: string | null) => void;
    /** When true, checked radio items can be unselected by toggling them directly. */
    allowToggle: boolean;
    /** The selected radio button id */
    selectedId: string | null;
    /** The `name` of the radio button group */
    name: string;
    className?: string;
}

const RadioGroupContext = createContext<RadioGroupContextInterface | null>(null);

/** React props interface for the `CheckedStateRadioGroup` */
interface CheckedStateRadioGroupProps {
    /** By default checked items can only be unselected/toggled off by selecting
        a different radio item in the group. When `allowToggle` is `true`, checked
        radio items can be unselected by toggling them directly. */
    allowToggle?: boolean;
    /** Child ReactNodes of the radio group Context Provider */
    children?: React.ReactNode;
    /** The `name` of the radio group */
    name: string;
}

/** The CheckedStateRadioGroup component */
export const CheckedStateRadioGroup = ({
    allowToggle = false,
    name,
    children,
}: CheckedStateRadioGroupProps) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const context: RadioGroupContextInterface = {
        allowToggle,
        selectedId,
        setSelectedId,
        name,
    };

    return <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>;
};

/** The React prop interface for `CheckStateRadioGroup`'s `Radio` component
 *  @internal
 */
interface RadioProps {
    /** Unique id string */
    id: string;
    /** Flag to determine if the radio is selected */
    checked?: boolean | null;
    /** Default checked value. Used for use outside controlled component */
    defaultChecked?: boolean;
    /** Optional event handler for when a Radio is selected.  */
    onChange?: CheckedStateChangeEventHandler;
    /** Custom component to use for the actual `CheckedState` component.
     *
     *  @remarks
     *  Allows consuming apps to inject their own version of `CheckedState`.
     */
    checkedStateComponent?: React.ComponentType<CheckedStateProps>;
    /** Classname for Radio */
    className?: string;
}

/** A Radio component for use within `CheckedStateRadioGroup`
 *  @internal
 *
 *  @remarks
 *  Not exported but available via `CheckedStateRadioGroup.Radio`
 */
const Radio = ({
    checked = null,
    defaultChecked = false,
    checkedStateComponent: CheckedStateComponent = CheckedState,
    ...props
}: RadioProps) => {
    // isFirstRender and associated logic replaces call to setSelectedId within
    // a class component constructor. The call needs to run once, and not trigger
    // an immediate re-render for the other Radio components in the group. Tracking
    // isFirstRender with useRef rather than useState prevents undesired re-render.
    const isFirstRender = useRef(true);
    const radioGroup = useContext(RadioGroupContext);

    useEffect(() => {
        if (defaultChecked) {
            radioGroup?.setSelectedId(props.id);
        }
        /* eslint-disable react-hooks/exhaustive-deps */
    }, []);

    const onChange = (event: CheckedStateChangeEvent) => {
        const wasChecked = !!event.target?.dataset.checked;
        const isChecked = !radioGroup?.allowToggle || !wasChecked;
        event.target.dataset.checked = isChecked ? 'checked' : '';
        radioGroup?.setSelectedId(isChecked ? event.target.id : null);
        if (wasChecked !== isChecked) {
            props.onChange?.(event);
        }
    };

    const isCheckedByDefault = isFirstRender.current && defaultChecked;
    const isCheckedBySelection = radioGroup?.selectedId === props.id;
    const isChecked = checked !== null ? checked : isCheckedByDefault || isCheckedBySelection;

    isFirstRender.current = false;

    return (
        <CheckedStateComponent
            {...props}
            data-type="radio"
            data-name={radioGroup?.name}
            data-checked={isChecked ? 'checked' : ''}
            onChange={onChange}
        />
    );
};

CheckedStateRadioGroup.Radio = Radio;
