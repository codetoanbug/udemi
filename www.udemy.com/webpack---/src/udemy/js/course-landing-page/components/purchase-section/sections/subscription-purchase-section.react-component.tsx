import {Tracker} from '@udemy/event-tracking';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {BlockList} from '@udemy/react-core-components';
import {getRequestData} from '@udemy/shared-utils';
import {mediaQueryPxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React from 'react';

import {withMatchMedia} from 'base-components/responsive/match-media.react-component';
import {ReactCLPSubscriptionContext} from 'course-landing-page/clp-subscription-context';
import {SubscriptionContext} from 'course-landing-page/types/clc-contexts';
import {PlanPeriodStyle} from 'subscription-browse/components/plan-period/plan-period.react-component';
import {SubscriptionCTA} from 'subscription-browse/components/subscription-cta/subscription-cta.react-component';
import {isConsumerSubscription, SubscribeFromPageCookie} from 'subscription-browse/utils';
import {SubscriptionLearnMoreEvent} from 'subscription-management/settings/subscription-page-events';

import '../purchase-section-container.less';

export interface SubscriptionPurchaseSectionComponentContext {
    courseId: number;
    enableSubsAuthModal?: boolean;
}

export interface SubscriptionPurchaseSectionProps
    extends SubscriptionPurchaseSectionComponentContext {
    uiRegion: string;
    courseTrackingId?: string;
    isMobile?: boolean;
    udStyle?: 'brand' | 'secondary' | 'primary';
}

@inject('courseId')
/* CLP has custom breakpoints, see course-landing-page/_base/tokens.less */
@withMatchMedia({isMobile: `(max-width: ${mediaQueryPxToRem(1079)}rem)`})
@observer
export class SubscriptionPurchaseSection extends React.Component<SubscriptionPurchaseSectionProps> {
    static defaultProps = {
        udStyle: 'brand',
    };

    static contextType = ReactCLPSubscriptionContext;

    @autobind
    learnMoreClickHandler() {
        const subscriptionPlan = this.context.subscriptionPlan?.subscriptionPlan;
        Tracker.publishEvent(
            new SubscriptionLearnMoreEvent(
                subscriptionPlan.id,
                subscriptionPlan.productType,
                this.props.uiRegion,
                this.context.subscriptionPlan.subscriptionPlanIds,
            ),
        );
    }

    @autobind
    ctaClickHandler() {
        SubscribeFromPageCookie.set('course_landing_page', this.props.courseId);
    }

    renderFeaturedList() {
        const subscriptionContext = this.context?.subscriptionContext as SubscriptionContext;
        if (
            !subscriptionContext ||
            !subscriptionContext?.featured_list ||
            subscriptionContext.featured_list.length === 0
        ) {
            return null;
        }
        return (
            <>
                {this.context?.subscriptionPlan?.subscriptionPlan &&
                    isConsumerSubscription(
                        this.context?.subscriptionPlan?.subscriptionPlan?.productType,
                    ) &&
                    subscriptionContext.title_placement === 'above_featured_list' && (
                        <div className="ud-heading-lg" styleName="subscription-title">
                            {subscriptionContext.title}
                        </div>
                    )}
                <BlockList
                    padding="tight"
                    styleName="blocklist"
                    size="small"
                    data-purpose="featured-list"
                >
                    {subscriptionContext.featured_list.map((item, index) => {
                        return (
                            <BlockList.Item key={index + item[0]} icon={<TickIcon label={false} />}>
                                {item}
                            </BlockList.Item>
                        );
                    })}
                </BlockList>
            </>
        );
    }

    render() {
        const udRequest = getRequestData();
        if (
            !this.context ||
            !this.context?.subscriptionContext ||
            !this.context?.subscriptionPlan
        ) {
            return null;
        }
        const {
            title,
            title_placement: titlePlacement,
            description,
            learn_more_url: learnMoreUrl,
        } = this.context?.subscriptionContext;
        return (
            <div data-purpose="subscription-purchase-section">
                <div>
                    {this.context?.subscriptionPlan?.subscriptionPlan &&
                        isConsumerSubscription(
                            this.context?.subscriptionPlan?.subscriptionPlan?.productType,
                        ) &&
                        titlePlacement === 'above_description' && (
                            <div
                                className="ud-heading-serif-lg dark-bg-text"
                                styleName="subscription-title-above-description"
                            >
                                {title}
                            </div>
                        )}
                    <div className="ud-text-sm dark-bg-text" styleName="purchase-text">
                        {description}{' '}
                        <a
                            styleName="purchase-learn-more-link"
                            className={classNames('ud-heading-sm', 'ud-link-underline')}
                            data-purpose="subscription-learn-more-link"
                            href={learnMoreUrl}
                            onClick={this.learnMoreClickHandler}
                        >
                            {gettext('Learn more')}
                        </a>
                    </div>
                </div>
                <SubscriptionCTA
                    styleName="subscription-cta"
                    uiRegion={this.props.uiRegion}
                    subtitleClassName="dark-bg-text"
                    data-purpose="subscription-purchase-button"
                    offerCtaStyle={this.props.udStyle}
                    onCTAClick={this.ctaClickHandler}
                    courseId={this.props.courseId}
                    courseTrackingId={this.props.courseTrackingId}
                    includeTrialDaysOnCta={false}
                    planPeriodStyle={
                        udRequest.isMobile
                            ? PlanPeriodStyle.MULTILINE_NO_MARGIN
                            : PlanPeriodStyle.MULTILINE_MARGIN
                    }
                    plan={this.context?.subscriptionPlan?.subscriptionPlan}
                />
                {this.renderFeaturedList()}
            </div>
        );
    }
}
