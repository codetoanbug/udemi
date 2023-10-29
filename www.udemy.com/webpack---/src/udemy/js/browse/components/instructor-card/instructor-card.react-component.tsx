import {Tracker, TrackImpression, ClickEvent} from '@udemy/event-tracking';
import {withI18n, WithI18nProps, LocalizedHtml} from '@udemy/i18n';
import {Avatar} from '@udemy/react-core-components';
import {StarRating} from '@udemy/react-merchandising-components';
import {ItemCard} from '@udemy/react-structure-components';
import classNames from 'classnames';
import React from 'react';

import {DiscoveryItemImpressionEvent} from 'browse/events';
import {discoveryTracker} from 'browse/tracking';

import styles from './instructor-card.less';

export interface Instructor {
    id: number;
    num_visible_taught_courses: number;
    title: string;
    avg_rating: number;
    total_num_students: number;
    tracking_id?: string;
    course_labels: Array<string>;
    url: string;
}

export interface InstructorCardProps {
    instructor: Instructor;
    className?: string;
    withContainer?: boolean;
    vertical?: boolean;
    index?: number;
    componentName: string;
    titleTag?: React.ElementType;
}

class InternalInstructorCard extends React.Component<InstructorCardProps & WithI18nProps> {
    static defaultProps = {
        className: '',
        withContainer: false,
        vertical: false,
        index: -1,
        titleTag: 'div' as React.ElementType,
    };

    trackDiscoveryImpression = () => {
        const trackingContext = {
            backendSource: DiscoveryItemImpressionEvent.backendSourceOptions.DISCOVERY,
            index: this.props.index,
        };
        const item = {...this.props.instructor};
        discoveryTracker.trackDiscoveryImpression({item}, trackingContext);
    };

    trackClickEvent = () => {
        Tracker.publishEvent(
            new ClickEvent({
                componentName: this.props.componentName,
                relatedObjectType: ClickEvent.relatedObjectTypes.user,
                relatedObjectId: this.props.instructor.id,
                trackingId: this.props.instructor.tracking_id,
            }),
        );
    };

    render() {
        const {instructor, withContainer, vertical, gettext, ninterpolate} = this.props;
        const TitleTag = this.props.titleTag ?? 'div';
        return (
            <TrackImpression trackFunc={this.trackDiscoveryImpression}>
                <ItemCard
                    className={classNames(this.props.className, {
                        [styles['card-container']]: withContainer,
                        [styles['card-vertical']]: vertical,
                    })}
                >
                    <ItemCard.ImageWrapper>
                        <Avatar user={instructor} alt="NONE" />
                    </ItemCard.ImageWrapper>
                    <div className={classNames('ud-text-xs', styles.details)}>
                        <TitleTag>
                            <ItemCard.Title
                                href={instructor.url}
                                className={classNames('ud-text-md ud-text-bold', styles.title)}
                                onClick={this.trackClickEvent}
                            >
                                {instructor.title}
                            </ItemCard.Title>
                        </TitleTag>
                        <div className={classNames('ud-text-sm', styles['label-container'])}>
                            {instructor.course_labels.join(', ')}
                        </div>
                        <div className={styles['rating-wrapper']}>
                            <StarRating rating={instructor.avg_rating} numeric={true} />
                            <span className={styles['rating-title']}>
                                {gettext('Instructor rating')}
                            </span>
                        </div>
                        <div>
                            <LocalizedHtml
                                html={ninterpolate(
                                    '<span class="bold">%(count)s</span> student',
                                    '<span class="bold">%(count)s</span> students',
                                    instructor.total_num_students,
                                    {count: instructor.total_num_students.toLocaleString()},
                                )}
                                interpolate={{
                                    bold: <span className="ud-text-bold" />,
                                }}
                            />
                        </div>
                        <div>
                            <LocalizedHtml
                                html={ninterpolate(
                                    '<span class="bold">%(count)s</span> course',
                                    '<span class="bold">%(count)s</span> courses',
                                    instructor.num_visible_taught_courses,
                                    {
                                        count: instructor.num_visible_taught_courses.toLocaleString(),
                                    },
                                )}
                                interpolate={{
                                    bold: <span className="ud-text-bold" />,
                                }}
                            />
                        </div>
                    </div>
                </ItemCard>
            </TrackImpression>
        );
    }
}

export const InstructorCard = withI18n(InternalInstructorCard);
