import {TrackImpression} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {Block, Skeleton} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import React from 'react';

import {CollectionStats} from 'browse/components/collection-stats/collection-stats.react-component';
import {OccupationUnitItem} from 'browse/components/discovery-units/related-occupations-unit/related-occupations-unit.react-component';

import styles from './occupation-card.less';
import {BaseOccupationCardProps} from './types';
import {useOccupationImpression} from './use-occupation-impression';

export interface OccupationCardProps extends BaseOccupationCardProps {
    stats: OccupationUnitItem['courses_stats'];
    showSubtitle?: boolean;
}

export const OccupationCard = ({
    stats,
    url,
    pluralName,
    titleHeadingLevel: Title = 'h3',
    showSubtitle,
    headingText,
    ...props
}: OccupationCardProps) => {
    const {gettext, interpolate} = useI18n();
    const {
        trackOccupationCardImpressionEvent,
        trackOccupationCardClickEvent,
    } = useOccupationImpression({...props, occupationName: props.defaultLocaleName});
    const vowelRegex = '^[aieouAIEOU].*';

    return (
        <TrackImpression trackFunc={trackOccupationCardImpressionEvent}>
            <div className={styles['occupation-card']}>
                <div className={styles['occupation-title-container']}>
                    <div
                        className={classNames('ud-heading-xs', styles['personal-plan-text'])}
                        data-purpose="heading-text"
                    >
                        {headingText ?? gettext('Great for')}
                    </div>
                    <Title>
                        <a
                            className={classNames('ud-heading-lg', styles['occupation-title'])}
                            data-purpose="occupation-title"
                            href={url}
                            onClick={trackOccupationCardClickEvent}
                        >
                            {pluralName}
                        </a>
                    </Title>
                    {showSubtitle && (
                        <p className={styles.subtitle} data-purpose="subtitle">
                            {interpolate(
                                gettext(
                                    'A curated collection of courses and hands-on practice exercises to help you advance as %(article)s %(name)s.',
                                ),
                                {
                                    name: props.name.toLocaleLowerCase(),
                                    article: props.name.match(vowelRegex) ? 'an' : 'a',
                                },
                                true,
                            )}
                        </p>
                    )}
                </div>
                <CollectionStats
                    avgRating={{
                        value: stats.avg_rating,
                        description: gettext('Avg. rating of courses'),
                    }}
                    numCourses={{
                        value: stats.num_courses,
                        description: gettext('Relevant courses'),
                    }}
                    numQuizzes={{
                        value: stats.num_exercises,
                        description: gettext('Hands-on exercises'),
                    }}
                />
            </div>
        </TrackImpression>
    );
};

export const OccupationCardSkeleton = () => {
    return (
        <>
            <div className={styles['skeleton-container']}>
                <Skeleton className={styles['skeleton-occupation-card']}>
                    <div className={styles['skeleton-title-container']}>
                        <Block className={styles['skeleton-card-heading']} />
                        <Block className={styles['skeleton-occupation-title']} />

                        <div className={styles.subtitle}>
                            <Block className={styles['skeleton-paragraph-line']} />
                            <Block className={styles['skeleton-paragraph-line']} />
                        </div>
                    </div>
                    <ul
                        className={classNames('ud-unstyled-list', styles['skeleton-stats-section'])}
                    >
                        <li>
                            <Block className={styles['skeleton-stat']} />
                        </li>
                        <li>
                            <Block className={styles['skeleton-stat']} />
                        </li>
                        <li>
                            <Block className={styles['skeleton-stat']} />
                        </li>
                    </ul>
                </Skeleton>
            </div>
        </>
    );
};
