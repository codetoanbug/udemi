import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {FormGroup, Select, TextArea, FileUploader} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import React, {useCallback, useState} from 'react';

import Raven from 'utils/ud-raven';

import {
    ISSUE_DETAILS_NOTE,
    LAB_TECHNICAL_ISSUE_CODE,
    TECHNICAL_ISSUE_ALLOWED_FILE_EXTENSIONS,
} from './constants';
import {createLabSupportTicket, getSupportLink} from './utils';

interface LabReportTechnicalIssueFormProps {
    labId: number;
    taskNumber?: number;
    currentMode?: string;
    subjects: string[];
    onSuccess: (ticket: {ticket_id: number}, withFile: boolean) => void;
    onCancel: () => void;
    onError: () => void;
}

export const LabReportTechnicalIssueForm = ({
    labId,
    taskNumber,
    currentMode,
    subjects,
    onSuccess,
    onCancel,
    onError,
}: LabReportTechnicalIssueFormProps) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [errorState, setErrorState] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = useCallback(() => {
        const errors: Record<string, string> = {};
        if (!subject) {
            errors.subject = gettext('Select an option');
        }
        if (!body) {
            errors.body = gettext('Please provide a description');
        }
        setErrorState(errors);
        return Object.keys(errors).length === 0;
    }, [subject, body]);

    const handleSubjectChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            setSubject(event.target.value);
        },
        [setSubject],
    );

    const handleBodyChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setBody(event.target.value);
        },
        [setBody],
    );

    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files?.length) {
                setFile(event.target.files[0]);
            }
        },
        [setFile],
    );

    const handleSelectedFileChange = useCallback(() => {
        setFile(null);
    }, [setFile]);

    const handleSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setErrorState({});
            if (!validate()) {
                return;
            }
            try {
                setIsLoading(true);
                const ticket = await createLabSupportTicket(
                    labId,
                    subject,
                    body,
                    file,
                    taskNumber,
                    currentMode,
                );
                onSuccess(ticket, !!file);
            } catch (error) {
                Raven.captureException(error);
                onError();
            } finally {
                setIsLoading(false);
            }
        },
        [validate, labId, subject, body, taskNumber, currentMode, file, onSuccess, onError],
    );

    const issueDetailsNote = (
        <LocalizedHtml
            html={ISSUE_DETAILS_NOTE[LAB_TECHNICAL_ISSUE_CODE].text}
            interpolate={{
                helpCenterUrl: (
                    <a href={getSupportLink()} target="_blank" rel="noopener noreferrer" />
                ),
            }}
        />
    );

    return (
        <form onSubmit={handleSubmit} noValidate={true}>
            <FormGroup
                label={gettext('What issues are you experiencing?')}
                validationState={errorState.subject ? 'error' : null}
                note={errorState.subject || null}
            >
                <Select name="subject" value={subject} onChange={handleSubjectChange}>
                    <Select.Placeholder>{gettext('-- Select one --')}</Select.Placeholder>
                    {subjects.map((subjectItem, index) => (
                        <option key={`subject-${index}`} value={subjectItem}>
                            {subjectItem}
                        </option>
                    ))}
                </Select>
            </FormGroup>
            <FormGroup
                label={gettext('Upload file')}
                note={interpolate(
                    gettext('Supported file types: %(supportedFileTypes)s. Max file size: 10MB'),
                    {supportedFileTypes: TECHNICAL_ISSUE_ALLOWED_FILE_EXTENSIONS.join(', ')},
                    true,
                )}
            >
                <FileUploader
                    name="file"
                    onChange={handleFileChange}
                    onChangeSelectedFile={handleSelectedFileChange}
                    uploadLabel={gettext('Select file')}
                    noSelectedFileLabel={file?.name}
                    allowedExtensionsDotted={TECHNICAL_ISSUE_ALLOWED_FILE_EXTENSIONS}
                    onDeleteFile={handleSelectedFileChange}
                    disableDeleteFile={!file}
                />
            </FormGroup>
            <FormGroup
                label={gettext('Issue details')}
                validationState={errorState.body ? 'error' : null}
                note={errorState.body || issueDetailsNote}
            >
                <TextArea
                    name="body"
                    value={body}
                    onChange={handleBodyChange}
                    placeholder={gettext(
                        'The more details you can provide within your feedback, the more helpful it will be for our team to understand the problem.',
                    )}
                />
            </FormGroup>
            <FooterButtons>
                <Button onClick={onCancel} udStyle="ghost">
                    {gettext('Cancel')}
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {gettext('Submit')}
                </Button>
            </FooterButtons>
        </form>
    );
};
