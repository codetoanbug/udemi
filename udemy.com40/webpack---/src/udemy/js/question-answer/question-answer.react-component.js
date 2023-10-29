import {Checkbox} from '@udemy/react-form-components';
import {Pagination} from '@udemy/react-navigation-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import {ONE_PANE_MODE} from 'instructor/common/constants';
import EmptyState from 'instructor/common/empty-state.react-component';
import ViewModeButtonGroup from 'instructor/common/view-mode-button-group.react-component';
import DescriptionDropdown from 'instructor/layout/description-dropdown.react-component';
import IAResponsiveHeader from 'instructor/layout/ia-responsive-header.react-component';
import TwoPane from 'instructor/layout/two-pane.react-component';
import udLink from 'utils/ud-link';

import {
    TAUGHT_COURSES_PARAMS,
    TAUGHT_COURSES_PARAMS_SLIM,
    AI_TAUGHT_COURSES_PARAMS,
    AI_TAUGHT_COURSES_PARAMS_SLIM,
} from '../instructor/constants';
import {
    UNREAD,
    UNANSWERED,
    UNRESPONDED,
    NO_INSTRUCTOR_RESPONSE,
    NO_INSTRUCTOR_RESPONSE_COUNT,
    SORT_LABELS,
    FILTER_LABELS,
    VIEW_MODE_TYPES,
} from './constants';
import QuestionAnswerList from './question-answer-list.react-component';
import QuestionDetail from './question-detail.react-component';
import QuestionStatusTooltip from './question-status-tooltip.react-component';
import './question-answer.less';

@inject('instructorStore')
@observer
export class IAQuestionAnswerApp extends Component {
    static propTypes = {
        baseUrl: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired,
        instructorStore: PropTypes.object.isRequired,
        store: PropTypes.object, // for testing
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
        isTaughtCoursesApiSlimVersionEnabled: PropTypes.bool,
        isInQAAITargetGroup: PropTypes.bool,
    };

    static defaultProps = {
        store: undefined,
        isUBOnlyDataPreviewEnabled: false,
        isTaughtCoursesApiSlimVersionEnabled: false,
        isInQAAITargetGroup: false,
    };

    constructor(props) {
        super(props);
        const {baseUrl, instructorStore} = this.props;

        instructorStore.QAStore.baseUrl = baseUrl;
        this.store = instructorStore.QAStore;
    }

