import {Tracker} from '@udemy/event-tracking';

import {
    OccupationCardClickEvent,
    OccupationCardEventData,
    OccupationCardImpressionEvent,
} from 'browse/events';

export const useOccupationImpression = ({
    occupationId,
    occupationName,
    index,
    uiRegion,
}: OccupationCardEventData) => {
    const trackOccupationCardImpressionEvent = () => {
        const eventData: OccupationCardEventData = {
            occupationId,
            occupationName,
            index,
            uiRegion,
        };
        Tracker.publishEvent(new OccupationCardImpressionEvent(eventData));
    };
    const trackOccupationCardClickEvent = () => {
        const eventData: OccupationCardEventData = {
            occupationId,
            occupationName,
            index,
            uiRegion,
        };
        Tracker.publishEvent(new OccupationCardClickEvent(eventData));
    };

    return {trackOccupationCardImpressionEvent, trackOccupationCardClickEvent};
};
