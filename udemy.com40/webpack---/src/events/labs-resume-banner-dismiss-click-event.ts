import {ClientEvent} from '@udemy/event-tracking';

import {LAB_MODE} from '../constants';

type Keys = keyof typeof LAB_MODE;

type LabMode = (typeof LAB_MODE)[Keys];

export class LabsResumeBannerDismissClickEvent extends ClientEvent {
    private labId: number;
    private labInstanceUuid: string;
    private labVertical: string;
    private labCompletionMode: LabMode;
    constructor({
        labId,
        labInstanceUuid,
        labVertical,
        labCompletionMode,
    }: {
        labId: number;
        labInstanceUuid: string;
        labVertical: string;
        labCompletionMode: LabMode;
    }) {
        super('LabsResumeBannerDismissClickEvent');
        this.labId = labId;
        this.labInstanceUuid = labInstanceUuid;
        this.labVertical = labVertical;
        this.labCompletionMode = labCompletionMode;
    }
}
