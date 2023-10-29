import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {Button} from '@udemy/react-core-components';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useContext, useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';

import debounce from 'utils/debounce';

import {DETAILED_PRACTICE_TEST_RESULTS_ACTIONS, TRACKING_CATEGORIES} from '../../../constants';
import requires from '../../../registry/requires';
import QuizPageLayout from '../../quiz-page-layout.react-component';
import {PAGE_TYPES} from '../constants';
import PracticeTestStore from '../practice-test.mobx-store';
import ResultsFooter from '../results/results-footer.react-component';
import ResultsHeader from '../results/results-header.react-component';
import {DomainFilterDropdown} from './domain-filter-dropdown.react-component';
import {ResultBadges} from './result-badges.react-component';
import {RevampedQuestionFilterDropdown} from './revamped-question-filter-dropdown.react-component';
import styles from './revamped-result-page.less';
import {RevampedResultPanel} from './revamped-result-panel.react-component';

const RevampedResultPageComponent: React.FC = (props: any) => {
    const store = useContext(MobXProviderContext).practiceTestStore as PracticeTestStore;
    const {match, quizViewStore} = props;

    // @ts-expect-error PracticeTestStore is not typed yet
    const expandedResultId = store.detailedTestResult?.id ?? null;
    // @ts-expect-error PracticeTestStore is not typed yet
    const attemptCount = store.detailedTestResult?.number ?? null;

    const [scrollContainer, setScrollContainer] = useState<HTMLDivElement>();

    const onClickBack = () => {
        store.goToResultsPage(expandedResultId);
    };

    const handleScroll = () => {
        quizViewStore.trackPracticeTestResults(
            TRACKING_CATEGORIES.DETAILED_PRACTICE_TEST_RESULTS,
            DETAILED_PRACTICE_TEST_RESULTS_ACTIONS.SCROLL_PAGE,
            {userAttemptedQuizId: expandedResultId},
        );
    };
    const debounceHandleScroll = debounce(handleScroll, 2000);

    useEffect(
        (() => {
            const id = parseInt(match.params.attemptId, 10) || 0;

            store
                .loadDetailedTestResult(id)
                .then(() => {
                    quizViewStore.track('review-questions', {
                        user_attempted_quiz: expandedResultId,
                    });
                    store.quizViewStore.trackPracticeTestResults(
                        TRACKING_CATEGORIES.DETAILED_PRACTICE_TEST_RESULTS,
                        DETAILED_PRACTICE_TEST_RESULTS_ACTIONS.VIEW_PAGE,
                        {userAttemptedQuizId: expandedResultId},
                    );
                })
                .catch(store.errorHandler);

            return () => {
                scrollContainer?.removeEventListener('scroll', debounceHandleScroll);
            };
        }) as VoidFunction,
        [],
    );

    useEffect(() => {
        scrollContainer?.addEventListener('scroll', debounceHandleScroll);
    }, [debounceHandleScroll, scrollContainer]);

    const renderBody = () => (
        <>
            <ResultsHeader pageType={PAGE_TYPES.DETAILED_RESULT} />
            <div className={styles.back}>
                <Button udStyle="ghost" onClick={onClickBack} data-purpose="back">
                    <PreviousIcon label={false} />
                    {gettext('Back to result overview')}
                </Button>
            </div>
            <span className={'ud-heading-lg'}>
                {gettext('Attempt')} {attemptCount}
            </span>
            <div className={styles['filter-area']}>
                <div className={styles.filters}>
                    <DomainFilterDropdown />
                    <RevampedQuestionFilterDropdown />
                </div>
                <ResultBadges />
            </div>

            <RevampedResultPanel />
            <div className={styles.back}>
                <Button udStyle="ghost" onClick={onClickBack} data-purpose="back">
                    <PreviousIcon label={false} />
                    {gettext('Back to result overview')}
                </Button>
            </div>
        </>
    );

    const renderFooter = () => {
        return <ResultsFooter />;
    };

    return (
        <QuizPageLayout
            pageType={PAGE_TYPES.DETAILED_RESULT}
            isLoading={!store.detailedTestResult}
            renderBody={renderBody}
            renderFooter={renderFooter}
            setScrollContainerRef={setScrollContainer}
            className={styles['revamped-result-page']}
        />
    );
};

export const RevampedResultPage = withRouter(
    requires('quizViewStore')(observer(RevampedResultPageComponent)),
);
