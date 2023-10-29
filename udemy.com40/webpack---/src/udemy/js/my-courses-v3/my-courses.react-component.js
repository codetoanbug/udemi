import {MainContentLoader} from '@udemy/react-reveal-components';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {FeatureState} from 'browse/components/feature-discovery/feature-discoverability.mobx-store';
import {FeatureDiscoverability} from 'browse/components/feature-discovery/feature-discoverability.react-component';
import FeatureList from 'browse/components/feature-discovery/feature-discovery.json';
import {LearningReminderBanner} from 'learning-calendar-reminders/learning-reminder-banner/learning-reminder-banner.react-component';
import {LearningReminderDiscoveryModal} from 'learning-calendar-reminders/learning-reminder-modal/learning-reminder-discovery-modal.react-component';

import CourseList from './course-list.react-component';
import LearningFilter from './learning-filter.react-component';
import MyCoursesStore from './my-courses.mobx-store';

import './my-courses.less';

@observer
export default class MyCourses extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        enrolledCourseCount: PropTypes.number.isRequired,
        googleAuthStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new MyCoursesStore('learning_tab', props.location, props.history);
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(this.props.location.search);
        this.store.updateMyCourses(searchParams);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) {
            const searchParams = new URLSearchParams(this.props.location.search);
            this.store.updateMyCourses(searchParams);
        }
    }

    @computed
    get hasEnoughEnrolledCourses() {
        return this.props.enrolledCourseCount > 6;
    }

    renderLearningReminderBanner() {
        return (
            <div styleName="learning-reminder-banner">
                <LearningReminderBanner googleAuthStore={this.props.googleAuthStore} />
            </div>
        );
    }

    renderLearningReminderModal() {
        return <LearningReminderDiscoveryModal googleAuthStore={this.props.googleAuthStore} />;
    }

    render() {
        return (
            <>
                <FeatureDiscoverability
                    config={FeatureList.learning_event_scheduler}
                    renderingStrategy={{
                        [FeatureState.PASSIVE]: {
                            component: this.renderLearningReminderBanner(),
                            primaryComponentType: 'banner',
                        },
                        [FeatureState.ACTIVE]: {
                            component: (
                                <>
                                    {this.renderLearningReminderBanner()}
                                    {this.renderLearningReminderModal()}
                                </>
                            ),
                            primaryComponentType: 'modal',
                        },
                    }}
                />
                {this.store.isLoading ? (
                    <MainContentLoader />
                ) : (
                    <>
                        {this.store.showZeroState || !this.hasEnoughEnrolledCourses ? null : (
                            <LearningFilter
                                store={this.store}
                                history={this.props.history}
                                location={this.props.location}
                            />
                        )}
                        <CourseList
                            store={this.store}
                            history={this.props.history}
                            location={this.props.location}
                        />
                    </>
                )}
            </>
        );
    }
}
