import {Button, Link} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import requires from '../../registry/requires';
import {TABS} from '../constants';
import QuestionDetails from './question-answer/question-details.react-component';

import './single-question-view.less';

@withRouter
@requires('courseTakingStore', 'questionAnswerStore')
@observer
export default class SingleQuestionView extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
        questionAnswerStore: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.fetchQuestion();
        this.props.questionAnswerStore.singleQuestionSelected = true;
        this.ref.focus();
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.questionId !== prevProps.match.params.questionId) {
            this.fetchQuestion();
        }
    }

    componentWillUnmount() {
        this.props.questionAnswerStore.singleQuestionSelected = false;
    }

    @action
    fetchQuestion() {
        this.hasLoadingError = false;
        const questionId = parseInt(this.props.match.params.questionId, 10);
        return this.props.questionAnswerStore
            .loadQuestion(questionId)
            .then(() => {
                this.props.questionAnswerStore.selectQuestion(questionId);
            })
            .catch(
                action(() => {
                    this.hasLoadingError = true;
                }),
            );
    }

    @observable hasLoadingError = false;

    @autobind
    onBackToAllQuestions() {
        this.props.questionAnswerStore.trackBackToAllQuestions();
    }

    get errorMessage() {
        if (!this.hasLoadingError) {
            return null;
        }
        return (
            <div data-purpose="error-message">
                {gettext('Sorry! This question failed to load.')}
            </div>
        );
    }

    get questionDetails() {
        if (!this.props.questionAnswerStore.activeQuestion) {
            return null;
        }
        return <QuestionDetails />;
    }

    get ariaLabelledby() {
        if (!this.props.questionAnswerStore.activeQuestion) {
            return null;
        }
        return `question-${this.props.questionAnswerStore.activeQuestion.id} question-dialog`;
    }

    render() {
        return (
            <div
                id="question-dialog"
                role="dialog"
                aria-label={gettext('Answers and replies')}
                aria-labelledby={this.ariaLabelledby}
                aria-modal={false}
                tabIndex="-1"
                ref={(ref) => {
                    this.ref = ref;
                }}
            >
                <Button
                    componentClass={Link}
                    to={{hash: `#${TABS.QUESTIONS}`}}
                    styleName="back-link"
                    udStyle="secondary"
                    data-purpose="back-link"
                    onClick={this.onBackToAllQuestions}
                >
                    {gettext('Back to All Questions')}
                </Button>
                {this.errorMessage}
                {this.questionDetails}
            </div>
        );
    }
}
