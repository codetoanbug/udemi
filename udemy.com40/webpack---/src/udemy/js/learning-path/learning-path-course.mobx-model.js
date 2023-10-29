import {parsePrimaryCourseLabel} from 'organization-common/utils';
import udLink from 'utils/ud-link';

import LearningPathItemContent from './learning-path-item-content.mobx-model';

export default class LearningPathCourse extends LearningPathItemContent {
    get apiDataMap() {
        return {
            ...super.apiDataMap,
            title: 'title',
            image: 'image_125_H',
            imageMobile: 'image_75x75',
            // For full course all curriculum items are selected by default
            numItems: 'num_of_published_curriculum_objects',
            numSelectedItems: 'num_of_published_curriculum_objects',
            courseLabel: {
                source: 'course_has_labels',
                map: (courseHasLabels) => parsePrimaryCourseLabel(courseHasLabels),
            },
            retirementDate: 'retirement_date',
            isCourseAvailableInOrg: 'is_course_available_in_org',
        };
    }

    get copyLinkUrl() {
        return udLink.makeAbsolute(this.enrollUrl);
    }
}
