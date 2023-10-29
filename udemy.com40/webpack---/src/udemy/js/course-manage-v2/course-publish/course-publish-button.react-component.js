import {Button} from '@udemy/react-core-components';
import {ModalTrigger} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import InstructorVerificationUserActionEvent, {
    publishEvent as publishInstructorVerificationEvent,
} from 'instructor-verification/events';
import InstructorVerificationAjaxModal from 'instructor-verification/instructor-verification-ajax-modal.react-component';
import VerificationFlowStoreContext, {
    VerificationFlowStateMap,
} from 'instructor-verification/verification-flow-store-context';

import {COURSE_PUBLISH_INSTRUCTOR_VERIFICATION_SOURCE} from './constants';
import CoursePublishModal from './course-publish-modal.react-component';
import CoursePublishUserActionEvent, {publishEvent} from './events';

@observer
export default class CoursePublishButton extends Component {
    static propTypes = {
        publishTitle: PropTypes.string.isRequired,
        publishAction: PropTypes.string.isRequired,
        buttonUrl: PropTypes.string.isRequired,
        courseId: PropTypes.number.isRequired,
        store: PropTypes.object.isRequired,
        className: PropTypes.string,
    };

    static defaultProps = {
        className: undefined,
    };

    static contextType = VerificationFlowStoreContext;

    componentDidMount() {
        this.context.courseId = this.props.courseId;
        this.context.source = COURSE_PUBLISH_INSTRUCTOR_VERIFICATION_SOURCE;
    }

    @autobind
    openModal() {
        publishEvent(
            new CoursePublishUserActionEvent({
                courseId: this.props.courseId,
                state: this.props.publishAction,
                action: 'click',
            }),
        );
        this.props.store.openModal();
        this.props.store.getCourse();
    }

    @autobind
    publishButtonClick() {
        publishEvent(
            new CoursePublishUserActionEvent({
                courseId: this.props.courseId,
                state: this.props.publishAction,
                action: 'click',
            }),
        );
    }

    @autobind
    closeAjaxModal() {
        if (this.context && this.context.store && this.context.store.status) {
            publishInstructorVerificationEvent(
                new InstructorVerificationUserActionEvent({
                    courseId: this.props.courseId,
                    state: VerificationFlowStateMap[this.context.store.status],
                    source: COURSE_PUBLISH_INSTRUCTOR_VERIFICATION_SOURCE,
                    action: 'close',
                    country: null,
                    verificationType: null,
                }),
            );
        }
        this.props.store.pageStore.refreshPublishCourseStatus();
    }

    render() {
        if (!this.props.buttonUrl) {
            return null;
        }
        const {buttonUrl, className, store, publishTitle} = this.props;
        // we are punting on the migration of the instructor verification pages
        // for now
        if (buttonUrl.includes('verification')) {
            return (
                <div key="publish-button" className={className}>
                    {/* TODO: why do we have a context provider without value? */}
                    <VerificationFlowStoreContext.Provider value={null}>
                        <ModalTrigger
                            onClose={this.closeAjaxModal}
                            trigger={
                                <Button udStyle="brand" onClick={this.publishButtonClick}>
                                    {publishTitle}
                                </Button>
                            }
                            renderModal={(props) => (
                                <InstructorVerificationAjaxModal {...props} url={buttonUrl} />
                            )}
                        />
                    </VerificationFlowStoreContext.Provider>
                </div>
            );
        }
        return (
            <div className={className}>
                <Button udStyle="brand" onClick={this.openModal} disabled={store.isModalOpen}>
                    {publishTitle}
                </Button>
                <CoursePublishModal store={store} />
            </div>
        );
    }
}
