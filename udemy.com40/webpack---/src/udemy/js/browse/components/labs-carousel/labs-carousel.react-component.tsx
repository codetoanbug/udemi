import {TrackImpression, Tracker} from '@udemy/event-tracking';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import {LabCardContainer} from 'browse/components/lab-card/lab-card.react-component';
import {LabDetailsQuickViewBox} from 'browse/components/lab-card/lab-details-quick-view-box.react-component';
import {Keys, LabCardData} from 'browse/components/lab-card/types';
import {LABS_DISCOVER_COMPONENTS} from 'browse/components/my-learning-unit/constants';
import {LabDiscoveryCardImpressionEvent} from 'browse/lab-events';
import Lab from 'labs/lab.mobx-model';

import styles from './labs-carousel.less';

export interface LabsCarouselProps {
    title: string;
    subtitle?: string;
    uiRegion: typeof LABS_DISCOVER_COMPONENTS[Keys];
    labs: Lab[];
    hideEstimatedTime?: boolean;
    isStandaloneUnit?: boolean;
    sourcePageId?: number;
    sourcePageType?: string;
}

export const LabsCarousel = ({
    title,
    subtitle,
    uiRegion,
    labs,
    hideEstimatedTime,
    isStandaloneUnit = false,
    sourcePageId,
    sourcePageType,
}: LabsCarouselProps) => {
    const trackLabCardImpression = (labId: number) => {
        Tracker.publishEvent(
            new LabDiscoveryCardImpressionEvent({
                labId,
                uiRegion,
                sourcePageId,
                sourcePageType,
            }),
        );
    };
    const {gettext} = useI18n();
    const isMobileMax = useMatchMedia('mobile-max');
    const hasCoarsePointer = useMatchMedia('(any-pointer: coarse)');
    const hasFinePointer = useMatchMedia('(any-pointer: fine)');
    const isLIHP = uiRegion === LABS_DISCOVER_COMPONENTS.LABS_UNIT_LIHP;

    const browseAllLabsButton = (
        <Button
            data-purpose="browse-all-labs-btn"
            udStyle="link-underline"
            componentClass="a"
            href="/labs/listing/"
            className={classNames(styles['browse-button'], {
                [styles['is-standalone-unit']]: isStandaloneUnit,
            })}
        >
            {gettext('Browse all labs')}
        </Button>
    );

    return (
        <section className={classNames('component-margin', styles['lab-unit-container'])}>
            <h2
                className={classNames(
                    isStandaloneUnit
                        ? 'ud-heading-serif-xl'
                        : isLIHP
                        ? 'ud-heading-xl'
                        : 'ud-heading-lg',
                    styles['lab-unit-container'],
                )}
                data-purpose="lab-unit-title"
            >
                {title}
            </h2>
            {(subtitle || !isStandaloneUnit) && (
                <div className={styles['subtitle-button-wrapper']}>
                    {subtitle && (
                        <p className={styles['unit-subtitle']} data-purpose="lab-unit-subtitle">
                            {subtitle}
                        </p>
                    )}
                    {/* Button will be conditionally rendered via CSS based on breakpoint and `is-standalone-unit` class */}
                    {browseAllLabsButton}
                </div>
            )}
            <Carousel
                data-purpose="carousel"
                fullViewport={!!isMobileMax}
                showPager={!!hasFinePointer}
                allowScroll={!!hasCoarsePointer}
                className={styles['lab-carousel']}
            >
                {labs?.map((lab) => (
                    <TrackImpression key={lab.id} trackFunc={() => trackLabCardImpression(lab.id)}>
                        <LabDetailsQuickViewBox
                            key={`lab-list-item-${lab.id}`}
                            lab={(lab as unknown) as LabCardData}
                            showQuickViewBox={!isMobileMax}
                            preventQuickViewBoxOpenEvent={[
                                LABS_DISCOVER_COMPONENTS.LABS_UNIT_LIHP,
                                LABS_DISCOVER_COMPONENTS.LABS_UNIT_TOPIC,
                            ].includes(uiRegion)}
                            sourcePageId={sourcePageId}
                            sourcePageType={sourcePageType}
                            labCard={
                                <LabCardContainer
                                    lab={(lab as unknown) as LabCardData}
                                    uiRegion={uiRegion}
                                    className="lab-card-short"
                                    hideEstimatedTime={hideEstimatedTime}
                                    sourcePageId={sourcePageId}
                                    sourcePageType={sourcePageType}
                                />
                            }
                        />
                    </TrackImpression>
                ))}
            </Carousel>
            {/* Button will be conditionally rendered via CSS based on breakpoint and `is-standalone-unit` class */}
            {browseAllLabsButton}
        </section>
    );
};
