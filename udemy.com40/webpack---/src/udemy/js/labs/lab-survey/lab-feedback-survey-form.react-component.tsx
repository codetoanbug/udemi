import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {AnyObject} from '@udemy/shared-utils/types';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import SurveyQuestion from 'survey/survey-question.react-component';
import SurveyStore from 'survey/survey.mobx-store';

import {ISSUE_DETAILS_NOTE, LAB_SURVEY_CODES} from './constants';
import {getSupportLink} from './utils';

import './lab-report-issue-modal.less';

interface LabFeedbackSurveyFormProps {
    surveyStore: SurveyStore;
    onSurveySubmitted: () => void;
    onCancel: () => void;
    selectedSurvey: string;
}

@observer
export class LabFeedbackSurveyForm extends React.Component<LabFeedbackSurveyFormProps> {
    @observable isLoading = false;
    @observable shouldCheckInputs = false;

    @computed
    get isSurveyFilled() {
        const {surveyStore} = this.props;

        return (
            surveyStore.questionSets.length > 0 &&
            surveyStore.questionSets[0].questions.every((question: {id: number | string}) =>
                this.isQuestionAnswered(question.id),
            )
        );
    }

    @computed
    get shouldDisplayInputError() {
        return this.shouldCheckInputs && !this.isSurveyFilled;
    }

    isQuestionAnswered(questionId: number | string) {
        const {surveyStore} = this.props;
        return !!(surveyStore.userAnswers as AnyObject)[questionId as number | string];
    }

    formGroupProps(question: {id: number | string; question_type: string}) {
        if (!this.isQuestionAnswered(question.id) && this.shouldDisplayInputError) {
            if (question.question_type === 'choice__dropdown') {
                return {
                    note: gettext('Select an option'),
                    validationState: 'error',
                };
            }
            return {
                note: gettext('This field is required'),
                validationState: 'error',
            };
        }
        if (
            this.props.selectedSurvey === LAB_SURVEY_CODES.CONTENT_FEEDBACK &&
            question.question_type !== 'choice__dropdown'
        ) {
            return {
                note: (
                    <LocalizedHtml
                        html={ISSUE_DETAILS_NOTE[LAB_SURVEY_CODES.CONTENT_FEEDBACK].text}
                        interpolate={{
                            helpCenterUrl: (
                                <a
                                    href={getSupportLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        }}
                    />
                ),
            };
        }
    }

    @autobind
    @action
    async onSubmit() {
        this.shouldCheckInputs = true;
        if (!this.isSurveyFilled) {
            return;
        }
        try {
            this.setIsLoading(true);
            await this.props.onSurveySubmitted();
        } catch (error) {
            // the error is displayed in the LabReportIssueModal component
        } finally {
            this.setIsLoading(false);
        }
    }

    @autobind
    @action
    setIsLoading(value: boolean) {
        this.isLoading = value;
    }

    renderQuestions() {
        const {surveyStore} = this.props;
        return surveyStore.questionSets[0].questions.map(
            (question: {id: React.Key; question_type: string}) => {
                const formGroupProps = this.formGroupProps(question);
                return (
                    <SurveyQuestion
                        key={question.id}
                        question={question}
                        surveyStore={surveyStore}
                        formGroupProps={formGroupProps}
                    />
                );
            },
        );
    }

    renderFooter() {
        return (
            <FooterButtons>
                <Button onClick={this.props.onCancel} udStyle="ghost">
                    {gettext('Cancel')}
                </Button>
                <Button disabled={this.isLoading} onClick={this.onSubmit}>
                    {gettext('Submit')}
                </Button>
            </FooterButtons>
        );
    }

    render() {
        return (
            <>
                {this.renderQuestions()}
                {this.renderFooter()}
            </>
        );
    }
}
