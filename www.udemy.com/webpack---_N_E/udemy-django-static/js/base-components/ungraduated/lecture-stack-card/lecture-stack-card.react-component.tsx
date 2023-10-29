import React from 'react';

import {LectureDetailsProps} from 'udemy-django-static/js/browse/components/lecture-details/types';

export interface DetailProps extends React.HTMLAttributes<HTMLDivElement>, LectureDetailsProps {
    lectureCardId: number;
    lecturePosition: number;
    lectureServeTrackingId: string;
    lectureTrackingId: string;
    inProgress?: boolean;
    completed?: boolean;
    duration: number;
    remainingTime?: number;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    learnUrl: string;
    courseImage: string;
    lectureImage?: string;
}

export interface LectureStackCardProps extends React.HTMLAttributes<HTMLDivElement> {
    detailProps: DetailProps;
    cardProps: CardProps;
}

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
