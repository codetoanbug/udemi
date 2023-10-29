import Observer from '@researchgate/react-intersection-observer';
import {RelatedSourceTypeOptions} from '@udemy/discovery-api';
import {TrackingContextProvider} from '@udemy/event-tracking';
import {AlternateHeadline} from '@udemy/react-discovery-units';
import autobind from 'autobind-decorator';
import {PropTypes as mobxTypes, observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import BrowseCourseCard from 'browse/components/course-card/browse-course-card.react-component';
import {getDeviceType, DEVICE_TYPE_MOBILE} from 'browse/lib/device-type';
import {discoveryTracker} from 'browse/tracking';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import MoreCoursesByInstructorStore from './more-courses-by-instructor.mobx-store';
import MoreCoursesByInstructorsSkeleton from './more-courses-by-instructors-skeleton.react-component';
import styles from './styles.less';

export const InstructorCoursesList = ({courses}) => {
    const deviceType = getDeviceType();
    if (deviceType === DEVICE_TYPE_MOBILE) {
        return (
            <div>
                {courses.map((course, index) => (
                    <TrackingContextProvider key={course.id} trackingContext={{index}}>
                        <span styleName="card-container">
                            <BrowseCourseCard course={course} size="small" />
                        </span>
                    </TrackingContextProvider>
                ))}
            </div>
        );
    }
    return (
        <Carousel
            gridMode={false}
            showPager={true}
            styleName="desktop-container"
            pagerButtonClassName={styles['pager-button']}
        >
            {courses.map((course, index) => {
                return (
                    <TrackingContextProvider key={course.id} trackingContext={{index}}>
                        <BrowseCourseCard course={course} />
                    </TrackingContextProvider>
                );
            })}
        </Carousel>
    );
};

InstructorCoursesList.propTypes = {
    courses: mobxTypes.arrayOrObservableArray,
    fullRowCarousel: PropTypes.bool,
    quickViewBoxEnabled: PropTypes.bool,
};

InstructorCoursesList.defaultProps = {
    courses: undefined,
    fullRowCarousel: false,
    quickViewBoxEnabled: false,
};

export const InstructorTitle = ({instructor}) => {
    return (
        /* eslint-disable-next-line jsx-a11y/heading-has-content */
        <h2
            className="ud-heading-xl"
            {...safelySetInnerHTML({
                descriptionOfCaller: 'more-courses-by-instructor:more-courses-link',
                html: interpolate(
                    gettext('More Courses by %(instructor)s'),
                    {instructor: `<a href="${instructor.url}">${instructor.title}</a>`},
                    true,
                ),
            })}
        />
    );
};

InstructorTitle.propTypes = {
    instructor: PropTypes.object.isRequired,
};

@inject('funnelLogContextStore')
@observer
export default class MoreCoursesByInstructor extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        context: PropTypes.string.isRequired,
        funnelLogContextStore: PropTypes.object,
        instructor: PropTypes.object.isRequired,
        organizationCoursesOnly: PropTypes.bool,
        subContext: PropTypes.string.isRequired,
        alternateTitle: PropTypes.shape({
            title: PropTypes.string.isRequired,
            secondaryText: PropTypes.string,
        }),
    };

    static defaultProps = {
        funnelLogContextStore: null,
        organizationCoursesOnly: undefined,
        alternateTitle: undefined,
    };

    constructor(props) {
        super(props);
        this.store = new MoreCoursesByInstructorStore(
            props.instructor.id,
            props.courseId,
            props.context,
            props.subContext,
            props.organizationCoursesOnly,
        );
    }

    componentDidMount() {
        this.store.getCourses();
    }

    @autobind
    onChangeIntersection({isIntersecting}) {
        if (!isIntersecting || !this.props.funnelLogContextStore) {
            return;
        }
        this.store.courses.forEach((course) => this.props.funnelLogContextStore.markAsSeen(course));
    }

    render() {
        const {instructor, alternateTitle} = this.props;

        if (!this.store.areCoursesLoaded && this.store.courses.length === 0) {
            return <MoreCoursesByInstructorsSkeleton />;
        }

        if (this.store.courses.length === 0) {
            return null;
        }

        return (
            <Observer onChange={this.onChangeIntersection}>
                <div styleName="more-from-instructor">
                    {alternateTitle ? (
                        <AlternateHeadline
                            titleTag="h2"
                            title={alternateTitle.title}
                            secondaryText={alternateTitle.secondaryText}
                        />
                    ) : (
                        <InstructorTitle instructor={instructor} />
                    )}
                    <TrackingContextProvider
                        trackingContext={{
                            trackImpressionFunc: discoveryTracker.trackDiscoveryImpression,
                            backendSource: this.store.backendSource,
                            relatedSourceId: this.props.courseId.toString(),
                            relatedSourceType: RelatedSourceTypeOptions.COURSE,
                        }}
                    >
                        <InstructorCoursesList courses={this.store.courses} />
                    </TrackingContextProvider>
                </div>
            </Observer>
        );
    }
}
