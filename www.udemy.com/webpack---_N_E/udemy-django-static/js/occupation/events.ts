import {UIRegionOptions} from 'udemy-django-static/js/browse/ui-regions';
import {ClientEvent, Tracker as tracker} from '@udemy/event-tracking';

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
}
/**
 Fires when user sees user's occupation goal header component.
 */
export class OccupationGoalHeaderImpressionEvent extends ClientEvent {
    careerGoal?: string;
    occupationName?: string;
    occupationId?: number;
    constructor({careerGoal, occupationName, occupationId}: OccupationGoalHeaderEventProps) {
        super('OccupationGoalHeaderImpressionEvent');
        this.careerGoal = careerGoal;
        this.occupationName = occupationName;
        this.occupationId = occupationId;
    }
}

interface OccupationFlowEditEventProps {
    currentOccupationId?: number;
    currentOccupationName?: string;
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
    currentCareerGoal?: string;
    uiRegion: string;
    constructor({
        currentOccupationId,
        currentOccupationName,
        currentCareerGoal,
        uiRegion,
    }: OccupationFlowEditEventProps) {
        super('OccupationFlowEditEvent');
        this.currentOccupationId = currentOccupationId;
        this.currentOccupationName = currentOccupationName;
        this.currentCareerGoal = currentCareerGoal;
        this.uiRegion = uiRegion;
    }
}

interface OccupationFlowStartEventProps {
    nonInteraction: boolean;
}

export class OccupationFlowStartEvent extends ClientEvent {
    nonInteraction: boolean;
    constructor({nonInteraction}: OccupationFlowStartEventProps) {
        super('OccupationFlowStartEvent');
        this.nonInteraction = nonInteraction;
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
}
export class LearningMapItemClickEvent extends ClientEvent {
    displayTitle: string;
    type: ItemType;
    label: string;
    itemLink: string;
    uiRegion: UIRegionOptions;
    constructor({displayTitle, type, label, itemLink, uiRegion}: LearningMapItemClickEventProps) {
        super('LearningMapItemClickEvent');
        this.displayTitle = displayTitle;
        this.type = type;
        this.label = label;
        this.itemLink = itemLink;
        this.uiRegion = uiRegion;
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
}
export class LearningMapNavigationItemClickEvent extends ClientEvent {
    name: string;
    level: LearningMapLevels;
    url?: string;
    uiRegion: UIRegionOptions;
    constructor({name, level, url, uiRegion}: LearningMapNavigationItemClickEventProps) {
        super('LearningMapNavigationItemClickEvent');
        this.name = name;
        this.level = level;
        this.url = url;
        this.uiRegion = uiRegion;
    }
}

const alreadyImpressedLearningMapItems = new Set();

export function trackLearningMapImpression(props: LearningMapItemImpressionEventProps) {
    // We need a way to determine whether a particular item has been impressed,
    // and we're using a delimited string since we don't have a UUID to rely upon here
    const impressionId = `${props.name}-${props.level}-${props.uiRegion}`;

    if (!alreadyImpressedLearningMapItems.has(impressionId)) {
        alreadyImpressedLearningMapItems.add(impressionId);

        tracker.publishEvent(
            new LearningMapItemImpressionEvent({
                name: props.name,
                level: props.level,
                uiRegion: props.uiRegion,
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
}
export class LearningMapItemImpressionEvent extends ClientEvent {
    name: string;
    level: LearningMapLevels;
    uiRegion: string;
    constructor({name, level, uiRegion}: LearningMapItemImpressionEventProps) {
        super('LearningMapItemImpressionEvent');
        this.name = name;
        this.level = level;
        this.uiRegion = uiRegion;
    }
}

export type OccupationDataFromOption = 'OCF' | 'OLP';
export type CareerGoalOption =
    | 'occupation-Aspiring'
    | 'occupation-Advancing'
    | 'management-Aspiring'
    | 'management-Advancing';

/**
    This events is fired when user sees user's occupation specific topic unit.
    Note: User's occupation is determined either by user submitted data in occupation collection flow or
    via the occupation landing page via which user converted to personal plan.
 */
interface OccupationTopicUnitImpressionEventProps {
    occupationId: number;
    occupationName: string;
    careerGoal?: CareerGoalOption;
    occupationDataFrom: OccupationDataFromOption;
}
export class OccupationTopicUnitImpressionEvent extends ClientEvent {
    occupationId: number;
    occupationName: string;
    careerGoal: CareerGoalOption | undefined;
    occupationDataFrom: OccupationDataFromOption;
    constructor({
        occupationId,
        occupationName,
        careerGoal,
        occupationDataFrom,
    }: OccupationTopicUnitImpressionEventProps) {
        super('OccupationTopicUnitImpressionEvent');
        this.occupationId = occupationId;
        this.occupationName = occupationName;
        this.careerGoal = careerGoal;
        this.occupationDataFrom = occupationDataFrom;
    }
}

/**
    This events if fired when user clicks on any one of the topic/skills in occupation specific topic unit.
    Note: User's occupation is determined either by user submitted data in occupation collection flow or
    via the occupation landing page via which user converted to personal plan.
 */
interface OccupationTopicUnitSkillClickEventProps {
    occupationId: number;
    occupationName: string;
    topicId: number;
    topicName: string;
    careerGoal?: CareerGoalOption;
    occupationDataFrom: OccupationDataFromOption;
}
export class OccupationTopicUnitSkillClickEvent extends ClientEvent {
    occupationId: number;
    occupationName: string;
    topicId: number;
    topicName: string;
    careerGoal: CareerGoalOption | undefined;
    occupationDataFrom: OccupationDataFromOption;
    constructor({
        occupationId,
        occupationName,
        topicId,
        topicName,
        careerGoal,
        occupationDataFrom,
    }: OccupationTopicUnitSkillClickEventProps) {
        super('OccupationTopicUnitSkillClickEvent');
        this.occupationId = occupationId;
        this.occupationName = occupationName;
        this.topicId = topicId;
        this.topicName = topicName;
        this.careerGoal = careerGoal;
        this.occupationDataFrom = occupationDataFrom;
    }
}
