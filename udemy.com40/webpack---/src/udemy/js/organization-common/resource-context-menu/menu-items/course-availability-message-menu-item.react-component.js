import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {PACKAGE_PLANS, USER_ROLES} from 'organization-common/constants';
import {hasAllowedPlan, hasAllowedRole, isCoursePublished} from 'organization-common/helpers';

import ContextMenuItem from './context-menu-item.react-component';

@inject('resourceContext')
@observer
export default class CourseAvailabilityMessageMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
    };

    render() {
        return (
            <ContextMenuItem
                icon={<InfoIcon label={false} />}
                title={gettext('This course is not available anymore')}
            />
        );
    }
}

CourseAvailabilityMessageMenuItem.shouldRender = function (props) {
    const {course} = props;
    return (
        hasAllowedPlan(PACKAGE_PLANS.ENTERPRISE) &&
        hasAllowedRole(USER_ROLES.OWNER, USER_ROLES.ADMIN, USER_ROLES.GROUP_ADMIN) &&
        !isCoursePublished(course)
    );
};
