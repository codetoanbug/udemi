import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {Buffers} from './buffers.react-component';
import {ProgressBarStore} from './progress-bar.mobx-store';

import './progress-bar.less';

interface LoadProgressProps {
    progressBarStore: ProgressBarStore;
}

@inject('progressBarStore')
@observer
export class LoadProgress extends Component<LoadProgressProps> {
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
                <Buffers progressBarStore={this.props.progressBarStore} />
            </div>
        );
    }
}
