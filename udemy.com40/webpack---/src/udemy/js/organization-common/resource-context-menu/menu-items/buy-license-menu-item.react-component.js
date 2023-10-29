import NewIcon from '@udemy/icons/dist/new.ud-icon';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {PACKAGE_PLANS, USER_ROLES, RESOURCE_TYPES} from 'organization-common/constants';
import {hasAllowedPlan, hasAllowedRole, isCoursePublished} from 'organization-common/helpers';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import BuyLicensesModal from 'organization-manage-courses/imported-courses/buy-licenses-modal.react-component';
import ImportedCoursesStore from 'organization-manage-courses/imported-courses/imported-courses.mobx-store';
import getConfigData from 'utils/get-config-data';

import ContextMenuItem from './context-menu-item.react-component';

const udConfig = getConfigData();

@inject('resourceContext')
@observer
export default class BuyLicensesMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
        course: PropTypes.object.isRequired,
        showIcon: PropTypes.bool,
    };

    static defaultProps = {
        showIcon: false,
    };

    constructor(props) {
        super(props);
        this.organizationId = udConfig.brand.organization.id;
        this.importedCoursesStore = new ImportedCoursesStore(this.organizationId);
    }

    @autobind
    handleClick() {
        const {course} = this.props;
        this.importedCoursesStore.openBuyLicensesModal(course);
        trackClickAction(this.props.resourceContext, 'Buy licenses', {
            resourceType: RESOURCE_TYPES.COURSE,
            resourceId: this.props.course.id,
        });
    }

    render() {
        const {course} = this.props;
        return (
            <>
                <ContextMenuItem
                    icon={this.props.showIcon && <NewIcon label={false} />}
                    title={gettext('Buy licenses')}
                    onClick={this.handleClick}
                />
                <BuyLicensesModal
                    course={course}
                    importedCoursesStore={this.importedCoursesStore}
                />
            </>
        );
    }
}

BuyLicensesMenuItem.shouldRender = function (props) {
    const {course} = props;

    return (
        hasAllowedPlan(PACKAGE_PLANS.ENTERPRISE) &&
        hasAllowedRole(USER_ROLES.OWNER, USER_ROLES.ADMIN) &&
        isCoursePublished(course) &&
        !course.is_free_for_organization &&
        !!course.price_detail
    );
};
