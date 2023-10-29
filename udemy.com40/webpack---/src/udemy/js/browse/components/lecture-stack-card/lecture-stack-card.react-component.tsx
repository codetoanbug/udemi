import React from 'react';

import {LectureStackCardProps} from './types';

export const LectureStackCard = ({cardProps}: LectureStackCardProps) => {
    return (
        <div
            style={{
                backgroundImage: `url(${
                    cardProps.lectureImage ? cardProps.lectureImage : cardProps.courseImage
                }`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100%',
                display: 'block',
            }}
        />
    );
};
