import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import {Popover} from '@udemy/react-popup-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './info-tooltip.less';

export default class InfoTooltip extends Component {
    static propTypes = {
        size: PropTypes.oneOf(['xsmall', 'small']),
        placement: PropTypes.string,
    };

    static defaultProps = {
        size: 'small',
        placement: 'top',
    };

    render() {
        const {size, placement, ...props} = this.props;
        return (
            <Popover
                placement={placement}
                canToggleOnHover={true}
                detachFromTarget={true}
                a11yRole="description"
                styleName={classNames('info-tooltip', {'info-tooltip-xsmall': size === 'xsmall'})}
                trigger={<InfoOutlineIcon size={size} label={gettext('Get info')} />}
                {...props}
            />
        );
    }
}
