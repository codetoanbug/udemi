import React from 'react';

import Gift from '@udemy/icons/dist/gift.ud-icon';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import Marketing from '@udemy/icons/dist/marketing.ud-icon';
import TrendingFlame from '@udemy/icons/dist/trending-flame.ud-icon';
import TrendingGraph from '@udemy/icons/dist/trending-graph.ud-icon';
import {Badge} from '@udemy/react-messaging-components';
import {Popover} from '@udemy/react-popup-components';

import styles from './opportunity-badge.module.less';

interface OpportunityBadgeProps {
    badgeIcon?: React.ReactNode;
    /** The style of the badge that matches the CSS class */
    badgeStyle: 'financial-incentive' | 'trending' | 'first-mover' | 'specialized';
    /** The text to display in the badge */
    badgeText: string;
    /** The text to display with the info tooltip */
    infoTooltipText?: string;
}
export const OpportunityBadge = ({
    badgeIcon,
    badgeStyle,
    badgeText,
    infoTooltipText,
}: OpportunityBadgeProps) => {
    const testId = 'opportunity-badge-' + badgeStyle;
    return (
        <Badge data-testid={testId} className={styles[badgeStyle]}>
            {badgeIcon && <div className={styles['badge-icon']}>{badgeIcon}</div>}
            {badgeText}
            {infoTooltipText && (
                <Popover
                    trigger={<InfoOutlineIcon />}
                    className={styles['tooltip-icon']}
                    canToggleOnHover={true}
                    placement="bottom"
                    withArrow={false}
                    detachFromTarget={true}
                >
                    {infoTooltipText}
                </Popover>
            )}
        </Badge>
    );
};

const TrendingBadge = () => {
    return (
        <OpportunityBadge
            badgeIcon={<TrendingGraph />}
            badgeStyle="trending"
            badgeText={'Trending'}
            infoTooltipText={
                'This subject has some coverage in Udemy Business, but there is demand for additional options.'
            }
        />
    );
};

export const FinancialIncentiveBadge = () => {
    return (
        <OpportunityBadge
            data-testid="opportunity-badge-financial"
            badgeIcon={<Gift />}
            badgeStyle="financial-incentive"
            badgeText={'Financial incentive'}
        />
    );
};

const FirstMoverBadge = () => {
    return (
        <OpportunityBadge
            badgeIcon={<TrendingFlame />}
            badgeStyle="first-mover"
            badgeText={'First mover'}
            infoTooltipText={
                'This subject is in demand and has limited content coverage in Udemy Business.'
            }
        />
    );
};

const SpecializedBadge = () => {
    return (
        <OpportunityBadge
            badgeIcon={<Marketing />}
            badgeStyle="specialized"
            badgeText={'Specialized'}
            infoTooltipText={
                'This subject is in demand among a subset of professional learners with a specific role or function.'
            }
        />
    );
};

export interface OpportunityTypeBadgeProps {
    opportunityType: string | undefined;
}

export const OpportunityTypeBadge = ({opportunityType}: OpportunityTypeBadgeProps) => {
    switch (opportunityType) {
        case 'UNSPECIFIED':
            return null;
        case 'TRENDING':
            return <TrendingBadge />;
        case 'FIRST_MOVER':
            return <FirstMoverBadge />;
        case 'SPECIALIZED':
            return <SpecializedBadge />;
        default:
            return null;
    }
};
