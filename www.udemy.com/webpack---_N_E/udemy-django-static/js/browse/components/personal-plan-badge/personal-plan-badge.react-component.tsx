import {useI18n} from '@udemy/i18n';
import {Badge} from '@udemy/react-messaging-components';
import React from 'react';

import styles from './personal-plan-badge.module.less';

export function PersonalPlanBadge() {
    const {gettext} = useI18n();
    return (
        <Badge data-purpose="personal-plan-badge" className={styles.badge}>
            {gettext('Personal Plan')}
        </Badge>
    );
}
