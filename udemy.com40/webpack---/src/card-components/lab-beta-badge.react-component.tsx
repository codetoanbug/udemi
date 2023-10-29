import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Badge} from '@udemy/react-messaging-components';

import styles from './lab-beta-badge.module.less';

export const LabBetaBadge = () => {
    const i18n = useI18n();
    return (
        <Badge data-testid="lab-beta-badge" className={styles['beta-badge']}>
            {i18n.gettext('Beta')}
        </Badge>
    );
};
