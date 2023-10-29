import {TrackingContextProvider} from '@udemy/event-tracking';
import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {DiscoveryItemImpressionEvent} from 'browse/events';
import {discoveryTracker} from 'browse/tracking';

import EmptyState from './empty-state.react-component';
import {MyCoursesPagination, getCoursePaginationLabel} from './pagination.react-component';
import SearchMyCourses from './search-my-courses.react-component';
import {updateSearchParams} from './search-params';
import WishlistedCourseCard from './wishlisted-course-card.react-component';
import WishlistedCoursesStore from './wishlisted-courses.mobx-store';

@observer
export default class WishlistedCourses extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new WishlistedCoursesStore();
    }

    @action
    componentDidMount() {
        const searchParams = new URLSearchParams(this.props.location.search);
        this.store.searchQuery = searchParams.get('q') || '';
        this.store.currentPage = parseInt(searchParams.get('p'), 10) || 1;
        this.store.loadCourses();
    }

    @action
    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) {
            const searchParams = new URLSearchParams(this.props.location.search);
            this.store.searchQuery = searchParams.get('q') || '';
            this.store.currentPage = parseInt(searchParams.get('p'), 10) || 1;
            this.store.loadCourses();
        }
    }

    @autobind
    setSearchQuery(searchQuery) {
        updateSearchParams({p: '1', q: searchQuery}, this.props.history);
    }

    @autobind
    onPageChange(page) {
        updateSearchParams({p: `${page}`}, this.props.history);
    }

    @autobind
    reset() {
        this.props.history.push({pathname: this.props.location.pathname});
    }

    render() {
        return (
            <>
                {this.store.isLoading ? (
                    <MainContentLoader />
                ) : this.store.showZeroState ? (
                    <EmptyState
                        layout="vertical"
                        ctaProps={{
                            componentClass: 'a',
                            href: '/',
                            children: gettext('Browse courses now'),
                        }}
                    />
                ) : (
                    <>
                        <SearchMyCourses
                            store={this.store}
                            onReset={this.reset}
                            onSubmit={this.setSearchQuery}
                        />
                        <div className="my-courses__course-card-grid">
                            {this.store.courses.map((course, idx) => (
                                <TrackingContextProvider
                                    key={course.id}
                                    trackingContext={{
                                        trackImpressionFunc:
                                            discoveryTracker.trackDiscoveryImpression,
                                        index: idx,
                                        backendSource:
                                            DiscoveryItemImpressionEvent.backendSourceOptions
                                                .USER_WISHLISTED_COURSES,
                                    }}
                                >
                                    <div>
                                        <WishlistedCourseCard course={course} />
                                    </div>
                                </TrackingContextProvider>
                            ))}
                        </div>
                        <MyCoursesPagination store={this.store} onPageChange={this.onPageChange} />
                        {getCoursePaginationLabel(this.store)}
                    </>
                )}
            </>
        );
    }
}
