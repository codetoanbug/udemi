import {useI18n} from '@udemy/i18n';
import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import {IconButton, Button} from '@udemy/react-core-components';
import {Progress} from '@udemy/react-messaging-components';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React, {useCallback} from 'react';

import {BaseFormGroup, checkFormGroup, InputSize} from '../index';
import styles from './file-uploader.module.less';

/**
 * React component props for `FileUploader`
 */
export interface FileUploaderProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
    /**
     * File extensions for the input element. Joined with comma and rendered as `accept` attribute
     * ({@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept}).
     *
     * @defaultValue `[]` in `FileUploader`
     */
    allowedExtensionsDotted?: string[];
    /**
     * Label displayed when no file is selected
     */
    noSelectedFileLabel?: string;
    /**
     * Function called when user changes the selected file, i.e. it is a change
     * from selected file to no selected file (typically `onChangeSelectedFile` is
     * implemented to clear the previously selected file).
     *
     * @remarks
     *
     * `onChange` is called when user selects a file to upload, i.e. it is a change
     * from no selected file to selected file.
     */
    onChangeSelectedFile?: () => void;
    /**
     * Function called when user removes the selected file
     */
    onDeleteFile?: () => void;
    /**
     * Boolean to disabled or enabled the Delete file button
     *
     * @defaultValue true in `FileUploader`
     */
    disableDeleteFile?: boolean;
    /**
     * File upload progress as a percentage value. `null` if the upload is not in progress
     *
     * @defaultValue `null` in `FileUploader`
     */
    progressPercentage?: number | null;
    /**
     * String set to `data-purpose` attribute on containing `<div>` element
     */
    purpose?: string;
    /**
     * Height of file uploader; corresponds to sizes for {@link TextInput}
     *
     * @defaultValue `'large'` in `FileUploader`
     */
    size?: InputSize;
    /**
     * Upload button label displayed when file upload is completed.
     */
    uploadCompletedLabel?: string;
    /**
     * Upload button label displayed when file upload is in progress.
     */
    uploadInProgressLabel?: string;
    /**
     * Upload button label displayed before upload has begun.
     */
    uploadLabel?: string;
    /**
     * Internally used to access the parent FormGroup; don't pass it yourself.
     */
    $$udFormGroup?: BaseFormGroup;
}

/**
 * ### FileUploader
 *
 * This component renders an input group for file upload, and a progress bar while uploading.
 *
 * @remarks
 *
 * Props not specific to this component will be passed through to the rendered `<input>` element.
 */
export const FileUploader = inject(({$$udFormGroup}) => ({$$udFormGroup}))(
    observer(
        Object.assign(
            ({
                allowedExtensionsDotted = [],
                onChangeSelectedFile = noop,
                onDeleteFile = undefined,
                disableDeleteFile = true,
                progressPercentage = null,
                purpose = '',
                size = 'large',
                $$udFormGroup,
                ...props
            }: FileUploaderProps) => {
                const {gettext, interpolate} = useI18n();
                const inputRef = React.useRef<HTMLInputElement>(null);
                // Separate these from the function signature so we can use i18n functions.
                const {
                    noSelectedFileLabel = gettext('No file selected'),
                    uploadCompletedLabel = gettext('Change'),
                    uploadInProgressLabel = gettext('Cancel'),
                    uploadLabel = gettext('Upload File'),
                    ...inputProps
                } = props;

                const handleDeleteFile = useCallback(
                    (e) => {
                        e.preventDefault();
                        if (inputRef?.current) {
                            inputRef.current.value = '';
                            onDeleteFile?.();
                        }
                    },
                    [onDeleteFile],
                );

                // Pass percentage as an argument rather than using the prop variable
                // directly so TS honors isUploading render guard below.
                const renderProgressBar = (percentage: number) => {
                    const progressLabel = interpolate(
                        gettext('%(percent)s%'),
                        {percent: percentage},
                        true,
                    );
                    return (
                        <div className={styles['input-group']}>
                            <div className={styles['progress-bar-wrapper']}>
                                <Progress
                                    value={percentage}
                                    max={100}
                                    label={progressLabel}
                                    className={styles['progress-bar']}
                                />
                                <span
                                    aria-hidden={true}
                                    className={styles['progress-label-wrapper']}
                                    style={{transform: `translateX(${percentage / 2}%)`}}
                                >
                                    <span className={styles['progress-label']}>
                                        {progressLabel}
                                    </span>
                                </span>
                            </div>
                            <Button
                                onClick={onChangeSelectedFile}
                                disabled={inputProps.disabled}
                                udStyle="secondary"
                                className={styles.btn}
                            >
                                {percentage < 100 ? uploadInProgressLabel : uploadCompletedLabel}
                            </Button>
                        </div>
                    );
                };

                const renderUploader = () => {
                    return (
                        <label
                            htmlFor={inputProps.id}
                            className={classNames(styles['input-group'], styles['uploader-label'])}
                        >
                            <span className={styles['fake-input']}>
                                <span className={styles['fake-input-text']}>
                                    {noSelectedFileLabel}
                                </span>
                            </span>
                            <Button
                                componentClass="span"
                                udStyle="secondary"
                                className={styles.btn}
                            >
                                {uploadLabel}
                            </Button>
                            {onDeleteFile && (
                                <IconButton
                                    udStyle="ghost"
                                    size="medium"
                                    disabled={disableDeleteFile}
                                    onClick={handleDeleteFile}
                                    data-purpose="delete-file-button"
                                    className={styles['delete-button']}
                                >
                                    <DeleteIcon
                                        color="neutral"
                                        size="medium"
                                        label={gettext('Delete')}
                                    />
                                </IconButton>
                            )}
                        </label>
                    );
                };

                checkFormGroup('TextInput', {$$udFormGroup, id: inputProps.id}, null, true);

                const isUploading = progressPercentage !== null && progressPercentage !== undefined;
                inputProps.accept = (allowedExtensionsDotted ?? []).join(',') || undefined;
                inputProps.id = $$udFormGroup ? $$udFormGroup.id : inputProps.id;
                inputProps.type = 'file';
                inputProps.className = classNames('ud-sr-only', inputProps.className);
                return (
                    <div className={styles[`file-uploader-${size}`]} data-purpose={purpose}>
                        {isUploading && renderProgressBar(progressPercentage)}
                        {!isUploading && <input ref={inputRef} {...inputProps} />}
                        {!isUploading && renderUploader()}
                    </div>
                );
            },
            {displayName: 'FileUploader'},
        ),
    ),
);
