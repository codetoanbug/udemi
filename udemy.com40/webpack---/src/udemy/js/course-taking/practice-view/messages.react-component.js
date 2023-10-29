import AccessTimeIcon from '@udemy/icons/dist/access-time.ud-icon';
import DownloadableResourceIcon from '@udemy/icons/dist/downloadable-resource.ud-icon';
import PersonIcon from '@udemy/icons/dist/person.ud-icon';
import {Button} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React from 'react';

import {formatNumber} from 'utils/numeral';

import './messages.less';

export const AssetMessage = ({length, scrollToResources}) => {
    const assetText = ngettext('Resource available', 'Resources available', length);

    return (
        <div styleName="practice-info">
            <DownloadableResourceIcon label={false} />
            <Button udStyle="link" onClick={scrollToResources}>
                {assetText}
            </Button>
        </div>
    );
};
AssetMessage.propTypes = {
    length: PropTypes.number.isRequired,
    scrollToResources: PropTypes.func.isRequired,
};

export const DurationMessage = ({duration}) => {
    const durationText = ninterpolate(
        '%(count)s minute to complete',
        '%(count)s minutes to complete',
        duration,
        {count: formatNumber(duration)},
    );

    return (
        <div styleName="practice-info" data-purpose="completion-time">
            <AccessTimeIcon label={false} />
            <span>{durationText}</span>
        </div>
    );
};
DurationMessage.propTypes = {
    duration: PropTypes.number.isRequired,
};

export const SubmissionMessage = ({amount}) => {
    const studentSolutionText = ninterpolate(
        '%(count)s student solution',
        '%(count)s student solutions',
        amount,
        {count: formatNumber(amount)},
    );

    return (
        <div styleName="practice-info">
            <PersonIcon label={false} />
            <span>{studentSolutionText}</span>
        </div>
    );
};
SubmissionMessage.propTypes = {
    amount: PropTypes.number.isRequired,
};
