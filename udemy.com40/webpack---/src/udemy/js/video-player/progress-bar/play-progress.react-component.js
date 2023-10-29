import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './progress-bar.less';

@inject('progressBarStore')
@observer
export default class PlayProgress extends Component {
    static propTypes = {
        progressBarStore: PropTypes.object.isRequired,
    };

    get progressBarInfo() {
        const text = gettext('Progress bar: %(currentTimePercent)s');
        return interpolate(
            text,
            {currentTimePercent: this.props.progressBarStore.currentTimePercent},
            true,
        );
    }

    render() {
        return (
            <div
                styleName="play-progress"
                style={{width: this.props.progressBarStore.currentTimePercent}}
            >
                <span className="ud-sr-only">{this.progressBarInfo}</span>
            </div>
        );
    }
}
