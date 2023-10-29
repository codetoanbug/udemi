import classNames from 'classnames';
import React, {AriaAttributes} from 'react';

import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {Button, ButtonProps} from '@udemy/react-core-components';
import {ItemCard, AvatarGroup} from '@udemy/react-structure-components';

import {InstructorProfileClickEvent, InstructorProfileClickEventData} from '../events';
import styles from './lecture-details.module.less';
import {Lecture, Instructor} from './types';

/** React Prop interface for the `LectureDetails` component */
export interface LectureDetailsProps {
    /** Lecture to show details for. */
    lecture: Lecture;
    /** UI region where the component using lecture details is displayed. */
    uiRegion: string;
    /** Optional button props to override default click behavior to lecture url. */
    buttonProps?: ButtonProps;
    /** False by default. Only renders lecture title when set to true.  */
    isCompact?: boolean;
    /** For stack lecture unit, identifies the current lecture index. */
    currentIndex?: number;
    /** For stack lecture unit, identifies the total number of lectures in the stack. */
    numOfLectures?: number;
    /** Optional aria live label. */
    ariaLive?: AriaAttributes['aria-live'];
    /** Optional context for screen reader. e.g. "Next Lecture" */
    srContext?: string;
}

/**
 * ### Lecture Details
 *
 * A React component that displays lecture details such as lecture title, course title and instructors of the course.
 */
export const LectureDetails = ({
    lecture,
    buttonProps,
    currentIndex = 0,
    numOfLectures,
    ariaLive,
    isCompact = false,
    uiRegion,
    srContext,
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
        const {instructors} = lecture.course;
        if (!instructors || instructors.length === 0) {
            return;
        }

        return (
            <ItemCard className={styles['instructor-container']} data-testid="instructors-unit">
                <AvatarGroup
                    users={instructors}
                    maxDisplayItems={2}
                    avatarProps={{
                        alt: 'NONE',
                        size: 'small',
                        srcKey: 'image_100x100',
                    }}
                />
                <div className={styles['instructor-name']}>
                    <span className="ud-sr-only">
                        {ngettext('Instructor:', 'Instructors:', instructors.length)}
                    </span>
                    {instructors.map((instructor, index) => {
                        return (
                            <a
                                key={instructor.id}
                                href={instructor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={classNames('ud-text-xs')}
                                onClick={() => onInstructorClick(instructor)}
                                data-testid="instructor-link"
                            >
                                {instructor.display_name}
                                {index !== instructors.length - 1 && ', '}
                            </a>
                        );
                    })}
                </div>
            </ItemCard>
        );
    };

    const defaultButtonProps =
        lecture?.url &&
        ({
            componentClass: 'a',
            target: '_blank',
            rel: 'noopener noreferrer',
            href: lecture?.url,
        } as ButtonProps);

    return (
        <div className={styles.container}>
            <Button
                udStyle="link"
                data-testid="lecture-link"
                className={styles['lecture-detail']}
                {...(buttonProps ?? defaultButtonProps)}
            >
                <h4
                    className={classNames('ud-heading-md', {
                        [styles['lecture-title-compact']]: isCompact,
                    })}
                    aria-live={ariaLive}
                    data-testid="lecture-title"
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
                    {srContext && <span className="ud-sr-only">{srContext}</span>}
                    {lecture.title}
                </h4>
                {!isCompact && (
                    <div className="ud-text-sm" data-testid="course-title">
                        {lecture.course.title}
                    </div>
                )}
            </Button>
            {!isCompact && renderInstructors()}
        </div>
    );
};
