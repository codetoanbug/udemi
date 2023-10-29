import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {LAB_INSTRUCTOR_PERMISSIONS} from 'lab-manage/constants';
import {
    ADMIN_LAB_ACCESS_LEVELS,
    EDIT_FULL_AND_ADMIN_LAB_ACCESS_LEVELS,
    FULL_AND_ADMIN_LAB_ACCESS_LEVELS,
    LAB_STATUS,
    LAB_TYPE,
    TEST_CREATOR_EDIT_FULL_AND_ADMIN_LAB_ACCESS_LEVELS,
    TEST_CREATOR_FULL_AND_ADMIN_LAB_ACCESS_LEVELS,
} from 'labs/constants';
import Lab from 'labs/lab.mobx-model';
import {checkUserLabAccessLevel} from 'labs/utils';

import {trackClick} from '../common/labs-tracking';
import {modularLabManageTasksUrl} from './constants';
import LabWorkspaceEditorStore from './lab-workspace-editor.mobx-store';
import LabsStore from './labs.mobx-store';

@inject('labsStore', 'labWorkspaceEditorStore')
@observer
export default class InstructorLabActions extends React.Component {
    static propTypes = {
        labsStore: PropTypes.instanceOf(LabsStore).isRequired,
        labWorkspaceEditorStore: PropTypes.instanceOf(LabWorkspaceEditorStore).isRequired,
        lab: PropTypes.instanceOf(Lab).isRequired,
    };

    @computed
    get isLabEditable() {
        if (
            this.isLabPublished &&
            checkUserLabAccessLevel(TEST_CREATOR_FULL_AND_ADMIN_LAB_ACCESS_LEVELS)
        ) {
            // TODO: fix this after align on edit permissions for published lab
            return true;
        }
        return [LAB_STATUS.draft, LAB_STATUS.unpublished, LAB_STATUS.in_review].includes(
            this.props.lab.status,
        );
    }

    @computed
    get isLabPublished() {
        return this.props.lab.status === LAB_STATUS.published;
    }

    @autobind
    async editLab() {
        const {lab, labWorkspaceEditorStore} = this.props;
        trackClick('edit_lab', {objectId: lab.id});
        if (lab.labType === LAB_TYPE.modular.key) {
            window.open(modularLabManageTasksUrl(lab.id), '_blank');
        } else {
            await labWorkspaceEditorStore.openModalForLab(lab.id);
        }
    }

    @autobind
    async togglePublishLab() {
        const {lab, labsStore} = this.props;
        const {publishLab, unpublishLab} = labsStore;
        trackClick(this.isLabPublished ? 'unpublish_lab' : 'publish_lab', {objectId: lab.id});
        this.isLabPublished ? await unpublishLab(lab.id) : await publishLab(lab.id);
    }

    @autobind
    async deleteLab() {
        const {lab, labsStore} = this.props;
        trackClick('delete_lab', {objectId: lab.id});
        await labsStore.deleteLab(lab.id);
    }

    get moreActions() {
        return (
            <IconButton udStyle="secondary" data-purpose="more-actions">
                <MoreIcon label={gettext('More lab actions')} />
            </IconButton>
        );
    }

    @computed
    get isLabEditAllowed() {
        const {lab} = this.props;

        const {instructorHasLab} = lab;

        if (instructorHasLab?.isOwner) {
            return true;
        }

        if (this.isLabPublished) {
            return (
                instructorHasLab &&
                ((instructorHasLab.hasPermission(LAB_INSTRUCTOR_PERMISSIONS.EDIT_DRAFT) &&
                    instructorHasLab.hasPermission(LAB_INSTRUCTOR_PERMISSIONS.EDIT_PUBLISHED)) ||
                    instructorHasLab.hasPermission(LAB_INSTRUCTOR_PERMISSIONS.CREATE_ALR_TEST))
            );
        }
        return instructorHasLab?.hasPermission(LAB_INSTRUCTOR_PERMISSIONS.EDIT_DRAFT);
    }

    render() {
        const {lab} = this.props;

        const {instructorHasLab} = lab;
        const isEditActionVisible =
            (lab.labType === LAB_TYPE.modular.key
                ? checkUserLabAccessLevel(TEST_CREATOR_EDIT_FULL_AND_ADMIN_LAB_ACCESS_LEVELS)
                : checkUserLabAccessLevel(EDIT_FULL_AND_ADMIN_LAB_ACCESS_LEVELS)) &&
            this.isLabEditable &&
            this.isLabEditAllowed;
        const isPublishActionVisible =
            checkUserLabAccessLevel(ADMIN_LAB_ACCESS_LEVELS) && instructorHasLab?.isOwner;
        const isDeleteActionVisible =
            checkUserLabAccessLevel(FULL_AND_ADMIN_LAB_ACCESS_LEVELS) &&
            !this.isLabPublished &&
            instructorHasLab?.isOwner;

        if (!isEditActionVisible && !isPublishActionVisible && !isDeleteActionVisible) {
            return null;
        }

        return (
            <Dropdown
                placement="bottom-end"
                menuWidth="small"
                data-purpose="actions-popover"
                trigger={this.moreActions}
            >
                <Dropdown.Menu>
                    {isEditActionVisible && (
                        <Dropdown.MenuItem data-purpose="edit-lab" onClick={this.editLab}>
                            {gettext('Edit')}
                        </Dropdown.MenuItem>
                    )}
                    {isPublishActionVisible && (
                        <Dropdown.MenuItem
                            data-purpose="publish-lab"
                            onClick={this.togglePublishLab}
                        >
                            {this.isLabPublished ? gettext('Unpublish') : gettext('Publish')}
                        </Dropdown.MenuItem>
                    )}
                    {isDeleteActionVisible && (
                        <Dropdown.MenuItem data-purpose="delete-lab" onClick={this.deleteLab}>
                            {gettext('Delete')}
                        </Dropdown.MenuItem>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
