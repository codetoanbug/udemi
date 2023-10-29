import {Tracker} from '@udemy/event-tracking';

import udMe from 'utils/ud-me';

import {LearningPathCreateEvent} from '../tracking-events';

class ListEventTracker {
    clickedCreateCourse() {
        Tracker.publishEvent(
            new LearningPathCreateEvent({
                userRole: udMe.organization.role,
            }),
        );
    }
}

export default new ListEventTracker();
