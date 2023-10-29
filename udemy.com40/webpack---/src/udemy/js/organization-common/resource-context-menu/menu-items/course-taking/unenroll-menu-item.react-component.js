import CancelIcon from '@udemy/icons/dist/cancel.ud-icon';
import autobind from 'autobind-decorator';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import requires from 'course-taking/registry/requires';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ResourceContextMenu from 'organization-common/resource-context-menu/resource-context-menu.react-component';

import ContextMenuItem from '../context-menu-item.react-component';

@inject('resourceContext')
@requires('unenrollStore')
export default class UnenrollMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
        unenrollStore: PropTypes.object.isRequired,
        addDivider: PropTypes.bool,
    };

    static defaultProps = {
        addDivider: true,
    };

    get title() {
        return gettext('Unenroll from course');
    }

    @autobind
    trackClick() {
        trackClickAction(this.props.resourceContext, this.title, {
            resourceType: RESOURCE_TYPES.COURSE,
            resourceId: this.props.unenrollStore.courseTakingStore.course.id,
        });
    }

    @autobind
    onClick() {
        const {openConfirmModal} = this.props.unenrollStore;
        openConfirmModal();
        this.trackClick();
    }

    render() {
        return (
            <>
                {this.props.addDivider && <ResourceContextMenu.Divider />}
                <ContextMenuItem
                    icon={<CancelIcon label={false} />}
                    title={this.title}
                    onClick={this.onClick}
                />
            </>
        );
    }
}

UnenrollMenuItem.shouldRender = ({unenrollStore}) => unenrollStore.canUnenroll;
