import FolderIcon from '@udemy/icons/dist/folder.ud-icon';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Enrollment from 'course-taking/enrollment.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';

import ContextMenuItem from '../context-menu-item.react-component';

@inject('resourceContext')
@observer
export default class ArchiveCourseMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
        enrollment: PropTypes.instanceOf(Enrollment).isRequired,
        courseTakingStore: PropTypes.object,
        actionCallbacks: PropTypes.shape({
            onCourseArchived: PropTypes.func.isRequired,
        }),
    };

    static defaultProps = {
        courseTakingStore: undefined,
        actionCallbacks: undefined,
    };

    @autobind
    trackClick() {
        trackClickAction(this.props.resourceContext, this.title, {
            resourceType: RESOURCE_TYPES.COURSE,
            resourceId: this.props.courseTakingStore.course.id,
        });
    }

    @autobind
    onClick() {
        const {enrollment, actionCallbacks} = this.props;
        enrollment.toggleArchived();
        actionCallbacks && actionCallbacks.onCourseArchived && actionCallbacks.onCourseArchived();
        this.trackClick();
    }

    @computed
    get title() {
        const {enrollment} = this.props;
        return enrollment.archivedTime
            ? gettext('Unarchive this course')
            : gettext('Archive this course');
    }

    render() {
        return (
            <ContextMenuItem
                icon={<FolderIcon label={false} />}
                title={this.title}
                onClick={this.onClick}
            />
        );
    }
}

ArchiveCourseMenuItem.shouldRender = ({enrollment}) => !!enrollment;
