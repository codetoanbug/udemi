import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import hotkeyRegistry from 'utils/hotkeys';
import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

import {ITEM_TYPES} from '../../../curriculum/constants';
import CurriculumItemFooter from '../../../curriculum/controls/curriculum-item-footer.react-component';
import requires from '../../../registry/requires';
import CompactQuizContainer from '../../compact-quiz-container.react-component';
import {ASSESSMENT_TYPES, HOTKEYS} from '../../constants';
import QuizPageLayout from '../../quiz-page-layout.react-component';
import RelatedLecture from '../related-lecture.react-component';
import FeedbackAlert from './feedback-alert.react-component';
import FITBQuizQuestion from './fitb-quiz-question.react-component';
import MCQuizQuestion from './mc-quiz-question.react-component';

@requires('courseTakingStore', 'quizViewStore')
@inject('simpleQuizStore', 'quizShortcutsMenuItemProps')
@observer
export default class QuestionPage extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
        simpleQuizStore: PropTypes.object.isRequired,
        quizShortcutsMenuItemProps: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        const {simpleQuizStore} = this.props;
        simpleQuizStore.setUpResetOnQuestionChange();

        this.hotkeyMap = [
            {
                key: HOTKEYS.NEXT_QUESTION,
                fn: this.onCheckOrNextQuestion,
            },
            {
                key: HOTKEYS.SKIP_QUESTION,
                fn: this.props.simpleQuizStore.skipQuestion,
            },
        ];
    }

    componentDidMount() {
        hotkeyRegistry.registerMap(this.hotkeyMap);
    }

    componentWillUnmount() {
        this.detachKeyhandler && this.detachKeyhandler();
        this.props.simpleQuizStore.disposeResetOnQuestionChange();
        hotkeyRegistry.unregisterMap(this.hotkeyMap);
    }

    @autobind
    onCheckOrNextQuestion() {
        const {quizViewStore, simpleQuizStore} = this.props;
        if (simpleQuizStore.isRevisitingQuestionPage || !quizViewStore.currentQuestion.isAnswered) {
            return;
        }
        if (simpleQuizStore.isCheckedAnswerCorrect) {
            simpleQuizStore.goToNextQuestion();
        } else {
            simpleQuizStore
                .checkAnswer()
                .then(this.scrollToFeedback)
                .catch(simpleQuizStore.errorHandler);
        }
    }

    @autobind
    setScrollContainerRef(ref) {
        this.scrollableContainer = ref;
    }

    @autobind
    scrollToFeedback() {
        this.scrollableContainer &&
            this.scrollableContainer.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
    }

    @autobind
    renderBody() {
        const question = this.props.quizViewStore.currentQuestion;

        return (
            <CompactQuizContainer>
                <FeedbackAlert />
                {question.relatedLecture && question.numAttempts > 0 ? (
                    <RelatedLecture question={question} />
                ) : null}
                {question.assessmentType === ASSESSMENT_TYPES.FILL_IN_THE_BLANK ? (
                    <FITBQuizQuestion question={question} />
                ) : (
                    <MCQuizQuestion question={question} />
                )}
            </CompactQuizContainer>
        );
    }

    renderCounter() {
        const {courseTakingStore, quizViewStore} = this.props;
        const question = quizViewStore.currentQuestion;
        return (
            <span>
                {interpolate(
                    courseTakingStore.isMediumScreenViewportSize
                        ? gettext('%(questionIndex)s of %(numQuestions)s')
                        : gettext('Question %(questionIndex)s of %(numQuestions)s'),
                    {
                        questionIndex: question.questionIndex,
                        numQuestions: quizViewStore.questions.length,
                    },
                    true,
                )}
            </span>
        );
    }

    renderSkipButton() {
        const {courseTakingStore, simpleQuizStore} = this.props;
        if (simpleQuizStore.isCheckedAnswerCorrect || simpleQuizStore.isRevisitingQuestionPage) {
            return null;
        }
        return (
            <Button
                size="small"
                className="ud-link-neutral"
                udStyle="ghost"
                onClick={simpleQuizStore.skipQuestion}
                data-purpose="skip-question-button"
            >
                {courseTakingStore.isMediumScreenViewportSize
                    ? gettext('Skip')
                    : gettext('Skip question')}
            </Button>
        );
    }

    @autobind
    renderLeftButtons() {
        return isMobileBrowser ? this.renderSkipButton() : this.renderCounter();
    }

    @autobind
    renderRightButtons() {
        const {quizViewStore, simpleQuizStore} = this.props;
        const question = quizViewStore.currentQuestion;

        let nextText;
        if (simpleQuizStore.isRevisitingQuestionPage) {
            nextText = gettext('Back to results');
        } else if (!simpleQuizStore.isCheckedAnswerCorrect) {
            nextText = gettext('Check answer');
        } else if (question.questionIndex === quizViewStore.questions.length) {
            nextText = gettext('See results');
        } else {
            nextText = gettext('Next');
        }

        return (
            <>
                {isMobileBrowser ? this.renderCounter() : this.renderSkipButton()}
                {!simpleQuizStore.isRevisitingQuestionPage ? (
                    <Button
                        size="small"
                        onClick={this.onCheckOrNextQuestion}
                        disabled={!question.isAnswered}
                        data-purpose="next-question-button"
                    >
                        {nextText}
                        {simpleQuizStore.isCheckedAnswerCorrect && <NextIcon label={false} />}
                    </Button>
                ) : (
                    <Button
                        size="small"
                        data-purpose="back-to-results-button"
                        onClick={simpleQuizStore.goBackToResultsPage}
                    >
                        {nextText}
                    </Button>
                )}
            </>
        );
    }

    @autobind
    renderFooter() {
        return (
            <CurriculumItemFooter
                reportType={ITEM_TYPES.QUIZ}
                reportId={this.props.quizViewStore.quiz.id}
                renderLeftButtons={this.renderLeftButtons}
                renderRightButtons={this.renderRightButtons}
                shortcutsMenuItemProps={this.props.quizShortcutsMenuItemProps}
            />
        );
    }

    render() {
        return (
            <QuizPageLayout
                isLoading={false}
                renderBody={this.renderBody}
                renderFooter={this.renderFooter}
                setScrollContainerRef={this.setScrollContainerRef}
            />
        );
    }
}
