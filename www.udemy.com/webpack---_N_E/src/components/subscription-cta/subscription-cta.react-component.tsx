import classNames from 'classnames';
import React, {ReactNode} from 'react';

import {ClickEvent, TrackImpression, Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {ButtonHtmlProps, Button} from '@udemy/react-core-components';
import {Block, Skeleton} from '@udemy/react-reveal-components';

import {DateIntervalType} from 'udemy-django-static/js/gql-codegen/api-platform-graphql';
import {SubscriptionPlanPropType} from 'udemy-django-static/js/subscription-browse/graphql/subscription-plan-adapter';
import {setVisitorIntentCookie} from 'udemy-django-static/js/subscription-browse/utils';
import {CHECKOUT_URL} from 'udemy-django-static/js/subscription-checkout/constants';
import {
    PlanType,
    SubscriptionCTAClickEvent,
    SubscriptionOfferImpressionEvent,
} from 'udemy-django-static/js/subscription-management/udlite/settings/subscription-page-events';

import {PlanPeriod, PlanPeriodStyle} from '../plan-period/plan-period.react-component';
import styles from './subscription-cta.module.less';

interface BaseSubscriptionCTAProps {
    className?: string;
    subtitleClassName?: string;
    showSubtitle?: boolean;
}

type Plan = Omit<SubscriptionPlanPropType, 'planHasTrial'>;

interface BaseOfferCTAProps extends BaseSubscriptionCTAProps {
    courseId?: number;
    courseTrackingId?: string;
    includeTrialDaysOnCta?: boolean;
    onCTAClick?: () => void;
    plan?: Plan;
    planPriceIds?: string[];
    uiRegion: string;
    offerCtaStyle?: ButtonHtmlProps['udStyle'];
    /**
     * Do not use.
     * TODO: Remove when cancel anytime experiment finishes
     */
    planPeriodStyle?: PlanPeriodStyle;
}

interface SubscriptionCTAWrapperProps extends BaseSubscriptionCTAProps {
    children: ReactNode;
    subtitle?: ReactNode;
    trackImpression?: () => void;
}

const SubscriptionCTAWrapper = ({
    children,
    subtitle,
    showSubtitle = true,
    className,
    subtitleClassName,
    trackImpression,
}: SubscriptionCTAWrapperProps) => {
    const main = (
        <div className={classNames(styles.container, className)}>
            {children}
            {showSubtitle && (
                <div className={classNames(styles.subtitle, subtitleClassName)}>{subtitle}</div>
            )}
        </div>
    );

    if (trackImpression) {
        return (
            <TrackImpression onlyOnce={true} trackFunc={trackImpression}>
                {main}
            </TrackImpression>
        );
    }

    return main;
};

interface OfferAvailableCTAProps extends BaseOfferCTAProps {
    plan: Plan;
}

const OfferAvailableCTA = ({
    plan,
    planPriceIds,
    courseId,
    uiRegion,
    courseTrackingId,
    onCTAClick,
    includeTrialDaysOnCta = true,
    offerCtaStyle,
    planPeriodStyle,
    ...props
}: OfferAvailableCTAProps) => {
    const {gettext, ninterpolate} = useI18n();
    const trackSubscriptionOfferImpression = () => {
        if (plan) {
            Tracker.publishEvent(
                new SubscriptionOfferImpressionEvent(
                    plan.id,
                    courseId,
                    uiRegion,
                    courseTrackingId,
                    !!plan.trialPeriodDays,
                    plan.trialPeriodDays,
                    null,
                    planPriceIds,
                ),
            );
        }
    };

    const onClick = () => {
        onCTAClick?.();
        if (plan) {
            setVisitorIntentCookie(plan.productType);
            Tracker.publishEvent(
                new SubscriptionCTAClickEvent(
                    plan.id,
                    plan.productType as PlanType,
                    !!plan.trialPeriodDays ? 'trial' : 'paid',
                    uiRegion,
                    courseId,
                    courseTrackingId,
                    planPriceIds,
                ),
            );
        }
    };

    let text = gettext('Start subscription');
    if (plan?.trialPeriodDays && plan.trialPeriodDays > 0) {
        text = includeTrialDaysOnCta
            ? ninterpolate(
                  'Try it free for %(trialPeriodDays)s day',
                  'Try it free for %(trialPeriodDays)s days',
                  plan.trialPeriodDays,
                  {
                      trialPeriodDays: plan.trialPeriodDays,
                  },
              )
            : gettext('Try Personal Plan for free');
    }

    const isAnnual =
        plan.intervalDisplay === DateIntervalType.Year || plan.intervalDisplay === 'year';
    const subtitle = (
        <PlanPeriod
            listPriceText={plan.monthlyPrice ?? plan.listPriceText}
            trialPeriodDays={plan.trialPeriodDays}
            showStartingAtPrice={isAnnual}
            style={planPeriodStyle}
        />
    );

    return (
        <SubscriptionCTAWrapper
            subtitle={subtitle}
            trackImpression={trackSubscriptionOfferImpression}
            {...props}
        >
            <Button
                id="subscriptionTrialOfferButton"
                componentClass="a"
                href={`${CHECKOUT_URL}?${new URLSearchParams({
                    'subscription-id': plan.id,
                }).toString()}`}
                onClick={onClick}
                udStyle={offerCtaStyle}
                className={styles['cta-button']}
            >
                <div className={styles.text}>{text}</div>
            </Button>
        </SubscriptionCTAWrapper>
    );
};

const AlreadySubscribedCTA = (props: BaseSubscriptionCTAProps) => {
    const {gettext} = useI18n();

    const onClick = () => {
        Tracker.publishEvent(
            new ClickEvent({
                componentName: 'GoToPersonalPlanHomeButton',
            }),
        );
    };

    return (
        <SubscriptionCTAWrapper subtitle={gettext("You're currently subscribed.")} {...props}>
            <Button
                href="/"
                componentClass="a"
                onClick={onClick}
                data-purpose="subscriber-cta"
                className={styles['cta-button']}
            >
                {gettext('Explore Personal Plan')}
            </Button>
        </SubscriptionCTAWrapper>
    );
};

const LoadingCTA = ({className}: Omit<BaseSubscriptionCTAProps, 'showSubtitle'>) => {
    return (
        <Skeleton className={classNames(styles.container, className)} data-testid="skeleton">
            <Block className={styles['skeleton-button']} />
            <Block className={styles['skeleton-text']} />
        </Skeleton>
    );
};

interface OfferNotAvailableCTA extends BaseSubscriptionCTAProps {
    offerCtaStyle?: ButtonHtmlProps['udStyle'];
}

const OfferNotAvailableCTA = (props: OfferNotAvailableCTA) => {
    const {gettext} = useI18n();

    return (
        <SubscriptionCTAWrapper subtitle={gettext('Not available in your country yet')} {...props}>
            <Button disabled={true} udStyle="brand">
                {gettext('Start subscription')}
            </Button>
        </SubscriptionCTAWrapper>
    );
};

export interface SubscriptionCTAProps extends BaseOfferCTAProps {
    isLoading?: boolean;
    isSubscriber?: boolean;
}

export const SubscriptionCTA = ({
    plan,
    isLoading,
    isSubscriber,
    offerCtaStyle = 'brand',
    ...props
}: SubscriptionCTAProps) => {
    if (isLoading) {
        return <LoadingCTA {...props} />;
    }

    if (isSubscriber) {
        return <AlreadySubscribedCTA {...props} />;
    }

    if (plan) {
        return <OfferAvailableCTA plan={plan} offerCtaStyle={offerCtaStyle} {...props} />;
    }

    return <OfferNotAvailableCTA offerCtaStyle={offerCtaStyle} {...props} />;
};
