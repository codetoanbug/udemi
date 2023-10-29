import {CourseUnitSkeleton} from '@udemy/react-discovery-units';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';

export interface RecommendationsSkeletonProps {
    layout?: 'multirow' | 'singlerow';
}

const RecommendationsSkeleton = isomorphic((props: RecommendationsSkeletonProps) => (
    <section>
        <CourseUnitSkeleton layout={props.layout} />
    </section>
));

export default RecommendationsSkeleton;
