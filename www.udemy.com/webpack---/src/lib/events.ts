import {getUserConsentCategories} from '@udemy/shared-utils';

import {ClientEvent, Dimensions} from '../tracker/event-common';
import {TrackingContext} from '../tracker/tracker';

/**
 * Define application-wide events here;
 * define app- or component-specific events in the app or component directory.
 *
 * You need to exactly follow the schema definitions in this repository:
 * https://github.com/udemy/schema-store
 * If you need to create a new event, you first need to create it in that repository.
 * Subclass from ClientEvent base class. Name of the class should match the name of the schema in the
 * repo. Attributes should have one to one correspondence with the fields in the event schema.
 * Note that class attributes are snake_case versions of the camelCase schema fields.
 * This conversion is handled while serializing the event object to json.
 * For example, for ExampleEvent with schema ExampleEvent.avdl below:
 *
 * record ExampleEvent {
 *   EventClientHeader clientHeader;
 *   int exampleIntegerField;
 *   string exampleStringField;
 *   union { null, array<int> } exampleListField = null;
 * }
 *
 * You would have the following class in this file:
 *
 * class ExampleEvent extends ClientEvent {
 *     constructor({example_integer_field, example_string_field, example_list_field}) {
 *         super('ExampleEvent');
 *         this.example_integer_field = example_integer_field
 *         this.example_string_field = example_string_field
 *         this.example_list_field = example_list_field
 *     }
 * }
 */

/**
 * PublicTestEvent can be used for development purposes
 */
export class PublicTestEvent extends ClientEvent {
    testField1: string;
    testField2: number;

    constructor({testField1, testField2}: {testField1: string; testField2: number}) {
        super('PublicTestEvent');
        this.testField1 = testField1;
        this.testField2 = testField2;
    }
}

/**
 * ClientLoadEvent is fired when the backend rendered page is loaded in the browser.
 * It gives all fundamental information about the front-end application.
 */
export class ClientLoadEvent extends ClientEvent {
    appVersion?: string;
    appLanguage?: string;
    url?: string;
    referrer?: string | null;
    timezoneOffset?: number;
    screen?: Dimensions;
    source?: string;
    viewport?: Dimensions;
    userConsentCategories?: string;

    constructor() {
        super('ClientLoadEvent');
    }

    processContext(context: TrackingContext) {
        super.processContext(context);
        this.appVersion = context.appVersion;
        this.appLanguage = context.appLanguage;
        this.url = context.url;
        this.referrer = context.referrer;
        this.timezoneOffset = context.timezoneOffset;
        this.screen = context.screen;
        this.source = context.sourceServiceName;
        this.viewport = context.viewport;
        this.userConsentCategories = getUserConsentCategories(null);
    }
}

/**
 * PageViewEvent is fired when a backend rendered page is loaded in the browser or when the react
 * router changes the route.
 */
export class PageViewEvent extends ClientEvent {
    url?: string;

    constructor(public isRouteChange: boolean) {
        super('PageViewEvent');
    }

    processContext(context: TrackingContext) {
        super.processContext(context);
        this.url = context.url;
    }
}

/**
 * ResumePageViewEvent is fired when a page is loaded from the backward/forward cache.
 * This event is fired only in browsers that support bf cache.
 * https://web.dev/bfcache/
 */
export class PageResumeEvent extends ClientEvent {
    url?: string;

    constructor() {
        super('PageResumeEvent');
    }

    processContext(context: TrackingContext) {
        super.processContext(context);
        this.url = context.url;
    }
}

/**
 * Fired on a browser visibility change event, i.e. when a user
 * switches tabs/goes to another window/comes back etc.
 */
export class PageVisibilityChangeEvent extends ClientEvent {
    constructor(public isVisible: boolean) {
        super('PageVisibilityChangeEvent');
    }
}

/**
 This event is fired as a general-purpose click event when a tracked HTML element is clicked.

 !!IMPORTANT!! You should almost always trigger this event on keypress of enter/space to capture
 actions taken by keyboard users.

 e.g.
 <div onClick={this.handleAction} onKeyDown={onEnterAndSpace(this.handleAction)}>
 */
export class ClickEvent extends ClientEvent {
    componentName: string;
    trackingId?: string;
    relatedObjectType?: string;
    relatedObjectId?: number;

    static relatedObjectTypes = {
        codingExercise: 'coding_exercise',
        course: 'course',
        courseCategory: 'course_category',
        courseLabel: 'course_label',
        coursesubCategory: 'course_subcategory',
        lecture: 'lecture',
        practiceTest: 'practice_test',
        simpleQuiz: 'simple_quiz',
        user: 'user',
    };

    constructor({
        componentName,
        trackingId = undefined,
        relatedObjectType = undefined,
        relatedObjectId = undefined,
    }: {
        componentName: string;
        trackingId?: string;
        relatedObjectType?: string;
        relatedObjectId?: number;
    }) {
        super('ClickEvent');
        this.componentName = componentName;
        this.trackingId = trackingId;
        this.relatedObjectType = relatedObjectType;
        this.relatedObjectId = relatedObjectId;
    }
}
