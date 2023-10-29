import {action, observable} from 'mobx';

import {I18nApi} from '@udemy/i18n';
import {escapeHtml} from '@udemy/shared-utils';

export interface ActivityNotificationActor {
    id: number;
    title: string;
    name: string;
    display_name: string;
    image_50x50: string;
    image_100x100: string;
    initials: string;
}

export interface ActivityNotificationActionObject {
    id: number;
    url: string;
    locale: {
        english_title: string;
    };
}

export interface ActivityNotificationTarget {
    id: number;
    title: string;
    url: string;
    content: unknown;
}

export interface ActivityNotificationActivity {
    id: number;
    timestamp: string;
    actor: ActivityNotificationActor;
    action_object: ActivityNotificationActionObject;
    target: ActivityNotificationTarget;
    text: string;
    is_read: string;
}

export interface ActivityNotificationReasonObject {
    relation: string;
    root: {
        action_object: ActivityNotificationActionObject;
        is_read: string;
        target: ActivityNotificationTarget;
        text: string;
        timestamp: string;
    };
}

export interface ActivityNotificationData {
    activities: ActivityNotificationActivity[];
    reason_object: ActivityNotificationReasonObject;
    target_url: string;
    template_id: string;
}

export class ActivityNotificationModel {
    isValid: boolean;
    activities: ActivityNotificationActivity[] = [];
    @observable isRead?: boolean;
    // computed by normalizeData()
    clickTrackingAction?: string;
    targetURL?: string;
    // computed by normalizeData() or set by ActivityNotificationsStore
    template?: string;
    constructor(data: ActivityNotificationData, i18nApi: I18nApi) {
        // The stuff that's not in extendObservable never changes, so it is not made observable.
        const normalizedData = normalizeData(data, i18nApi);

        // It's not unusual for the data to be invalid, as it's split between MySQL and Redis.
        // For example, if an Action object gets deleted from MySQL, corresponding
        // notifications aren't deleted from Redis. Such notifications would be invalid.
        this.isValid = !!(
            normalizedData &&
            data.activities &&
            data.activities.length > 0 &&
            data.target_url
        );

        // Note that we still want to do the Object.assign and extendObservable even if
        // !this.isValid so that ActivityNotificationsStore can keep track of how many
        // invalid activities were received.
        Object.assign(this, normalizedData || {}, {
            activities: data.activities || [],
            targetURL: data.target_url || '',
        });

        this.setIsRead(data.reason_object.root.is_read === 'True');
    }

    get mainActivity() {
        return this.activities[0];
    }

    @action
    setIsRead(value: boolean) {
        this.isRead = value;
    }
}

