import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {PACKAGE_PLANS, USER_ROLES} from 'organization-common/constants';
import {hasAllowedPlan, hasAllowedRole, isCoursePublished} from 'organization-common/helpers';
import ResourceContextMenu from 'organization-common/resource-context-menu/resource-context-menu.react-component';

import ContextMenuItem from './context-menu-item.react-component';

@inject('resourceContext', 'resourceContextMenuItemProps')
@observer
export default class FreeCourseMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
        showIcon: PropTypes.bool,
        resourceContextMenuItemProps: PropTypes.object,
    };

    static defaultProps = {
        showIcon: false,
        resourceContextMenuItemProps: {},
    };

    render() {
        return (
            <ContextMenuItem
                icon={null}
                title={gettext('Free course')}
                resourceContextMenuProps={{
                    ...ResourceContextMenu.defaultProps,
                    udStyle: 'secondary',
                }}
                resourceContextMenuItemProps={{
                    ...this.props.resourceContextMenuItemProps,
                    disabled: true,
                }}
            />
        );
    }
}

FreeCourseMenuItem.shouldRender = function (props) {
    const {course} = props;
    return (
        hasAllowedPlan(PACKAGE_PLANS.ENTERPRISE) &&
        hasAllowedRole(USER_ROLES.OWNER, USER_ROLES.ADMIN) &&
        isCoursePublished(course) &&
        course.is_free_for_organization
    );
};
