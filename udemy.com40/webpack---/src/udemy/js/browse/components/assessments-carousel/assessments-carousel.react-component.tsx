import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import {Provider} from 'mobx-react';
import React from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import AssessmentCard from 'my-courses-v3/measure-competence/assessment-card.react-component';

import styles from './assessments-carousel.less';

export interface Assessment {
    assessmentLinkDestination: string;
    dateCompleted: string;
    groupId: number;
    testletId: number;
    title: string;
    type: string;
}

export interface AssessmentCarouselProps {
    title: string;
    assessments: Assessment[];
    subtitle?: string;
    isMobile?: boolean;
    isPersonalPlan?: boolean;
    resourceContextMenu?: Record<string, unknown>;
    className?: string;
    cardSize?: 'small' | 'medium' | 'large' | null;
}

export const AssessmentsCarousel = ({
    title,
    subtitle,
    assessments,
    isMobile,
    isPersonalPlan,
    resourceContextMenu,
    className,
    cardSize,
}: AssessmentCarouselProps) => {
    const udData = useUDData();
    const i18n = useI18n();
    const noLeftPadding = className?.includes('no-left-padding-mobile');
    const carouselDesktopStyleName = className?.includes('carousel-desktop-auto-fill')
        ? 'carousel-desktop-auto-fill'
        : 'carousel-desktop-basic';
    const carouselStyleName = isMobile ? 'carousel-mobile' : carouselDesktopStyleName;

    return (
        <div
            data-purpose="assessments-carousel"
            className={classNames('ud-text-md', className, styles['assessments-carousel'])}
        >
            <h2 data-purpose="title" className="ud-heading-xl">
                {title}
            </h2>
            {subtitle && (
                <p data-purpose="subtitle" className={styles['subtitle-text']}>
                    {subtitle}
                </p>
            )}
            <Carousel
                fullViewport={isMobile}
                showPager={!isMobile}
                className={classNames(styles[carouselStyleName], {
                    [styles['no-left-padding']]: noLeftPadding,
                })}
            >
                {assessments.map((assessment, index) => (
                    <Provider key={index} resourceContextMenu={resourceContextMenu}>
                        <AssessmentCard
                            data-purpose="assessment-card"
                            key={index}
                            isPersonalPlan={isPersonalPlan}
                            assessment={assessment}
                            size={cardSize}
                            className={styles['assessment-card']}
                            udData={udData}
                            {...i18n}
                        />
                    </Provider>
                ))}
            </Carousel>
        </div>
    );
};
