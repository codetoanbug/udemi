import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {DETAILED_PRACTICE_TEST_RESULTS_ACTIONS, TRACKING_CATEGORIES} from '../../../constants';
import {RESULT_QUESTION_FILTERS} from '../question/question-filters';

@inject('practiceTestStore')
@observer
export default class QuestionFilterDropdown extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
    };

    @autobind
    onSelect(filterKey) {
        this.props.practiceTestStore.detailedTestResult.setActiveQuestionFilterKey(filterKey);
        this.props.practiceTestStore.quizViewStore.trackPracticeTestResults(
            TRACKING_CATEGORIES.DETAILED_PRACTICE_TEST_RESULTS,
            DETAILED_PRACTICE_TEST_RESULTS_ACTIONS.CLICK_QUESTION_TYPE_FILTER,
            {userAttemptedQuizId: this.props.practiceTestStore.detailedTestResult.id},
        );
    }

    render() {
        const result = this.props.practiceTestStore.detailedTestResult;
        return (
            <Dropdown
                placement="bottom-start"
                trigger={
                    <Dropdown.Button>
                        {RESULT_QUESTION_FILTERS[result.activeQuestionFilterKey].label}
                    </Dropdown.Button>
                }
            >
                <Dropdown.Menu>
                    {Object.keys(RESULT_QUESTION_FILTERS).map((key) => (
                        <Dropdown.MenuItem key={key} onClick={() => this.onSelect(key)}>
                            {RESULT_QUESTION_FILTERS[key].label}
                        </Dropdown.MenuItem>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
