import {LocalizedHtml, useI18n} from '@udemy/i18n';
import React, {useContext} from 'react';

import {ReactSubscriptionCTAContext} from '../../subscription-cta-experiment-provider';

import './plan-period.less';

const enum PlanPeriodVariant {
    STARTING_AT_AFTER_TRIAL_PERIOD,
    STARTING_AT_AFTER_TRIAL_PERIOD_DAYS,
    STARTING_AT_PER_MONTH,
    PRICE_WITH_TRIAL,
    PRICE_WITH_TRIAL_PERIOD_DAYS,
    PRICE_PER_MONTH,
    STARTING_AT_PER_MONTH_EMPHASIZED,
}

// Provides override configurations:
// If single localized line is >42 characters
// AND one of the MULTILINE configurations is passed in,
// this will determine the amount of space between the lines
export const enum PlanPeriodStyle {
    SINGLE,
    MULTILINE_MARGIN,
    MULTILINE_NO_MARGIN,
}

export interface PlanPeriodConfiguration {
    trialPeriodDays?: number;
    listPriceText: string;
    showTrialDays?: boolean;
    showStartingAtPrice?: boolean;
    style?: PlanPeriodStyle;
    emphasizeListPriceText?: boolean;
}

interface CancelAnytimeProps {
    style: PlanPeriodStyle;
}

const CancelAnytime = ({style}: CancelAnytimeProps) => {
    if (style === PlanPeriodStyle.MULTILINE_NO_MARGIN || style === PlanPeriodStyle.MULTILINE_MARGIN)
        return <>{gettext('Cancel anytime')}</>;
    return <></>;
};

