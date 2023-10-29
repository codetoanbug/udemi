import ScheduleIcon from '@udemy/icons/dist/schedule.ud-icon';
import {observer, MobXProviderContext} from 'mobx-react';
import React, {useEffect, useState} from 'react';

import {TextInputContainer} from '../text-input/text-input-container.react-component';
import {TextInput, InputSize} from '../text-input/text-input.react-component';
import styles from './time-picker.module.less';

/** React props for the TimePicker component. */
export interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Error messaging to display when the `validationState` is `error` */
    errorLabel: React.ReactNode;
    /**
     * The size of the `TextInput` within `TimePicker`
     *
     * @defaultValue 'large'
     */
    size?: InputSize;
}

/**
 * The TimePicker component.
 *
 * @remarks
 * The internal {@link TextInput} will display as 24 or 12 hour time based on a user's system settings,

 * 
 * @privateRemarks
 * This was based on a component originally used in Marketing Tools.
 */
export const TimePicker = observer(
    Object.assign(
        ({errorLabel, ...props}: TimePickerProps) => {
            // $$udFormGroup is the parent FormGroup passed down via a Context Provider
            const {$$udFormGroup} = React.useContext(MobXProviderContext);
            const originalFormGroupNote = $$udFormGroup.props.note;
            const [validationState, setValidationState] = useState('neutral');
            const validateInput = (e: React.FormEvent<HTMLInputElement>) => {
                e.preventDefault();
                const isValid = e.currentTarget.checkValidity();
                setValidationState(isValid ? 'neutral' : 'error');
            };
            const ariaProps = $$udFormGroup?.inputAriaProps;

            useEffect(() => {
                $$udFormGroup.setPropOverrides({
                    validationState,
                    note: validationState === 'error' ? errorLabel : originalFormGroupNote,
                });
            }, [errorLabel, $$udFormGroup, validationState, originalFormGroupNote]);

            return (
                <TextInputContainer>
                    <TextInput
                        {...ariaProps}
                        type="time"
                        className={styles['time-picker']}
                        onInput={validateInput}
                        size="large"
                        {...props}
                    />
                    <ScheduleIcon size="medium" label={false} className={styles.icon} />
                </TextInputContainer>
            );
        },
        {displayName: 'TimePicker'},
    ),
);
