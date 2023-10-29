import {DiscoveryUnit, DiscoveryUnitItem} from '@udemy/discovery-api';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {ButtonStyleType} from '@udemy/react-core-components';
import {AlternateHeadline} from '@udemy/react-discovery-units';
import {Block, Skeleton} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import React from 'react';

import {
    OccupationCard,
    OccupationCardProps,
    OccupationCardSkeleton,
} from 'browse/components/occupation-card/occupation-card.react-component';
import {PlanPeriodStyle} from 'subscription-browse/components/plan-period/plan-period.react-component';
import {SubscriptionCTA} from 'subscription-browse/components/subscription-cta/subscription-cta.react-component';
import {SubscriptionPlanPropType} from 'subscription-browse/graphql/subscription-plan-adapter';

import styles from './related-occupations-unit.less';

export interface OccupationUnitItem extends DiscoveryUnitItem {
    default_name: string;
    default_locale_name: string; // English name used for event tracking
    plural_name: string;
    url: string;
    courses_stats: {
        avg_rating: number;
        num_courses: number;
        num_exercises: number;
    };
}

export interface RelatedOccupationsUnitProps {
    unit: DiscoveryUnit<OccupationUnitItem>;
    titleId?: string;
    className?: string;
    cardProps?: Partial<OccupationCardProps>;
    plan?: SubscriptionPlanPropType;
    isAnnualPlanEnabled?: boolean;
    planPriceIds?: string[] | null;
    ctaButtonStyle?: ButtonStyleType;
    showHeader?: boolean;
    showCancelAnytime?: boolean;
}

export const RelatedOccupationsUnit = ({
    unit,
    className,
    cardProps,
    titleId = 'relatedOccupationsUnit',
    plan,
    planPriceIds,
    ctaButtonStyle = 'brand',
    showHeader = true,
}: RelatedOccupationsUnitProps) => {
    const isMobileMax = useMatchMedia('mobile-max');
    const {gettext} = useI18n();

    if (unit.items.length === 0) {
        return null;
    }

    const occupations = unit.items.map((item, index) => (
        <OccupationCard
            key={item.id}
            index={index}
            occupationId={item.id}
            name={item.default_name}
            pluralName={item.plural_name}
            url={item.url}
            uiRegion={cardProps?.uiRegion ?? ''}
            titleHeadingLevel={cardProps?.titleHeadingLevel}
            stats={item.courses_stats}
            showSubtitle={index === 0}
            defaultLocaleName={item.default_locale_name}
            {...cardProps}
        />
    ));

    return (
        <section aria-labelledby={titleId} className={className} data-purpose="related-occupations">
            {showHeader && (
                <AlternateHeadline
                    titleId={titleId}
                    titleTag="h2"
                    title={gettext('Thrive in your career')}
                    secondaryText={gettext(
                        'Access a collection of top-rated courses curated for in-demand roles with a Personal Plan subscription.',
                    )}
                />
            )}
            {occupations[0]}
            {plan && (
                <div
                    className={classNames('component-margin', styles['subscription-cta-banner'])}
                    data-purpose="subscription-cta-banner"
                >
                    <SubscriptionCTA
                        className={styles['subscription-cta']}
                        isSubscriber={false}
                        includeTrialDaysOnCta={false}
                        plan={plan}
                        uiRegion={cardProps?.uiRegion ?? ''}
                        planPriceIds={planPriceIds ?? undefined}
                        offerCtaStyle={ctaButtonStyle}
                        planPeriodStyle={
                            isMobileMax
                                ? PlanPeriodStyle.MULTILINE_NO_MARGIN
                                : PlanPeriodStyle.SINGLE
                        }
                    />
                </div>
            )}
        </section>
    );
};

export const RelatedOccupationsSkeleton = ({className}: {className: string}) => {
    return (
        <div className={className}>
            <OccupationCardSkeleton />
            <div className={styles['subscription-cta-banner']}>
                <SkeletonSubscriptionCTAWithPlanText />
            </div>
        </div>
    );
};

export const SkeletonSubscriptionCTAWithPlanText = ({
    planTextPosition = 'right',
}: {
    planTextPosition?: string;
}) => {
    return (
        <Skeleton className={styles[`subscription-cta-container-${planTextPosition}`]}>
            <Block className={classNames('ud-btn-large', styles['skeleton-cta-button'])} />
            <Block className={styles['skeleton-subscription-text']} />
        </Skeleton>
    );
};