export const PlanPeriod = ({
    trialPeriodDays,
    listPriceText,
    showTrialDays,
    showStartingAtPrice,
    emphasizeListPriceText,
    style = PlanPeriodStyle.SINGLE,
}: PlanPeriodConfiguration) => {
    const SINGLE_LINE_CHARACTER_LIMIT = 42;
    const MULTILINE_WRAP_LIMIT = 64;
    const {gettext} = useI18n();
    const subscriptionCTAContext = useContext(ReactSubscriptionCTAContext);
    const showCancelAnytime = subscriptionCTAContext.showCancelAnytime ?? false;

    // Returns copy w/ punctuation at the end if 'Cancel anytime.' is shown on a single line
    function getPlanPeriodText(planPeriodVariant?: PlanPeriodVariant) {
        switch (planPeriodVariant) {
            case PlanPeriodVariant.STARTING_AT_AFTER_TRIAL_PERIOD: {
                const planPeriodText = gettext(
                    'Starting at %(listPriceText)s per month after trial',
                );
                return interpolate(
                    planPeriodText,
                    {
                        listPriceText,
                        trialPeriodDays,
                    },
                    true,
                );
            }
            case PlanPeriodVariant.STARTING_AT_AFTER_TRIAL_PERIOD_DAYS: {
                return interpolate(
                    gettext(
                        'Starting at %(listPriceText)s per month after %(trialPeriodDays)s-day trial',
                    ),
                    {
                        listPriceText,
                        trialPeriodDays,
                    },
                    true,
                );
            }
            case PlanPeriodVariant.STARTING_AT_PER_MONTH: {
                return interpolate(
                    gettext('Starting at %(listPriceText)s per month'),
                    {listPriceText},
                    true,
                );
            }
            case PlanPeriodVariant.STARTING_AT_PER_MONTH_EMPHASIZED:
                return (
                    <LocalizedHtml
                        html={interpolate(
                            gettext(
                                'Starting at <span class="emphasis">%(listPriceText)s</span> per month',
                            ),
                            {listPriceText},
                            true,
                        )}
                        interpolate={{emphasis: <span className="ud-text-bold" />}}
                    />
                );
            case PlanPeriodVariant.PRICE_WITH_TRIAL_PERIOD_DAYS: {
                return interpolate(
                    gettext('%(listPriceText)s per month after %(trialPeriodDays)s-day trial'),
                    {
                        listPriceText,
                        trialPeriodDays,
                    },
                    true,
                );
            }
            case PlanPeriodVariant.PRICE_WITH_TRIAL: {
                const planPeriodText = gettext('%(listPriceText)s per month after trial');
                return interpolate(
                    planPeriodText,
                    {
                        listPriceText,
                        trialPeriodDays,
                    },
                    true,
                );
            }
            case PlanPeriodVariant.PRICE_PER_MONTH: {
                const planPeriodText = gettext('%(listPriceText)s per month');
                return interpolate(planPeriodText, {listPriceText}, true);
            }
            default:
                return '';
        }
    }

    // When 'Cancel anytime.' copy is displayed on one line, use this function to ensure proper localized punctuation added
    function getPlanPeriodSentence(planPeriodVariant?: PlanPeriodVariant) {
        switch (planPeriodVariant) {
            case PlanPeriodVariant.STARTING_AT_AFTER_TRIAL_PERIOD_DAYS:
                return interpolate(
                    gettext(
                        'Starting at %(listPriceText)s per month after %(trialPeriodDays)s-day trial. Cancel anytime.',
                    ),
                    {
                        listPriceText,
                        trialPeriodDays,
                    },
                    true,
                );
            case PlanPeriodVariant.STARTING_AT_AFTER_TRIAL_PERIOD:
                return interpolate(
                    gettext('Starting at %(listPriceText)s per month after trial. Cancel anytime.'),
                    {
                        listPriceText,
                        trialPeriodDays,
                    },
                    true,
                );
            case PlanPeriodVariant.STARTING_AT_PER_MONTH:
                return interpolate(
                    gettext('Starting at %(listPriceText)s per month. Cancel anytime.'),
                    {listPriceText},
                    true,
                );
            case PlanPeriodVariant.PRICE_WITH_TRIAL_PERIOD_DAYS:
                return interpolate(
                    gettext(
                        '%(listPriceText)s per month after %(trialPeriodDays)s-day trial. Cancel anytime.',
                    ),
                    {
                        listPriceText,
                        trialPeriodDays,
                    },
                    true,
                );
            case PlanPeriodVariant.PRICE_WITH_TRIAL:
                return interpolate(
                    gettext('%(listPriceText)s per month after trial. Cancel anytime.'),
                    {
                        listPriceText,
                        trialPeriodDays,
                    },
                    true,
                );
            case PlanPeriodVariant.PRICE_PER_MONTH:
                return interpolate(
                    gettext('%(listPriceText)s per month. Cancel anytime.'),
                    {listPriceText},
                    true,
                );
            default:
                return '';
        }
    }

    let multiline =
        style === PlanPeriodStyle.MULTILINE_MARGIN || style === PlanPeriodStyle.MULTILINE_NO_MARGIN;

    let planPeriodVariant;
    let planPeriodText: string | JSX.Element = '';
    // This logic is designed to treat a 0-day trial in the same way as no trial at all.
    const trialPeriodDaysUnwrapped = trialPeriodDays ?? 0;
    if (showStartingAtPrice && trialPeriodDaysUnwrapped > 0 && showTrialDays) {
        planPeriodVariant = PlanPeriodVariant.STARTING_AT_AFTER_TRIAL_PERIOD_DAYS;
    }
    if (showStartingAtPrice && trialPeriodDaysUnwrapped > 0 && !showTrialDays) {
        planPeriodVariant = PlanPeriodVariant.STARTING_AT_AFTER_TRIAL_PERIOD;
    }
    if (showStartingAtPrice && trialPeriodDaysUnwrapped <= 0) {
        if (emphasizeListPriceText) {
            planPeriodVariant = PlanPeriodVariant.STARTING_AT_PER_MONTH_EMPHASIZED;
        } else {
            planPeriodVariant = PlanPeriodVariant.STARTING_AT_PER_MONTH;
        }
    }
    if (!showStartingAtPrice && trialPeriodDaysUnwrapped > 0 && showTrialDays) {
        planPeriodVariant = PlanPeriodVariant.PRICE_WITH_TRIAL_PERIOD_DAYS;
    }
    if (!showStartingAtPrice && trialPeriodDaysUnwrapped > 0 && !showTrialDays) {
        planPeriodVariant = PlanPeriodVariant.PRICE_WITH_TRIAL;
    }
    if (!showStartingAtPrice && trialPeriodDaysUnwrapped <= 0) {
        planPeriodVariant = PlanPeriodVariant.PRICE_PER_MONTH;
    }

    if (showCancelAnytime) {
        planPeriodText = getPlanPeriodSentence(planPeriodVariant);
    } else {
        planPeriodText = getPlanPeriodText(planPeriodVariant);
    }
    // If localized sentence shorter than 42 characters and parent component specifies multiline configuration,
    // split the copy across lines without punctuation. Otherwise, we can end up with just a single word on the
    // wrapped line
    multiline =
        multiline &&
        typeof planPeriodText === 'string' &&
        planPeriodText.length > SINGLE_LINE_CHARACTER_LIMIT &&
        planPeriodText.length < MULTILINE_WRAP_LIMIT;
    if (multiline) {
        planPeriodText = getPlanPeriodText(planPeriodVariant);
    }

    if (showCancelAnytime) {
        let planPeriodStyle = 'plan-period-one-line';
        if (style === PlanPeriodStyle.MULTILINE_MARGIN && multiline) {
            planPeriodStyle = 'plan-period-multiline';
        }
        if (style === PlanPeriodStyle.MULTILINE_NO_MARGIN && multiline) {
            planPeriodStyle = 'plan-period-multiline-no-margin';
        }
        const cancelAnytimeStyle = multiline
            ? 'cancel-anytime-multiline'
            : 'cancel-anytime-one-line';
        return (
            <div>
                <div styleName={planPeriodStyle}>{planPeriodText}</div>
                <div styleName={cancelAnytimeStyle}>
                    {multiline && <CancelAnytime style={style} />}
                </div>
            </div>
        );
    }
    return <>{planPeriodText}</>;
};
