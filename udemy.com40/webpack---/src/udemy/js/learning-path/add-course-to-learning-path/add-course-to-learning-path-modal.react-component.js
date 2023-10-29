import {Tracker} from '@udemy/event-tracking';
import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {COURSE_CONTENT_TYPE} from 'learning-path/learning-path-page/constants';
import {LearningPathContentItemAddEvent} from 'learning-path/tracking-events';
import {RETIREMENT_ALERT_MODAL_TYPES} from 'organization-common/course-retirement/constants';
import CourseRetirementModalAlert from 'organization-common/course-retirement/course-retirement-modal-alert.react-component';
import {noop} from 'utils/noop';
import udMe from 'utils/ud-me';

import styles from './add-course-to-learning-path-modal.less';
import AddCourseToLearningPathStore from './add-course-to-learning-path.mobx-store';
import LearningPathSelectionForm from './learning-path-selection-form.react-component';

/**
 * A modal component that allows users to add a course to one or more learning paths.
 *
 * Note: This component is part of the ContextMenu component.
 */
@observer
class InternalAddCourseToLearningPathModal extends React.Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        organizationId: PropTypes.number.isRequired,
        courseId: PropTypes.number.isRequired,
        onCourseAdded: PropTypes.func,
        gettext: PropTypes.func.isRequired,
        interpolate: PropTypes.func.isRequired,
        ninterpolate: PropTypes.func.isRequired,
    };

    static defaultProps = {
        onCourseAdded: noop,
    };

    constructor(props) {
        super(props);
        this.store = new AddCourseToLearningPathStore(props.organizationId, props.courseId, {
            ninterpolate: props.ninterpolate,
        });
    }

    exitHandler = () => {
        this.store.resetModal();
        this.props.onHide();
    };

    addCourse = async () => {
        const successMessage = await this.store.addCourse();
        if (successMessage) {
            this.store.selectedPaths.forEach((path) => {
                Tracker.publishEvent(
                    new LearningPathContentItemAddEvent({
                        userRole: udMe.organization.role,
                        pathId: path.id,
                        contentItemType: COURSE_CONTENT_TYPE,
                        pageName: 'add_to_learning_path_modal',
                    }),
                );
            });

            this.exitHandler();
            this.props.onCourseAdded(successMessage);
        }
    };

    renderBody() {
        const {gettext} = this.props;
        if (this.store.isLoading) {
            return <MainContentLoader />;
        }

        return (
            <FormGroup
                udStyle="fieldset"
                label={gettext('Which learning path would you like this course to be added to?')}
            >
                <LearningPathSelectionForm
                    onSelect={this.store.toggleLearningPath}
                    learningPaths={this.store.learningPaths}
                    addCourseToLearningPathStore={this.store}
                />
            </FormGroup>
        );
    }

    renderErrorMessage() {
        if (!this.store.errorMessage) {
            return null;
        }

        return <AlertBanner udStyle="error" title={this.store.errorMessage} />;
    }

    renderDuplicationTitles() {
        return (
            <ul className={styles['duplicate-list']}>
                {this.store.duplicatedCoursePaths.map((path) => {
                    return <li key={path.id}>{path.title}</li>;
                })}
            </ul>
        );
    }

    renderCourseNotice() {
        const {gettext} = this.props;
        if (this.store.duplicatedCoursePaths.length > 0) {
            const alertContext = (
                <div className={styles['notice-context']}>
                    <div>
                        {gettext('This course has already been added to the following paths:')}
                    </div>
                    <div>{this.renderDuplicationTitles()}</div>
                    <div>{gettext('Are you sure you want to add it again?')}</div>
                </div>
            );
            return (
                <div className={styles['notice-container']}>
                    <AlertBanner udStyle="warning" showCta={false} title={alertContext} />
                </div>
            );
        }
        return null;
    }

    fetchLearningPathsData = () => {
        return this.store.fetchLearningPathData();
    };

    getRetirementAlertTitle = (date) => {
        const {interpolate, gettext} = this.props;
        return interpolate(
            gettext(
                'This course is set to be retired and will be automatically removed from your path ' +
                    'on %(retirementDate)s. Learners enrolled in this course won’t lose access to it.',
            ),
            {retirementDate: date},
            true,
        );
    };

    render() {
        const {courseId, isVisible, gettext} = this.props;
        const submitTitle = gettext('Add to path');

        return (
            <Modal
                title={gettext('Add to learning path')}
                isOpen={isVisible}
                onOpen={this.fetchLearningPathsData}
                onClose={this.exitHandler}
            >
                <CourseRetirementModalAlert
                    courseId={courseId}
                    getTitle={this.getRetirementAlertTitle}
                    modalType={RETIREMENT_ALERT_MODAL_TYPES.ADD_TO_PATH}
                    isSubmitting={this.store.isSubmitting}
                />
                {this.renderErrorMessage()}
                {this.renderBody()}
                {this.renderCourseNotice()}

                <FooterButtons>
                    <Button
                        udStyle="ghost"
                        onClick={this.exitHandler}
                        data-purpose="add-to-path-cancel-button"
                    >
                        {gettext('Cancel')}
                    </Button>
                    <Button
                        disabled={this.store.isSubmitting || this.store.selectedPaths.length === 0}
                        data-purpose="add-to-path"
                        onClick={this.addCourse}
                    >
                        {this.store.isSubmitting ? `${submitTitle}...` : submitTitle}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}

const AddCourseToLearningPathModal = withI18n(InternalAddCourseToLearningPathModal);
export default AddCourseToLearningPathModal;
