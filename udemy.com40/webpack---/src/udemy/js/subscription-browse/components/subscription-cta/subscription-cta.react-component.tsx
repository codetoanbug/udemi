import {Tracker, ClickEvent} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {Button, ButtonHtmlProps} from '@udemy/react-core-components';
import {Block} from '@udemy/react-reveal-components';
import React from 'react';

import {CTAContainer} from 'browse/components/cta-container/cta-container.react-component';
import {DateIntervalType} from 'gql-codegen/api-platform-graphql';
import {SubscriptionPlanPropType} from 'subscription-browse/graphql/subscription-plan-adapter';
import {setVisitorIntentCookie} from 'subscription-browse/utils';
import {CHECKOUT_URL} from 'subscription-checkout/constants';
import {
    SubscriptionCTAClickEvent,
    SubscriptionOfferImpressionEvent,
} from 'subscription-management/settings/subscription-page-events';

import {PlanPeriod, PlanPeriodStyle} from '../plan-period/plan-period.react-component';
import styles from './subscription-cta.less';

interface BaseSubscriptionCTAProps {
    className?: string;
    subtitleClassName?: string;
    showSubtitle?: boolean;
}

interface BaseOfferCTAProps extends BaseSubscriptionCTAProps {
    courseId?: number;
    courseTrackingId?: string;
    includeTrialDaysOnCta?: boolean;
    onCTAClick?: () => void;
    plan?: SubscriptionPlanPropType;
    planPriceIds?: string[];
    uiRegion: string;
    offerCtaStyle?: ButtonHtmlProps['udStyle'];
    /**
     * Do not use.
     * TODO: Remove when cancel anytime experiment finishes
     */
    planPeriodStyle?: PlanPeriodStyle;
}

interface OfferAvailableCTAProps extends BaseOfferCTAProps {
    plan: SubscriptionPlanPropType;
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
    const onClick = () => {
        onCTAClick?.();
        if (plan) {
            setVisitorIntentCookie(plan.productType);
            Tracker.publishEvent(
                new SubscriptionCTAClickEvent(
                    plan.id,
                    plan.productType,
                    plan.trialPeriodDays ? 'trial' : 'paid',
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
        <CTAContainer
            subtitle={subtitle}
            impressionEvent={
                plan
                    ? () =>
                          new SubscriptionOfferImpressionEvent(
                              plan.id,
                              courseId,
                              uiRegion,
                              courseTrackingId,
                              !!plan.trialPeriodDays,
                              plan.trialPeriodDays,
                              null,
                              planPriceIds,
                          )
                    : undefined
            }
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
        </CTAContainer>
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
        <CTAContainer subtitle={gettext("You're currently subscribed.")} {...props}>
            <Button
                href="/"
                componentClass="a"
                onClick={onClick}
                data-purpose="subscriber-cta"
                className={styles['cta-button']}
            >
                {gettext('Explore Personal Plan')}
            </Button>
        </CTAContainer>
    );
};

const LoadingCTA = ({className}: Omit<BaseSubscriptionCTAProps, 'showSubtitle'>) => {
    return (
        <CTAContainer
            className={className}
            data-testid="skeleton"
            skeletonChildren={
                <>
                    <Block className={styles['skeleton-button']} />
                    <Block className={styles['skeleton-text']} />
                </>
            }
        ></CTAContainer>
    );
};

interface OfferNotAvailableCTA extends BaseSubscriptionCTAProps {
    offerCtaStyle?: ButtonHtmlProps['udStyle'];
}

const OfferNotAvailableCTA = (props: OfferNotAvailableCTA) => {
    const {gettext} = useI18n();

    return (
        <CTAContainer subtitle={gettext('Not available in your country yet')} {...props}>
            <Button disabled={true} udStyle="brand">
                {gettext('Start subscription')}
            </Button>
        </CTAContainer>
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
