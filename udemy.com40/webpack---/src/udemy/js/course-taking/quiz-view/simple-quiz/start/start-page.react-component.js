import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import {ITEM_TYPES} from '../../../curriculum/constants';
import CurriculumItemFooter from '../../../curriculum/controls/curriculum-item-footer.react-component';
import NextItemLink from '../../../curriculum/next-item-link.react-component';
import requires from '../../../registry/requires';
import CompactQuizContainer from '../../compact-quiz-container.react-component';
import QuizPageLayout from '../../quiz-page-layout.react-component';

import './start-page.less';

@requires('quizViewStore')
@inject('simpleQuizStore', 'quizShortcutsMenuItemProps')
@observer
export default class StartPage extends Component {
    static propTypes = {
        quizViewStore: PropTypes.object.isRequired,
        simpleQuizStore: PropTypes.object.isRequired,
        quizShortcutsMenuItemProps: PropTypes.object.isRequired,
    };

    @autobind
    renderBody() {
        const {simpleQuizStore, quizViewStore} = this.props;
        const quiz = quizViewStore.quiz;
        return (
            <CompactQuizContainer>
                <section>
                    <div className="ud-heading-xxl">{quiz.title}</div>
                    <div styleName="quiz-info">
                        <span>{interpolate(gettext('Quiz %s'), [quiz.objectIndex])}</span>
                        <span styleName="text-separator">{'|'}</span>
                        <span>
                            {ninterpolate('%s question', '%s questions', quiz.numAssessments)}
                        </span>
                    </div>
                    {quiz.description && (
                        <p
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'start-page:quiz-description',
                                html: quiz.description,
                            })}
                        />
                    )}
                </section>
                <nav styleName="nav">
                    <Button
                        autoFocus={true}
                        disabled={simpleQuizStore.isPreparingNewAttempt}
                        onClick={simpleQuizStore.startOrResumeQuiz}
                        data-purpose="start-or-resume-quiz"
                    >
                        {simpleQuizStore.isTakingQuiz
                            ? gettext('Resume quiz')
                            : gettext('Start quiz')}
                    </Button>
                    {!getIsMobileApp() && (
                        <Button
                            componentClass={NextItemLink}
                            className="ud-link-neutral"
                            udStyle="ghost"
                            data-purpose="next-item"
                        >
                            {gettext('Skip quiz')}
                        </Button>
                    )}
                </nav>
            </CompactQuizContainer>
        );
    }

    @autobind
    renderFooter() {
        return (
            <CurriculumItemFooter
                reportType={ITEM_TYPES.QUIZ}
                reportId={this.props.quizViewStore.quiz.id}
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
            />
        );
    }
}
