import {withI18n} from '@udemy/i18n';
import BarChartIcon from '@udemy/icons/dist/bar-chart.ud-icon';
import {Link} from '@udemy/react-core-components';
import {udLink, withUDData} from '@udemy/ud-data';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {PACKAGE_PLANS, USER_ROLES, RESOURCE_TYPES} from 'organization-common/constants';
import {hasAllowedPlans, hasAllowedRoles} from 'organization-common/helpers';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';

import ContextMenuItem from './context-menu-item.react-component';

@inject('resourceContext')
@observer
class InternalViewCourseActivityMenuItem extends React.Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        resourceContext: PropTypes.string.isRequired,
        isAbsolutePath: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    static defaultProps = {
        isAbsolutePath: true,
    };

    shouldRender = () => {
        const {udData} = this.props;
        return (
            hasAllowedPlans([PACKAGE_PLANS.ENTERPRISE], {Config: udData.Config}) &&
            hasAllowedRoles([USER_ROLES.OWNER, USER_ROLES.ADMIN, USER_ROLES.GROUP_ADMIN], {
                me: udData.me,
            })
        );
    };

    trackClick = () => {
        trackClickAction(
            this.props.resourceContext,
            'View course activity',
            {
                resourceType: RESOURCE_TYPES.COURSE,
                resourceId: this.props.course.id,
            },
            {
                Config: this.props.udData.Config,
            },
        );
    };

    render() {
        if (!this.shouldRender()) {
            return null;
        }

        const {gettext} = this.props;
        let linkTo = udLink.toCourseInsights(this.props.course.id);
        if (!this.props.isAbsolutePath) {
            linkTo = `/course/${this.props.course.id}`;
        }
        return (
            <Link to={linkTo} disableRouter={this.props.isAbsolutePath}>
                <ContextMenuItem
                    icon={<BarChartIcon label={false} />}
                    title={gettext('View course activity')}
                    onClick={this.trackClick}
                />
            </Link>
        );
    }
}
const ViewCourseActivityMenuItem = withI18n(withUDData(InternalViewCourseActivityMenuItem));

ViewCourseActivityMenuItem.shouldRender = () => true;
export default ViewCourseActivityMenuItem;
