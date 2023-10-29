import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './section-divider.less';

export default class SectionDivider extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
    };

    render() {
        return (
            <div className="ud-heading-xs" styleName="divider-outer">
                <div styleName="border" />
                <div styleName="divider-inner">{this.props.text}</div>
                <div styleName="border" />
            </div>
        );
    }
}
