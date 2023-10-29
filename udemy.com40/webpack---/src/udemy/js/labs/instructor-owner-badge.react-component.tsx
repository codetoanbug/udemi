import {Badge} from '@udemy/react-messaging-components';
import React from 'react';

import './instructor-owner-badge.less';

interface InstructorOwnerBadgeProps {
    className?: string;
}

export const InstructorOwnerBadge = ({className}: InstructorOwnerBadgeProps) => {
    return (
        <Badge styleName="owner-badge" className={className} data-purpose="owner-badge">
            {gettext('Owner')}
        </Badge>
    );
};
