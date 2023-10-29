import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

@inject('progressBarStore')
@observer
export default class Buffers extends Component {
    static propTypes = {
        progressBarStore: PropTypes.object.isRequired,
    };

    calculateBufferTimePercent(position) {
        const duration = this.props.progressBarStore.videoDuration;
        return `${(100 / duration) * position}%`;
    }

    calculateWidth(start, end) {
        const startPercent = this.calculateBufferTimePercent(start);
        const endPercent = this.calculateBufferTimePercent(end);

        return `calc(${endPercent} - ${startPercent})`;
    }

    @autobind
    renderBuffer({start, end}, item) {
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
    }

    render() {
        return this.props.progressBarStore.buffers.map(this.renderBuffer);
    }
}