    componentDidMount() {
        this.store.setThreadFromPathname(this.props.location.pathname);
        const taughtCoursesParams = this.props.isInQAAITargetGroup
            ? this.props.isTaughtCoursesApiSlimVersionEnabled
                ? AI_TAUGHT_COURSES_PARAMS_SLIM
                : AI_TAUGHT_COURSES_PARAMS
            : this.props.isTaughtCoursesApiSlimVersionEnabled
            ? TAUGHT_COURSES_PARAMS_SLIM
            : TAUGHT_COURSES_PARAMS;

        this.store.loadInitialTaughtCourses(taughtCoursesParams);
        this.store.loadViewModeSettings();
        this.store.loadInitialThreads();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.store.setThreadFromPathname(nextProps.location.pathname);
        }
    }

    @autobind
    onCourseSelect(courseId) {
        this.store.setCourseFilter(courseId);
    }

    @autobind handleFilterChanged(ev) {
        this.store.setFilter(ev.target.dataset.filter, ev.target.checked);
    }

    @autobind
    handleViewModeTypeChange(ev) {
        this.store.updateUserViewModeType(ev.target.value, true);
    }

    @autobind
    handleLoadMoreThreads(page) {
        this.store.loadMoreThreads(page);
        window.scrollTo(0, 0);
    }

    @autobind
    setOrdering(value) {
        this.store.setOrdering(value);
    }

    renderFilterCheckbox(filterType, checked = null, disabled = null) {
        const countType =
            filterType !== NO_INSTRUCTOR_RESPONSE ? filterType : NO_INSTRUCTOR_RESPONSE_COUNT;
        checked = checked === null ? this.store.filters[filterType] : checked;
        disabled = disabled === null ? false : Boolean(disabled);
        return (
            <Checkbox
                name={filterType}
                data-filter={filterType}
                checked={checked}
                onChange={this.handleFilterChanged}
                disabled={disabled}
            >
                {FILTER_LABELS[filterType]}
                {` (${this.store.filterCounts[countType]})`}
            </Checkbox>
        );
    }

    getFilterInputs() {
        return {
            unreadCheckbox: this.renderFilterCheckbox(UNREAD),
            unansweredCheckbox: this.renderFilterCheckbox(
                UNANSWERED,
                this.store.filters[UNANSWERED] || this.store.filters[UNRESPONDED],
                this.store.filters[UNRESPONDED],
            ),
            unrespondedCheckbox: this.renderFilterCheckbox(UNRESPONDED),
            noInstructorResponseCheckbox: this.renderFilterCheckbox(
                NO_INSTRUCTOR_RESPONSE,
                this.store.filters[NO_INSTRUCTOR_RESPONSE] || this.store.filters[UNRESPONDED],
                this.store.filters[UNRESPONDED],
            ),
            sortDropdown: (
                <DescriptionDropdown
                    description={gettext('Sort by')}
                    labels={SORT_LABELS}
                    value={this.store.ordering}
                    setValue={this.setOrdering}
                />
            ),
            paneView: (
                <ViewModeButtonGroup label={gettext('Select view mode')}>
                    {Object.keys(VIEW_MODE_TYPES).map((key) => {
                        const {Icon, label, tooltipText} = VIEW_MODE_TYPES[key];
                        return (
                            <ViewModeButtonGroup.Button
                                key={key}
                                name="courseViewType"
                                onChange={this.handleViewModeTypeChange}
                                value={key}
                                checked={key === this.store.viewModeType}
                                icon={<Icon label={label} />}
                                tooltipText={tooltipText}
                            />
                        );
                    })}
                </ViewModeButtonGroup>
            ),
        };
    }

    renderQuestionAnswerList() {
        return <QuestionAnswerList showFeaturedQuestionsBadge={true} />;
    }

    isGenerateWithAIVisible(thread) {
        return (
            this.props.isInQAAITargetGroup &&
            this.store.isCourseCategorySuitableForGenerateWithAI(thread) &&
            this.store.isCourseLanguageSuitableForGenerateWithAI(thread)
        );
    }

    render() {
        const allCourseDropdownData = {
            data: this.store._taughtCourses,
            selectedId: this.store.courseIdFilter,
            onCourseSelect: this.onCourseSelect,
        };
        const filterInputs = this.getFilterInputs();
        const showLoader = !this.store.ready || this.store.loadingNextPage;
        const showEmptyState = this.store.ready && this.store.noThreads;
        const showThreads =
            !this.store.loadingNextPage && this.store.ready && !this.store.noThreads;
        let emptyState = null;
        if (this.store.isThreadListLoading) {
            emptyState = <MainContentLoader />;
        } else if (!this.store.isThreadDetailLoading && this.store.filteredThreads.length === 0) {
            if (this.store.filters[UNREAD]) {
                emptyState = (
                    <EmptyState
                        src={udLink.toStorageStaticAsset('communication/empty-mailbox-v2.jpg')}
                        src2x={udLink.toStorageStaticAsset('communication/empty-mailbox-2x-v2.jpg')}
                        headerText={gettext('No unread items')}
                        subText={gettext('You’re all caught up')}
                    />
                );
            } else {
                emptyState = (
                    <EmptyState
                        src={udLink.toStorageStaticAsset('communication/empty-search.jpg')}
                        src2x={udLink.toStorageStaticAsset('communication/empty-search-2x.jpg')}
                        headerText={gettext('No results')}
                        subText={gettext('Try a different filter or search')}
                    />
                );
            }
        }
        return (
            <Provider store={this.store}>
                <MemoizedBrowserRouter>
                    <div>
                        <IAResponsiveHeader
                            title={gettext('Q&A')}
                            loaded={this.store.ready && !this.store.noThreads}
                            leftItems={[
                                filterInputs.unreadCheckbox,
                                filterInputs.unansweredCheckbox,
                                filterInputs.unrespondedCheckbox,
                                filterInputs.noInstructorResponseCheckbox,
                                filterInputs.sortDropdown,
                            ]}
                            rightCTA={filterInputs.paneView}
                            allCourseDropdownData={allCourseDropdownData}
                            isUBOnlyDataPreviewEnabled={this.props.isUBOnlyDataPreviewEnabled}
                        />
                        {showLoader && <MainContentLoader />}
                        {showEmptyState && (
                            <EmptyState
                                src={udLink.toStorageStaticAsset(
                                    'communication/empty-mailbox-v2.jpg',
                                )}
                                src2x={udLink.toStorageStaticAsset(
                                    'communication/empty-mailbox-2x-v2.jpg',
                                )}
                                headerText={gettext('No questions yet')}
                                subText={
                                    this.store.isPublishedInstructor
                                        ? gettext("You'll receive student questions here")
                                        : gettext(
                                              'Q&A is a forum where your students can ask questions, hear your responses, ' +
                                                  'and respond to one another. Here’s where you’ll see your courses’ Q&A threads',
                                          )
                                }
                            />
                        )}
                        {showThreads && this.store.viewModeType === ONE_PANE_MODE && (
                            <>
                                {this.store._threads.map((thread) => (
                                    <div styleName="one-pane" key={thread.id}>
                                        <div styleName="tooltip">
                                            <QuestionStatusTooltip
                                                store={this.store}
                                                thread={thread}
                                            />
                                        </div>
                                        <QuestionDetail
                                            thread={thread}
                                            showFeaturedQuestionsBadge={true}
                                            isGenerateWithAIButtonEnabled={this.isGenerateWithAIVisible(
                                                thread,
                                            )}
                                        />
                                    </div>
                                ))}
                                {emptyState}
                                <Pagination
                                    pageCount={this.store.pageCount}
                                    activePage={this.store.page}
                                    onPageChange={this.handleLoadMoreThreads}
                                    styleName="pagination"
                                />
                            </>
                        )}
                        {showThreads && this.store.viewModeType !== ONE_PANE_MODE && (
                            <div styleName="two-pane">
                                <TwoPane twoPaneStore={this.store.twoPaneStore}>
                                    <Route render={this.renderQuestionAnswerList} />
                                    <QuestionDetail
                                        thread={this.store.selectedThread}
                                        showFeaturedQuestionsBadge={true}
                                        isGenerateWithAIButtonEnabled={this.isGenerateWithAIVisible(
                                            this.store.selectedThread,
                                        )}
                                    />
                                </TwoPane>
                            </div>
                        )}
                    </div>
                </MemoizedBrowserRouter>
            </Provider>
        );
    }
}

export default withRouter(IAQuestionAnswerApp);
