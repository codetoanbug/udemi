import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {Button, ButtonProps} from '@udemy/react-core-components';
import {ItemCard} from '@udemy/react-structure-components';
import classNames from 'classnames';
import React from 'react';

import {InstructorProfileClickEvent, InstructorProfileClickEventData} from 'udemy-django-static/js/browse/events';
import AvatarGroup from 'udemy-django-static/js/organization-common/avatar-group/avatar-group.react-component';

import styles from './lecture-details.module.less';
import {LectureDetailsProps, Instructor} from './types';

export const LectureDetails = ({
    lectureTitle,
    courseTitle,
    buttonProps,
    visibleInstructors,
    currentIndex = 0,
    numOfLectures,
    ariaLive,
    isCompact = false,
    uiRegion,
    learnUrl,
}: LectureDetailsProps) => {
    const {gettext, interpolate, ngettext} = useI18n();
    const onInstructorClick = (instructor: Instructor) => {
        if (instructor.id) {
            const instructorEventData: InstructorProfileClickEventData = {
                instructorId: instructor.id,
                uiRegion,
            };
            Tracker.publishEvent(new InstructorProfileClickEvent(instructorEventData));
        }
    };

    const renderInstructors = () => {
        if (!visibleInstructors || visibleInstructors.length === 0) {
            return;
        }

        return (
            <ItemCard className={styles['instructor-container']} data-purpose="instructors-unit">
                <AvatarGroup
                    size="small"
                    users={visibleInstructors}
                    srcKey="image_100x100"
                    alt="NONE"
                    maxDisplayItems={2}
                />
                <div className={styles['instructor-name']}>
                    <span className="ud-sr-only">
                        {ngettext('Instructor:', 'Instructors:', visibleInstructors.length)}
                    </span>
                    {visibleInstructors.map((instructor, index) => {
                        return (
                            <a
                                key={instructor.id}
                                href={instructor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={classNames('ud-text-xs')}
                                onClick={() => onInstructorClick(instructor)}
                                data-purpose="instructor-link"
                            >
                                {instructor.display_name}
                                {index !== visibleInstructors.length - 1 && ', '}
                            </a>
                        );
                    })}
                </div>
            </ItemCard>
        );
    };

    const defaultButtonProps =
        learnUrl &&
        ({
            componentClass: 'a',
            target: '_blank',
            rel: 'noopener noreferrer',
            href: learnUrl,
        } as ButtonProps);

    return (
        <div className={styles.container}>
            <Button
                udStyle="link"
                className={styles['lecture-detail']}
                {...(buttonProps ?? defaultButtonProps)}
            >
                <h4
                    className={classNames('ud-heading-md', {
                        [styles['lecture-title-compact']]: isCompact,
                    })}
                    aria-live={ariaLive}
                    data-purpose="lecture-title"
                >
                    {ariaLive !== 'off' && numOfLectures && (
                        <span className="ud-sr-only">
                            {interpolate(
                                gettext('slide %(currentLectureIndex)s of %(numOfLectures)s'),
                                {currentLectureIndex: currentIndex + 1, numOfLectures},
                                true,
                            )}
                        </span>
                    )}
                    {lectureTitle}
                </h4>
                {!isCompact && (
                    <div className="ud-text-sm" data-purpose="course-title">
                        {courseTitle}
                    </div>
                )}
            </Button>
            {!isCompact && renderInstructors()}
        </div>
    );
};
