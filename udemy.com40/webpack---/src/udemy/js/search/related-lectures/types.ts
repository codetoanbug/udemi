import {AvatarUser} from '@udemy/react-core-components';

interface Instructor extends AvatarUser {
    url: string;
    image_100x100: string;
}

export interface Lecture {
    id: number;
    title: string;
    enroll_url: string;
    tracking_id: string;
    primary_topic_title: string;
    content_length: number;
    course?: Course;
    frontendTrackingId?: string;
}

interface Course {
    id: number;
    title: string;
    visible_instructors?: Instructor[];
    image_304x171?: string;
    image_480x270?: string;
    tracking_id?: string;
}

export const LDU_VARIANT = {
    CONTROL: 'control',
    ONLY_BOTTOM_DRAWER: 'only_bottom_drawer',
};

export interface SearchRelatedLecturesUnit {
    items: Lecture[];
    result_tracking_id: string;
    // Duplicate field for consistency with the Discovery API
    tracking_id: string;
    is_lab_intent: boolean;
    is_lecture_forbidden: boolean;
    ldu_variant: typeof LDU_VARIANT[keyof typeof LDU_VARIANT];
}
