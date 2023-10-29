import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import requires from '../../../registry/requires';
import CompactQuizContainer from '../../compact-quiz-container.react-component';
import QuizPageLayout from '../../quiz-page-layout.react-component';
import PracticeTestSummary from '../practice-test-summary.react-component';
import StartFooter from './start-footer.react-component';
import './start-page.less';

@inject('practiceTestStore')
@requires('quizViewStore')
@observer
export default class StartPage extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.props.practiceTestStore.resetIsStartPageLoaded();
    }

    componentDidMount() {
        this.props.practiceTestStore.ensureStartPageIsLoaded();
    }

    @autobind
    renderBody() {
        const quiz = this.props.quizViewStore.quiz;
        return (
            <CompactQuizContainer>
                <section>
                    <div className="ud-heading-xxl">{quiz.title}</div>
                    <PracticeTestSummary
                        styleName="quiz-info"
                        size="lg"
                        durationHours={quiz.durationHours}
                        durationMinutes={quiz.durationMinutes}
                        numAssessments={quiz.numAssessments}
                        passPercent={quiz.passPercent}
                    />
                    {quiz.description && (
                        <p
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'start-page:quiz-description',
                                html: quiz.description,
                            })}
                        />
                    )}
                </section>
                <hr styleName="divider" />
                <p>{gettext('Instructions:')}</p>
                <ul styleName="instructions">
                    <li>{gettext('You can pause the test at any time and resume later.')}</li>
                    <li>{gettext('You can retake the test as many times as you would like.')}</li>
                    <li>
                        {gettext(
                            'The progress bar at the top of the screen will show your progress as ' +
                                'well as the time remaining in the test. If you run out of time, don’t worry; ' +
                                'you will still be able to finish the test.',
                        )}
                    </li>
                    <li>
                        {gettext('You can skip a question to come back to at the end of the exam.')}
                    </li>
                    <li>
                        {gettext(
                            'You can also use “Mark for review” to come back to questions you ' +
                                'are unsure about before you submit your test.',
                        )}
                    </li>
                    <li>
                        {gettext(
                            'If you want to finish the test and see your results immediately, press the stop button.',
                        )}
                    </li>
                </ul>
            </CompactQuizContainer>
        );
    }

    @autobind
    renderFooter() {
        return <StartFooter />;
    }

    render() {
        return (
            <QuizPageLayout
                isLoading={!this.props.practiceTestStore.isStartPageLoaded}
                renderBody={this.renderBody}
                renderFooter={this.renderFooter}
            />
        );
    }
}
