import {observable} from 'mobx';

import {parsePrimaryCourseLabel} from 'organization-common/utils';
import udLink from 'utils/ud-link';

import LearningPathItemContent from './learning-path-item-content.mobx-model';

export default class LearningPathCoursePortion extends LearningPathItemContent {
    @observable selectedItemsMap = {};

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            title: {
                source: 'course',
                map: (course) => course.title,
            },
            image: {
                source: 'course',
                map: (course) => course.image_125_H,
            },
            imageMobile: {
                source: 'course',
                map: (course) => course.image_75x75,
            },
            numItems: {
                source: 'course',
                map: (course) => course.num_of_published_curriculum_objects,
            },
            numSelectedItems: 'num_selected_items',
            _courseId: {
                source: 'course',
                map: (course) => course.id,
            },
            selectedItemsMap: {
                // Pre loaded map of selected items
                source: 'items',
                map: (items) => {
                    const res = {};
                    items.forEach((item) => {
                        res[item] = 1;
                    });
                    return res;
                },
            },
            courseLabel: {
                source: 'course',
                map: (course) => {
                    const courseHasLabels = course.course_has_labels;
                    return parsePrimaryCourseLabel(courseHasLabels);
                },
            },
            retirementDate: {
                source: 'course',
                map: (course) => course.retirement_date,
            },
            isCourseAvailableInOrg: {
                source: 'course',
                map: (course) => course.is_course_available_in_org,
            },
        };
    }

    get courseId() {
        return this._courseId;
    }

    _checkItemSelection(item) {
        item.setIsSelected(!!this.selectedItemsMap[[item.type, item.id]]);
    }

    async enroll(data = {}) {
        const response = await super.enroll({course_portion_id: this.id, ...data});
        return response;
    }

    get copyLinkUrl() {
        return udLink.makeAbsolute(this.enrollUrl);
    }
}
