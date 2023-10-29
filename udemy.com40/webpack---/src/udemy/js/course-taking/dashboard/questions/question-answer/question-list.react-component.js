import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import requires from '../../../registry/requires';
import QuestionListQuestion from './question-list-question.react-component';
import Question from './question.mobx-model';

import './question-list.less';

@requires('questionAnswerStore')
@observer
export default class QuestionList extends React.Component {
    static propTypes = {
        questionAnswerStore: PropTypes.object.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isFullyLoaded: PropTypes.bool.isRequired,
        hideLoading: PropTypes.bool.isRequired,
        loadMore: PropTypes.func.isRequired,
        showResponses: PropTypes.bool,
        questions: PropTypes.arrayOf(PropTypes.instanceOf(Question)).isRequired,
        areOrgQuestionsDisabled: PropTypes.bool,
    };

    static defaultProps = {
        showResponses: false,
        areOrgQuestionsDisabled: false,
    };

    ref = React.createRef();
    get questionList() {
        const qList = [];
        this.props.questions.forEach((question, index) => {
            const extraParams = {};
            const isNextFocus = this.props.questionAnswerStore.questionRefIndex === index;
            if (isNextFocus) {
                extraParams.innerRef = this.ref;
            }
            qList.push(
                <QuestionListQuestion
                    key={question.id}
                    question={question}
                    showResponses={this.props.showResponses}
                    trackAction={this.props.questionAnswerStore.trackAction}
                    activeQuestion={this.props.questionAnswerStore.activeQuestion}
                    {...extraParams}
                />,
            );
        });
        return qList;
    }

    @autobind
    loadQuestionsAndFocus() {
        const qSize = this.props.questions.length;
        this.props.questionAnswerStore.setRefIndex(qSize);
        this.props.loadMore().then(() => {
            setTimeout(() => {
                this.setFocusToFirstQuestionAfterReloading();
            });
        });
    }

    get loadMoreButton() {
        const {isFullyLoaded, isLoading} = this.props;
        if (isFullyLoaded || isLoading) {
            return null;
        }
        return (
            <div styleName="load-more">
                <Button
                    udStyle="secondary"
                    onClick={this.loadQuestionsAndFocus}
                    data-purpose="load-more"
                    styleName="load-more-button"
                >
                    {gettext('See more')}
                </Button>
            </div>
        );
    }

    setFocusToFirstQuestionAfterReloading() {
        if (this.ref.current) {
            this.ref.current.focus();
        }
    }

    render() {
        const {isLoading, hideLoading} = this.props;
        return (
            <div>
                <div data-purpose="list">
                    {this.questionList}
                    {isLoading && !hideLoading && (
                        <Loader block={true} size="xxlarge" styleName="loader" />
                    )}
                </div>
                {this.loadMoreButton}
            </div>
        );
    }
}
