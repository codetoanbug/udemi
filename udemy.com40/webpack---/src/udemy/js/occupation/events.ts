import {Tracker, ClientEvent} from '@udemy/event-tracking';

import {UIRegionOptions} from 'browse/ui-regions';

/**
 This event is fired when a user interacts with flow progressing elements in
 the Occupation exploration process
 TODO: OccupationFlowProgressionEvent will deprecate after atomic level implementation is complete.
 */
interface OccupationFlowProgressionEventProps {
    progression: number;
    selection: string;
    selectionType: string;
}
export class OccupationFlowProgressionEvent extends ClientEvent {
    progression: number;
    selection: string;
    selectionType: string;
    constructor({progression, selection, selectionType}: OccupationFlowProgressionEventProps) {
        super('OccupationFlowProgressionEvent');
        this.progression = progression;
        this.selection = selection;
        this.selectionType = selectionType;
    }
}

interface OccupationGoalHeaderEventProps {
    careerGoal?: string;
    occupationName?: string;
    occupationId?: number;
    occupationGroupName?: string;
    occupationGroupId?: number;
}
/**
 Fires when user sees user's occupation goal header component.
 */
export class OccupationGoalHeaderImpressionEvent extends ClientEvent {
    careerGoal?: string;
    occupationName?: string;
    occupationId?: number;
    occupationGroupName?: string;
    occupationGroupId?: number;
    constructor({
        careerGoal,
        occupationName,
        occupationId,
        occupationGroupName,
        occupationGroupId,
    }: OccupationGoalHeaderEventProps) {
        super('OccupationGoalHeaderImpressionEvent');
        this.careerGoal = careerGoal;
        this.occupationName = occupationName;
        this.occupationId = occupationId;
        this.occupationGroupName = occupationGroupName;
        this.occupationGroupId = occupationGroupId;
    }
}

interface OccupationFlowEditEventProps {
    currentOccupationId?: number;
    currentOccupationName?: string;
    currentOccupationGroupId?: number;
    currentOccupationGroupName?: string;
    currentCareerGoal?: string;
    uiRegion: string;
}
/**
 Fires when a user clicks the "Edit goal" button on the occupation header component or
"Edit profession" button on the recommendation unit.
*/
export class OccupationFlowEditEvent extends ClientEvent {
    currentOccupationId?: number;
    currentOccupationName?: string;
    currentOccupationGroupId?: number;
    currentOccupationGroupName?: string;
    currentCareerGoal?: string;
    uiRegion: string;
    constructor({
        currentOccupationId,
        currentOccupationName,
        currentOccupationGroupId,
        currentOccupationGroupName,
        currentCareerGoal,
        uiRegion,
    }: OccupationFlowEditEventProps) {
        super('OccupationFlowEditEvent');
        this.currentOccupationId = currentOccupationId;
        this.currentOccupationName = currentOccupationName;
        this.currentOccupationGroupId = currentOccupationGroupId;
        this.currentOccupationGroupName = currentOccupationGroupName;
        this.currentCareerGoal = currentCareerGoal;
        this.uiRegion = uiRegion;
    }
}

interface OccupationFlowStartEventProps {
    nonInteraction: boolean;
    uiRegion: string;
}

export class OccupationFlowStartEvent extends ClientEvent {
    nonInteraction: boolean;
    uiRegion: string;
    constructor({nonInteraction, uiRegion}: OccupationFlowStartEventProps) {
        super('OccupationFlowStartEvent');
        this.nonInteraction = nonInteraction;
        this.uiRegion = uiRegion;
    }
}

export const enum ItemType {
    SEARCH = 'search',
    TOPIC = 'topic',
    SUBCATEGORY = 'subcategory',
}

export const enum LearningMapLevels {
    SKILL = 'SKILL',
    SUBJECT = 'SUBJECT',
    CONCEPT_GROUP = 'CONCEPT_GROUP',
}

interface CareerTrackPageLinkClickEventProps {
    displayTitle: string;
    uiRegion: string;
    trackingId: string;
    sourcePageType: string | undefined;
    sourcePageId: number | undefined;
}

interface CareerTrackPageLinkmpressionEventProps {
    displayTitle: string;
    uiRegion: string;
    sourcePageType: string | undefined;
    sourcePageId: number | undefined;
}

/**
 Fires when a user click on a career track entry point
 */
export class CareerTrackPageLinkClickEvent extends ClientEvent {
    displayTitle: string;
    uiRegion: string;
    trackingId: string;
    sourcePageType: string | undefined;
    sourcePageId: number | undefined;
    constructor({
        displayTitle,
        uiRegion,
        trackingId,
        sourcePageType,
        sourcePageId,
    }: CareerTrackPageLinkClickEventProps) {
        super('CareerTrackPageLinkClickEvent');
        this.displayTitle = displayTitle;
        this.uiRegion = uiRegion;
        this.trackingId = trackingId;
        this.sourcePageType = sourcePageType;
        this.sourcePageId = sourcePageId;
    }
}

