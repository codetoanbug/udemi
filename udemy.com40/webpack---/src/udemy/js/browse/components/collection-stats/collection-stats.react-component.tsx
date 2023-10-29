import {useFormatNumber} from '@udemy/i18n';
import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import {Block, Skeleton} from '@udemy/react-reveal-components';
import React from 'react';

import styles from './collection-stats.less';

interface Stat {
    value: number;
    description: string;
}

export interface CollectionStatsProps {
    avgRating: Stat;
    numCourses: Stat;
    numQuizzes: Stat;
    numInstructors?: Stat | undefined;
    type?: 'default' | 'large' | 'small';
}

export const CollectionStats = ({
    avgRating,
    numCourses,
    numQuizzes,
    numInstructors = undefined,
    type = 'default',
}: CollectionStatsProps) => {
    const {formatNumber} = useFormatNumber();
    const stats = [
        {
            stat: `${formatNumber(numCourses.value)}+`,
            description: numCourses.description,
        },
        {
            stat: `${formatNumber(numQuizzes.value)}+`,
            description: numQuizzes.description,
        },
        ...(numInstructors
            ? [
                  {
                      stat: `${formatNumber(numInstructors.value)}+`,
                      description: numInstructors.description,
                  },
              ]
            : []),
        {
            stat: (
                <div className={styles.rating}>
                    {formatNumber(avgRating.value.toFixed(1))}
                    <span className={styles['rating-icon']}>
                        <RatingStarIcon
                            color="inherit"
                            label={false}
                            size={type === 'large' ? 'medium' : 'small'}
                        />
                    </span>
                </div>
            ),
            description: avgRating.description,
        },
    ];

    const statStyle = `stat-${type}`;
    const headingClass = `ud-heading-${type === 'large' ? 'xl' : type === 'small' ? 'md' : 'lg'}`;

    return (
        <ul className={styles[`stats-${stats.length}`]}>
            {stats.map((item, index) => (
                <li key={index} data-purpose="stat">
                    <div className={headingClass}>{item.stat}</div>
                    <div className={styles[statStyle]}>{item.description}</div>
                </li>
            ))}
        </ul>
    );
};

export const SkeletonCollectionStats = ({numStats}: {numStats: number}) => (
    <Skeleton className={styles[`stats-${numStats}`]}>
        {[...Array(numStats)].map((item, i) => (
            <Block key={i} className={styles['skeleton-stat-default']} />
        ))}
    </Skeleton>
);
