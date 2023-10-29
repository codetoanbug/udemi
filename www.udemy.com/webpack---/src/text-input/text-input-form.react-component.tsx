import {useI18n} from '@udemy/i18n';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {Button, IconButton, isIcon} from '@udemy/react-core-components';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import React from 'react';

import styles from './text-input-form.module.less';
import {InputSize, TextInput, TextInputProps} from './text-input.react-component';

/** React props interface for the `TextInputForm` component. */
interface TextInputFormProps extends Omit<TextInputProps, 'onSubmit'> {
    /** Object for applying `data-purpose` attributes various elements within `TextInputForm`. */
    dataPurposes?: Record<string, string>;
    /** Optional event handler to call when the `TextInputForm` is cleared. */
    onClearInput?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /**
     * Flag to show the "Clear" button.
     *
     * @defaultValue false
     */
    showClearInputButton?: boolean;
    /**
     * The size of the TextInput within the TextInputForm.
     *
     * @defaultValue 'large'
     */
    size?: InputSize;
    /** Optional event handler for when the `TextInputForm` is submitted. */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    /**
     * Content of the submit button
     *
     * @defaultValue 'Submit'
     */
    submitButtonContent?: React.ReactNode;
    /** React props to pass on to the Submit button. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    submitButtonProps?: Record<string, any>;
}

/**
 * The TextInputForm component.
 *
 * @remarks
 * A `<form>` tag wrapping a {@link TextInput} component.
 */
export const TextInputForm = ({
    dataPurposes = {},
    onClearInput = noop,
    onSubmit = noop,
    showClearInputButton = false,
    size = 'large',
    submitButtonProps = {},
    children,
    ...props
}: TextInputFormProps) => {
    const {gettext} = useI18n();
    const {submitButtonContent = gettext('Submit'), ...textInputProps} = props;
    const SubmitButton = isIcon(submitButtonContent) ? IconButton : Button;

    const onTextInputFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(event);
    };

    return (
        <form
            data-purpose={dataPurposes.form}
            onSubmit={onTextInputFormSubmit}
            className={classNames(styles['text-input-form'], {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                [styles['form-with-clear-button']]: showClearInputButton,
            })}
        >
            {children ?? (
                <TextInput data-purpose={dataPurposes.input} size={size} {...textInputProps} />
            )}
            {showClearInputButton && (
                <IconButton
                    onClick={onClearInput}
                    udStyle="ghost"
                    size={size}
                    className={styles['clear-button']}
                >
                    <CloseIcon color="neutral" label={gettext('Clear input')} />
                </IconButton>
            )}
            <SubmitButton
                type="submit"
                size={size}
                data-purpose={dataPurposes.submit}
                disabled={props.disabled}
                {...submitButtonProps}
            >
                {submitButtonContent}
            </SubmitButton>
        </form>
    );
};
