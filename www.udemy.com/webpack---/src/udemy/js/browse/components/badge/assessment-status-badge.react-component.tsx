import React from 'react';

import {
    InProgressBadge,
    CompletedBadge,
    ExpiredBadge,
} from 'browse/components/badge/assessment-badges.react-component';
import {
    ASSESSMENT_BADGE_EXPIRED,
    ASSESSMENT_BADGE_COMPLETED,
    ASSESSMENT_BADGE_IN_PROGRESS,
} from 'browse/components/badge/constants';

export const AssessmentStatusBadge = (props: {badgeType: string}) => {
    switch (props.badgeType) {
        case ASSESSMENT_BADGE_EXPIRED:
            return <ExpiredBadge />;
        case ASSESSMENT_BADGE_COMPLETED:
            return <CompletedBadge />;
        case ASSESSMENT_BADGE_IN_PROGRESS:
            return <InProgressBadge />;
    }
    return null;
};
