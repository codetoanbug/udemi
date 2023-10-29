import {ClientEvent} from '@udemy/event-tracking';

import {LABS_DISCOVER_COMPONENTS} from 'browse/components/my-learning-unit/constants';

type Keys = keyof typeof LABS_DISCOVER_COMPONENTS;

type UiRegionType = typeof LABS_DISCOVER_COMPONENTS[Keys];

export class LabDiscoveryCardClickEvent extends ClientEvent {
    private labId: number;
    private courseId?: number;
    private uiRegion: UiRegionType;
    private trackingId?: string;
    private sourcePageId?: number;
    private sourcePageType?: string;

    constructor({
        labId,
        courseId = undefined,
        uiRegion,
        trackingId = undefined,
        sourcePageId = undefined,
        sourcePageType = undefined,
    }: {
        labId: number;
        uiRegion: UiRegionType;
        courseId?: number;
        trackingId?: string;
        sourcePageId?: number;
        sourcePageType?: string;
    }) {
        super('LabDiscoveryCardClickEvent');
        this.labId = labId;
        this.courseId = courseId;
        this.uiRegion = uiRegion;
        this.trackingId = trackingId;
        this.sourcePageId = sourcePageId;
        this.sourcePageType = sourcePageType;
    }
}

interface LabDiscoveryCardImpressionEventProps {
    labId: number;
    courseId?: number;
    uiRegion: UiRegionType;
    sourcePageId?: number;
    sourcePageType?: string;
}
export class LabDiscoveryCardImpressionEvent extends ClientEvent {
    labId: number;
    courseId?: number;
    uiRegion: UiRegionType;
    sourcePageId?: number;
    sourcePageType?: string;

    constructor({
        labId,
        courseId,
        uiRegion,
        sourcePageId,
        sourcePageType,
    }: LabDiscoveryCardImpressionEventProps) {
        super('LabDiscoveryCardImpressionEvent');
        this.labId = labId;
        this.courseId = courseId;
        this.uiRegion = uiRegion;
        this.sourcePageId = sourcePageId;
        this.sourcePageType = sourcePageType;
    }
}

export class ExploreLabsClickEvent extends ClientEvent {
    constructor() {
        super('ExploreLabsClickEvent');
    }
}

export class LabsInfoModalLaunchEvent extends ClientEvent {
    constructor() {
        super('LabsInfoModalLaunchEvent');
    }
}
