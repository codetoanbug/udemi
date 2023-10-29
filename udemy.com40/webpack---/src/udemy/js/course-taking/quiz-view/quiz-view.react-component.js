import autobind from 'autobind-decorator';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import HotkeyOverlay from 'course-taking/lecture-view/video-viewer/info-overlay/hotkey-overlay.react-component';
import hotkeyRegistry from 'utils/hotkeys';

import {QUIZ_TYPES} from '../curriculum/constants';
import CurriculumItemLoader from '../curriculum/curriculum-item-loader.react-component';
import registers from '../registry/registers';
import requires from '../registry/requires';
import {CodingExercise as CodingExerciseNewUI} from './coding-exercise-ide-like/coding-exercise.react-component.tsx';
import CodingExercise from './coding-exercise/coding-exercise.react-component';
import {HOTKEYS} from './constants';
import PracticeTestPage from './practice-test/practice-test-page.react-component';
import QuizViewStore from './quiz-view.mobx-store';
import SimpleQuizPage from './simple-quiz/simple-quiz-page.react-component';

import './quiz-view.less';

@requires('courseTakingStore')
@registers('quizViewStore')
@observer
export default class QuizView extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.quizViewStore = new QuizViewStore(this.props.courseTakingStore);
        this.ref = React.createRef();
        this.shortcutsMenuItemProps = {
            onClick: this.quizViewStore.showHotkeys,
            renderHotkeyOverlay: this.renderHotkeyOverlay,
        };
    }

    componentDidMount() {
        const {courseTakingStore} = this.props;
        const quizId = this.quizViewStore.quiz.id;
        const isPreviewing = courseTakingStore.isUserInstructor;

        this.quizViewStore.load(quizId, isPreviewing).catch((error) => {
            this.quizViewStore.unload();
            this.quizViewStore.defaultErrorHandler(error);
        });

        if (this.quizViewStore.quiz.quizType !== QUIZ_TYPES.CODING_EXERCISE) {
            hotkeyRegistry.registerMap(this.hotkeys);
        }
    }

    componentWillUnmount() {
        hotkeyRegistry.unregisterMap(this.hotkeys);
    }

    get hotkeys() {
        let nextQuestionLabel;

        if (this.quizViewStore.quiz.quizType === QUIZ_TYPES.SIMPLE_QUIZ) {
            nextQuestionLabel = gettext('Check answer / Next question');
        } else {
            nextQuestionLabel = gettext('Next question');
        }

        return [
            {
                name: gettext('Keyboard shortcuts'),
                key: HOTKEYS.SHOW_HOTKEYS,
                isShowShortcuts: true,
                fn: this.quizViewStore.toggleHotkeys,
            },
            {
                name: gettext('Select answer 1-9'),
                key: HOTKEYS.SELECT_ANSWER_1_TO_9,
            },
            {
                name: nextQuestionLabel,
                key: HOTKEYS.NEXT_QUESTION,
            },
            {
                name: gettext('Skip question'),
                key: HOTKEYS.SKIP_QUESTION,
            },
        ];
    }

    @autobind
    renderHotkeyOverlay() {
        return (
            <HotkeyOverlay
                keyMap={this.hotkeys}
                isOpen={this.quizViewStore.isHotkeyOverlayVisible}
                onClose={this.quizViewStore.hideHotkeys}
                container={this.ref.current}
            />
        );
    }

    renderQuizPage() {
        switch (this.quizViewStore.quiz.quizType) {
            case QUIZ_TYPES.SIMPLE_QUIZ:
                return <SimpleQuizPage />;
            case QUIZ_TYPES.CODING_EXERCISE:
                return this.props.courseTakingStore.isNewCodingExerciseUIEnabled ? (
                    <CodingExerciseNewUI />
                ) : (
                    <CodingExercise />
                );
            case QUIZ_TYPES.PRACTICE_TEST:
                return <PracticeTestPage />;
            default:
                return null;
        }
    }

    render() {
        if (!this.quizViewStore.isLoaded) {
            return <CurriculumItemLoader />;
        }
        return (
            <Provider quizShortcutsMenuItemProps={this.shortcutsMenuItemProps}>
                <div styleName="container" ref={this.ref}>
                    {this.renderQuizPage()}
                </div>
            </Provider>
        );
    }
}