function normalizeData(data: ActivityNotificationData, i18nApi: I18nApi) {
    const {gettext, ngettext, interpolate, ninterpolate} = i18nApi;
    switch (data.template_id) {
        case 'announcement-comment-activity':
            return {
                clickTrackingAction: 'activity-comment',
                template: interpolateTemplate(
                    gettext(
                        '%(user)s commented on announcement: ' +
                            '<span class="subject">%(subject)s</span>',
                    ),
                    {
                        subject: data.reason_object.root.text,
                        user: pluralizeActors(data.activities, ninterpolate),
                    },
                    interpolate,
                ),
            };
        case 'announcement-made-activity':
            return {
                clickTrackingAction: 'announcement-made',
                template: interpolateTemplate(
                    gettext(
                        '%(user)s made an announcement: ' +
                            '<span class="subject">%(subject)s</span>',
                    ),
                    {
                        subject: data.reason_object.root.text,
                        user: pluralizeActors(data.activities, ninterpolate),
                    },
                    interpolate,
                ),
            };
        case 'captions-autocaptions-generated-activity':
            return {
                clickTrackingAction: 'captions-autocaptions-generated',
                template: interpolateTemplate(
                    gettext(
                        'Automatic captions have been created for your course, ' +
                            '<span class="subject">%(subject)s</span>',
                    ),
                    {
                        subject: data.reason_object.root.target.title,
                    },
                    interpolate,
                ),
            };
        case 'captions-translations-generated-activity':
            return {
                clickTrackingAction: 'captions-translations-generated',
                template: interpolateTemplate(
                    gettext(
                        'Your course <span class="subject">%(subject)s</span> ' +
                            'has been translated into %(language)s.',
                    ),
                    {
                        subject: data.reason_object.root.target.title,
                        language: data.reason_object.root.action_object.locale.english_title,
                    },
                    interpolate,
                ),
            };
        case 'captions-poor-quality-activity':
            return {
                clickTrackingAction: 'captions-poor-quality',
                template: interpolateTemplate(
                    gettext(
                        'Captions have been automatically generated for your course, ' +
                            '%(course)s, but have been disabled as they may not meet our ' +
                            'quality threshold.',
                    ),
                    {
                        course: data.reason_object.root.target.title,
                    },
                    interpolate,
                ),
            };
        case 'discussion-post-activity':
            return {
                clickTrackingAction: 'discussion-post',
                template: interpolateTemplate(
                    ngettext(
                        '%(count)s new question: <span class="subject">%(subject)s</span>',
                        '%(count)s new questions: <span class="subject">%(subject)s</span>',
                        data.activities.length,
                    ),
                    {
                        count: data.activities.length,
                        subject: data.reason_object.root.target.title,
                    },
                    interpolate,
                ),
            };
        case 'discussion-reply-given-activity':
            return {
                clickTrackingAction: 'discussion-reply',
                template: interpolateTemplate(
                    gettext(
                        '%(user)s replied to the question: ' +
                            '<span class="subject">%(subject)s</span>',
                    ),
                    {
                        subject: data.reason_object.root.target.title,
                        user: pluralizeActors(data.activities, ninterpolate),
                    },
                    interpolate,
                ),
            };
        case 'instructor-feedback-comment-activity':
            return {
                clickTrackingAction: 'practice-comment',
                template: interpolateTemplate(
                    gettext(
                        '%(user)s replied to your feedback in course: ' +
                            '<span class="subject">%(subject)s</span>',
                    ),
                    {
                        subject: data.reason_object.root.target.title,
                        user: pluralizeActors(data.activities, ninterpolate),
                    },
                    interpolate,
                ),
            };
        case 'own-practice-comment-activity':
            return {
                clickTrackingAction: 'practice-comment',
                template: interpolateTemplate(
                    gettext(
                        '%(user)s commented on your assignment in course: ' +
                            '<span class="subject">%(subject)s</span>',
                    ),
                    {
                        subject: data.reason_object.root.target.title,
                        user: pluralizeActors(data.activities, ninterpolate),
                    },
                    interpolate,
                ),
            };
        case 'peer-practice-comment-activity':
            return {
                clickTrackingAction: 'practice-comment',
                template: interpolateTemplate(
                    gettext(
                        '%(user)s replied to your feedback in course: ' +
                            '<span class="subject">%(subject)s</span>',
                    ),
                    {
                        subject: data.reason_object.root.target.title,
                        user: pluralizeActors(data.activities, ninterpolate),
                    },
                    interpolate,
                ),
            };
        case 'practice-feedback-activity':
            return {
                clickTrackingAction: 'practice-feedback',
                template: interpolateTemplate(
                    gettext(
                        '%(user)s submitted feedback on your assignment in course: ' +
                            '<span class="subject">%(subject)s</span>',
                    ),
                    {
                        subject: data.reason_object.root.target.title,
                        user: pluralizeActors(data.activities, ninterpolate),
                    },
                    interpolate,
                ),
            };
        case 'practice-submission-activity':
            return {
                clickTrackingAction: 'practice-submission',
                template: interpolateTemplate(
                    gettext(
                        '%(user)s submitted a response to an assignment in course: ' +
                            '<span class="subject">%(subject)s</span>',
                    ),
                    {
                        subject: data.reason_object.root.target.title,
                        user: pluralizeActors(data.activities, ninterpolate),
                    },
                    interpolate,
                ),
            };
        case 'review-response-given-activity':
            return {
                clickTrackingAction: 'review-response',
                template: interpolateTemplate(
                    gettext(
                        '%(user)s responded to your review: <span class="subject">%(subject)s</span>',
                    ),
                    {
                        subject: data.reason_object.root.target.content,
                        user: pluralizeActors(data.activities, ninterpolate),
                    },
                    interpolate,
                ),
            };
        case 'user-test-video-asset-failed-activity':
            return {
                clickTrackingAction: 'user-test-video-failed',
                template: gettext('Oops! Your test video didn’t come through. Let’s fix that.'),
            };
        case 'user-test-video-comment-activity':
            return {
                clickTrackingAction: 'user-test-video-commented',
                template: gettext('We have a new comment about your test video.'),
            };
        case 'user-test-video-negative-review-given-activity':
            return {
                clickTrackingAction: 'user-test-video-negative-review-given',
                template: gettext(
                    'Good job on the test video! Here’s what worked and what can change.',
                ),
            };
        case 'user-test-video-review-given-activity':
            return {
                clickTrackingAction: 'user-test-video-review-given',
                template: gettext('Your test video skills are sharp! Come get your praise.'),
            };
        case 'instructor-course-lecture-deleted-activity':
            return {
                clickTrackingAction: 'instructor-course-lecture-deleted-given',
                template: ngettext(
                    'The lecture that you requested to be deleted is now deleted.',
                    'The lectures that you requested to be deleted are now deleted.',
                    data.activities.length,
                ),
            };
        case 'instructor-course-quiz-deleted-activity':
            return {
                clickTrackingAction: 'instructor-course-quiz-deleted-given',
                template: ngettext(
                    'The quiz that you requested to be deleted is now deleted.',
                    'The quizzes that you requested to be deleted are now deleted.',
                    data.activities.length,
                ),
            };
        case 'instructor-course-assignment-deleted-activity':
            return {
                clickTrackingAction: 'instructor-course-assignment-deleted-given',
                template: ngettext(
                    'The assignment that you requested to be deleted is now deleted.',
                    'The assignments that you requested to be deleted are now deleted.',
                    data.activities.length,
                ),
            };
        case 'instructor-course-assessment-deleted-activity':
            return {
                clickTrackingAction: 'instructor-course-assessment-deleted-given',
                template: ngettext(
                    'The assessment that you requested to be deleted is now deleted.',
                    'The assessments that you requested to be deleted are now deleted.',
                    data.activities.length,
                ),
            };
        default:
            return null;
    }
}

function interpolateTemplate(template: string, context = {}, interpolate: I18nApi['interpolate']) {
    const escapedContext = {};
    Object.entries(context).forEach(([key, value]) => {
        Object.assign(escapedContext, {
            [key]: escapeHtml(value),
        });
    });
    return interpolate(template, escapedContext, true);
}

function pluralizeActors(
    activities: ActivityNotificationActivity[],
    ninterpolate: I18nApi['ninterpolate'],
) {
    if (activities.length === 1) {
        return activities[0].actor.title;
    }
    if (activities.length > 1) {
        return ninterpolate(
            '%(name)s and %(count)s other',
            '%(name)s and %(count)s others',
            activities.length - 1,
            {name: activities[0].actor.title, count: activities.length - 1},
        );
    }
    return '';
}
