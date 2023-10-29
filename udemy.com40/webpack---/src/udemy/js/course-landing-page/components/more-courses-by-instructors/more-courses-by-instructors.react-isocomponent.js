import {ClientSideRender} from '@udemy/design-system-utils';
import {FunnelLogContextProvider} from '@udemy/funnel-tracking';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

import {UI_REGION} from 'browse/ui-regions';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {isomorphic} from 'utils/isomorphic-rendering';

import MoreCoursesByInstructor from './more-courses-by-instructor.react-component.js';
import MoreCoursesByInstructorsSkeleton from './more-courses-by-instructors-skeleton.react-component';

const MoreCoursesByInstructors = ({clcStore}) => {
    const [data, setData] = useState({
        instructors: undefined,
        courseId: undefined,
        context: undefined,
        subContext: undefined,
        organizationCoursesOnly: undefined,
    });

    useEffect(() => {
        let isMounted = true;
        clcStore?.getOrPopulate(['more_courses_by_instructors']).then((response) => {
            if (isMounted) {
                setData(response.more_courses_by_instructors?.data || {});
            }
        });

        return () => {
            isMounted = false;
        };
    }, [clcStore]);

    const {instructors, ...instructorProps} = data;

    return (
        <div className="component-margin">
            <ClientSideRender
                placeholder={<MoreCoursesByInstructorsSkeleton />}
                uiRegion={UI_REGION.MORE_COURSES_BY_INSTRUCTORS}
            >
                {instructors ? (
                    <FunnelLogContextProvider context={data.context} subcontext={data.subContext}>
                        <div data-purpose="more-from-instructors-app">
                            {instructors.map((instructor) => (
                                <MoreCoursesByInstructor
                                    key={instructor.id}
                                    instructor={instructor}
                                    {...instructorProps}
                                />
                            ))}
                        </div>
                    </FunnelLogContextProvider>
                ) : (
                    <MoreCoursesByInstructorsSkeleton />
                )}
            </ClientSideRender>
        </div>
    );
};

MoreCoursesByInstructors.propTypes = {
    clcStore: PropTypes.instanceOf(CourseLandingComponentsStore),
};

MoreCoursesByInstructors.defaultProps = {
    clcStore: undefined,
};

export default isomorphic(MoreCoursesByInstructors);
