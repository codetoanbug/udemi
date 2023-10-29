import {Badge} from '@udemy/react-messaging-components';
import {useI18n} from '@udemy/i18n';
import React from 'react';

import styles from './lab-beta-badge.module.less';

export const LabBetaBadge = () => {
    const {gettext} = useI18n();
    return <Badge className={styles['beta-badge']}>{gettext('Beta')}</Badge>;
};
