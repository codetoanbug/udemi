import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {getParamValueAsInt, getQueryParams} from 'utils/query-params';

import requires from '../../../registry/requires';
import QuizPageLayout from '../../quiz-page-layout.react-component';
import {PAGE_TYPES} from '../constants';
import ChangelogModal from './changelog-modal.react-component';
import ResultsFooter from './results-footer.react-component';
import ResultsGroup from './results-group.react-component';
import ResultsHeader from './results-header.react-component';

@withRouter
@inject('practiceTestStore')
@requires('quizViewStore')
@observer
export default class ResultsPage extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        practiceTestStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
    };

    componentDidMount() {
        const {practiceTestStore, quizViewStore, location} = this.props;
        const queryParams = getQueryParams(location);
        const expandedParam = getParamValueAsInt(queryParams.expanded, 0);
        practiceTestStore
            .loadTestResults()
            .then(() => {
                let initiallyExpandedResult = null;
                if (expandedParam) {
                    initiallyExpandedResult = practiceTestStore.testResults.find((result) => {
                        return result.id === expandedParam;
                    });
                }
                if (!initiallyExpandedResult) {
                    initiallyExpandedResult = practiceTestStore.firstTestResult;
                }
                if (initiallyExpandedResult) {
                    if (!initiallyExpandedResult.isExpanded) {
                        this._ensureHistorySet();
                        practiceTestStore.toggleIsExpandedForResult(initiallyExpandedResult);
                    }
                    quizViewStore.track('viewed-result-page', {
                        user_attempted_quiz: initiallyExpandedResult.id,
                    });
                }
            })
            .catch(practiceTestStore.errorHandler);
    }

    @autobind
    _ensureHistorySet() {
        // FIXME https://udemyjira.atlassian.net/browse/TE-2626 - attempt to prevent race condition
        if (this.props.practiceTestStore.isHistoryNotSet) {
            this.props.practiceTestStore.setHistory(this.props.history);
        }
    }

    @autobind
    getScrollContainer() {
        return this.scrollContainer;
    }

    @autobind
    setScrollContainerRef(ref) {
        this.scrollContainer = ref;
    }

    @autobind
    renderBody() {
        return (
            <>
                <ResultsHeader pageType={PAGE_TYPES.RESULTS} />
                {this.props.practiceTestStore.testResultsByVersion.map((versionGroup, i) => (
                    <ResultsGroup
                        key={versionGroup.version}
                        getScrollContainer={this.getScrollContainer}
                        versionGroup={versionGroup}
                        versionIndex={i}
                    />
                ))}
                <ChangelogModal />
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
                isLoading={!this.props.practiceTestStore.areTestResultsLoaded}
                renderBody={this.renderBody}
                renderFooter={this.renderFooter}
                setScrollContainerRef={this.setScrollContainerRef}
            />
        );
    }
}
