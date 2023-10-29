import {ClientEvent} from '@udemy/event-tracking';

import {ASSET_TYPE} from 'asset/constants';

import {CourseAnalyticsEntity} from '../events-v2';

interface LectureAnalyticsEntity {
    id: number;
    type: LectureType;
}

export const enum LectureType {
    VIDEO = 'video',
    VIDEO_MASHUP = 'video_mashup',
    AUDIO = 'audio',
    ARTICLE = 'article',
    PRESENTATION = 'presentation',
    FILE = 'file', // includes "ebook"
    EXTERNAL_LINK = 'external_link', // includes iframe
    MISSING_CONTENT = 'missing_content', // weird artifact when instructors are editing lectures
}

export class LectureStarted extends ClientEvent {
    constructor(
        public lecture: LectureAnalyticsEntity,
        public course: CourseAnalyticsEntity | null,
    ) {
        super('LectureStarted');
    }
}

export class LectureCompleted extends ClientEvent {
    constructor(
        public lecture: LectureAnalyticsEntity,
        public course: CourseAnalyticsEntity | null,
    ) {
        super('LectureCompleted');
    }
}

export const MAP_LECTURE_TYPE_FOR_ANALYTICS_EVENTS = Object.freeze({
    [ASSET_TYPE.VIDEO]: LectureType.VIDEO,
    [ASSET_TYPE.VIDEO_MASHUP]: LectureType.VIDEO_MASHUP,
    [ASSET_TYPE.PRESENTATION]: LectureType.PRESENTATION,
    [ASSET_TYPE.AUDIO]: LectureType.AUDIO,
    [ASSET_TYPE.ARTICLE]: LectureType.ARTICLE,
    [ASSET_TYPE.FILE]: LectureType.FILE,
    [ASSET_TYPE.EBOOK]: LectureType.FILE,
    [ASSET_TYPE.IFRAME]: LectureType.EXTERNAL_LINK,
    [ASSET_TYPE.IMPORT_CONTENT]: LectureType.EXTERNAL_LINK,
    [ASSET_TYPE.EXTERNAL_LINK]: LectureType.EXTERNAL_LINK, // DeprecatedAsset component, shows button/link
    [ASSET_TYPE.UPCOMING]: LectureType.MISSING_CONTENT,
});
