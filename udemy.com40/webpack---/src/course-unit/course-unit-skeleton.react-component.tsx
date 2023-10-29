import React from 'react';

import {CourseCardSkeletonGroup} from '@udemy/react-reveal-components';

interface CourseUnitSkeletonProps {
    className?: string;
    layout?: 'multirow' | 'singlerow';
}

export const CourseUnitSkeleton = ({
    className = '',
    layout = 'multirow',
}: CourseUnitSkeletonProps) => {
    return (
        <CourseCardSkeletonGroup
            data-testid={'course-unit-skeleton-group'}
            className={className}
            rowCount={layout === 'multirow' ? 3 : 1}
            size={layout === 'multirow' ? 'small' : 'medium'}
            withTitle={true}
        />
    );
};
