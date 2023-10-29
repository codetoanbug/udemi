import {Tracker, ClickEvent} from '@udemy/event-tracking';
import ArrowRightIcon from '@udemy/icons/dist/arrow-right.ud-icon';
import CodeIcon from '@udemy/icons/dist/code.ud-icon';
import LightbulbIcon from '@udemy/icons/dist/lightbulb.ud-icon';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import QuizIcon from '@udemy/icons/dist/quiz.ud-icon';
import {inject} from 'mobx-react';
import React, {useCallback} from 'react';

import {BackendSourceOptions, DiscoveryItemClickEvent, EnrollNowEvent} from 'browse/events';
import {ITEM_EVENT_TYPES} from 'course-taking/curriculum/constants';
import {CurriculumItem} from 'search/types/curriculum-item';
import escapeHtml from 'utils/escape/escape-html';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getConfigData from 'utils/get-config-data';

import './course-card.less';

interface LessonTableProps {
    lessons: CurriculumItem[];
    query: string;
    trackingId: string;
    courseId: number;
    isConsumerSubsSubscriber?: boolean;
}

export const LessonTable = inject('isConsumerSubsSubscriber')(
    ({
        lessons,
        query,
        courseId,
        trackingId,
        isConsumerSubsSubscriber = false,
    }: LessonTableProps) => {
        const handleLessonClick = useCallback(
            (
                lessonId: number,
                fireEnrollNowEvent: boolean,
                lessonEventType: string | undefined,
                index: number,
            ) => (event: React.MouseEvent<HTMLTableRowElement>) => {
                // prevents parent click event from firing BrowseCourseCard
                event.stopPropagation();

                let relatedObjectType = '';
                switch (lessonEventType) {
                    case ITEM_EVENT_TYPES.LECTURE:
                        relatedObjectType = ClickEvent.relatedObjectTypes.lecture;
                        break;
                    case ITEM_EVENT_TYPES.PRACTICE_TEST:
                        relatedObjectType = ClickEvent.relatedObjectTypes.practiceTest;
                        break;
                    case ITEM_EVENT_TYPES.SIMPLE_QUIZ:
                        relatedObjectType = ClickEvent.relatedObjectTypes.simpleQuiz;
                        break;
                    case ITEM_EVENT_TYPES.CODING_EXERCISE:
                        relatedObjectType = ClickEvent.relatedObjectTypes.codingExercise;
                        break;
                    default:
                        relatedObjectType = ClickEvent.relatedObjectTypes.lecture;
                }

                Tracker.publishEvent(
                    new ClickEvent({
                        componentName: 'lessonTable',
                        relatedObjectType,
                        relatedObjectId: lessonId,
                        trackingId,
                    }),
                );
                Tracker.publishEvent(
                    new DiscoveryItemClickEvent({
                        id: lessonId,
                        type: lessonEventType?.replace('-', '_') ?? 'lecture',
                        trackingId,
                        serveTrackingId: trackingId, // DiscoveryItemClickEvent on courses are using same tracking id for both the fields.
                        backendSource: BackendSourceOptions.SEARCH_RECOMMENDATIONS,
                        position: index,
                        badgeFamilies: [],
                    }),
                );
                if (fireEnrollNowEvent) {
                    // this click enrolls user into course
                    Tracker.publishEvent(
                        new EnrollNowEvent({
                            buyable: {
                                id: courseId,
                                type: 'course',
                                trackingId,
                            },
                        }),
                    );
                }
            },
            [trackingId, courseId],
        );

        const udConfig = getConfigData();
        const hasOrganization = udConfig.brand.has_organization;

        const lessonTableHeader =
            hasOrganization || isConsumerSubsSubscriber ? (
                <>
                    <span className="ud-heading-xs" styleName="jump-right-in">
                        {gettext('Jump right in')}
                    </span>
                    <span
                        className="ud-text-xs"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'course-card:lectures-about-query',
                            html: ninterpolate(
                                '(%(count)s lecture about <q>%(query)s</q>)',
                                '(%(count)s lectures about <q>%(query)s</q>)',
                                lessons.length,
                                {
                                    count: lessons.length,
                                    query: escapeHtml(query),
                                },
                            ),
                            dataPurpose: 'lectures-about-query',
                        })}
                    />
                </>
            ) : (
                <>
                    {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
                    <h2
                        className="ud-heading-sm"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'course-card:lectures-about-query',
                            html: ninterpolate(
                                '%(count)s Lecture about <q>%(query)s</q>',
                                '%(count)s Lectures about <q>%(query)s</q>',
                                lessons.length,
                                {
                                    count: lessons.length,
                                    query: escapeHtml(query),
                                },
                            ),
                            dataPurpose: 'lectures-about-query',
                        })}
                    />
                </>
            );

        const renderSubscriberCurriculumLink = (lesson: CurriculumItem) => {
            return (
                <a
                    href={lesson.enroll_and_preview_url}
                    styleName="lesson-text interactive"
                    data-key={lesson.id}
                    data-purpose="curriculum-item-link"
                >
                    {renderCurriculumTitleContent(lesson.title, true, lesson.item_event_type)}
                </a>
            );
        };

        const renderCurriculumTitleContent = (
            title: string,
            isForLink: boolean,
            itemEventType = '',
        ) => {
            let icon = <PlayIcon label={gettext('lecture')} styleName="play-icon" />;
            let lessonText = gettext('Play lecture');
            if (hasOrganization || isConsumerSubsSubscriber) {
                if (itemEventType === ITEM_EVENT_TYPES.SIMPLE_QUIZ) {
                    icon = <LightbulbIcon label={false} styleName="play-icon" />;
                    lessonText = gettext('Start quiz');
                } else if (itemEventType === ITEM_EVENT_TYPES.CODING_EXERCISE) {
                    icon = <CodeIcon label={false} styleName="play-icon" />;
                    lessonText = gettext('Start coding exercise');
                } else if (itemEventType === ITEM_EVENT_TYPES.PRACTICE_TEST) {
                    icon = <QuizIcon label={false} styleName="play-icon" />;
                    lessonText = gettext('Start practice test');
                }
            }
            return (
                <>
                    {icon}
                    <span
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'course-card:lesson-title',
                            html: title,
                            dataPurpose: 'lesson-title',
                        })}
                    />
                    {isForLink && (
                        <span
                            styleName="lesson-text-indicator"
                            data-purpose="lesson-text-indicator"
                        >
                            <span>{lessonText}</span>
                            <ArrowRightIcon label={gettext('lecture')} color="inherit" />
                        </span>
                    )}
                </>
            );
        };

        return (
            <table styleName="lesson-table">
                <thead>
                    <tr>
                        <th colSpan={2}>{lessonTableHeader}</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.map((lesson, index) => (
                        <tr
                            key={lesson.id}
                            onClick={handleLessonClick(
                                lesson.id,
                                !!lesson.enroll_and_preview_url,
                                lesson.item_event_type,
                                index,
                            )}
                            onContextMenu={handleLessonClick(
                                lesson.id,
                                false,
                                lesson.item_event_type,
                                index,
                            )}
                        >
                            <td>
                                {lesson.enroll_and_preview_url ? (
                                    renderSubscriberCurriculumLink(lesson)
                                ) : (
                                    <div
                                        styleName="lesson-text"
                                        data-purpose="curriculum-item-name"
                                    >
                                        {renderCurriculumTitleContent(lesson.title, false)}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    },
);
