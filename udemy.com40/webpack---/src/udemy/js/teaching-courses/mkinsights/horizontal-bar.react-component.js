import {Meter} from '@udemy/react-messaging-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './horizontal-bar.less';

export default class HorizontalBar extends Component {
    static propTypes = {
        percentage: PropTypes.number.isRequired,
    };

    render() {
        return (
            <Meter
                value={this.props.percentage}
                min={0}
                max={100}
                styleName="horizontal-bar"
                label={gettext('%(percent)s%')}
            />
        );
    }
}
