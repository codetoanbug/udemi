/**
 * COPIED from browse-course package - DO NOT make updates to this file
 */
import {ClientEvent} from '@udemy/event-tracking';

export const COURSE_BADGE_BESTSELLER = 'bestseller';
export const COURSE_BADGE_FREE = 'free';
export const COURSE_BADGE_HIGHEST_RATED = 'top_rated';
export const COURSE_BADGE_HOT_AND_NEW = 'hot_and_new';
export const COURSE_BADGE_NEW = 'new';
export const COURSE_BADGE_UPDATED_RECENTLY = 'updated_recently';
export const COURSE_BADGE_CODING_EXERCISES = 'coding_exercises';

/** The possible types that a Course Badge can be */
export type CourseBadgeFamily =
    | typeof COURSE_BADGE_BESTSELLER
    | typeof COURSE_BADGE_HIGHEST_RATED
    | typeof COURSE_BADGE_NEW
    | typeof COURSE_BADGE_HOT_AND_NEW
    | typeof COURSE_BADGE_FREE
    | typeof COURSE_BADGE_UPDATED_RECENTLY
    | typeof COURSE_BADGE_CODING_EXERCISES;

/**
 * Provides additional properties
 * for any object that can be tracked
 */
interface TrackableObject {
    /**
     * tracking ID of object
     */
    trackingId: string;
}

/**
 * A minimal representation of a buyable, or purchasable, item
 * used for event tracking
 */
interface Buyable {
    /**
     * Unique ID for given "type" of buyable
     */
    id: number;
    /**
     * Type of buyable
     */
    type: 'course' | 'subscription';
}

export type TrackableBuyable = Buyable & TrackableObject;

/**
 * Fired when user clicks the 'Enroll now' button
 */
class EnrollNowEvent extends ClientEvent {
    private buyable: TrackableBuyable;
    constructor({buyable}: {buyable: TrackableBuyable}) {
        super('EnrollNowEvent');
        this.buyable = buyable;
    }
}

/**
 * Fired when quick view is viewed by a user
 */
class QuickViewBoxOpenEvent extends ClientEvent {
    private id: number;
    private type?: string;
    private trackingId?: string;
    constructor({id, type, trackingId}: {id: number; type?: string; trackingId?: string}) {
        super('QuickViewBoxOpenEvent');
        this.id = id;
        this.trackingId = trackingId;
        this.type = type;
    }
}

/* export events in alphabetical order*/
export {EnrollNowEvent, QuickViewBoxOpenEvent};

export type {Buyable};
