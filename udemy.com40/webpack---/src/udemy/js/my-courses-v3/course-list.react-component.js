import {LocalizedHtml} from '@udemy/i18n';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {UI_REGION} from 'browse/ui-regions';
import {getNumericSiteStat} from 'utils/site-stats';

import EmptyState from './empty-state.react-component';
import EnrolledCourseCard from './enrolled-course-card.react-component';
import MyCoursesSubscriptionContext from './my-courses-subscription-context';
import {MyCoursesPagination, getCoursePaginationLabel} from './pagination.react-component';
import {updateSearchParams} from './search-params';

@observer
export default class CourseList extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    static contextType = MyCoursesSubscriptionContext;

    @autobind
    onPageChange(page) {
        updateSearchParams({p: `${page}`}, this.props.history);
    }

    renderZeroState() {
        const {activeTab, isOrganization} = this.props.store;
        const {consumerSubscriptionActive} = this.context;

        let title, subtitle;
        if (activeTab === 'learning_tab') {
            const subtitleLine1 =
                consumerSubscriptionActive || isOrganization
                    ? gettext('When you enroll in a course, it will appear here.')
                    : gettext('When you purchase a course, it will appear here.');
            if (isOrganization) {
                title = interpolate(gettext('Start learning from over %s courses today.'), [
                    getNumericSiteStat('num_courses_rounded'),
                ]);
                subtitle = [
                    <p key="subtitle-line-1">{subtitleLine1}</p>,
                    <p key="subtitle-line-2" className="ud-text-with-links">
                        <LocalizedHtml
                            html={gettext(
                                'Discover New Courses in your <a class="link">Account Subscription</a>.',
                            )}
                            interpolate={{
                                link: <a href="/" className="ud-text-bold" />,
                            }}
                        />
                    </p>,
                ];
            } else {
                title = interpolate(gettext('Start learning from over %s courses today.'), [
                    getNumericSiteStat('num_courses_rounded'),
                ]);
                subtitle = (
                    <p className="ud-text-with-links">
                        {subtitleLine1}{' '}
                        <LocalizedHtml
                            dataPurpose="no-courses-link"
                            html={gettext('<a class="link">Browse now</a>.')}
                            interpolate={{link: <a href="/" className="ud-text-bold" />}}
                        />
                    </p>
                );
            }
            return <EmptyState layout="vertical" title={title} subtitle={subtitle} />;
        } else if (activeTab === 'archive_tab') {
            title = gettext('Focus on only the courses that matter to you.');
            const subtitleHtml = consumerSubscriptionActive
                ? gettext('<a class="link">Go to the Purchased</a> tab to archive.')
                : gettext('<a class="link">Go to the All Courses</a> tab to archive.');
            const subtitleHref = consumerSubscriptionActive
                ? '/home/my-courses/learning/'
                : '/home/my-courses';
            subtitle = (
                <p className="ud-text-with-links">
                    <LocalizedHtml
                        dataPurpose="no-archived-courses"
                        html={subtitleHtml}
                        interpolate={{link: <a href={subtitleHref} className="ud-text-bold" />}}
                    />
                </p>
            );
            return <EmptyState layout="vertical" title={title} subtitle={subtitle} />;
        }
        return null;
    }

    render() {
        return (
            <>
                {this.props.store.showZeroState ? (
                    this.renderZeroState()
                ) : (
                    <div className="my-courses__course-card-grid">
                        {this.props.store.courses.map((course, id) => (
                            <div key={id}>
                                <EnrolledCourseCard
                                    course={course}
                                    store={this.props.store}
                                    uiRegion={
                                        this.props.store.searchQuery
                                            ? UI_REGION.SEARCH
                                            : UI_REGION.ALL_COURSES
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}
                <MyCoursesPagination store={this.props.store} onPageChange={this.onPageChange} />
                {getCoursePaginationLabel(this.props.store)}
            </>
        );
    }
}
