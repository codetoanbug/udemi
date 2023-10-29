import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import DownloadFileIcon from '@udemy/icons/dist/download-file.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup, Select, TextInput} from '@udemy/react-form-components';
import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import AssetUploader from 'course-manage-v2/asset-creator/asset-uploader.react-component';
import {assetTypes} from 'course-manage-v2/asset-library/constants';
import {LabSourceCodeValidationStore} from 'lab-manage/lab-source-code-validation.mobx-store';
import {CodeArchiveAssetUploaderStore} from 'lab-manage/tasks/resources/code-archive-asset-uploader.mobx-store';
import {
    ADMIN_LAB_ACCESS_LEVELS,
    ERROR_NOTIFICATION_PROPS,
    FULL_AND_ADMIN_LAB_ACCESS_LEVELS,
    LAB_CONTAINER_VERTICALS,
    LAB_TYPE,
    LAB_VERTICAL,
    NOTIFICATION_OPTIONS,
} from 'labs/constants';
import {checkUserLabAccessLevel, downloadAssetByUrl} from 'labs/utils';

import {LAB_DESCRIPTION_MAX_SIZE, LAB_TITLE_MAX_SIZE} from './constants';
import LabWorkspaceEditorStore from './lab-workspace-editor.mobx-store';

import './lab-workspace-editor.less';

@inject('labWorkspaceEditorStore')
@observer
export default class LabWorkspaceEditor extends React.Component {
    static propTypes = {
        labWorkspaceEditorStore: PropTypes.instanceOf(LabWorkspaceEditorStore).isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this._resetUploader();
        const {lab} = this.props.labWorkspaceEditorStore;
        this.labSourceCodeValidationStore = new LabSourceCodeValidationStore(lab);
        this.isVerticalTemplateChangeAvailable = checkUserLabAccessLevel(
            FULL_AND_ADMIN_LAB_ACCESS_LEVELS,
        );
    }

    async componentDidMount() {
        const {labWorkspaceEditorStore} = this.props;
        if (
            this.isLabEditorCourseAttachAvailable &&
            labWorkspaceEditorStore.courses?.length === 0
        ) {
            await labWorkspaceEditorStore.loadInstructorCourses();
        }
    }

    componentDidUpdate() {
        this.labSourceCodeValidationStore.setLab(this.props.labWorkspaceEditorStore.lab);
    }

    @computed
    get isLabEditorCourseAttachAvailable() {
        return (
            checkUserLabAccessLevel(ADMIN_LAB_ACCESS_LEVELS) &&
            this.props.labWorkspaceEditorStore.lab?.labType === LAB_TYPE.workspace.key
        );
    }

    get labVerticalOptions() {
        return Object.values(LAB_VERTICAL).map((item) => {
            return (
                <option key={item.key} value={item.key.toLowerCase()}>
                    {item.label}
                </option>
            );
        });
    }

    get labTemplateSelect() {
        const {labWorkspaceEditorStore} = this.props;
        const {lab, templates} = labWorkspaceEditorStore;

        let templatesOptions = null;

        if (lab.vertical) {
            templatesOptions = templates?.map((template) => {
                return (
                    <option key={`template-${template.id}`} value={template.id}>
                        {template.title}
                    </option>
                );
            });
        }

        return (
            <Select
                name="template"
                value={lab.template || ''}
                onChange={this.setFormField}
                disabled={!this.isVerticalTemplateChangeAvailable}
            >
                <Select.Placeholder>{gettext('Select a lab template')}</Select.Placeholder>
                {templatesOptions}
            </Select>
        );
    }

    _resetUploader() {
        this.uploaderStore = new CodeArchiveAssetUploaderStore(assetTypes.misc);
    }

    @autobind async handleVerticalChange(event) {
        const {labWorkspaceEditorStore} = this.props;
        this.setFormField(event);
        await labWorkspaceEditorStore.loadLabTemplates(event.target.value);
    }

    @autobind setFormField(event) {
        this.props.labWorkspaceEditorStore.lab.setFormField(event.target.name, event.target.value);
    }

    @autobind onClose() {
        const {onClose, labWorkspaceEditorStore} = this.props;
        const {lab} = labWorkspaceEditorStore;

        if (lab.isSavingInProgress) {
            return false;
        }

        labWorkspaceEditorStore.clearForm();
        labWorkspaceEditorStore.setIsModalOpen(false);
        onClose();
    }

    @autobind
    async onDeleteClick() {
        const {labWorkspaceEditorStore} = this.props;
        const {lab} = labWorkspaceEditorStore;
        try {
            await lab.deleteInitialSourceCode();
            this._resetUploader();
        } catch (e) {
            toasterStore.addAlertBannerToast(
                {...ERROR_NOTIFICATION_PROPS, title: gettext('Unable to delete file.')},
                NOTIFICATION_OPTIONS,
            );
        }
    }

    @autobind
    async onDownloadClick() {
        const url = await this.props.labWorkspaceEditorStore.lab.initialCode.getResourceDownloadUrl();
        url && downloadAssetByUrl(url);
    }

    @autobind
    async handleAddInitialCodeFile(assetId) {
        try {
            await this.props.labWorkspaceEditorStore.lab.createInitialCodeResource(assetId);
            this._resetUploader();
        } catch (e) {
            toasterStore.addAlertBannerToast(
                {...ERROR_NOTIFICATION_PROPS, title: gettext('Unable to upload file.')},
                NOTIFICATION_OPTIONS,
            );
        }
    }

    @autobind
    setCourse(event) {
        if (event.target.value === '') {
            this.props.labWorkspaceEditorStore.lab.setFormField('course', {});
            this.props.labWorkspaceEditorStore.lab.course = null;
        } else {
            this.props.labWorkspaceEditorStore.lab.setFormField('course', {id: event.target.value});
        }
    }

