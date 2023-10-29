import {withI18n} from '@udemy/i18n';
import AddToGroupIcon from '@udemy/icons/dist/add-to-group.ud-icon';
import {ToasterStore} from '@udemy/react-messaging-components';
import {safelySetInnerHTML} from '@udemy/shared-utils';
import {withUDData} from '@udemy/ud-data';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {PACKAGE_PLANS, USER_ROLES, RESOURCE_TYPES} from 'organization-common/constants';
import {hasAllowedPlans, hasAllowedRoles, isCoursePublished} from 'organization-common/helpers';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import AddCourseToCustomCategoryModal from 'organization-manage-courses/custom-category/add-course-to-custom-category-modal.react-component';

import ContextMenuItem from './context-menu-item.react-component';

@inject('resourceContext')
@observer
class InternalAddCourseToCustomCategoryMenuItem extends React.Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        resourceContext: PropTypes.string.isRequired,
        title: PropTypes.string,
        showIcon: PropTypes.bool,
        udData: PropTypes.object.isRequired,
        gettext: PropTypes.func.isRequired,
    };

    static defaultProps = {
        title: '',
        showIcon: true,
    };

    @observable isCustomCategoryModalVisible = false;

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
    handleClick = () => {
        const {course, udData, resourceContext} = this.props;
        trackClickAction(
            resourceContext,
            'Add to custom category',
            {
                resourceType: RESOURCE_TYPES.COURSE,
                resourceId: course.id,
            },
            {
                Config: udData.Config,
            },
        );
        this.isCustomCategoryModalVisible = true;
    };

    @action
    closeCustomCategoryModal = () => {
        this.isCustomCategoryModalVisible = false;
    };

    onCourseAdded = (message) => {
        const messageComponent = (
            <div
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'add_course_to_custom_category_menu_item:on_course_added',
                    html: message,
                })}
            ></div>
        );
        const alertBannerProps = {
            udStyle: 'success',
            title: messageComponent,
            body: '',
            showCta: false,
        };
        ToasterStore.addAlertBannerToast(alertBannerProps, {
            autoDismiss: true,
            autoDismissTimeout: 5000,
        });
    };

    render() {
        if (!this.shouldRender()) {
            return null;
        }
        const {course, title, showIcon, udData, gettext} = this.props;
        return (
            <>
                <ContextMenuItem
                    icon={showIcon && <AddToGroupIcon label={false} />}
                    title={title || gettext('Add to custom category')}
                    onClick={this.handleClick}
                />
                <AddCourseToCustomCategoryModal
                    courseCustomCategories={course.customCategoryIds}
                    courseId={course.id}
                    isOpen={this.isCustomCategoryModalVisible}
                    onClose={this.closeCustomCategoryModal}
                    onCourseAdded={this.onCourseAdded}
                    organizationId={udData.Config.brand.organization.id}
                />
            </>
        );
    }
}

const AddCourseToCustomCategoryMenuItem = withI18n(
    withUDData(InternalAddCourseToCustomCategoryMenuItem),
);

AddCourseToCustomCategoryMenuItem.shouldRender = () => true;
export default AddCourseToCustomCategoryMenuItem;
