import {BackendSourceOptions} from '@udemy/browse-event-tracking';

import {Instructor} from '../lecture-details/types';

export const LECTURE_CARD_SIZES = {
    SMALL: 'small',
    LARGE: 'large',
};

export interface TrackingContext {
    backendSource: BackendSourceOptions;
    trackingId: string;
    frontendTrackingId: string;
    position: number;
}

interface Course {
    title: string;
    instructors?: Instructor[];
    image: string;
}

export interface Lecture {
    title: string;
    url?: string;
    id: number;
    duration: string;
    image?: string;
    course: Course;
}
