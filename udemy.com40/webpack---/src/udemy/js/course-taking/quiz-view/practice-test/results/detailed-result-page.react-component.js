import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import debounce from 'utils/debounce';

import {TRACKING_CATEGORIES, DETAILED_PRACTICE_TEST_RESULTS_ACTIONS} from '../../../constants';
import requires from '../../../registry/requires';
import QuizPageLayout from '../../quiz-page-layout.react-component';
import {PAGE_TYPES} from '../constants';
import DetailedResultPanel from './detailed-result-panel.react-component';
import ResultsFooter from './results-footer.react-component';
import ResultsHeader from './results-header.react-component';

import './detailed-result-page.less';

@withRouter
@inject('practiceTestStore')
@requires('quizViewStore')
@observer
export default class DetailedResultPage extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.props.practiceTestStore.resetDetailedTestResult();
        this.debounceHandleScroll = debounce(this.handleScroll, 2000);
    }

    componentDidMount() {
        const {match, practiceTestStore, quizViewStore} = this.props;
        const id = parseInt(match.params.attemptId, 10) || 0;
        practiceTestStore
            .loadDetailedTestResult(id)
            .then(() => {
                quizViewStore.track('review-questions', {
                    user_attempted_quiz: practiceTestStore.detailedTestResult.id,
                });
                this.props.practiceTestStore.quizViewStore.trackPracticeTestResults(
                    TRACKING_CATEGORIES.DETAILED_PRACTICE_TEST_RESULTS,
                    DETAILED_PRACTICE_TEST_RESULTS_ACTIONS.VIEW_PAGE,
                    {userAttemptedQuizId: practiceTestStore.detailedTestResult.id},
                );
            })
            .catch(practiceTestStore.errorHandler);

        this.scrollContainer.addEventListener('scroll', this.debounceHandleScroll);
    }

    componentWillUnmount() {
        this.scrollContainer.removeEventListener('scroll', this.debounceHandleScroll);
    }

    @autobind
    handleScroll() {
        this.props.practiceTestStore.quizViewStore.trackPracticeTestResults(
            TRACKING_CATEGORIES.DETAILED_PRACTICE_TEST_RESULTS,
            DETAILED_PRACTICE_TEST_RESULTS_ACTIONS.SCROLL_PAGE,
            {userAttemptedQuizId: this.props.practiceTestStore.detailedTestResult.id},
        );
    }

    @autobind
    onClickBack() {
        const expandedResultId = this.props.practiceTestStore.detailedTestResult.id;
        this.props.practiceTestStore.goToResultsPage(expandedResultId);
    }

    @autobind
    setScrollContainerRef(ref) {
        this.scrollContainer = ref;
    }

    @autobind
    renderBody() {
        return (
            <>
                <ResultsHeader pageType={PAGE_TYPES.DETAILED_RESULT} />
                <div styleName="back">
                    <Button udStyle="ghost" onClick={this.onClickBack} data-purpose="back">
                        <PreviousIcon label={false} />
                        {gettext('Return to review')}
                    </Button>
                </div>
                <DetailedResultPanel />
            </>
        );
    }

    @autobind
    renderFooter() {
        return <ResultsFooter />;
    }

    render() {
        return (
            <QuizPageLayout
                pageType={PAGE_TYPES.DETAILED_RESULT}
                isLoading={!this.props.practiceTestStore.detailedTestResult}
                renderBody={this.renderBody}
                renderFooter={this.renderFooter}
                setScrollContainerRef={this.setScrollContainerRef}
                styleName="detailed-result-page"
            />
        );
    }
}
