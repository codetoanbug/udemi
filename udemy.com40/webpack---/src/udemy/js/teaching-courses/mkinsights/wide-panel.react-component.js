import PropTypes from 'prop-types';
import React, {Component} from 'react';

/* eslint-disable no-unused-vars,import/order */
import baseStyles from './insights.less';
import styles from './wide-panel.less';
/* eslint-enable no-unused-vars,import/order */

export default class WidePanel extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    static defaultProps = {
        className: '',
    };

    render() {
        return (
            <div className={this.props.className} styleName="baseStyles.rp-xxl styles.wide-panel">
                {this.props.children}
            </div>
        );
    }
}
