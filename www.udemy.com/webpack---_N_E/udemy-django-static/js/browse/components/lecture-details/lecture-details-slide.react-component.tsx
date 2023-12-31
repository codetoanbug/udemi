import {tokens} from '@udemy/styles';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';

import {LectureStackCardProps} from 'udemy-django-static/js/base-components/ungraduated/lecture-stack-card/lecture-stack-card.react-component';
import {LectureDetails} from './lecture-details.react-component';

import styles from './lecture-details-slide.module.less';

interface LectureDetailsSlideProps {
    children: React.ReactNode;
    currentIndex: number;
}
export const LectureDetailsSlide = ({children, currentIndex}: LectureDetailsSlideProps) => {
    const [prevIdx, setPrevIdx] = useState(currentIndex);
    const [isFading, setIsFading] = useState(false);
    useEffect(() => {
        if (currentIndex !== prevIdx) {
            setIsFading(true);
            setTimeout(() => {
                setPrevIdx(currentIndex);
                setIsFading(false);
            }, Number(tokens['animation-duration-fast'].replace('ms', '')));
        }
    }, [prevIdx, currentIndex]);
    const currentLectureData = React.Children.toArray(children)[
        currentIndex
    ] as React.ReactElement<LectureStackCardProps>;
    const prevLectureData = React.Children.toArray(children)[
        prevIdx
    ] as React.ReactElement<LectureStackCardProps>;
    const numOfLectures = React.Children.count(children);
    return (
        <div className={styles['lecture-slide-container']}>
            <div
                data-purpose="current"
                className={classNames(
                    styles['lecture-item'],
                    styles['current-lecture'],
                    isFading ? styles['fade-in'] : '',
                )}
            >
                <LectureDetails {...currentLectureData.props.detailProps} ariaLive="off" />
            </div>
            <div
                data-purpose="prev"
                className={classNames(styles['lecture-item'], isFading ? styles['fade-out'] : '')}
            >
                <LectureDetails
                    {...prevLectureData.props.detailProps}
                    ariaLive="assertive"
                    currentIndex={currentIndex}
                    numOfLectures={numOfLectures}
                />
            </div>
        </div>
    );
};