    render() {
        const {labWorkspaceEditorStore} = this.props;

        if (!labWorkspaceEditorStore.isModalOpen) {
            return null;
        }

        const {lab, courses} = labWorkspaceEditorStore;
        return (
            <Modal
                isOpen={labWorkspaceEditorStore.isModalOpen}
                onClose={this.onClose}
                fullPage={false}
                title={
                    lab.labType === LAB_TYPE.dev_workspace.key
                        ? gettext('New dev workspace')
                        : gettext('New in course workspace')
                }
                requireExplicitAction={true}
            >
                <form>
                    <div styleName="form-row">
                        <div styleName="form-col">
                            <FormGroup
                                udStyle="default"
                                styleName="field"
                                label={gettext('Vertical')}
                            >
                                <Select
                                    name="vertical"
                                    value={lab.vertical || ''}
                                    onChange={this.handleVerticalChange}
                                    disabled={!this.isVerticalTemplateChangeAvailable}
                                >
                                    <Select.Placeholder>
                                        {gettext('Select a lab vertical')}
                                    </Select.Placeholder>
                                    {this.labVerticalOptions}
                                </Select>
                            </FormGroup>
                            <FormGroup
                                udStyle="default"
                                styleName="field"
                                label={gettext('Template')}
                            >
                                {this.labTemplateSelect}
                            </FormGroup>
                            <FormGroup udStyle="default" styleName="field" label={gettext('Title')}>
                                <TextInput
                                    name="title"
                                    maxLength={LAB_TITLE_MAX_SIZE}
                                    placeholder={gettext('Enter a title')}
                                    defaultValue={lab.title}
                                    onChange={this.setFormField}
                                    required={true}
                                />
                            </FormGroup>
                            <FormGroup
                                udStyle="default"
                                styleName="field"
                                label={gettext('Description')}
                            >
                                <TextInput
                                    name="description"
                                    maxLength={LAB_DESCRIPTION_MAX_SIZE}
                                    placeholder={gettext('Enter a description')}
                                    defaultValue={lab.description}
                                    onChange={this.setFormField}
                                />
                            </FormGroup>
                            {this.isLabEditorCourseAttachAvailable && (
                                <FormGroup
                                    udStyle="default"
                                    styleName="field"
                                    label={gettext('Course')}
                                >
                                    <Select
                                        name="course"
                                        value={lab.course?.id || ''}
                                        onChange={this.setCourse}
                                    >
                                        <option key="none" value="">
                                            {gettext('Select a course')}
                                        </option>
                                        {courses?.map((course) => {
                                            return (
                                                <option
                                                    key={`course-${course.id}`}
                                                    value={course.id}
                                                >
                                                    {course.title}
                                                </option>
                                            );
                                        })}
                                    </Select>
                                </FormGroup>
                            )}
                            {LAB_CONTAINER_VERTICALS.includes(lab.vertical) && (
                                <div>
                                    {lab.initialCode ? (
                                        <div styleName="initial-code-container">
                                            <FormGroup
                                                styleName="field"
                                                label={gettext('Initial Code')}
                                            >
                                                <TextInput
                                                    name="fileName"
                                                    disabled={true}
                                                    value={lab.initialCode.displayTitle}
                                                />
                                            </FormGroup>
                                            <IconButton
                                                udStyle="ghost"
                                                styleName="download-button"
                                                size="small"
                                                onClick={this.onDownloadClick}
                                            >
                                                <DownloadFileIcon
                                                    color="neutral"
                                                    size="small"
                                                    label={gettext('Download')}
                                                />
                                            </IconButton>
                                            <IconButton
                                                udStyle="ghost"
                                                size="small"
                                                styleName="delete-button"
                                                onClick={this.onDeleteClick}
                                            >
                                                <DeleteIcon
                                                    color="neutral"
                                                    size="small"
                                                    label={gettext('Delete')}
                                                />
                                            </IconButton>
                                        </div>
                                    ) : (
                                        <FormGroup
                                            udStyle="default"
                                            styleName="field"
                                            label={gettext('Initial Code')}
                                        >
                                            {this.labSourceCodeValidationStore
                                                .hasValidationErrors && (
                                                <div className="ud-form-group-error">
                                                    {this.labSourceCodeValidationStore.validationErrors.map(
                                                        (error, index) => (
                                                            <div
                                                                className="ud-form-note ud-text-xs"
                                                                key={`initial-code-error-${index}`}
                                                            >
                                                                {error}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                            <AssetUploader
                                                // DO NOT REMOVE THIS KEY; IT LETS THIS COMPONENT RESET ITSELF
                                                // reset the uploader to allow another upload; this is paired with a key change in AssetUploader
                                                // which automatically happens when the resource list size increases
                                                key={`lab-${lab.id}-initial-code-uploader`}
                                                store={this.uploaderStore}
                                                onUpload={this.handleAddInitialCodeFile}
                                                showNotes={false}
                                                validateBeforeUpload={
                                                    this.labSourceCodeValidationStore
                                                        .validateInitialSourceCode
                                                }
                                            />
                                            <div className="ud-form-note ud-text-xs">
                                                {gettext(
                                                    'Submit an unique file in .zip format, containing files that will be the starter point for learners on the Workspace.',
                                                )}
                                            </div>
                                        </FormGroup>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <FooterButtons>
                        <Button udStyle="ghost" onClick={this.onClose} data-purpose="cancel">
                            {lab.isSavingInProgress ? (
                                <Loader color="inherit" label={gettext('Saving')} />
                            ) : (
                                gettext('Close')
                            )}
                        </Button>
                    </FooterButtons>
                </form>
            </Modal>
        );
    }
}
