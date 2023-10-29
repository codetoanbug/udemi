import {Duration, formatDuration} from '@udemy/react-date-time-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './progress-display.less';

@inject('progressBarStore')
@observer
export default class ProgressDisplay extends React.Component {
    static propTypes = {
        progressBarStore: PropTypes.object.isRequired,
    };

    render() {
        const currentTime = formatDuration(
            {
                numSeconds: this.props.progressBarStore.progressBarTime,
                presentationStyle: Duration.STYLE.TIMESTAMP,
                precision: Duration.PRECISION.MINUTES,
            },
            {gettext, interpolate},
        );
        const totalTime = formatDuration(
            {
                numSeconds: this.props.progressBarStore.videoDuration,
                presentationStyle: Duration.STYLE.TIMESTAMP,
                precision: Duration.PRECISION.MINUTES,
            },
            {gettext, interpolate},
        );
        return (
            <div className="ud-heading-sm" styleName="progress-display">
                <div data-purpose="progress-display">
                    <span data-purpose="current-time">{currentTime}</span>
                    <span>{' / '}</span>
                    <span data-purpose="duration">{totalTime}</span>
                </div>
                {/* Spacer keeps the timer width consistent (4:44 is wider than 1:11). */}
                <div aria-hidden={true} styleName="progress-display-spacer">
                    <span>{currentTime.replace(/\d/g, '4')}</span>
                    <span>{' / '}</span>
                    <span>{totalTime.replace(/\d/g, '4')}</span>
                </div>
            </div>
        );
    }
}
