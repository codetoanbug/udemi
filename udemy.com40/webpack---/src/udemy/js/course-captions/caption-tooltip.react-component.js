import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Popover} from '@udemy/react-popup-components';
import PropTypes from 'prop-types';
import React from 'react';

import './captions-form.less';

const CaptionTooltip = ({children, iconProps, ...props}) => {
    return (
        <Popover
            a11yRole="description"
            canToggleOnHover={true}
            placement="bottom"
            styleName="tooltip"
            trigger={<InfoIcon label={gettext('Get info')} {...iconProps} />}
            {...props}
        >
            <div className="ud-text-sm">{children}</div>
        </Popover>
    );
};

CaptionTooltip.propTypes = {
    iconProps: PropTypes.object,
};

CaptionTooltip.defaultProps = {
    iconProps: {},
};

export default CaptionTooltip;
