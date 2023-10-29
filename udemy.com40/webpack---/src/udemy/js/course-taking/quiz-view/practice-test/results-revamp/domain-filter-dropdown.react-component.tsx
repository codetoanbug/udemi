import {Dropdown} from '@udemy/react-menu-components';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useContext} from 'react';

import {DETAILED_PRACTICE_TEST_RESULTS_ACTIONS, TRACKING_CATEGORIES} from '../../../constants';
import MCQuestion from '../../mc-question.mobx-model';
import PracticeTestStore from '../practice-test.mobx-store';
import TestResultModel from '../results/test-result.mobx-model';

const DomainFilterDropdownComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).practiceTestStore as PracticeTestStore;
    const result = (store.detailedTestResult as unknown) as TestResultModel;

    const knowledgeAreaFilters = () => {
        return [
            ...new Set(
                result?.questions
                    .map((question: MCQuestion) => question.knowledgeArea)
                    .filter(Boolean),
            ),
        ] as string[];
    };

    const onSelect = (filter: string | null) => {
        result.setActiveKnowledgeAreaFilter(filter);
        store.quizViewStore.trackPracticeTestResults(
            TRACKING_CATEGORIES.DETAILED_PRACTICE_TEST_RESULTS,
            DETAILED_PRACTICE_TEST_RESULTS_ACTIONS.CLICK_KNOWLEDGE_AREAS_FILTER,
            {userAttemptedQuizId: result.id},
        );
    };

    const defaultFilter = gettext('All domains');

    return (
        <Dropdown
            placement="bottom-start"
            trigger={
                <Dropdown.Button size={'medium'}>
                    <span className="ud-text-sm">
                        {result.activeKnowledgeAreaFilter || defaultFilter}
                    </span>
                </Dropdown.Button>
            }
        >
            <Dropdown.Menu>
                <Dropdown.MenuItem onClick={() => onSelect(null)}>
                    {defaultFilter}
                </Dropdown.MenuItem>
                {knowledgeAreaFilters().map((filter) => (
                    <Dropdown.MenuItem key={filter} onClick={() => onSelect(filter)}>
                        {filter}
                    </Dropdown.MenuItem>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export const DomainFilterDropdown = observer(DomainFilterDropdownComponent);
