import {withI18n} from '@udemy/i18n';
import CalendarArrowRight from '@udemy/icons/dist/calendar-arrow-right.ud-icon';
import {withUDData} from '@udemy/ud-data';
import {action} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import AssignResourceModal from 'organization-common/assign-resource/assign-resource-modal.react-component';
import {PACKAGE_PLANS, USER_ROLES, RESOURCE_TYPES} from 'organization-common/constants';
import {hasAllowedPlans, hasAllowedRoles, isCoursePublished} from 'organization-common/helpers';
import {
    shouldDisableMenuItem,
    trackClickAction,
} from 'organization-common/resource-context-menu/helpers';

import ContextMenuItem from './context-menu-item.react-component';
import ShareMenuItemStore from './share-menu-item.mobx-store';

@inject('resourceContext')
@observer
class InternalAssignCourseMenuItem extends React.Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        resourceContext: PropTypes.string.isRequired,
        gettext: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.shareMenuItemStore = new ShareMenuItemStore(
            props.course.id,
            RESOURCE_TYPES.COURSE,
            props.resourceContext,
        );
    }

    shouldRender = () => {
        const {udData, course} = this.props;
        return (
            hasAllowedPlans([PACKAGE_PLANS.ENTERPRISE], {Config: udData.Config}) &&
            hasAllowedRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN, USER_ROLES.GROUP_ADMIN], {
                me: udData.me,
            }) &&
            isCoursePublished(course)
        );
    };

    @action
    handleOpen = async () => {
        await this.shareMenuItemStore.resourcePreview();
        trackClickAction(
            this.props.resourceContext,
            'Assign',
            {
                resourceType: RESOURCE_TYPES.COURSE,
                resourceId: this.props.course.id,
            },
            {
                Config: this.props.udData.Config,
            },
        );
    };

    @action
    handleOnClose = () => {
        this.shareMenuItemStore.hideModal();
    };

    render() {
        if (!this.shouldRender()) {
            return null;
        }
        const {gettext} = this.props;
        return (
            <>
                <ContextMenuItem
                    icon={<CalendarArrowRight label={false} />}
                    title={gettext('Assign')}
                    onClick={this.handleOpen}
                />
                <AssignResourceModal
                    resourceId={this.props.course.id}
                    resourceType={RESOURCE_TYPES.COURSE}
                    shareData={this.shareMenuItemStore.shareData}
                    isOpen={this.shareMenuItemStore.isModalShown}
                    onClose={this.handleOnClose}
                    context={this.props.resourceContext}
                />
            </>
        );
    }
}

const AssignCourseMenuItem = withI18n(withUDData(InternalAssignCourseMenuItem));

AssignCourseMenuItem.shouldRender = () => true;

AssignCourseMenuItem.shouldDisable = function (props) {
    return shouldDisableMenuItem(props.course);
};
export default AssignCourseMenuItem;
