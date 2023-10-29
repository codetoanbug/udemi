/* eslint-disable @typescript-eslint/naming-convention */
import classNames from 'classnames';
import React from 'react';

import {ToggleInput, ToggleInputProps} from '../toggle-input/toggle-input.react-component';

// Retain string constants for size from ToggleInputProps, but make it required
type FakeRadioProps = Pick<ToggleInputProps, 'className'> &
    Required<Pick<ToggleInputProps, 'size'>>;

/**
 * The FadeRadio component.
 *
 * @privateRemarks
 * This is used to render what looks like a Radio Button, but is just a stylized `<span>`
 * The real input is contained within a {@link ToggleInput} component.
 */
export const FakeRadio = ({size, className}: FakeRadioProps) => (
    <span
        className={classNames(className, 'ud-fake-toggle-input ud-fake-toggle-radio', {
            'ud-fake-toggle-radio-small': size === 'small',
            'ud-fake-toggle-radio-large': size === 'large',
        })}
    />
);

type RadioProps = Omit<ToggleInputProps, 'fakeInput' | 'inputType'>;

/**
 * The Radio (radio button) component.
 *
 * @privateRemarks
 * Renders a "fakeInput" (a `span`) as a visual representation
 * of the radio button state.
 *
 * The real mechanism for the radio button is an internal {@link ToggleInput} component.
 */
export const Radio = ({size = 'small', ...props}: RadioProps) => {
    const fakeInput = <FakeRadio size={size} />;
    return <ToggleInput {...{size, ...props}} fakeInput={fakeInput} inputType="radio" />;
};

Radio.$$udType = 'Radio';