/**
 Fires when a career track page entry point is presented to the user
 */
export class CareerTrackPageLinkImpressionEvent extends ClientEvent {
    displayTitle: string;
    uiRegion: string;
    sourcePageType: string | undefined;
    sourcePageId: number | undefined;
    constructor({
        displayTitle,
        uiRegion,
        sourcePageType,
        sourcePageId,
    }: CareerTrackPageLinkmpressionEventProps) {
        super('CareerTrackPageLinkImpressionEvent');
        this.displayTitle = displayTitle;
        this.uiRegion = uiRegion;
        this.sourcePageType = sourcePageType;
        this.sourcePageId = sourcePageId;
    }
}

/**
 Fires when a user adds the career track page link unit to their my learning page
 */
interface CareerTrackPageLinkAddEventProps {
    displayTitle: string;
    nonInteraction: boolean;
}
export class CareerTrackPageLinkAddEvent extends ClientEvent {
    displayTitle: string;
    nonInteraction: boolean;
    constructor({displayTitle, nonInteraction}: CareerTrackPageLinkAddEventProps) {
        super('CareerTrackPageLinkAddEvent');
        this.displayTitle = displayTitle;
        this.nonInteraction = nonInteraction;
    }
}

/**
 Fires when a user removes the career track page link unit from their my learning page
 */
interface CareerTrackPageLinkRemoveEventProps {
    displayTitle: string;
}
export class CareerTrackPageLinkRemoveEvent extends ClientEvent {
    displayTitle: string;
    constructor({displayTitle}: CareerTrackPageLinkRemoveEventProps) {
        super('CareerTrackPageLinkRemoveEvent');
        this.displayTitle = displayTitle;
    }
}

/**
 Fires when a user clicks on a concept that leads to search
 result page or topic/subcategory page
 */
interface LearningMapItemClickEventProps {
    displayTitle: string;
    type: ItemType;
    label: string;
    itemLink: string;
    uiRegion: UIRegionOptions;
    careerGuide: string;
    trackingId: string | null;
}
export class LearningMapItemClickEvent extends ClientEvent {
    displayTitle: string;
    type: ItemType;
    label: string;
    itemLink: string;
    uiRegion: UIRegionOptions;
    careerGuide: string;
    trackingId: string | null;
    constructor({
        displayTitle,
        type,
        label,
        itemLink,
        uiRegion,
        careerGuide,
        trackingId,
    }: LearningMapItemClickEventProps) {
        super('LearningMapItemClickEvent');
        this.displayTitle = displayTitle;
        this.type = type;
        this.label = label;
        this.itemLink = itemLink;
        this.uiRegion = uiRegion;
        this.careerGuide = careerGuide;
        this.trackingId = trackingId;
    }
}

/**
 Fires when a user clicks on an item in the desktop side nav area
    OR
    when a user expands a region on mobile
    OR
    when a user clicks on a subject header and redirects to the associated topic/category page
 */
interface LearningMapNavigationItemClickEventProps {
    name: string;
    level: LearningMapLevels;
    url?: string;
    uiRegion: UIRegionOptions;
    careerGuide: string;
}
export class LearningMapNavigationItemClickEvent extends ClientEvent {
    name: string;
    level: LearningMapLevels;
    url?: string;
    uiRegion: UIRegionOptions;
    careerGuide: string;
    constructor({
        name,
        level,
        url,
        uiRegion,
        careerGuide,
    }: LearningMapNavigationItemClickEventProps) {
        super('LearningMapNavigationItemClickEvent');
        this.name = name;
        this.level = level;
        this.url = url;
        this.uiRegion = uiRegion;
        this.careerGuide = careerGuide;
    }
}

const alreadyImpressedLearningMapItems = new Set();

export function trackLearningMapImpression(props: LearningMapItemImpressionEventProps) {
    // We need a way to determine whether a particular item has been impressed,
    // and we're using a delimited string since we don't have a UUID to rely upon here
    const impressionId = `${props.name}-${props.level}-${props.uiRegion}`;

    if (!alreadyImpressedLearningMapItems.has(impressionId)) {
        alreadyImpressedLearningMapItems.add(impressionId);

        Tracker.publishEvent(
            new LearningMapItemImpressionEvent({
                name: props.name,
                level: props.level,
                uiRegion: props.uiRegion,
                careerGuide: props.careerGuide,
            }),
        );
    }
}

/**
 Fires when a user sees a learning map section of the career track page
 */
interface LearningMapItemImpressionEventProps {
    name: string;
    level: LearningMapLevels;
    uiRegion: UIRegionOptions;
    careerGuide: string;
}
export class LearningMapItemImpressionEvent extends ClientEvent {
    name: string;
    level: LearningMapLevels;
    uiRegion: string;
    careerGuide: string;
    constructor({name, level, uiRegion, careerGuide}: LearningMapItemImpressionEventProps) {
        super('LearningMapItemImpressionEvent');
        this.name = name;
        this.level = level;
        this.uiRegion = uiRegion;
        this.careerGuide = careerGuide;
    }
}
