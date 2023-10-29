import AccessTimeIcon from '@udemy/icons/dist/access-time.ud-icon';
import PauseIcon from '@udemy/icons/dist/pause.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Duration, formatDuration} from '@udemy/react-date-time-components';
import {Meter} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import requires from '../../../registry/requires';

import './test-timer.less';

@inject('practiceTestStore')
@requires('quizViewStore')
@observer
export default class TestTimer extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
        className: PropTypes.string,
    };

    static defaultProps = {
        className: null,
    };

    @autobind
    onClickPause() {
        const {practiceTestStore, quizViewStore} = this.props;
        if (practiceTestStore.timer.isPaused) {
            practiceTestStore.timer.unpause();
        } else {
            practiceTestStore.timer.pause();
            quizViewStore.track('pause-test');
        }
    }

    renderTimeRemaining(timer) {
        const time = formatDuration(
            {
                numSeconds: Math.abs(timer.timeRemaining),
                presentationStyle: Duration.STYLE.TIMESTAMP,
                precision: Duration.PRECISION.MINUTES,
            },
            {gettext, interpolate},
        );
        return (
            <div
                styleName={classNames('timer', {'timer-expired': timer.timeRemaining < 0})}
                data-purpose={timer.timeRemaining < 0 ? 'timer-expired' : null}
            >
                <div data-purpose="time-remaining">{time}</div>
                {/* Spacer keeps the timer width consistent (4:44 is wider than 1:11). */}
                <div aria-hidden={true} styleName="timer-spacer">
                    {time.replace(/\d/g, '4')}
                </div>
            </div>
        );
    }

    render() {
        const {className, practiceTestStore, quizViewStore} = this.props;
        const timer = practiceTestStore.timer;
        if (!timer.isInitialized) {
            return null;
        }

        const isMobileApp = getIsMobileApp();
        const numQuestions = quizViewStore.questions.length;
        const questionIndex = quizViewStore.currentQuestion.questionIndex;
        const progressPercent = Math.floor((100 * (questionIndex - 1)) / (numQuestions - 1));

        return (
            <div
                className={classNames(className, 'ud-text-lg')}
                styleName={isMobileApp ? 'wrapper wrapper-mobile-app' : 'wrapper'}
            >
                <div styleName="inner">
                    <span
                        className="ud-text-md"
                        styleName="question-count"
                        data-purpose="question-count"
                    >
                        {`${questionIndex}/${numQuestions}`}
                    </span>
                    <Meter
                        styleName="quiz-progress"
                        value={progressPercent}
                        min={0}
                        max={100}
                        label={gettext('%(percent)s% complete')}
                    />
                    <AccessTimeIcon
                        label={false}
                        size="medium"
                        styleName={classNames('clock', {'timer-expired': timer.timeRemaining < 0})}
                        data-purpose={timer.timeRemaining < 0 ? 'timer-expired-icon' : ''}
                    />
                    {this.renderTimeRemaining(timer)}
                    <Button
                        udStyle="ghost"
                        size="xsmall"
                        className="ud-link-neutral"
                        onClick={this.onClickPause}
                        data-purpose="pause"
                    >
                        <PauseIcon label={gettext('Pause')} size="medium" styleName="pause" />
                    </Button>
                    <Button
                        udStyle="ghost"
                        size="xsmall"
                        className="ud-link-neutral ud-link-underline"
                        onClick={practiceTestStore.showStopTestConfirmation}
                        data-purpose="stop"
                    >
                        {gettext('Finish test')}
                    </Button>
                </div>
            </div>
        );
    }
}
