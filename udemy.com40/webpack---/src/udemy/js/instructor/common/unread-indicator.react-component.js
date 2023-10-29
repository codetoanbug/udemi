import {Button} from '@udemy/react-core-components';
import {Tooltip} from '@udemy/react-popup-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import './unread-indicator.less';

@observer
export default class UnreadIndicator extends Component {
    static propTypes = {
        unread: PropTypes.bool.isRequired,
        important: PropTypes.bool.isRequired,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        onClick: noop,
    };

    render() {
        const {unread, important, onClick} = this.props;

        const unreadImportant = unread && important;

        const readStyleNames = classNames('thread-status', {
            'thread-status-read': !unread && !important,
            'thread-status-unread': unread,
            'thread-status-important': important,
            'thread-status-unread-important': unreadImportant,
        });

        let tooltipText = '';
        if (unread) {
            tooltipText = important ? gettext('Unread and important') : gettext('Unread');
        } else {
            tooltipText = important ? gettext('Important') : gettext('Mark as unread');
        }

        return (
            <Tooltip
                placement="left"
                styleName="tooltip"
                trigger={
                    <Button udStyle="link" onClick={onClick}>
                        <span styleName={readStyleNames} />
                    </Button>
                }
            >
                {tooltipText}
            </Tooltip>
        );
    }
}
