import {SuspenseUntilInView} from '@udemy/react-reveal-components';
import React from 'react';

import CourseReviewDisplaySkeleton from './course-review-display-skeleton.react-isocomponent';

const CourseReviewDisplay = React.lazy(() =>
    import(
        /* webpackChunkName: "course-landing-page-lazy" */ './course-review-display.react-isocomponent'
    ),
);

const CourseReviewDisplayLazy = (props) => (
    <SuspenseUntilInView fallback={<CourseReviewDisplaySkeleton {...props} />}>
        <CourseReviewDisplay {...props} />
    </SuspenseUntilInView>
);

export default CourseReviewDisplayLazy;
