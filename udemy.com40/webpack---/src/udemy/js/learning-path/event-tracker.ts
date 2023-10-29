import {Tracker} from '@udemy/event-tracking';

import {LearningPath, LearningPathReturnSelected} from 'learning-path/tracking-events-v2';

export class EventTracker {
    static returnToLearningPathClicked(
        learningPath: LearningPath,
        contentItemType: string,
        contentItemId: number,
    ) {
        Tracker.publishEvent(
            new LearningPathReturnSelected(learningPath, contentItemType, contentItemId),
        );
    }
}
