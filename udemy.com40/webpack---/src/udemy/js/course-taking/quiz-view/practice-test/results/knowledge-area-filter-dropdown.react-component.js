import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './knowledge-area-filter-dropdown.less';
import {TRACKING_CATEGORIES, DETAILED_PRACTICE_TEST_RESULTS_ACTIONS} from '../../../constants';

@inject('practiceTestStore')
@observer
export default class KnowledgeAreaFilterDropdown extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
    };

    @computed
    get knowledgeAreaFilters() {
        return [
            ...new Set(
                this.props.practiceTestStore.detailedTestResult.questions
                    .map((question) => question.knowledgeArea)
                    .filter(Boolean),
            ),
        ];
    }

    @autobind
    onSelect(filter) {
        this.props.practiceTestStore.detailedTestResult.setActiveKnowledgeAreaFilter(filter);
        this.props.practiceTestStore.quizViewStore.trackPracticeTestResults(
            TRACKING_CATEGORIES.DETAILED_PRACTICE_TEST_RESULTS,
            DETAILED_PRACTICE_TEST_RESULTS_ACTIONS.CLICK_KNOWLEDGE_AREAS_FILTER,
            {userAttemptedQuizId: this.props.practiceTestStore.detailedTestResult.id},
        );
    }

    render() {
        if (this.knowledgeAreaFilters.length <= 1) {
            return null;
        }
        const result = this.props.practiceTestStore.detailedTestResult;
        const defaultFilter = gettext('All knowledge areas');
        return (
            <Dropdown
                placement="bottom-start"
                trigger={
                    <Dropdown.Button>
                        <span styleName="dropdown-title">
                            {result.activeKnowledgeAreaFilter || defaultFilter}
                        </span>
                    </Dropdown.Button>
                }
            >
                <Dropdown.Menu>
                    <Dropdown.MenuItem onClick={() => this.onSelect(null)}>
                        {defaultFilter}
                    </Dropdown.MenuItem>
                    {this.knowledgeAreaFilters.map((filter) => (
                        <Dropdown.MenuItem key={filter} onClick={() => this.onSelect(filter)}>
                            {filter}
                        </Dropdown.MenuItem>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
