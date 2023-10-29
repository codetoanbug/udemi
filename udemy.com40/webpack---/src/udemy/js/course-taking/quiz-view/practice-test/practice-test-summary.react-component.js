import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import TimeSummary from './time-summary.react-component';
import './practice-test-summary.less';

export default class PracticeTestSummary extends Component {
    static propTypes = {
        className: PropTypes.string,
        size: PropTypes.oneOf(['md', 'lg']),
        durationHours: PropTypes.number.isRequired,
        durationMinutes: PropTypes.number.isRequired,
        numAssessments: PropTypes.number.isRequired,
        passPercent: PropTypes.number.isRequired,
    };

    static defaultProps = {
        className: '',
        size: 'md',
    };

    render() {
        const {
            className,
            size,
            durationHours,
            durationMinutes,
            numAssessments,
            passPercent,
        } = this.props;
        return (
            <div
                className={classNames(className, {'ud-text-lg': size === 'lg'})}
                styleName={classNames('summary', {'summary-lg': size === 'lg'})}
            >
                {ninterpolate('%(count)s question', '%(count)s questions', numAssessments, {
                    count: numAssessments,
                })}
                <span styleName="separator">{' | '}</span>
                <TimeSummary hours={durationHours} minutes={durationMinutes} />
                <span styleName="separator">{' | '}</span>
                <span styleName="required-to-pass-desktop">
                    {interpolate(
                        gettext('%(percent)s% correct required to pass'),
                        {percent: passPercent},
                        true,
                    )}
                </span>
                <span styleName="required-to-pass-mobile">
                    {interpolate(
                        gettext('%(percent)s% required to pass'),
                        {percent: passPercent},
                        true,
                    )}
                </span>
            </div>
        );
    }
}
