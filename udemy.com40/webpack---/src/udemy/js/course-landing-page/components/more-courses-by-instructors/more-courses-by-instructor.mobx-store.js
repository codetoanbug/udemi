import {action, observable} from 'mobx';

import {DiscoveryItemImpressionEvent} from 'browse/events';
import {attachFrontendTrackingIds} from 'browse/tracking';
import {getVariantValue} from 'utils/get-experiment-data';
import udApi from 'utils/ud-api';

import apiParams, {FREE_COURSE_SUPPRESSION} from './constants';

export default class MoreCoursesByInstructorStore {
    @observable courses = [];
    @observable areCoursesLoaded = false;

    backendSource = DiscoveryItemImpressionEvent.backendSourceOptions.TAUGHT_COURSES;

    constructor(instructorId, courseId, context, subContext, organizationCoursesOnly) {
        this.instructorId = instructorId;
        this.courseId = courseId;
        this.context = context;
        this.subContext = subContext;
        this.organizationCoursesOnly = organizationCoursesOnly;
    }

    @action
    getCourses() {
        return udApi.get(this._buildApiUrl(), {params: this._getParams()}).then((response) => {
            this._setCourses(
                response.data.results
                    .filter((course) => course.id !== this.courseId)
                    .slice(0, apiParams.page_size - 1),
            );
        });
    }

    @action
    _setCourses(courses) {
        attachFrontendTrackingIds(courses);
        this.courses = courses;
        this.areCoursesLoaded = true;
    }

    _buildApiUrl() {
        return `users/${this.instructorId}/taught-courses/`;
    }

    _getParams() {
        const freeCourseSuppression = getVariantValue(
            'f2p',
            FREE_COURSE_SUPPRESSION.key,
            FREE_COURSE_SUPPRESSION.default_value,
        );

        const apiParamsWithExperiment = {
            ...apiParams,
        };

        if (freeCourseSuppression === FREE_COURSE_SUPPRESSION.variant) {
            apiParamsWithExperiment.filter_by_paid = true;
        }

        return Object.assign(
            {
                context: this.context,
                subcontext: this.subContext,
                organizationCoursesOnly: this.organizationCoursesOnly,
            },
            apiParamsWithExperiment,
        );
    }
}
