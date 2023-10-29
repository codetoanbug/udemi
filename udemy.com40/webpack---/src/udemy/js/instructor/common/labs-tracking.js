import {Tracker} from '@udemy/event-tracking';

import {InstructorLabActionEvent} from 'instructor/events';

export function trackClick(resource, extras) {
    Tracker.publishEvent(
        new InstructorLabActionEvent({
            labId: extras && extras.objectId ? extras.objectId : null,
            action: resource,
        }),
    );
}

export default trackClick;
