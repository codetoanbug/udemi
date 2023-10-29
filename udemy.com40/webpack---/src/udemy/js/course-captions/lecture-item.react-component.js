import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import {ConfirmModal} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {CAPTION_STATUS_CHOICES} from 'caption/constants';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import CaptionTooltip from './caption-tooltip.react-component';
import {CAPTION_ERROR_TITLES} from './constants';
import UploaderButton from './uploader-button.react-component';
import './captions-form.less';

const CaptionDate = ({caption}) => {
    if (!caption || caption.status !== CAPTION_STATUS_CHOICES.SUCCESS) {
        return null;
    }

    return (
        <span>
            <RelativeDuration datetime={caption.modified} />
        </span>
    );
};
CaptionDate.propTypes = {
    caption: PropTypes.shape({
        status: PropTypes.number.isRequired,
        modified: PropTypes.string.isRequired,
    }),
};

CaptionDate.defaultProps = {
    caption: undefined,
};

export const CaptionStatus = ({caption, isLecturePublished, isCourseLocale}) => {
    if (!caption || caption.status === CAPTION_STATUS_CHOICES.FAILED) {
        return (
            <>
                <span styleName="ellipsis">{gettext('Uncaptioned')}</span>
                {isLecturePublished || !isCourseLocale ? null : (
                    <CaptionTooltip>
                        {gettext('Unpublished videos will not be autocaptioned.')}
                    </CaptionTooltip>
                )}
            </>
        );
    } else if (caption.status === CAPTION_STATUS_CHOICES.DELETING) {
        return <span styleName="ellipsis">{gettext('Deleting')}</span>;
    } else if (caption.status !== CAPTION_STATUS_CHOICES.SUCCESS) {
        if (caption.source === 'auto') {
            return (
                <>
                    <span styleName="ellipsis">{gettext('Generating (Up to one hour)')}</span>
                    <CaptionTooltip>
                        {gettext('Captions are being created automatically for this lecture.')}
                    </CaptionTooltip>
                </>
            );
        }
        return <span styleName="ellipsis">{gettext('Processing')}</span>;
    }

    if (caption.source === 'auto') {
        if (!caption.confidenceThreshold) {
            return (
                <>
                    <span styleName="ellipsis">{gettext('Auto-generated (Needs review)')}</span>
                    <CaptionTooltip>
                        {gettext(
                            'These captions may have errors. Please click edit and review captions.',
                        )}
                    </CaptionTooltip>
                </>
            );
        }
        return <span styleName="ellipsis">{gettext('Auto-generated')}</span>;
    }

    if (caption.isEdit) {
        return <span styleName="ellipsis">{gettext('Edited')}</span>;
    }
    return <span styleName="ellipsis">{gettext('Uploaded')}</span>;
};

CaptionStatus.propTypes = {
    caption: PropTypes.object,
    isLecturePublished: PropTypes.bool.isRequired,
    isCourseLocale: PropTypes.bool.isRequired,
};

CaptionStatus.defaultProps = {
    caption: undefined,
};

