import {Checkbox} from '@udemy/react-form-components';
import {Pagination} from '@udemy/react-navigation-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {toJS} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import EmptyState from 'instructor/common/empty-state.react-component';
import DescriptionDropdown from 'instructor/layout/description-dropdown.react-component';
import IAResponsiveHeader from 'instructor/layout/ia-responsive-header.react-component';
import TwoPaneStore from 'instructor/layout/two-pane.mobx-store';
import udLink from 'utils/ud-link';

import QuestionStatusTooltip from '../question-answer/question-status-tooltip.react-component';
import AssignmentsDetail from './assignments-detail.react-component';
import AssignmentsStore from './assignments.mobx-store';
import {
    FILTER_UNREAD,
    SORT_LABELS,
    FEEDBACK,
    FEEDBACK_LABELS,
    SHARING,
    SHARING_LABELS,
} from './constants';
import './assignments.less';

@inject('instructorStore')
@observer
export class IAAssignmentsApp extends Component {
    static propTypes = {
        baseUrl: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired,
        instructorStore: PropTypes.object.isRequired,
        store: PropTypes.object, // for testing
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
        isTaughtCoursesApiSlimVersionEnabled: PropTypes.bool,
    };

    static defaultProps = {
        store: undefined,
        isUBOnlyDataPreviewEnabled: false,
        isTaughtCoursesApiSlimVersionEnabled: false,
    };

    constructor(props) {
        super(props);

        const {baseUrl, instructorStore} = props;
        const searchQuery = qs.parse(location.search, {ignoreQueryPrefix: true});
        const courseId = searchQuery.course ? Number.parseInt(searchQuery.course, 10) : null;
        this.store =
            props.store ||
            new AssignmentsStore({
                baseUrl,
                instructorStore,
                twoPaneStore: new TwoPaneStore(),
                courseId,
            });
    }

    componentDidMount() {
        this.store.loadInitialTaughtCourses(this.props.isTaughtCoursesApiSlimVersionEnabled);
        this.store.loadInitialThreads();
    }

    @autobind
    onCourseSelect(courseId) {
        this.store.setCourseFilter(courseId);
    }

    @autobind
    handleUnreadChanged(ev) {
        this.store.setFilter(FILTER_UNREAD, ev.target.checked);
    }

    @autobind
    setOrdering(value) {
        this.store.setOrdering(value);
    }

    @autobind
    setFeedback(value) {
        this.store.setFilter(FEEDBACK, value);
    }

    @autobind
    setSharing(value) {
        this.store.setFilter(SHARING, value);
    }

    @autobind
    handleLoadMoreThreads(page) {
        this.store.loadMoreThreads(page);
        window.scrollTo(0, 0);
    }

    @autobind
    getLabels(titles, counts) {
        const labels = Object.assign({}, titles);
        if (counts) {
            const titleKeys = Object.keys(titles);
            titleKeys.forEach((key) => {
                const titleValue = titles[key];
                const count = counts[key];
                labels[key] = this.store && counts ? `${titleValue} (${count})` : `${titleValue}`;
            });
        }
        return labels;
    }

    getFilterInputs() {
        return {
            unreadCheckbox: (
                <Checkbox
                    name="Unread"
                    checked={this.store.filters[FILTER_UNREAD]}
                    onChange={this.handleUnreadChanged}
                >
                    {`${gettext('Unread')} (${this.store.filterCounts.unread})`}
                </Checkbox>
            ),
            sharingTypeDropdown: (
                <DescriptionDropdown
                    description={gettext('Sharing preference')}
                    labels={this.getLabels(SHARING_LABELS, this.store.filterCounts.permission)}
                    value={this.store.filters[SHARING]}
                    setValue={this.setSharing}
                />
            ),
            feedbackTypeDropdown: (
                <DescriptionDropdown
                    description={gettext('Feedback type')}
                    labels={this.getLabels(FEEDBACK_LABELS, this.store.filterCounts.feedback)}
                    value={this.store.filters[FEEDBACK]}
                    setValue={this.setFeedback}
                />
            ),
            sortDropdown: (
                <DescriptionDropdown
                    description={gettext('Sort by')}
                    labels={SORT_LABELS}
                    value={this.store.ordering}
                    setValue={this.setOrdering}
                />
            ),
        };
    }

    render() {
        const allCourseDropdownData = {
            data: toJS(this.store._taughtCourses),
            selectedId: this.store.courseIdFilter,
            onCourseSelect: this.onCourseSelect,
        };

        const filterInputs = this.getFilterInputs();
        let emptyState = null;
        if (this.store.isThreadListLoading) {
            emptyState = <MainContentLoader />;
        } else if (!this.store.isThreadDetailLoading && this.store.filteredThreads.length === 0) {
            emptyState = (
                <EmptyState
                    src={udLink.toStorageStaticAsset('communication/empty-search.jpg')}
                    src2x={udLink.toStorageStaticAsset('communication/empty-search-2x.jpg')}
                    headerText={gettext('No results')}
                    subText={gettext('Try a different filter')}
                />
            );
        }
        return (
            <Provider store={this.store}>
                <MemoizedBrowserRouter>
                    <div>
                        <IAResponsiveHeader
                            title={gettext('Assignments')}
                            loaded={this.store.ready && !this.store.noThreads}
                            leftItems={[
                                filterInputs.unreadCheckbox,
                                filterInputs.sharingTypeDropdown,
                                filterInputs.feedbackTypeDropdown,
                                filterInputs.sortDropdown,
                            ]}
                            allCourseDropdownData={allCourseDropdownData}
                            isUBOnlyDataPreviewEnabled={this.props.isUBOnlyDataPreviewEnabled}
                        />
                        {!this.store.ready && <MainContentLoader />}
                        {this.store.ready && this.store.noThreads && (
                            <EmptyState
                                src={udLink.toStorageStaticAsset(
                                    'communication/empty-mailbox-v2.jpg',
                                )}
                                src2x={udLink.toStorageStaticAsset(
                                    'communication/empty-mailbox-2x-v2.jpg',
                                )}
                                subText={gettext(
                                    'Assignments are an optional feature of course creation. ' +
                                        'If you’ve created assignments, you’ll see student submissions here',
                                )}
                            />
                        )}
                        {this.store.ready && !this.store.noThreads && (
                            <>
                                {this.store._threads.map((thread) => (
                                    <div styleName="one-pane" key={thread.id}>
                                        <div styleName="tooltip">
                                            <QuestionStatusTooltip
                                                store={this.store}
                                                thread={thread}
                                            />
                                        </div>
                                        <AssignmentsDetail thread={thread} />
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
                    </div>
                </MemoizedBrowserRouter>
            </Provider>
        );
    }
}

export default withRouter(IAAssignmentsApp);
