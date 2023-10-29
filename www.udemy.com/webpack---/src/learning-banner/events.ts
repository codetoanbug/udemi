import {Tracker} from '@udemy/event-tracking';

import {LabActionEvent} from '../events/lab-action-event';
import {LabsResumeBannerContinueClickEvent} from '../events/labs-resume-banner-continue-click-event';
import {LabsResumeBannerDismissClickEvent} from '../events/labs-resume-banner-dismiss-click-event';
import {LabsResumeBannerEndLabClickEvent} from '../events/labs-resume-banner-end-lab-click-event';
import {LabsResumeBannerViewEvent} from '../events/labs-resume-banner-view-event';
import {ReviewLabsBannerDismissed} from '../events/review-labs-banner-dimissed';
import {ReviewLabsBannerSelected} from '../events/review-labs-banner-selected';
import {LabInstanceApiResponse} from '../types/labs';

export const sendLabsResumeBannerViewEvent = (labInstance: LabInstanceApiResponse) => {
    const eventData = {
        labId: labInstance.lab.id,
        labInstanceUuid: labInstance.uuid,
        labVertical: labInstance.lab.vertical,
        labCompletionMode: labInstance.lab.enrollment?.last_attempted_mode,
    };
    Tracker.publishEvent(new LabsResumeBannerViewEvent(eventData));
};

export const sendLabsResumeBannerContinueClickEvent = (labInstance: LabInstanceApiResponse) => {
    const eventData = {
        labId: labInstance.lab.id,
        labInstanceUuid: labInstance.uuid,
        labVertical: labInstance.lab.vertical,
        labCompletionMode: labInstance.lab.enrollment?.last_attempted_mode,
    };
    Tracker.publishEvent(new LabsResumeBannerContinueClickEvent(eventData));
};

export const sendLabsResumeBannerDismissClickEvent = (labInstance: LabInstanceApiResponse) => {
    const eventData = {
        labId: labInstance.lab.id,
        labInstanceUuid: labInstance.uuid,
        labVertical: labInstance.lab.vertical,
        labCompletionMode: labInstance.lab.enrollment?.last_attempted_mode,
    };
    Tracker.publishEvent(new LabsResumeBannerDismissClickEvent(eventData));
};

export const sendLabsResumeBannerEndLabClickEvent = (labInstance: LabInstanceApiResponse) => {
    const eventData = {
        labId: labInstance.lab.id,
        labInstanceUuid: labInstance.uuid,
        labVertical: labInstance.lab.vertical,
        labCompletionMode: labInstance.lab.enrollment?.last_attempted_mode,
    };
    Tracker.publishEvent(new LabsResumeBannerEndLabClickEvent(eventData));
};

export const sendLabClickEvent = (
    labInstance: LabInstanceApiResponse | undefined,
    action: string,
    labTaskId?: {toString: () => number},
    labTaskResourceId?: {toString: () => number},
    inSessionTimeBetweenViewAndCtaClick?: number,
    uiRegion?: string,
    labCompletionMode?: string,
    hasAutomatedLabReview = false,
) => {
    const eventData = {
        action,
        hasAutomatedLabReview,
        inSessionTimeBetweenViewAndCtaClick: inSessionTimeBetweenViewAndCtaClick || null,
        labCompletionMode: labCompletionMode || labInstance?.lab.enrollment.last_attempted_mode,
        labId: labInstance?.id.toString(),
        labInstanceUuid: labInstance?.uuid || null,
        labTaskId: labTaskId?.toString() || null,
        labTaskResourceId: labTaskResourceId?.toString() || null,
        labVertical: labInstance?.lab.vertical,
        uiRegion: uiRegion || null,
    };
    const eventObject = new LabActionEvent(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendReviewLabsBannerSelectedEvent = () => {
    Tracker.publishEvent(new ReviewLabsBannerSelected());
};

export const sendReviewLabsBannerDismissedEvent = (isMultipleLabsBanner: boolean) => {
    Tracker.publishEvent(new ReviewLabsBannerDismissed({isMultipleLabsBanner}));
};
