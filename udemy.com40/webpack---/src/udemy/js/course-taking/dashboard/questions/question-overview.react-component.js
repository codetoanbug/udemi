import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Checkbox, FormGroup, TextInputForm, Select} from '@udemy/react-form-components';
import {Dropdown} from '@udemy/react-menu-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {THEMES} from 'base-components/ungraduated/form/rich-text-editor/constants';
import SystemMessagePopover from 'base-components/ungraduated/popover/system-message-popover.react-component';
import {getQueryParams} from 'utils/query-params';
import udApiStat from 'utils/ud-api-stat';
import SystemMessage from 'utils/ud-system-message';

import requires from '../../registry/requires';
import {
    SORT_BY,
    SORT_LABELS,
    FILTER_LABELS,
    LECTURE_FILTER_LABELS,
    LECTURE_FILTER,
    SECTION_LABELS,
} from './question-answer/constants';
import NewQuestion from './question-answer/new-question/new-question.react-component';
import QuestionListWarning from './question-answer/question-list-warning.react-component';
import QuestionList from './question-answer/question-list.react-component';
import './question-overview.less';

@requires('questionAnswerStore', 'courseTakingStore')
@observer
export default class QuestionOverview extends React.Component {
    static propTypes = {
        questionAnswerStore: PropTypes.object.isRequired,
        courseTakingStore: PropTypes.shape({
            currentCurriculumItem: PropTypes.object,
            coursePortion: PropTypes.object,
            areOrgQuestionsDisabled: PropTypes.bool,
        }).isRequired,
    };

    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        const {questionAnswerStore, courseTakingStore} = this.props;
        const {lectureFilter, loadQuestions, loadFeaturedQuestions} = questionAnswerStore;
        if (courseTakingStore.coursePortion) {
            // bind filter to current for course portion mode
            questionAnswerStore.updateLectureFilter(LECTURE_FILTER.CURRENT);
            return;
        }
        // for LECTURE_FILTER.CURRENT, we need currentCurriculumItem to be available
        if (courseTakingStore.currentCurriculumItem || lectureFilter === LECTURE_FILTER.ALL) {
            loadFeaturedQuestions();
            udApiStat.increment(
                'featured_questions.student.ui.render',
                {},
                () => true,
                () => false,
            );

            loadQuestions();
        }

