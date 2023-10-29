import LockIcon from '@udemy/icons/dist/lock.ud-icon';
import {Tooltip} from '@udemy/react-popup-components';
import PropTypes from 'prop-types';
import React from 'react';

import './locked-state-icon.less';

const LockedStateIcon = ({tooltipMessage, isTooltipHidden, theme, ...props}) => {
    if (isTooltipHidden) {
        return <LockIcon label={tooltipMessage} size="xsmall" styleName={`icon-${theme}`} />;
    }
    return (
        <Tooltip
            placement="right"
            styleName="tooltip"
            trigger={<LockIcon label={false} size="xsmall" styleName={`icon-${theme}`} />}
            {...props}
        >
            {tooltipMessage}
        </Tooltip>
    );
};

LockedStateIcon.propTypes = {
    tooltipMessage: PropTypes.string.isRequired,
    isTooltipHidden: PropTypes.bool,
    theme: PropTypes.oneOf(['subdued', 'neutral']),
};

LockedStateIcon.defaultProps = {
    isTooltipHidden: false,
    theme: 'subdued',
};

export default LockedStateIcon;
