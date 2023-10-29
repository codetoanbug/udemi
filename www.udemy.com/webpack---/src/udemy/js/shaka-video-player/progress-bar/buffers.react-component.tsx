import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ProgressBarStore} from './progress-bar.mobx-store';

interface BuffersProps {
    progressBarStore: ProgressBarStore;
}
@inject('progressBarStore')
@observer
export class Buffers extends Component<BuffersProps> {
    static propTypes = {
        progressBarStore: PropTypes.object.isRequired,
    };

    calculateBufferTimePercent(position: any) {
        const duration = this.props.progressBarStore.videoDuration;
        return `${(100 / duration) * position}%`;
    }

    calculateWidth(start: any, end: any) {
        const startPercent = this.calculateBufferTimePercent(start);
        const endPercent = this.calculateBufferTimePercent(end);

        return `calc(${endPercent} - ${startPercent})`;
    }

    renderBuffer = ({start, end}: any, item: any) => {
        return (
            <div
                data-purpose="video-progress-buffer"
                key={item}
                style={{
                    left: this.calculateBufferTimePercent(start),
                    width: this.calculateWidth(start, end),
                }}
            />
        );
    };

    render() {
        return this.props.progressBarStore?.buffers?.map(this.renderBuffer);
    }
}
