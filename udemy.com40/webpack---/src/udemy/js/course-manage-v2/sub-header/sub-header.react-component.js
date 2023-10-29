import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './sub-header.less';

export default class SubHeader extends Component {
    static propTypes = {
        actionButtons: PropTypes.node,
        title: PropTypes.string.isRequired,
    };

    static defaultProps = {
        actionButtons: null,
    };

    render() {
        const {title, children, actionButtons} = this.props;
        return (
            <div styleName="flex-align-center container">
                <div styleName="flex-align-center content">
                    <h2 data-purpose="page-title" className="ud-heading-serif-xl">
                        {title}
                    </h2>
                    {children}
                </div>
                {actionButtons && <div styleName="flex-align-center content">{actionButtons}</div>}
            </div>
        );
    }
}
