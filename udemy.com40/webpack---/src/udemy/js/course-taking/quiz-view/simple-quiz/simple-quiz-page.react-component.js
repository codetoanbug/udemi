import {Provider, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import requires from '../../registry/requires';
import {PAGE_TYPES} from './constants';
import QuestionPage from './question/question-page.react-component';
import ResultsPage from './results/results-page.react-component';
import SimpleQuizStore from './simple-quiz.mobx-store';
import StartPage from './start/start-page.react-component';

@requires('courseTakingStore', 'quizViewStore')
@observer
export default class SimpleQuizPage extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.simpleQuizStore = new SimpleQuizStore(
            this.props.courseTakingStore,
            this.props.quizViewStore,
        );
        this.simpleQuizStore.initFromLatestAttempt();
    }

    renderPage() {
        switch (this.simpleQuizStore.currentPage) {
            case PAGE_TYPES.START:
                return <StartPage />;
            case PAGE_TYPES.QUESTION:
                return <QuestionPage />;
            case PAGE_TYPES.RESULTS:
                return <ResultsPage />;
            default:
                return null;
        }
    }

    render() {
        return <Provider simpleQuizStore={this.simpleQuizStore}>{this.renderPage()}</Provider>;
    }
}
