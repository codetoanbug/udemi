import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Buffers from './buffers.react-component';

import './progress-bar.less';

@inject('progressBarStore')
@observer
export default class LoadProgress extends Component {
    static propTypes = {
        progressBarStore: PropTypes.object.isRequired,
    };

    get loadedInfo() {
        const text = gettext('Loaded: %(bufferedPercent)s');
        return interpolate(
            text,
            {bufferedPercent: this.props.progressBarStore.bufferedPercent},
            true,
        );
    }

    render() {
        return (
            <div styleName="load-progress">
                <span className="ud-sr-only">{this.loadedInfo}</span>

                <Buffers />
            </div>
        );
    }
}