export const CaptionFileActions = ({caption, changeCaptionFn, deleteFn, editFn}) => {
    const actions = [];
    const isCaptionAvailable = caption && caption.status !== CAPTION_STATUS_CHOICES.FAILED;

    if (caption && caption.status === 1) {
        actions.push(
            <Dropdown.MenuItem key="edit" styleName="caption-edit-menu-item" onClick={editFn}>
                {gettext('Edit')}
            </Dropdown.MenuItem>,
        );
    }

    actions.push(
        <Dropdown.MenuItem
            key="upload"
            componentClass={UploaderButton}
            typography="ud-text-sm"
            udStyle="ghost"
            onChange={changeCaptionFn}
        >
            {gettext('Upload')}
        </Dropdown.MenuItem>,
    );

    if (caption && caption.status === 1) {
        actions.push(
            <Dropdown.MenuItem
                componentClass="div"
                key="download"
                href={caption.url}
                target="_blank"
            >
                {gettext('Download')}
            </Dropdown.MenuItem>,
        );
    }

    if (deleteFn && caption && caption.status === 1 && caption.source !== 'auto') {
        const label = caption.isEditOfAutoCaption ? gettext('Reset') : gettext('Delete');
        actions.push(
            <Dropdown.MenuItem key="delete" data-purpose="delete-caption" onClick={deleteFn}>
                <span styleName="color-negative">{label}</span>
            </Dropdown.MenuItem>,
        );
    }

    let actionBtn = null;
    if (caption && caption.status === CAPTION_STATUS_CHOICES.SUCCESS) {
        actionBtn = (
            <Button
                key="edit"
                onClick={editFn}
                size="xsmall"
                udStyle="secondary"
                styleName="caption-action-button hidden-lg-max"
            >
                {gettext('Edit')}
            </Button>
        );
    } else if (!isCaptionAvailable) {
        actionBtn = (
            <UploaderButton
                key="upload"
                onChange={changeCaptionFn}
                udStyle="secondary"
                styleName="caption-action-button"
                size="xsmall"
            >
                {gettext('Upload')}
            </UploaderButton>
        );
    }

    return (
        <>
            {actionBtn}
            {isCaptionAvailable ? (
                <Dropdown
                    placement="bottom-end"
                    styleName="caption-action-dropdown"
                    trigger={
                        <IconButton
                            data-purpose="dropdown-ellipsis-editor"
                            size="xsmall"
                            udStyle="ghost"
                        >
                            <MoreIcon label={gettext('Actions')} size="medium" />
                        </IconButton>
                    }
                >
                    <Dropdown.Menu>{actions}</Dropdown.Menu>
                </Dropdown>
            ) : null}
        </>
    );
};

CaptionFileActions.propTypes = {
    caption: PropTypes.object,
    changeCaptionFn: PropTypes.func,
    deleteFn: PropTypes.func,
    editFn: PropTypes.func,
};

CaptionFileActions.defaultProps = {
    caption: undefined,
    changeCaptionFn: undefined,
    deleteFn: undefined,
    editFn: undefined,
};

function CaptionAlert({type, message, block}) {
    return (
        <AlertBanner
            udStyle="error"
            styleName="error-alert-banner"
            data-purpose="caption-upload-alert"
            showCta={false}
            title={CAPTION_ERROR_TITLES[type]}
            body={
                !message && !block ? null : (
                    <>
                        {message && (
                            <p
                                {...safelySetInnerHTML({
                                    descriptionOfCaller: 'lecture-item:message',
                                    html: message,
                                })}
                            />
                        )}
                        {block && <pre>{block}</pre>}
                    </>
                )
            }
        />
    );
}
CaptionAlert.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    block: PropTypes.string,
};

CaptionAlert.defaultProps = {
    block: undefined,
};

const UploadProgress = ({fileName, progress = 0}) => {
    const uploadingText = (
        <div styleName="progress-bar-text">
            <Loader size="small" />
            {interpolate(gettext('Uploading %(fileName)s'), {fileName}, true)}
        </div>
    );
    return (
        <div styleName="lecture-item-uploading progress-bar-text-container">
            {uploadingText}
            <span className="ud-sr-only">
                {interpolate(gettext('%(percent)s% complete'), {percent: progress}, true)}
            </span>
            <div
                aria-hidden={true}
                styleName="progress-bar progress-bar-text-container"
                style={{width: `${progress}%`}}
            >
                {uploadingText}
            </div>
        </div>
    );
};

UploadProgress.propTypes = {
    fileName: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
};

