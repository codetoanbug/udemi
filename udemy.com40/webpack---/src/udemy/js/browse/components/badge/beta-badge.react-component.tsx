import {useI18n} from '@udemy/i18n';
import {Badge} from '@udemy/react-messaging-components';
import React from 'react';

import styles from './beta-badge.less';

export function BetaBadge() {
    const {gettext} = useI18n();
    return (
        <Badge data-purpose="beta-badge" className={styles['beta-badge']}>
            {gettext('Beta')}
        </Badge>
    );
}
