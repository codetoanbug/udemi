import React, {useEffect, useState} from 'react';

import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import BaseCourseRetirementBanner from 'organization-common/course-retirement/course-retirement-banner.react-isocomponent';

interface CourseRetirementBannerProps {
    clcStore: CourseLandingComponentsStore;
}

interface GetCourseRetirementData {
    course_retirement?: CourseRetirementData;
}

interface CourseRetirementData {
    courseId?: string;
    courseLabelId?: string;
}

/**
 * Displays a notice banner on the CLP when a course is set to be retired:
 * https://business-support.udemy.com/hc/en-us/articles/115005650668
 * This is only possible for UB enterprise customers.
 * @see CourseRetirement in udemy/course_landing_page/components.py for conditional logic
 */
export const CourseRetirementBanner = ({clcStore}: CourseRetirementBannerProps) => {
    const [courseRetirementData, setCourseRetirementData] = useState<CourseRetirementData>();

    useEffect(() => {
        let isMounted = true;
        clcStore
            .getOrPopulate<GetCourseRetirementData>(['course_retirement'])
            .then((response) => {
                if (isMounted) {
                    setCourseRetirementData(response?.course_retirement);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [clcStore]);

    if (!courseRetirementData) {
        return null;
    }

    const {courseId, courseLabelId} = courseRetirementData;

    return (
        <BaseCourseRetirementBanner
            courseId={courseId}
            courseLabelId={courseLabelId}
            className="component-margin"
        />
    );
};
