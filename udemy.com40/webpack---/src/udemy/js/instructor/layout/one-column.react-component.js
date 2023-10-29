import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './one-column.less';

export default class OneColumn extends Component {
    static propTypes = {
        children: PropTypes.node,
    };

    static defaultProps = {
        children: undefined,
    };

    render() {
        const {children} = this.props;
        return <div styleName="one-column">{children}</div>;
    }
}
