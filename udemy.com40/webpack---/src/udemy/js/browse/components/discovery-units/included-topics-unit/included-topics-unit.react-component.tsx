import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {PillGroup} from '@udemy/react-navigation-components';
import {Block, Skeleton, ShowMore} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import React from 'react';

import {GradientScroll} from 'browse/components/discovery-units/included-topics-unit/gradient-scroll.react-component';

import styles from './included-topics-unit.less';

interface CourseLabelProps {
    id: number;
    title: string;
    url: string;
}

interface UnitProps {
    items: CourseLabelProps[];
}

export interface IncludedTopicsUnitProps {
    unit: UnitProps;
}

export const IncludedTopicsUnit = ({unit}: IncludedTopicsUnitProps) => {
    const isMobileMax = useMatchMedia('mobile-max');
    const {gettext} = useI18n();

    const wrapTopics = (component: JSX.Element) => {
        if (isMobileMax) {
            return <GradientScroll>{component}</GradientScroll>;
        }
        return (
            // (pill height) + (pill top margin) = 40
            <ShowMore collapsedHeight={40} className={styles['show-more-right']}>
                {component}
            </ShowMore>
        );
    };

    return (
        <>
            <div className={classNames('ud-text-bold', styles['topics-title'])}>
                {gettext('Sample topics:')}
            </div>
            {wrapTopics(
                <div className={styles.topics} data-purpose="topics">
                    <PillGroup className={styles['topics-row']}>
                        {unit.items.map((topic, index) => (
                            <PillGroup.Pill
                                componentClass="a"
                                href={topic.url}
                                key={index}
                                size="small"
                            >
                                {topic.title}
                            </PillGroup.Pill>
                        ))}
                    </PillGroup>
                </div>,
            )}
        </>
    );
};

export const IncludedTopicsSkeleton = () => {
    return (
        <>
            <Skeleton className={styles['topics-title-skeleton']}>
                <Block className={styles['topics-title-skeleton-block']} />
            </Skeleton>
            <Skeleton>
                <Block className={styles['topics-row-skeleton-block']} />
            </Skeleton>
        </>
    );
};
