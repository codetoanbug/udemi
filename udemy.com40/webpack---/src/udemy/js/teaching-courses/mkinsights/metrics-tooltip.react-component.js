import {Popover} from '@udemy/react-popup-components';
import PropTypes from 'prop-types';
import React from 'react';

import {HIGH_CONVERSION_RATE_THRESHOLD} from './constants';
import './metrics-tooltip.less';

export const MetricsTooltip = ({children, ...props}) => {
    return (
        <Popover
            a11yRole="description"
            canToggleOnHover={true}
            placement="top"
            styleName="tooltip"
            {...props}
        >
            <div className="ud-text-sm" styleName="content">
                {children}
            </div>
        </Popover>
    );
};

export const InsightsTooltip = ({calculation, insight, children, ...props}) => {
    return (
        <MetricsTooltip trigger={children} {...props}>
            <div className="ud-heading-sm" styleName="heading">
                {gettext('Calculation')}
            </div>
            {calculation}
            <div className="ud-heading-sm" styleName="heading">
                {gettext('Insight')}
            </div>
            {insight}
        </MetricsTooltip>
    );
};
InsightsTooltip.propTypes = {
    calculation: PropTypes.node.isRequired,
    insight: PropTypes.node.isRequired,
};

export const ChannelsTooltip = (props) => (
    <InsightsTooltip
        calculation={
            <>
                <p>{gettext('Percentage of paid enrollments from:')}</p>
                <ul>
                    <li>
                        {gettext(
                            'Udemy discovery (e.g. course recommendation emails, homepage recommendations)',
                        )}
                    </li>
                    <li>{gettext('Udemy search')}</li>
                    <li>{gettext('Outside sources (e.g. Google search, word of mouth)')}</li>
                    <li>{gettext('Instructor promotion')}</li>
                    <li>{gettext('Paid advertising & affiliate traffic ')}</li>
                </ul>
            </>
        }
        insight={gettext(
            'Understand how students are finding courses in your Topic area to strategize your own marketing efforts.',
        )}
        {...props}
    />
);

export const ConversionTooltip = (props) => (
    <InsightsTooltip
        calculation={gettext(
            'Percent of students who purchased a course after visiting the course landing page in the last 3 months.',
        )}
        insight={interpolate(
            gettext(
                'If conversion rate is lower than %s%, students are not able to find the right course, ' +
                    'instructor, or price. Create a course that fills this gap.',
            ),
            [HIGH_CONVERSION_RATE_THRESHOLD],
        )}
        {...props}
    />
);
