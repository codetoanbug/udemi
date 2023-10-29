import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {withMatchMedia} from '@udemy/hooks';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import {Button, ButtonProps} from '@udemy/react-core-components';
import {StarRating} from '@udemy/react-merchandising-components';
import {Block, Skeleton} from '@udemy/react-reveal-components';
import {SaveToListButton} from '@udemy/shopping';
import {withUDData, WithUDDataProps} from '@udemy/ud-data';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {DiscoveryItemImpressionEvent, LearningProductType} from 'browse/events';
import {formatNumberCompact} from 'browse/lib/format-number-compact';
import {BrowseCourse} from 'browse/types/course';
import {UI_REGION} from 'browse/ui-regions';
import {AddCourseToLearningPathButtonStore} from 'learning-path/add-course-to-learning-path/add-course-to-learning-path-button.mobx-store';
import {AddCourseToLearningPathButton} from 'learning-path/add-course-to-learning-path/add-course-to-learning-path-button.react-component';
import {TrackingContext} from 'search/events';

import styles from './lecture-view-course-card.less';
import {Course, Lecture} from './types';
import {getCourseLinkCTA, handleCourseCTAClick} from './utils';

export const LectureViewCourseCardSkeleton = () => (
    <Skeleton className={classNames(styles.container, styles.skeleton)}>
        <Block />
    </Skeleton>
);

interface LectureViewCourseCardProps {
    course: Course;
    lecture?: Lecture;
    trackingContext?: TrackingContext;
    isSmMax?: boolean;
}

@withMatchMedia({isSmMax: 'sm-max'})
@observer
export class InternalLectureViewCourseCard extends Component<
    LectureViewCourseCardProps & WithI18nProps & WithUDDataProps
> {
    static defaultProps = {
        isSmMax: undefined,
    };

    trackCourseCTAImpression = (course: Course) => {
        const trackingContext = this.props.trackingContext;
        if (trackingContext) {
            Tracker.publishEvent(
                new DiscoveryItemImpressionEvent({
                    id: course.id,
                    type: LearningProductType.COURSE,
                    trackingId: trackingContext.trackingId ?? '',
                    serveTrackingId: trackingContext.searchTrackingId ?? '',
                    backendSource: trackingContext.backendSource,
                    position: trackingContext.index,
                    badgeFamilies: [],
                    relatedSourceId: null,
                    relatedSourceType: null,
                }),
            );
        }
    };

    renderCourseRatings(course: Course) {
        const {ninterpolate} = this.props;
        if (!course.rating) {
            return null;
        }
        const ratings = ninterpolate(
            '%(rating)s rating',
            '%(rating)s ratings',
            Number.parseInt(String(course.num_reviews), 10),
            {rating: formatNumberCompact(course.num_reviews)},
        );
        return (
            <div data-purpose="ratings" className={styles.section}>
                <span className={classNames('ud-text-xs', styles['subdued-text'])}>{ratings}</span>
                <StarRating
                    numeric={true}
                    rating={course.rating}
                    size={this.props.isSmMax ? 'medium' : 'large'}
                />
            </div>
        );
    }

    renderStudentCount(course: Course) {
        const {gettext} = this.props;
        if (!course.num_subscribers) {
            return null;
        }
        const numStudentsText = formatNumberCompact(course.num_subscribers);
        return (
            <div data-purpose="enrollment" className={styles.section}>
                <span className={classNames('ud-text-xs', styles['subdued-text'])}>
                    {gettext('students')}
                </span>
                <span className={this.props.isSmMax ? 'ud-heading-md' : 'ud-heading-lg'}>
                    {numStudentsText}
                </span>
            </div>
        );
    }

    renderContentLength(course: Course) {
        const {gettext} = this.props;
        if (!course.content_info_short) {
            return null;
        }
        return (
            <div data-purpose="content-length" className={styles.section}>
                <span className={classNames('ud-text-xs', styles['subdued-text'])}>
                    {gettext('total content')}
                </span>
                <span className={this.props.isSmMax ? 'ud-heading-md' : 'ud-heading-lg'}>
                    {course.content_info_short}
                </span>
            </div>
        );
    }

    renderCourseActionCTA(course: Course) {
        const {Config: udConfig} = this.props.udData;
        const buttonProps: ButtonProps = {
            udStyle: 'primary',
            size: 'medium',
            className: styles['course-action-cta'],
        };
        if (!udConfig.brand.has_organization) {
            const saveButtonProps = {
                ...buttonProps,
                labelPosition: 'right' as const,
                label: gettext('Save'),
            };
            return (
                <SaveToListButton
                    course={course}
                    data-purpose="save-list-button"
                    uiRegion={UI_REGION.BOTTOM_DRAWER}
                    {...saveButtonProps}
                />
            );
        }
        return (
            <AddCourseToLearningPathButton
                course={course as BrowseCourse}
                data-purpose="add-to-learning-path-button"
                store={new AddCourseToLearningPathButtonStore()}
                buttonProps={buttonProps}
            />
        );
    }

    render() {
        const {gettext, udData, course, lecture} = this.props;
        const {Config: udConfig} = udData;

        if (!course) {
            return null;
        }
        const courseCTALink = getCourseLinkCTA({udConfig, course, lecture});
        return (
            <div
                className={styles.container}
                role="region"
                aria-label={gettext('View Course')}
                data-purpose="container"
            >
                <h3
                    className={classNames('ud-heading-md', styles['course-title'])}
                    data-purpose="course-title"
                >
                    <a
                        href={courseCTALink}
                        onClick={() => handleCourseCTAClick(course, this.props.trackingContext)}
                    >
                        {course.title}
                    </a>
                </h3>
                <span className={styles.divider}></span>
                <div className={styles['meta-data']}>
                    {this.renderCourseRatings(course)}
                    {this.renderStudentCount(course)}
                    {this.renderContentLength(course)}
                </div>
                <TrackImpression trackFunc={() => this.trackCourseCTAImpression(course)}>
                    <Button
                        udStyle="brand"
                        size="medium"
                        componentClass="a"
                        data-purpose="view-course-button"
                        className={styles['course-cta']}
                        href={courseCTALink}
                        onClick={() => handleCourseCTAClick(course, this.props.trackingContext)}
                    >
                        {gettext('View course')}
                    </Button>
                </TrackImpression>
                {this.renderCourseActionCTA(course)}
            </div>
        );
    }
}

export const LectureViewCourseCard = withI18n(withUDData(InternalLectureViewCourseCard));
