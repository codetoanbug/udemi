import PropTypes from 'prop-types';
import React, {Component} from 'react';

/* eslint-disable no-unused-vars,import/order */
import styles from './ia-metrics-header-item.react-component.less';

export default class IAMetricsHeaderItem extends Component {
    static propTypes = {
        headline: PropTypes.string.isRequired,
        textStatement: PropTypes.string.isRequired,
    };

    render() {
        const {headline, textStatement} = this.props;

        return (
            <div styleName="styles.item">
                <p>
                    <b>{headline}</b>
                </p>
                <p>{textStatement}</p>
            </div>
        );
    }
}
