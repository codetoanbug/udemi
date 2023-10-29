import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import RatingStarOutlineIcon from '@udemy/icons/dist/rating-star-outline.ud-icon';
import ReloadIcon from '@udemy/icons/dist/reload.ud-icon';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Tooltip} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import {ITEM_TYPES} from '../../../curriculum/constants';
import CurriculumItemFooter from '../../../curriculum/controls/curriculum-item-footer.react-component';
import NextItemLink from '../../../curriculum/next-item-link.react-component';
import requires from '../../../registry/requires';
import CompactQuizContainer from '../../compact-quiz-container.react-component';
import QuizPageLayout from '../../quiz-page-layout.react-component';
import QuestionList from '../question/question-list.react-component';

import './results-page.less';

@requires('courseTakingStore', 'quizViewStore')
@inject('simpleQuizStore')
@observer
export default class ResultsPage extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
        simpleQuizStore: PropTypes.object.isRequired,
    };

    @autobind
    renderHeader() {
        const {courseTakingStore, simpleQuizStore} = this.props;
        const userPassed = simpleQuizStore.attemptStats.userPassed;
        const questionsCorrect = simpleQuizStore.getQuestionsFromAttemptStats('correct');
        const questionsSkipped = simpleQuizStore.getQuestionsFromAttemptStats('skipped');

        return (
            <header styleName={classNames('header', {'header-fail': !userPassed})}>
                <CompactQuizContainer>
                    {!questionsSkipped.length && userPassed ? (
                        <div styleName="success-icon-container">
                            <span styleName="success-icon">
                                <RatingStarOutlineIcon
                                    label={false}
                                    color="inherit"
                                    size="xlarge"
                                />
                            </span>
                        </div>
                    ) : null}
                    <div
                        styleName="results-title"
                        className={classNames({
                            'ud-heading-xl': !courseTakingStore.isMobileViewportSize,
                            'ud-heading-lg': courseTakingStore.isMobileViewportSize,
                        })}
                        data-purpose="results-title"
                    >
                        {questionsSkipped.length
                            ? gettext('Complete the quiz to see your results.')
                            : userPassed
                            ? gettext('Great job! You are ready to move on to the next lecture.')
                            : gettext('Review the course materials to expand your learning.')}
                    </div>
                    <div
                        className={classNames({
                            'ud-text-md': !courseTakingStore.isMobileViewportSize,
                            'ud-text-sm': courseTakingStore.isMobileViewportSize,
                        })}
                        data-purpose="results-summary"
                    >
                        {interpolate(
                            gettext('You got %(correct)s out of %(total)s correct.'),
                            {
                                correct: questionsCorrect.length,
                                total: simpleQuizStore.attemptStats.numAnsweredQuestions,
                            },
                            true,
                        )}
                        {questionsSkipped.length
                            ? ` ${ninterpolate(
                                  '%s question is skipped.',
                                  '%s questions are skipped.',
                                  questionsSkipped.length,
                              )}`
                            : null}
                    </div>
                </CompactQuizContainer>
            </header>
        );
    }

    @autobind
    renderBody() {
        const {simpleQuizStore} = this.props;
        const questionsWrong = simpleQuizStore.getQuestionsFromAttemptStats('wrong');
        const questionsCorrect = simpleQuizStore.getQuestionsFromAttemptStats('correct');
        const questionsSkipped = simpleQuizStore.getQuestionsFromAttemptStats('skipped');

        const reviewSection = (
            <section>
                {questionsSkipped.length ? (
                    <div styleName="status-section" data-purpose="skipped-section">
                        <div className="ud-text-bold" styleName="result-title">
                            <ReloadIcon label={false} styleName="icon" />
                            <span>{gettext('What you skipped')}</span>
                        </div>
                        <QuestionList questions={questionsSkipped} />
                    </div>
                ) : null}
                {questionsCorrect.length ? (
                    <div styleName="status-section" data-purpose="correct-section">
                        <div className="ud-text-bold" styleName="result-title">
                            <TickIcon label={false} color="positive" styleName="icon" />
                            <span>{gettext('What you know')}</span>
                            <Tooltip
                                placement="right"
                                styleName="icon"
                                trigger={<InfoIcon label={gettext('Get info')} />}
                            >
                                {gettext('These are questions you got right on the first try.')}
                            </Tooltip>
                        </div>
                        <QuestionList questions={questionsCorrect} />
                    </div>
                ) : null}
                {questionsWrong.length ? (
                    <div styleName="status-section" data-purpose="incorrect-section">
                        <div className="ud-text-bold" styleName="result-title">
                            <CloseIcon label={false} color="negative" styleName="icon" />
                            <span>{gettext('What you should review')}</span>
                        </div>
                        <QuestionList questions={questionsWrong} showRelatedLectures={true} />
                    </div>
                ) : null}
            </section>
        );

        return (
            <CompactQuizContainer responsiveFullscreen={true}>{reviewSection}</CompactQuizContainer>
        );
    }

    renderRetryButton() {
        const {courseTakingStore, simpleQuizStore} = this.props;
        const userPassed = simpleQuizStore.attemptStats.userPassed;
        return (
            <Button
                size="small"
                className={!userPassed ? null : 'ud-link-neutral'}
                udStyle={!userPassed ? 'primary' : 'ghost'}
                onClick={simpleQuizStore.retryQuiz}
                data-purpose="retry-button"
            >
                {courseTakingStore.isMediumScreenViewportSize
                    ? gettext('Retry')
                    : gettext('Retry quiz')}
            </Button>
        );
    }

    renderContinueButton() {
        const userPassed = this.props.simpleQuizStore.attemptStats.userPassed;
        return !getIsMobileApp() ? (
            <Button
                componentClass={NextItemLink}
                size="small"
                className={userPassed ? null : 'ud-link-neutral'}
                udStyle={userPassed ? 'primary' : 'ghost'}
                data-purpose="next-item"
            >
                {gettext('Continue')}
            </Button>
        ) : null;
    }

    @autobind
    renderRightButtons() {
        const userPassed = this.props.simpleQuizStore.attemptStats.userPassed;
        return (
            <>
                {userPassed ? this.renderRetryButton() : this.renderContinueButton()}
                {userPassed ? this.renderContinueButton() : this.renderRetryButton()}
            </>
        );
    }

    @autobind
    renderFooter() {
        return (
            <CurriculumItemFooter
                reportType={ITEM_TYPES.QUIZ}
                reportId={this.props.quizViewStore.quiz.id}
                renderRightButtons={this.renderRightButtons}
            />
        );
    }

    render() {
        return (
            <QuizPageLayout
                isLoading={!this.props.simpleQuizStore.attemptStats}
                renderHeader={this.renderHeader}
                renderBody={this.renderBody}
                renderFooter={this.renderFooter}
                styleName="results-page"
            />
        );
    }
}