@withRouter
@inject('store')
@observer
export default class LectureItem extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        lecture: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
    };

    @observable showDeleteConfirmation = false;

    @autobind
    @action
    onDeleteConfirm() {
        const {lecture, store} = this.props;
        this.showDeleteConfirmation = false;
        store.deleteCaption(lecture);
    }

    @autobind
    @action
    onDeleteCancel() {
        this.showDeleteConfirmation = false;
    }

    @autobind
    @action
    onDeleteClick() {
        this.showDeleteConfirmation = true;
    }

    @autobind
    @action
    onEditClick() {
        const {history, lecture, store} = this.props;
        history.push(store.getEditorUrl(lecture.id));
    }

    @autobind
    onChangeCaption() {
        const {lecture, store} = this.props;
        return (file) => {
            store.replaceCaption(lecture, file);
        };
    }

    getTitle() {
        const {lecture} = this.props;
        if (lecture.isPromoVideo) {
            return gettext('Promotional video');
        }
        const title = lecture.is_published
            ? gettext('Lecture %(lectureNumber)s: %(lectureTitle)s')
            : gettext('Unpublished lecture: %(lectureTitle)s');

        return interpolate(
            title,
            {
                lectureTitle: lecture.title,
                lectureNumber: lecture.object_index,
            },
            true,
        );
    }

    getIcon() {
        const {lecture, store} = this.props;
        const caption = store.getCaptionsFor(lecture);

        if (!caption || caption.status === CAPTION_STATUS_CHOICES.FAILED) {
            return (
                <div styleName="empty-circle-container">
                    <div styleName="empty-circle" />
                </div>
            );
        } else if (caption.status !== CAPTION_STATUS_CHOICES.SUCCESS) {
            return <Loader size="small" />;
        } else if (caption.confidenceThreshold) {
            return <SuccessIcon label={false} color="positive" />;
        }
        return <WarningIcon label={false} color="neutral" />;
    }

    @autobind
    getActions(caption) {
        const {store} = this.props;
        const actionProps = {
            caption,
            changeCaptionFn: this.onChangeCaption(),
            editFn: this.onEditClick,
        };

        if (store.canUserEditCourse) {
            actionProps.deleteFn = this.onDeleteClick;
        }

        return (
            <div styleName="flex lecture-item-cell caption-actions-cell">
                <div styleName="caption-actions">
                    <CaptionFileActions {...actionProps} />
                </div>
            </div>
        );
    }

    render() {
        const {lecture, store} = this.props;
        const uploadStatus = lecture.uploadStatus.get(store.currentLocaleId) || {};
        const caption = store.getCaptionsFor(lecture);

        if (uploadStatus.onProcess) {
            return (
                <UploadProgress fileName={uploadStatus.fileName} progress={uploadStatus.progress} />
            );
        }

        const confirmModalText =
            caption && caption.isEditOfAutoCaption
                ? gettext(
                      'Are you sure you want to reset this caption file? ' +
                          'If you reset this caption file the original auto-generated caption file will ' +
                          'be restored.',
                  )
                : gettext(
                      'Are you sure you want to delete this caption file? ' +
                          'If an auto-generated caption file exists it will replace the deleted file.',
                  );

        return (
            <div data-purpose="lecture-caption-container">
                {!uploadStatus.error ? null : <CaptionAlert {...uploadStatus.error} />}
                <div className="ud-text-sm" styleName="lecture-item">
                    <div styleName="lecture-item-cell">{this.getIcon()}</div>
                    <div styleName="flex lecture-item-cell lecture-item-details">
                        <div styleName="flex lecture-item-cell lecture-title">
                            <span styleName="ellipsis">{this.getTitle()}</span>
                        </div>
                        <div styleName="flex lecture-item-cell hidden-lg-max">
                            <CaptionStatus
                                caption={caption}
                                isLecturePublished={lecture.is_published}
                                isCourseLocale={store.isDefaultLocale}
                            />
                        </div>
                        <div styleName="flex lecture-item-cell caption-edited-date">
                            <CaptionDate caption={caption} />
                        </div>
                    </div>
                    {this.getActions(caption)}
                    <ConfirmModal
                        onCancel={this.onDeleteCancel}
                        onConfirm={this.onDeleteConfirm}
                        isOpen={this.showDeleteConfirmation}
                    >
                        {confirmModalText}
                    </ConfirmModal>
                </div>
            </div>
        );
    }
}
