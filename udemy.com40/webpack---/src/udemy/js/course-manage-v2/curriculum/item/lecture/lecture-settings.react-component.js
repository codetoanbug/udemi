import {Button} from '@udemy/react-core-components';
import {Switch} from '@udemy/react-form-components';
import {Dropdown} from '@udemy/react-menu-components';
import {Popover} from '@udemy/react-popup-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {assetTypes} from '../../../asset-library/constants';
import CurriculumLectureModel from './curriculum-lecture.mobx-model';
import './lecture-editor.less';

const PreviewAsStudentMenuItem = observer(({curriculumItem}) => {
    const text = gettext('As Student');
    if (curriculumItem.is_published) {
        return (
            <Dropdown.MenuItem
                data-purpose="preview-as-student"
                href={curriculumItem.previewAsStudentUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                {text}
            </Dropdown.MenuItem>
        );
    }
    return (
        <Popover
            placement="left"
            canToggleOnHover={true}
            a11yRole="description"
            detachFromTarget={true}
            shouldCloseOtherPoppers={false}
            trigger={
                <Dropdown.MenuItem
                    data-purpose="preview-as-student"
                    aria-disabled={true}
                    /* Don't close dropdown menu. */
                    onClick={() => false}
                >
                    {text}
                </Dropdown.MenuItem>
            }
        >
            {gettext('Only instructors can see unpublished lectures.')}
        </Popover>
    );
});

const IsPublishedToggle = observer(
    ({curriculumItem, onToggle, canToggle, disablePublishButton}) => {
        if (!canToggle) {
            return null;
        }
        const buttonProps = {
            udStyle: 'secondary',
            size: 'small',
            'data-purpose': 'is-published-toggle',
            disabled: curriculumItem.isSaving || disablePublishButton,
            onClick: onToggle,
        };
        if (curriculumItem.is_published) {
            return <Button {...buttonProps}>{gettext('Unpublish')}</Button>;
        }
        return (
            <Button {...buttonProps} udStyle="brand">
                {gettext('Publish')}
            </Button>
        );
    },
);

const IsFreeToggle = observer(({curriculumItem, onToggle, canToggle}) => {
    if (!curriculumItem.course.is_paid || !curriculumItem.is_published) {
        return null;
    }
    return (
        <Switch
            data-purpose="is-free-toggle"
            checked={curriculumItem.is_free}
            onChange={onToggle}
            disabled={curriculumItem.isSaving || !canToggle}
            size="large"
        >
            {gettext('Free Preview:')}
        </Switch>
    );
});

const IsDownloadableToggle = observer(({curriculumItem, onToggle}) => {
    if (!curriculumItem.asset || !curriculumItem.is_published) {
        return null;
    }
    switch (curriculumItem.asset.asset_type) {
        case assetTypes.article:
        case assetTypes.importContent:
            // These are never downloadable.
            return null;
        case assetTypes.ebook:
            return <div>{gettext('Ebooks are always downloadable')}</div>;
        default:
            return (
                <Switch
                    data-purpose="is-downloadable-toggle"
                    checked={curriculumItem.is_downloadable}
                    onChange={onToggle}
                    disabled={curriculumItem.isSaving}
                    size="large"
                >
                    {gettext('Downloadable:')}
                </Switch>
            );
    }
});

@observer
export default class LectureSettings extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
        canToggleIsFree: PropTypes.bool.isRequired,
        canTogglePublishedState: PropTypes.bool.isRequired,
        onToggleIsDownloadable: PropTypes.func.isRequired,
        onToggleIsFree: PropTypes.func.isRequired,
        onToggleIsPublished: PropTypes.func.isRequired,
        disablePublishButton: PropTypes.bool,
    };

    static defaultProps = {
        disablePublishButton: false,
    };

    render() {
        const {
            curriculumItem,
            canTogglePublishedState,
            onToggleIsPublished,
            canToggleIsFree,
            disablePublishButton,
            onToggleIsFree,
            onToggleIsDownloadable,
        } = this.props;
        return (
            <div styleName="lecture-settings" data-purpose="lecture-settings">
                <div styleName="lecture-settings-btns">
                    <Dropdown
                        placement="bottom-start"
                        trigger={
                            <Dropdown.Button udStyle="primary" size="small">
                                {gettext('Preview')}
                            </Dropdown.Button>
                        }
                    >
                        <Dropdown.Menu>
                            <Dropdown.MenuItem
                                componentClass="div"
                                data-purpose="preview-as-instructor"
                                href={curriculumItem.previewAsInstructorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {gettext('As Instructor')}
                            </Dropdown.MenuItem>
                            <PreviewAsStudentMenuItem curriculumItem={curriculumItem} />
                        </Dropdown.Menu>
                    </Dropdown>
                    <IsPublishedToggle
                        curriculumItem={curriculumItem}
                        canToggle={canTogglePublishedState}
                        onToggle={onToggleIsPublished}
                        disablePublishButton={disablePublishButton}
                    />
                </div>
                <IsFreeToggle
                    curriculumItem={curriculumItem}
                    canToggle={canToggleIsFree}
                    onToggle={onToggleIsFree}
                />
                <IsDownloadableToggle
                    curriculumItem={curriculumItem}
                    onToggle={onToggleIsDownloadable}
                />
            </div>
        );
    }
}
