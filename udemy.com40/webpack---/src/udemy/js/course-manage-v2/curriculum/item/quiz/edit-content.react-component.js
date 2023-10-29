import {Button} from '@udemy/react-core-components';
import {ConfirmModal} from '@udemy/react-dialog-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';
import {showErrorToast} from 'instructor/toasts';

import {
    quizDraftFilterParams,
    quizTypes,
    maxNumOfAssessments as defaultMaxNumOfAssessments,
    maxWarningNumOfAssessments as defaultMaxWarningNumOfAssessments,
} from '../constants';
import AssessmentList from './assessment-list.react-component';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import QuizSettings from './quiz-settings.react-component';
import './quiz-editor.less';

@observer
export default class EditContent extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        canTogglePublishedState: PropTypes.bool.isRequired,
        className: PropTypes.string,
        maxNumOfAssessments: PropTypes.number,
        maxWarningNumOfAssessments: PropTypes.number,
    };

    static defaultProps = {
        className: '',
        maxNumOfAssessments: defaultMaxNumOfAssessments,
        maxWarningNumOfAssessments: defaultMaxWarningNumOfAssessments,
    };

    @autobind
    onToggleIsPublished() {
        const {curriculumItem} = this.props;
        if (curriculumItem.is_published && curriculumItem.is_draft) {
            showErrorToast(gettext('You cannot unpublish with edits that are not live'));
            return;
        }
        curriculumItem
            .partialUpdate(
                {
                    is_published: !curriculumItem.is_published,
                },
                quizDraftFilterParams,
                false,
            )
            .catch(handleUnexpectedAPIError);
    }

    @autobind
    onDeleteAssessmentConfirm() {
        this.props.curriculumItem.deleteAssessment().catch(handleUnexpectedAPIError);
    }

    render() {
        const {
            canTogglePublishedState,
            className,
            curriculumItem,
            maxNumOfAssessments,
            maxWarningNumOfAssessments,
        } = this.props;
        const isPracticeTest = curriculumItem.type === quizTypes.practiceTest;
        const assessments = curriculumItem.assessments || [];
        const hasMaxNumOfAssessments = assessments.length >= maxNumOfAssessments;
        const hasWarningNumOfAssessments = assessments.length >= maxWarningNumOfAssessments;
        return (
            <div className={className} data-purpose="edit-content">
                <div styleName="edit-questions-header">
                    <div styleName="edit-questions-header-left">
                        <div className="ud-text-bold">{gettext('Questions')}</div>
                        {!hasMaxNumOfAssessments && (
                            <Button
                                udStyle="secondary"
                                size="small"
                                data-purpose="new-question-btn"
                                onClick={curriculumItem.openAddContent}
                            >
                                {isPracticeTest
                                    ? gettext('New Question(s)')
                                    : gettext('New Question')}
                            </Button>
                        )}
                    </div>
                    <QuizSettings
                        curriculumItem={curriculumItem}
                        canTogglePublishedState={canTogglePublishedState}
                        onToggleIsPublished={this.onToggleIsPublished}
                    />
                </div>
                {hasMaxNumOfAssessments ? (
                    <AlertBanner
                        udStyle="error"
                        showCta={false}
                        data-purpose="assessment-danger-alert"
                        title={gettext('The maximum number of questions has been reached.')}
                    />
                ) : null}
                {!hasMaxNumOfAssessments && hasWarningNumOfAssessments ? (
                    <AlertBanner
                        udStyle="warning"
                        showCta={false}
                        data-purpose="assessment-warning-alert"
                        title={interpolate(
                            gettext('Note: You can add up to %(limit)s quiz questions.'),
                            {limit: maxNumOfAssessments},
                            true,
                        )}
                    />
                ) : null}
                <AssessmentList curriculumItem={curriculumItem} />
                <ConfirmModal
                    onCancel={curriculumItem.closeDeleteAssessmentConfirmation}
                    onConfirm={this.onDeleteAssessmentConfirm}
                    isOpen={!!curriculumItem.toBeDeletedAssessmentId}
                >
                    {gettext(
                        'You are about to remove a question. Are you sure you want to continue?',
                    )}
                </ConfirmModal>
            </div>
        );
    }
}
