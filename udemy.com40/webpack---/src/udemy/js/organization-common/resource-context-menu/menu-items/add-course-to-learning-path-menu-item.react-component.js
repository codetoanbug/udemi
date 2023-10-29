import {withI18n} from '@udemy/i18n';
import AddToGroupIcon from '@udemy/icons/dist/add-to-group.ud-icon';
import {ToasterStore} from '@udemy/react-messaging-components';
import {noop} from '@udemy/shared-utils';
import {withUDData} from '@udemy/ud-data';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import AddCourseToLearningPathModal from 'learning-path/add-course-to-learning-path/add-course-to-learning-path-modal.react-component';
import {PACKAGE_PLANS, RESOURCE_TYPES} from 'organization-common/constants';
import {hasAllowedPlans, isCoursePublished} from 'organization-common/helpers';
import {
    shouldDisableMenuItem,
    trackClickAction,
} from 'organization-common/resource-context-menu/helpers';

import ContextMenuItem from './context-menu-item.react-component';

@inject('resourceContext')
@observer
class InternalAddCourseToLearningPathMenuItem extends React.Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        resourceContext: PropTypes.string.isRequired,
        onActionStart: PropTypes.func,
        onActionEnd: PropTypes.func,
        gettext: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    static defaultProps = {
        onActionStart: noop,
        onActionEnd: noop,
    };

    @observable isLearningPathModalVisible = false;

    shouldRender = () => {
        const {course, udData} = this.props;
        return (
            hasAllowedPlans([PACKAGE_PLANS.ENTERPRISE], {Config: udData.Config}) &&
            udData.Config.features.organization.learning_path.enabled &&
            isCoursePublished(course)
        );
    };

    @action
    closeLearningPathModal = () => {
        this.isLearningPathModalVisible = false;
        this.props.onActionEnd();
    };

    @action
    openLearningPathModal = () => {
        trackClickAction(
            this.props.resourceContext,
            'Add to learning path',
            {
                resourceType: RESOURCE_TYPES.COURSE,
                resourceId: this.props.course.id,
            },
            {
                Config: this.props.udData.Config,
            },
        );
        this.isLearningPathModalVisible = true;
        this.props.onActionStart();
    };

    onCourseAdded = (message) => {
        const alertBannerProps = {
            udStyle: 'success',
            title: message,
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
        const {course, gettext, udData} = this.props;

        return (
            <>
                <ContextMenuItem
                    icon={<AddToGroupIcon label={false} />}
                    onClick={this.openLearningPathModal}
                    title={gettext('Add to learning path')}
                />
                <AddCourseToLearningPathModal
                    courseId={course.id}
                    isVisible={this.isLearningPathModalVisible}
                    onHide={this.closeLearningPathModal}
                    onCourseAdded={this.onCourseAdded}
                    organizationId={udData.Config.brand.organization.id}
                    courseLearningPaths={course.learningPathsIds || []}
                />
            </>
        );
    }
}
const AddCourseToLearningPathMenuItem = withI18n(
    withUDData(InternalAddCourseToLearningPathMenuItem),
);

AddCourseToLearningPathMenuItem.shouldRender = () => true;

AddCourseToLearningPathMenuItem.shouldDisable = function (props) {
    return shouldDisableMenuItem(props.course);
};
export default AddCourseToLearningPathMenuItem;
