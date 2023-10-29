import {TrackImpression} from '@udemy/event-tracking';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import {discoveryTracker} from 'browse/tracking';
import TakeAssessmentCard from 'my-courses-v3/measure-competence/take-assessment-card.react-component';

import styles from './assessment-unit.less';
import {AssessmentUnitProps, Assessment} from './types';

export const AssessmentUnit = ({
    unit,
    title,
    subtitle,
    isStandaloneUnit = false, // unit rendered by itself outside the discovery units container
    uiRegion,
    sourcePageType,
    sourcePageId,
}: AssessmentUnitProps) => {
    const isMobileMax = useMatchMedia('mobile-max');
    const hasFinePointer = useMatchMedia('(any-pointer: fine)');
    const hasCoarsePointer = useMatchMedia('(any-pointer: coarse');
    const i18n = useI18n();
    // need to return an empty div because the parent component
    // is using intersection observer and will throw an error otherwise
    if (!unit.items.length) return <div />;

    const assessments = unit.items;

    const browseAllAssessmentsButton = (
        <Button
            data-purpose="browse-all-assessments-btn"
            udStyle="link-underline"
            componentClass="a"
            href="/skills-assessment/"
            className={classNames(styles['browse-button'], {
                [styles['is-standalone-unit']]: isStandaloneUnit,
            })}
        >
            {i18n.gettext('Browse all assessments')}
        </Button>
    );
    const trackAssessmentUnitImpression = () => {
        discoveryTracker.trackUnitView(unit, unit.item_type);
    };

    return (
        <section
            data-purpose="assessment-unit-container"
            className={classNames('component-margin', styles['assessment-unit-container'])}
        >
            <h2
                className={isStandaloneUnit ? 'ud-heading-serif-xl' : 'ud-heading-lg'}
                data-purpose="assessment-unit-title"
            >
                {title}
            </h2>
            {(subtitle || !isStandaloneUnit) && (
                <div className={styles['subtitle-button-wrapper']}>
                    {subtitle && (
                        <p
                            className={styles['unit-subtitle']}
                            data-purpose="assessment-unit-subtitle"
                        >
                            {subtitle}
                        </p>
                    )}
                    {/* Button will be conditionally rendered via CSS based on breakpoint and `is-standalone-unit` class */}
                    {browseAllAssessmentsButton}
                </div>
            )}
            <TrackImpression trackFunc={trackAssessmentUnitImpression}>
                <Carousel
                    data-purpose="carousel"
                    fullViewport={!!isMobileMax}
                    showPager={!!hasFinePointer}
                    allowScroll={!!hasCoarsePointer}
                    className={styles['assessment-carousel']}
                >
                    {assessments?.map((assessment: Assessment) => (
                        <TakeAssessmentCard
                            id={assessment.id}
                            title={assessment.title}
                            key={assessment.id}
                            minCompletionTime={25}
                            maxCompletionTime={35}
                            equivalentNumberOfQuestions={30}
                            assessmentLinkDestination={`/skills-assessment/${assessment.slug}`}
                            isBeta={assessment.isBeta}
                            isPersonalPlan={true}
                            className={styles['assessment-unit-card']}
                            uiRegion={uiRegion}
                            sourcePageType={sourcePageType}
                            sourcePageId={sourcePageId}
                        />
                    ))}
                </Carousel>
            </TrackImpression>
            {/* Button will be conditionally rendered via CSS based on breakpoint and `is-standalone-unit` class */}
            {browseAllAssessmentsButton}
        </section>
    );
};
