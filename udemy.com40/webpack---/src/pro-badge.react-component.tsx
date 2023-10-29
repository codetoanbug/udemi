import React from 'react';

import {useI18n} from '@udemy/i18n';
import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import {Badge} from '@udemy/react-messaging-components';
import {useUDData} from '@udemy/ud-data';

import styles from './pro-badge.module.less';

export interface ProBadgeProps {
    background?: 'neutral' | 'dark';
    className?: string;
}

export const ProBadge = ({
    className = '',
    background = 'neutral',
    ...otherProps
}: ProBadgeProps) => {
    const {gettext} = useI18n();
    const udData = useUDData();

    if (udData.Config.brand.has_organization) {
        return (
            <Badge className={`${className} ${styles['pro-badge']}`} {...otherProps}>
                <RatingStarIcon className="icon" size="xsmall" label={false} color="inherit" />
                {'Pro'}
            </Badge>
        );
    }

    return (
        <Badge className={`${className} ${styles[background]}`} {...otherProps}>
            {gettext('Beta')}
        </Badge>
    );
};

ProBadge.displayName = 'ProBadge';
