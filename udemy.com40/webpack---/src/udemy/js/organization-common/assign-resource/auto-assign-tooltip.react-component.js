import {withMatchMedia} from '@udemy/hooks';
import {withI18n} from '@udemy/i18n';
import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Tooltip} from '@udemy/react-popup-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import styles from './assign-resource-modal.less';

@withMatchMedia({isMobile: 'mobile-max'})
class InternalAutoAssignTooltip extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        isMobile: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isMobile: false,
    };

    render() {
        const {gettext} = this.props;
        return (
            <Tooltip
                trigger={<InfoIcon label={gettext('Get info')} size="xsmall" />}
                placement={this.props.isMobile ? 'bottom-end' : 'bottom'}
                className={styles['auto-assign-info-popover']}
            >
                {this.props.text}
            </Tooltip>
        );
    }
}

const AutoAssignTooltip = withI18n(InternalAutoAssignTooltip);
export default AutoAssignTooltip;
