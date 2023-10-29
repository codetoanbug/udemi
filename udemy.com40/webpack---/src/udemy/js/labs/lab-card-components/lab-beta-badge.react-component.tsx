import {Badge} from '@udemy/react-messaging-components';
import React from 'react';

import './lab-beta-badge.less';

export const LabBetaBadge = () => {
    return <Badge styleName="beta-badge">{gettext('Beta')}</Badge>;
};
