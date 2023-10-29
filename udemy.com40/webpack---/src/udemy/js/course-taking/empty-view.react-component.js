import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './empty-view.less';

export default class EmptyView extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        messageBody: PropTypes.string.isRequired,
        dataPurpose: PropTypes.string,
    };

    static defaultProps = {
        dataPurpose: 'empty-container',
    };

    render() {
        return (
            <div data-purpose={this.props.dataPurpose} styleName="empty-view">
                <div>
                    <h2 className="ud-heading-xl" styleName="title">
                        {this.props.title}
                    </h2>
                    <p>{this.props.messageBody}</p>
                </div>
            </div>
        );
    }
}
