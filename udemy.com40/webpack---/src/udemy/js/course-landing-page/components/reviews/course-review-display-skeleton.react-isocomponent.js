import {TextSkeleton} from '@udemy/react-reveal-components';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';

import './course-review-display-skeleton.less';

export const ReviewListSkeleton = () => (
    <TextSkeleton styleName="review-list-skeleton" lineCountPerParagraph={7} paragraphCount={12} />
);

const CourseReviewDisplaySkeleton = isomorphic(() => {
    return (
        <>
            <TextSkeleton
                styleName="review-summary-skeleton"
                withTitle={true}
                lineCountPerParagraph={13}
                paragraphCount={1}
            />
            <section data-purpose="review-list-skeleton-section">
                <ReviewListSkeleton />
            </section>
        </>
    );
});

export default CourseReviewDisplaySkeleton;
