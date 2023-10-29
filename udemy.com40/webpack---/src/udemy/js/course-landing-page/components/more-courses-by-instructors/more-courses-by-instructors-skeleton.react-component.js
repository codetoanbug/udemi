import React from 'react';

import CourseCardsSkeleton from 'base-components/course-card/course-cards-skeleton.react-component';
import {getDeviceType, DEVICE_TYPE_MOBILE} from 'browse/lib/device-type';
import './styles.less';

const MoreCoursesByInstructorsSkeleton = () => {
    const isMobile = getDeviceType() === DEVICE_TYPE_MOBILE;

    return (
        <section styleName="more-from-instructor">
            <CourseCardsSkeleton
                rowCount={isMobile ? 3 : 1}
                cardCountPerRow={isMobile ? 1 : 3}
                size={isMobile ? 'small' : 'medium'}
                withTitle={true}
            />
        </section>
    );
};

export default MoreCoursesByInstructorsSkeleton;