        const queryParams = getQueryParams();
        if ('scroll' in queryParams) {
            this.scrollToRef();
        }
    }

    @observable containerRef = null;

    @autobind
    onSearchQueryChange(event) {
        this.props.questionAnswerStore.trackAllQuestionsTextSearch();
        this.props.questionAnswerStore.setSearchQuery(event.target.value);
    }

    @autobind
    onSearchQueryDelete() {
        this.props.questionAnswerStore.setSearchQuery('');
    }

    get overviewHeader() {
        const {searchQuery} = this.props.questionAnswerStore;
        return (
            <FormGroup
                className="ct-dashboard-search-bar"
                label={gettext('Search all course questions')}
                labelProps={{className: 'ud-sr-only'}}
            >
                <TextInputForm
                    showClearInputButton={!!searchQuery}
                    onClearInput={this.onSearchQueryDelete}
                    value={searchQuery}
                    onChange={this.onSearchQueryChange}
                    placeholder={gettext('Search all course questions')}
                    submitButtonContent={<SearchIcon label={gettext('Search')} />}
                    data-purpose="question-search-box"
                />
            </FormGroup>
        );
    }

    @autobind
    onSelectedLectureFilterChanged(event) {
        if (event && event.target) {
            this.props.questionAnswerStore.updateLectureFilter(event.target.value);
        }
    }

    get lectureFilterDropdown() {
        const {lectureFilter} = this.props.questionAnswerStore;
        return (
            <FormGroup label={gettext('Filters:')}>
                <Select onChange={this.onSelectedLectureFilterChanged} value={lectureFilter}>
                    <option value={LECTURE_FILTER.ALL} data-purpose="filter-by-all-lectures">
                        {LECTURE_FILTER_LABELS[LECTURE_FILTER.ALL]}
                    </option>
                    <option value={LECTURE_FILTER.CURRENT} data-purpose="filter-by-current-lecture">
                        {LECTURE_FILTER_LABELS[LECTURE_FILTER.CURRENT]}
                    </option>
                </Select>
            </FormGroup>
        );
    }

    @autobind
    onSelectedSortOptionsFilterChanged(event) {
        if (event && event.target) {
            this.props.questionAnswerStore.updateSortingKey(event.target.value);
        }
    }

    get sortOptionsDropdown() {
        const {sortBy} = this.props.questionAnswerStore;
        return (
            <FormGroup label={gettext('Sort by:')}>
                <Select onChange={this.onSelectedSortOptionsFilterChanged} value={sortBy}>
                    <option value={SORT_BY.RECENCY} data-purpose="sort-by-most-recent">
                        {SORT_LABELS[SORT_BY.RECENCY]}
                    </option>
                    <option value={SORT_BY.UPVOTES} data-purpose="sort-by-most-upvotes">
                        {SORT_LABELS[SORT_BY.UPVOTES]}
                    </option>
                    <option value={SORT_BY.POPULARITY} data-purpose="sort-by-popularity">
                        {SORT_LABELS[SORT_BY.POPULARITY]}
                    </option>
                </Select>
            </FormGroup>
        );
    }

    get additionalFilters() {
        const {questionAnswerStore} = this.props;

        return (
            <div role={'group'} aria-labelledby={'filterQuestionsTriggerButton'}>
                <FormGroup label={''}>
                    <Dropdown
                        menuWidth="large"
                        placement="bottom-start"
                        trigger={
                            <Dropdown.Button id={'filterQuestionsTriggerButton'}>
                                {gettext('Filter questions')}
                            </Dropdown.Button>
                        }
                    >
                        <Dropdown.Menu>
                            <Dropdown.MenuItem
                                componentClass={Checkbox}
                                onClick={() => false}
                                checked={questionAnswerStore.filterFollowed}
                                onChange={questionAnswerStore.toggleFollowingFilter}
                                data-purpose="toggle-following"
                            >
                                {FILTER_LABELS.FOLLOWING}
                            </Dropdown.MenuItem>
                            <Dropdown.MenuItem
                                componentClass={Checkbox}
                                onClick={() => false}
                                checked={questionAnswerStore.filterSelfAsked}
                                onChange={questionAnswerStore.toggleSelfAskedFilter}
                                data-purpose="toggle-self-asked"
                            >
                                {FILTER_LABELS.USER}
                            </Dropdown.MenuItem>
                            <Dropdown.MenuItem
                                componentClass={Checkbox}
                                onClick={() => false}
                                checked={questionAnswerStore.filterNoAnswers}
                                onChange={questionAnswerStore.toggleResponsesFilter}
                                data-purpose="toggle-unanswered"
                            >
                                {FILTER_LABELS.UNANSWERED}
                            </Dropdown.MenuItem>
                        </Dropdown.Menu>
                    </Dropdown>
                </FormGroup>
            </div>
        );
    }

    get filterResultsSummary() {
        const {
            searchQuery,
            lectureFilter,
            showCollapsedView,
            questionsHolder,
            featuredQuestionsHolder,
        } = this.props.questionAnswerStore;

        const {totalCount, isLoading} = questionsHolder;
        const totalFeaturedCount = featuredQuestionsHolder.totalCount;
        const isFeaturedLoading = featuredQuestionsHolder.isLoading;

        let summaryMessage = gettext('All questions in this course');
        let summaryDetail = `(${totalCount})`;

        if (totalFeaturedCount === 0 && totalCount === 0 && !isLoading && !isFeaturedLoading) {
            summaryMessage = gettext('No results');
            summaryDetail = '';
        } else if (searchQuery) {
            summaryDetail = ninterpolate('(%s result)', '(%s results)', totalCount);
        } else if (lectureFilter === LECTURE_FILTER.CURRENT) {
            summaryMessage = gettext('All questions in this lecture');
        } else if (isLoading) {
            summaryMessage = gettext('Loading...');
            summaryDetail = '';
        }

        return (
            <div styleName="filter-results-summary" role="status">
                <h3 className="ud-heading-lg">{summaryMessage}</h3>
                {!showCollapsedView && (
                    <span className="ud-heading-md" styleName="filter-results-summary-detail">
                        {summaryDetail}
                    </span>
                )}
            </div>
        );
    }

    get featuredFilterResultsSummary() {
        const {
            searchQuery,
            lectureFilter,
            featuredQuestionsHolder,
            showCollapsedView,
        } = this.props.questionAnswerStore;

        const totalFeaturedCount = featuredQuestionsHolder.totalCount;
        const isFeaturedLoading = featuredQuestionsHolder.isLoading;

        let summaryMessage = gettext('Featured questions in this course');
        let summaryDetail = `(${totalFeaturedCount})`;
        if (searchQuery) {
            summaryDetail = ninterpolate('(%s result)', '(%s results)', totalFeaturedCount);
        } else if (lectureFilter === LECTURE_FILTER.CURRENT) {
            summaryMessage = gettext('Featured questions in this lecture');
        } else if (isFeaturedLoading) {
            summaryMessage = gettext('Loading...');
            summaryDetail = '';
        }

        return (
            <div styleName="filter-results-summary" role="status">
                <h3 className="ud-heading-lg">{summaryMessage}</h3>
                {!showCollapsedView && (
                    <span className="ud-heading-md" styleName="filter-results-summary-detail">
                        {summaryDetail}
                    </span>
                )}
            </div>
        );
    }

    get newQuestionAlert() {
        const {questionAnswerStore} = this.props;

        if (!questionAnswerStore.isNewQuestionConfirmationVisible) {
            return null;
        }

        return (
            <AlertBanner
                styleName="new-question-alert-banner"
                udStyle="success"
                title={gettext('Question added successfully')}
                body={
                    <>
                        <p>
                            {gettext(
                                "We'll notify you of responses so you can upvote or mark them as the " +
                                    'answer to your question.',
                            )}
                        </p>
                        <p>
                            {gettext(
                                'If your question is more general in nature you can try searching Google, ' +
                                    'Quora, or StackExchange while you wait for the instructor or other students to ' +
                                    'help.',
                            )}
                        </p>
                    </>
                }
                data-purpose="new-question-confirmation"
                ctaText={gettext('Dismiss')}
                onAction={questionAnswerStore.hideNewQuestionConfirmation}
                dismissButtonProps={false}
            />
        );
    }

    get askNewQuestion() {
        const {showNewQuestionForm} = this.props.questionAnswerStore;
        return (
            <Button
                className="ud-link-neutral"
                styleName="ask-new-question"
                onClick={showNewQuestionForm}
                udStyle="link"
                data-purpose="ask-new-question-button"
            >
                {gettext('Ask a new question')}
            </Button>
        );
    }

    get noResultMessage() {
        const {
            questions,
            featuredQuestions,
            questionsHolder,
            featuredQuestionsHolder,
        } = this.props.questionAnswerStore;

        if (
            questions.length ||
            featuredQuestions.length ||
            questionsHolder.isLoading ||
            featuredQuestionsHolder.isLoading
        ) {
            return null;
        }
        return <div>{gettext('Try searching different keywords or adjusting your filters')}</div>;
    }

    @autobind
    scrollToRef() {
        const {top} = this.containerRef.current.getBoundingClientRect();
        window.scrollTo({top, left: 0, behavior: 'smooth'});
    }

    render() {
        const {
            isNewQuestionFormVisible,
            hideNewQuestionForm,
            showCollapsedView,
            questions,
            featuredQuestions,
            questionsHolder,
            featuredQuestionsHolder,
            loadMore,
            featuredLoadMore,
        } = this.props.questionAnswerStore;
        const {isLoading, isFullyLoaded} = questionsHolder;
        const isFeaturedLoading = featuredQuestionsHolder.isLoading;
        const isFeaturedFullyLoaded = featuredQuestionsHolder.isFullyLoaded;
        const {coursePortion, areOrgQuestionsDisabled} = this.props.courseTakingStore;
        if (isNewQuestionFormVisible) {
            return <NewQuestion editorTheme={THEMES.Q_AND_A} onClose={hideNewQuestionForm} />;
        }

        const showFeaturedQuestions = featuredQuestions.length > 0;
        const showQuestions = questions.length > 0 || !showFeaturedQuestions;
        const bothLoading = isLoading && isFeaturedLoading;
        const bothLoaded = !isLoading && !isFeaturedLoading;

        return (
            <div ref={this.containerRef}>
                <QuestionListWarning />
                {!coursePortion && (
                    <>
                        {this.overviewHeader}
                        <section
                            styleName="sort-filter-container"
                            aria-label={SECTION_LABELS.SORTFILTER}
                        >
                            {this.lectureFilterDropdown}
                            {this.sortOptionsDropdown}
                            {!showCollapsedView && this.additionalFilters}
                        </section>
                    </>
                )}
                {this.newQuestionAlert}
                {showFeaturedQuestions && (
                    <div styleName="question-list">
                        <SystemMessagePopover
                            placement="right"
                            systemMessageId={
                                SystemMessage.ids.hasSeenStudentFeaturedQuestionsPrompt
                            }
                            detachFromTarget={true}
                            trigger={this.featuredFilterResultsSummary}
                        >
                            <div>
                                {gettext(
                                    'Get instant answers to common questions in the new Featured Questions section',
                                )}
                            </div>
                        </SystemMessagePopover>
                        <QuestionList
                            showResponses={true}
                            questions={featuredQuestions}
                            isLoading={isFeaturedLoading}
                            isFullyLoaded={isFeaturedFullyLoaded}
                            hideLoading={bothLoading}
                            loadMore={featuredLoadMore}
                            areOrgQuestionsDisabled={areOrgQuestionsDisabled}
                        />
                    </div>
                )}
                {showQuestions && (
                    <div styleName="question-list">
                        {this.filterResultsSummary}
                        <QuestionList
                            showResponses={true}
                            questions={questions}
                            isLoading={isLoading}
                            isFullyLoaded={isFullyLoaded}
                            hideLoading={bothLoading}
                            loadMore={loadMore}
                            areOrgQuestionsDisabled={areOrgQuestionsDisabled}
                        />
                    </div>
                )}
                {bothLoading && <Loader block={true} size="xxlarge" />}
                {this.noResultMessage}
                {bothLoaded && !areOrgQuestionsDisabled && this.askNewQuestion}
            </div>
        );
    }
}
