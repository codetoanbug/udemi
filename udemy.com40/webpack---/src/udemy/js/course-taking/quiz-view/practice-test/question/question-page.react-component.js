import autobind from 'autobind-decorator';
import {reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import hotkeyRegistry from 'utils/hotkeys';

import {SIDEBAR_CONTENT} from '../../../constants';
import requires from '../../../registry/requires';
import CompactQuizContainer from '../../compact-quiz-container.react-component';
import {HOTKEYS} from '../../constants';
import QuizPageLayout from '../../quiz-page-layout.react-component';
import MCQuizQuestion from '../../simple-quiz/question/mc-quiz-question.react-component';
import {isPracticeTestExperimentEnabled} from '../../utils';
import FinishTestConfirmModal from './finish-test-confirm-modal.react-component';
import PauseTestModal from './pause-test-modal.react-component';
import QuestionFooter from './question-footer.react-component';
import QuestionNavigation from './question-navigation.react-component';
import {RevampQuestion} from './revamp-question.react-component';
import StopTestConfirmModal from './stop-test-confirm-modal.react-component';
import TestTimer from './test-timer.react-component';
import TimesUpConfirmModal from './times-up-confirm-modal.react-component';
import './question-page.less';

@inject('practiceTestStore')
@requires('courseTakingStore', 'quizViewStore')
@observer
export default class QuestionPage extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
    };

    componentDidMount() {
        const {courseTakingStore, quizViewStore, practiceTestStore} = this.props;
        if (!quizViewStore.attempt) {
            // There's redirect logic in PracticeTestPage to handle this, but the QuestionPage
            // mounts before that happens, so we need to make sure the initial render and
            // componentDidMount do not crash.
            return;
        }
        this.isLoadedPromise = practiceTestStore
            .ensureQuestionPageIsLoaded()
            .then(() => {
                if (quizViewStore.questions.length === 0) {
                    practiceTestStore.goToResultsPage();
                } else {
                    practiceTestStore.setCurrentTestQuestion();
                    practiceTestStore.setUpAutoSaveOnQuestionOrAnswersChange();
                    this.onQuestionChangeDisposer = reaction(
                        () =>
                            quizViewStore.currentQuestion ? quizViewStore.currentQuestion.id : null,
                        this.onQuestionChange,
                    );
                    practiceTestStore.timer.initialize();
                    courseTakingStore.setSidebarContentAvailability(
                        SIDEBAR_CONTENT.PRACTICE_TEST_QUESTIONS,
                        true,
                    );
                }
            })
            .catch(practiceTestStore.errorHandler);

        hotkeyRegistry.registerMap(this.hotkeyMap);
    }

    componentWillUnmount() {
        this.isLoadedPromise &&
            this.isLoadedPromise
                .then(() => {
                    // The timer is paused, and the setInterval is cleared, but it is still considered
                    // initialized. It becomes uninitialized as soon as the attempt changes.
                    // It's implemented this way because PracticeTestPage pauses the timer when the user
                    // leaves the test, and it seemed weird for pause to work on an uninitialized timer.
                    this.props.practiceTestStore.timer.pause({save: false});

                    this.props.practiceTestStore.disposeAutoSaveOnQuestionOrAnswersChange();
                    this.onQuestionChangeDisposer && this.onQuestionChangeDisposer();
                })
                .catch(this.props.practiceTestStore.errorHandler);
        this.isLoadedPromise = null;

        this.props.courseTakingStore.setSidebarContentAvailability(
            SIDEBAR_CONTENT.PRACTICE_TEST_QUESTIONS,
            false,
        );

        hotkeyRegistry.unregisterMap(this.hotkeyMap);
    }

    hotkeyMap = [
        {
            key: HOTKEYS.NEXT_QUESTION,
            fn: this.handleNextQuestion,
        },
        {
            key: HOTKEYS.SKIP_QUESTION,
            fn: this.props.practiceTestStore.skipTestQuestion,
        },
    ];

    @autobind
    onQuestionChange() {
        setTimeout(() => {
            if (this.scrollContainer) {
                this.scrollContainer.scrollTop = 0;
            }
        }, 0);
    }

    @autobind
    handleNextQuestion() {
        if (this.props.quizViewStore.currentQuestion.isAnswered) {
            this.props.practiceTestStore.goToNextQuestion();
        }
    }

    @autobind
    setScrollContainerRef(ref) {
        this.scrollContainer = ref;
    }

    @autobind
    onToggleMarkForReview() {
        this.props.practiceTestStore.toggleIsMarkedForReview(
            this.props.quizViewStore.currentQuestion,
        );
    }

    @autobind
    renderHeader() {
        const {courseTakingStore, practiceTestStore} = this.props;
        if (courseTakingStore.isMediumScreenViewportSize && practiceTestStore.isQuestionNavOpen) {
            return null;
        }
        return <TestTimer styleName="timer" />;
    }

    @autobind
    renderBody() {
        const {courseTakingStore, practiceTestStore} = this.props;
        if (courseTakingStore.isMediumScreenViewportSize && practiceTestStore.isQuestionNavOpen) {
            return <QuestionNavigation />;
        }

        return (
            <CompactQuizContainer>
                {isPracticeTestExperimentEnabled() ? (
                    <RevampQuestion
                        question={this.props.quizViewStore.currentQuestion}
                        onToggleMarkForReview={this.onToggleMarkForReview}
                    />
                ) : (
                    <MCQuizQuestion
                        question={this.props.quizViewStore.currentQuestion}
                        onToggleMarkForReview={this.onToggleMarkForReview}
                    />
                )}
                <FinishTestConfirmModal />
                <PauseTestModal />
                <StopTestConfirmModal />
                <TimesUpConfirmModal />
            </CompactQuizContainer>
        );
    }

    @autobind
    renderFooter() {
        return <QuestionFooter />;
    }

    render() {
        return (
            <QuizPageLayout
                isLoading={
                    !this.props.quizViewStore.attempt ||
                    !this.props.quizViewStore.areQuestionsLoaded ||
                    !this.props.quizViewStore.currentQuestion
                }
                renderBody={this.renderBody}
                renderFooter={this.renderFooter}
                renderHeader={this.renderHeader}
                setScrollContainerRef={this.setScrollContainerRef}
                styleName="question-page"
            />
        );
    }
}
