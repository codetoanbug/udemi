import {ClientEvent} from '@udemy/event-tracking';
import {LAB_MODE} from 'udemy-django-static/js/labs/constants';

type Keys = keyof typeof LAB_MODE;

type LabMode = typeof LAB_MODE[Keys];

export class LabsResumeBannerOpenWorkspaceClickEvent extends ClientEvent {
    private labId: number;
    private labInstanceUuid: string;
    private labVertical: string;
    private labCompletionMode: LabMode;
    private secondsLeftOnWorkspace: number;
    constructor({
        labId,
        labInstanceUuid,
        labVertical,
        labCompletionMode,
        secondsLeftOnWorkspace,
    }: {
        labId: number;
        labInstanceUuid: string;
        labVertical: string;
        labCompletionMode: LabMode;
        secondsLeftOnWorkspace: number;
    }) {
        super('LabsResumeBannerOpenWorkspaceClickEvent');
        this.labId = labId;
        this.labInstanceUuid = labInstanceUuid;
        this.labVertical = labVertical;
        this.labCompletionMode = labCompletionMode;
        this.secondsLeftOnWorkspace = secondsLeftOnWorkspace;
    }
}
