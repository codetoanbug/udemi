import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './time-summary.less';

export default class TimeSummary extends Component {
    static propTypes = {
        hours: PropTypes.number.isRequired,
        minutes: PropTypes.number.isRequired,
        seconds: PropTypes.number,
        overtimeMinutes: PropTypes.number,
        overtimeSeconds: PropTypes.number,
    };

    static defaultProps = {
        seconds: 0,
        overtimeMinutes: 0,
        overtimeSeconds: 0,
    };

    render() {
        const {hours, minutes, seconds, overtimeMinutes, overtimeSeconds} = this.props;
        return (
            <>
                {hours > 0
                    ? ninterpolate('%(count)s hour', '%(count)s hours', hours, {count: hours})
                    : null}
                {hours > 0 && minutes > 0 ? ' ' : null}
                {minutes > 0
                    ? ninterpolate('%(count)s minute', '%(count)s minutes', minutes, {
                          count: minutes,
                      })
                    : null}
                {hours === 0 && minutes === 0 && seconds > 0
                    ? ninterpolate('%(count)s second', '%(count)s seconds', seconds, {
                          count: seconds,
                      })
                    : null}
                {overtimeMinutes > 0 || overtimeSeconds > 0 ? (
                    <span styleName="overtime">
                        {' '}
                        {overtimeMinutes > 0
                            ? ninterpolate(
                                  '(+%(count)s minute)',
                                  '(+%(count)s minutes)',
                                  overtimeMinutes,
                                  {count: overtimeMinutes},
                              )
                            : null}
                        {overtimeMinutes === 0 && overtimeSeconds > 0
                            ? ninterpolate(
                                  '(+%(count)s second)',
                                  '(+%(count)s seconds)',
                                  overtimeSeconds,
                                  {count: overtimeSeconds},
                              )
                            : null}
                    </span>
                ) : null}
            </>
        );
    }
}
