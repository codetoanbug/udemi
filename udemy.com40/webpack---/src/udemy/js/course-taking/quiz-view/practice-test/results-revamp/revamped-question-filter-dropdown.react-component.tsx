import {Dropdown} from '@udemy/react-menu-components';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useContext} from 'react';

import {DETAILED_PRACTICE_TEST_RESULTS_ACTIONS, TRACKING_CATEGORIES} from '../../../constants';
import PracticeTestStore from '../practice-test.mobx-store';
import {RESULT_QUESTION_FILTERS} from '../question/question-filters';
import TestResultModel from '../results/test-result.mobx-model';

const RevampedQuestionFilterDropdownComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).practiceTestStore as PracticeTestStore;
    const result = (store.detailedTestResult as unknown) as TestResultModel;
    const filters = RESULT_QUESTION_FILTERS as Record<string, {label: string}>;

    const onSelect = (filterKey: string) => {
        result.setActiveQuestionFilterKey(filterKey);
        store.quizViewStore.trackPracticeTestResults(
            TRACKING_CATEGORIES.DETAILED_PRACTICE_TEST_RESULTS,
            DETAILED_PRACTICE_TEST_RESULTS_ACTIONS.CLICK_QUESTION_TYPE_FILTER,
            {userAttemptedQuizId: result.id},
        );
    };
    return (
        <Dropdown
            placement="bottom-start"
            trigger={
                <Dropdown.Button size={'medium'}>
                    <span className="ud-text-sm">
                        {filters[result.activeQuestionFilterKey].label}
                    </span>
                </Dropdown.Button>
            }
        >
            <Dropdown.Menu>
                {Object.keys(RESULT_QUESTION_FILTERS).map((key) => (
                    <Dropdown.MenuItem key={key} onClick={() => onSelect(key)}>
                        {filters[key].label}
                    </Dropdown.MenuItem>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export const RevampedQuestionFilterDropdown = observer(RevampedQuestionFilterDropdownComponent);
