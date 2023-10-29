import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import requires from '../../../registry/requires';
import SidebarHeader from '../../../sidebar/sidebar-header.react-component';
import {NAV_QUESTION_FILTERS} from './question-filters';
import QuestionNavigationItem from './question-navigation-item.react-component';
import './question-navigation.less';

@requires('quizViewStore', 'practiceTestStore')
@observer
export default class QuestionNavigation extends Component {
    static propTypes = {
        quizViewStore: PropTypes.object.isRequired,
        practiceTestStore: PropTypes.object.isRequired,
    };

    // One of the keys in the NAV_QUESTION_FILTERS object.
    @observable activeFilterKey = 'ALL_QUESTIONS';

    @autobind
    @action
    onSelectFilter(filterKey) {
        this.activeFilterKey = filterKey;
    }

    @autobind
    onSelectNavItem(question) {
        this.props.practiceTestStore.navigateToQuestion(question);
    }

    @autobind
    onToggleMarkForReview(question) {
        this.props.practiceTestStore.toggleIsMarkedForReview(question);
    }

    get filters() {
        const selectedFilterConfig = NAV_QUESTION_FILTERS[this.activeFilterKey];

        return (
            <Dropdown
                placement="bottom-start"
                trigger={
                    <Dropdown.Button
                        className="ud-link-neutral"
                        size="small"
                        typography="ud-heading-md"
                        udStyle="ghost"
                    >
                        {selectedFilterConfig.label}
                    </Dropdown.Button>
                }
            >
                <Dropdown.Menu>
                    {Object.keys(NAV_QUESTION_FILTERS).map((filterKey) => (
                        <Dropdown.MenuItem
                            key={filterKey}
                            onClick={() => this.onSelectFilter(filterKey)}
                            data-purpose="filter-item"
                        >
                            {NAV_QUESTION_FILTERS[filterKey].label}
                        </Dropdown.MenuItem>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    get header() {
        return (
            <SidebarHeader
                title={this.filters}
                a11yTitle={gettext('Questions')}
                onClose={this.props.practiceTestStore.courseTakingStore.closeSidebar}
            />
        );
    }

    render() {
        const {quizViewStore} = this.props;

        const selectedFilterConfig = NAV_QUESTION_FILTERS[this.activeFilterKey];
        const filteredQuestions = quizViewStore.questions.filter(selectedFilterConfig.filter);
        const skippedQuestionIds = new Set(
            quizViewStore.questions.filter(NAV_QUESTION_FILTERS.SKIPPED.filter).map((q) => q.id),
        );
        return (
            <>
                {this.header}
                {filteredQuestions.length === 0 && (
                    <div
                        className="ud-text-lg"
                        data-purpose="questions-list"
                        styleName="empty-list"
                    >
                        {gettext('No questions match this filter.')}
                    </div>
                )}
                {filteredQuestions.length > 0 && (
                    <ul data-purpose="questions-list" className="ud-unstyled-list">
                        {filteredQuestions.map((question) => (
                            <QuestionNavigationItem
                                key={question.id}
                                question={question}
                                skipped={skippedQuestionIds.has(question.id)}
                                highlight={question === quizViewStore.currentQuestion}
                                onSelect={this.onSelectNavItem}
                                onToggleMarkForReview={this.onToggleMarkForReview}
                            />
                        ))}
                    </ul>
                )}
            </>
        );
    }
}
