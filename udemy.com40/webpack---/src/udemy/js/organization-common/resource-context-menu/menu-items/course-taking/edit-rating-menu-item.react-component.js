import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import requires from 'course-taking/registry/requires';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ResourceContextMenu from 'organization-common/resource-context-menu/resource-context-menu.react-component';

import ContextMenuItem from '../context-menu-item.react-component';

@inject('resourceContext')
@requires('leaveRatingStore')
@observer
export default class EditRatingMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
        leaveRatingStore: PropTypes.object.isRequired,
        addDivider: PropTypes.bool,
    };

    static defaultProps = {
        addDivider: true,
    };

    @autobind
    handleClick() {
        this.props.leaveRatingStore.setReview(this.props.courseTakingStore.courseReview);
        this.props.leaveRatingStore.onStartReview();
        trackClickAction(this.props.resourceContext, this.title, {
            resourceType: RESOURCE_TYPES.COURSE,
            resourceId: this.props.courseTakingStore.course.id,
        });
    }

    @computed
    get title() {
        return this.props.courseTakingStore.courseReview
            ? gettext('Edit your rating')
            : gettext('Leave a rating');
    }

    render() {
        return (
            <>
                {this.props.addDivider && <ResourceContextMenu.Divider />}
                <ContextMenuItem
                    icon={<EditIcon label={false} />}
                    title={this.title}
                    onClick={this.handleClick}
                />
            </>
        );
    }
}

EditRatingMenuItem.shouldRender = ({courseTakingStore}) => {
    return courseTakingStore.hasEditReviewHeaderMenuItem;
};
