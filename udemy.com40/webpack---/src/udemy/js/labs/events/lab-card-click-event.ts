import {ClientEvent} from '@udemy/event-tracking';

import {LABS_DISCOVER_COMPONENTS} from 'browse/components/my-learning-unit/constants';

type Keys = keyof typeof LABS_DISCOVER_COMPONENTS;

type UiRegionType = typeof LABS_DISCOVER_COMPONENTS[Keys];
export class LabCardClickEvent extends ClientEvent {
    private labId: string;
    private page: number;
    private index: number;

    private uiRegion: UiRegionType;
    constructor({
        labId,
        page,
        index,
        uiRegion,
    }: {
        labId: string;
        page: number;
        index: number;
        uiRegion: UiRegionType;
    }) {
        super('LabCardClickEvent');
        this.labId = labId;
        this.page = page;
        this.index = index;
        this.uiRegion = uiRegion;
    }
}
