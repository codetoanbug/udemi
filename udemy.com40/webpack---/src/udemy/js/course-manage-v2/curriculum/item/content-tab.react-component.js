import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './content-tab.less';

export default class ContentTab extends Component {
    static propTypes = {
        title: PropTypes.node.isRequired,
        onClose: PropTypes.func.isRequired,
        children: PropTypes.node,
        purpose: PropTypes.string,
    };

    static defaultProps = {
        children: null,
        purpose: '',
    };

    render() {
        return (
            <div styleName="tab-container" data-purpose={this.props.purpose}>
                <div className="ud-heading-sm" styleName="tab">
                    <div styleName="title">
                        {this.props.title}
                        <IconButton
                            udStyle="ghost"
                            size="xsmall"
                            data-purpose="content-tab-close"
                            onClick={this.props.onClose}
                            className="ud-link-neutral"
                            styleName="close"
                        >
                            <CloseIcon label={gettext('Close')} size="small" />
                        </IconButton>
                    </div>
                </div>
                <div styleName="tab-content">{this.props.children}</div>
            </div>
        );
    }
}
