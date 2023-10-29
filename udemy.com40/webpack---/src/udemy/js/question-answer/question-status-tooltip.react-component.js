import {Button} from '@udemy/react-core-components';
import {Tooltip} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './question-status-tooltip.less';

export default class QuestionStatusTooltip extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        thread: PropTypes.object.isRequired,
    };

    @autobind
    handleClick() {
        this.props.store.toggleRead(this.props.thread);
    }

    render() {
        const {thread} = this.props;
        const readStyleNames = classNames({
            'thread-status': true,
            'thread-status-unread': !thread.is_read,
        });
        return (
            <Tooltip
                placement="right"
                styleName="tooltip"
                trigger={
                    <Button udStyle="link" onClick={this.handleClick}>
                        <span styleName={readStyleNames} />
                    </Button>
                }
            >
                {thread.is_read ? gettext('Mark as unread') : gettext('Mark as read')}
            </Tooltip>
        );
    }
}
