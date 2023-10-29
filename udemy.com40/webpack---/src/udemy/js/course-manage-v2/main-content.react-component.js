import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './main-content.less';

export default class MainContent extends Component {
    static propTypes = {
        wideContent: PropTypes.bool,
    };

    static defaultProps = {
        wideContent: false,
    };

    render() {
        const styleName = classNames('content', {wide: this.props.wideContent});
        return <div styleName={styleName}>{this.props.children}</div>;
    }
}
