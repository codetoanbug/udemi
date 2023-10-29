import {Button} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import {Checkbox, FormGroup} from '@udemy/react-form-components';
import {Badge, AlertBanner} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getConfigData from 'utils/get-config-data';

import requires from '../registry/requires';
import BasePage from './base-page.react-component';
import {PAGES} from './constants';
import Question from './question.react-component';
import SubmissionQuestionInput from './submission-question-input.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './practice.less';
import styles from './submission-page.less';
/* eslint-enable no-unused-vars,import/order */

const udConfig = getConfigData();

const SubmissionQuestions = observer(({submission}) => {
    return (
        <FormGroup
            udStyle="fieldset"
            label={gettext('Questions')}
            labelProps={{className: 'ud-sr-only'}}
            styleName="styles.submission-questions"
            validationState={submission.hasError ? 'error' : 'neutral'}
        >
            <div>
                {submission.questions.map((question) => (
                    <SubmissionQuestionInput
                        key={question.id}
                        question={question}
                        isSubmitted={!!submission.submissionTime}
                    />
                ))}
            </div>
        </FormGroup>
    );
});
SubmissionQuestions.propTypes = {
    submission: PropTypes.object.isRequired,
};

@inject('fullscreenStore')
@requires('practiceViewStore')
@observer
export default class SubmissionPage extends Component {
    static propTypes = {
        practiceViewStore: PropTypes.object.isRequired,
        fullscreenStore: PropTypes.object.isRequired,
    };

    @autobind
    getOverlayContainer() {
        return this.props.fullscreenStore.ref || document.body;
    }

    @autobind
    saveHandler() {
        this.props.practiceViewStore.saveDraft();
    }

    @autobind
    @action
    checkboxHandler(event) {
        this.props.practiceViewStore.userSubmission.isPrivate = !event.target.checked;
    }

    @autobind
    @action
    publish(onClose) {
        onClose();
        this.props.practiceViewStore.publishAttempt = true;
        this.props.practiceViewStore.saveDraft();
    }

    get subtitleContents() {
        const {userSubmission} = this.props.practiceViewStore;
        return (
            <>
                {gettext('Save or submit your work')}
                {userSubmission && userSubmission.submissionTime && (
                    <Badge styleName="baseStyles.green-badge">
                        {gettext('Assignment submitted')}
                    </Badge>
                )}
            </>
        );
    }

    render() {
        const {
            getSubmissionPageAnswers,
            userSubmission,
            sendingSave,
        } = this.props.practiceViewStore;

        const areOrgAssignmentsDisabled = !udConfig.features.organization.course_taking
            .student_assignment_submissions_enabled;
        return (
            <BasePage
                onPracticeInitialized={getSubmissionPageAnswers}
                title={gettext('Assignment submission')}
                subtitle={this.subtitleContents}
                pageType={PAGES.SUBMISSION_PAGE}
            >
                {areOrgAssignmentsDisabled && (
                    <AlertBanner
                        showCta={false}
                        title={gettext('Assignment submission is disabled for your organization.')}
                        styleName="baseStyles.mb-md"
                    />
                )}
                {!!userSubmission && (
                    <div styleName="baseStyles.panel baseStyles.question-list">
                        {!userSubmission.questionsAreLoaded ? (
                            <Loader block={true} size="large" />
                        ) : (
                            <form name="assignmentSubmitForm">
                                <SubmissionQuestions submission={userSubmission} />
                                {!areOrgAssignmentsDisabled && (
                                    <Question
                                        question={{
                                            body: gettext('Choose your sharing preference'),
                                        }}
                                    >
                                        <div styleName="styles.sharing-preference">
                                            <Checkbox
                                                disabled={!!userSubmission.submissionTime}
                                                checked={!userSubmission.isPrivate}
                                                onChange={this.checkboxHandler}
                                            >
                                                {gettext(
                                                    'Yes, I want to get feedback from my fellow students.',
                                                )}
                                            </Checkbox>
                                        </div>
                                    </Question>
                                )}
                                {!!userSubmission.submissionTime ||
                                !userSubmission.questionsAreLoaded ? null : (
                                    <div styleName="styles.submission-btns">
                                        <Button
                                            udStyle="secondary"
                                            onClick={this.saveHandler}
                                            disabled={sendingSave}
                                            data-purpose="save-draft-button"
                                        >
                                            {gettext('Save draft')}
                                        </Button>
                                        {areOrgAssignmentsDisabled ? null : (
                                            <ModalTrigger
                                                trigger={
                                                    <Button
                                                        udStyle="secondary"
                                                        disabled={sendingSave}
                                                        data-purpose="submit-button"
                                                    >
                                                        {gettext('Submit')}
                                                    </Button>
                                                }
                                                renderModal={({isOpen, onClose}) => (
                                                    <ConfirmModal
                                                        isOpen={isOpen}
                                                        onCancel={onClose}
                                                        onConfirm={() => this.publish(onClose)}
                                                        confirmText={gettext('Submit')}
                                                        getContainer={this.getOverlayContainer}
                                                    >
                                                        {gettext(
                                                            'You will no longer be able to edit after you submit.',
                                                        )}
                                                    </ConfirmModal>
                                                )}
                                            />
                                        )}
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                )}
            </BasePage>
        );
    }
}
