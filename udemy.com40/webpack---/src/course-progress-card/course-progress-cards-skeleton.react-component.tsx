import React from 'react';

import {
    CourseCardSkeletonGroup,
    CourseCardSkeletonGroupProps,
} from '@udemy/react-reveal-components';

const config = {
    compact: {cardWidth: '25.6rem', imageSize: '6.4rem', lineCount: 1},
    small: {cardWidth: '25.6rem', imageSize: '9rem', lineCount: 3},
    large: {cardWidth: '40rem', imageSize: '12rem', lineCount: 4},
};

export interface CourseProgressCardsSkeletonProps
    extends Omit<CourseCardSkeletonGroupProps, 'size'> {
    size?: keyof typeof config;
}

export const CourseProgressCardsSkeleton = ({
    size = 'small',
    ...skeletonGroupProps
}: CourseProgressCardsSkeletonProps) => {
    const {cardWidth, imageSize, lineCount} = config[size];

    return (
        <CourseCardSkeletonGroup
            size="small"
            style={{width: cardWidth, maxWidth: cardWidth, minWidth: cardWidth}}
            imageStyle={{width: imageSize, height: imageSize}}
            lineCount={lineCount}
            {...skeletonGroupProps}
        />
    );
};
