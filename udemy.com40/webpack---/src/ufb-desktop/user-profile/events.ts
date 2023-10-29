import {ClientEvent} from '@udemy/event-tracking';

/**
 * Fired when a Pro feature link is selected by user
 */
export class OrganizationUserProFeatureLabSelectEvent extends ClientEvent {
    uiRegion: string;

    constructor({uiRegion}: {uiRegion: string}) {
        super('OrganizationUserProFeatureLabSelectEvent');
        this.uiRegion = uiRegion;
    }
}

export class OrganizationUserProFeatureAssessmentSelectEvent extends ClientEvent {
    uiRegion: string;

    constructor({uiRegion}: {uiRegion: string}) {
        super('OrganizationUserProFeatureAssessmentSelectEvent');
        this.uiRegion = uiRegion;
    }
}

export class OrganizationUserProFeatureUdemyPathSelectEvent extends ClientEvent {
    uiRegion: string;

    constructor({uiRegion}: {uiRegion: string}) {
        super('OrganizationUserProFeatureUdemyPathSelectEvent');
        this.uiRegion = uiRegion;
    }
}

export class OrganizationUserProFeatureWorkspaceSelectEvent extends ClientEvent {
    uiRegion: string;

    constructor({uiRegion}: {uiRegion: string}) {
        super('OrganizationUserProFeatureWorkspaceSelectEvent');
        this.uiRegion = uiRegion;
    }
}
