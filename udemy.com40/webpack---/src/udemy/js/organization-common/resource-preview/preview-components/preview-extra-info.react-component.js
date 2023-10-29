import {Image} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React from 'react';

import './preview-extra-info.less';

export const AuthorIconAndName = ({authorIcon, authorName}) => {
    return (
        <div className="ud-heading-sm" styleName="attachment__author" data-purpose="author-icon">
            <Image
                styleName="attachment__author_icon"
                src={authorIcon}
                alt={gettext('Author icon')}
                width={16}
                height={16}
            />
            <span>{authorName}</span>
        </div>
    );
};

AuthorIconAndName.propTypes = {
    authorIcon: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
};

export const ResourceTitle = ({title}) => {
    return (
        <div className="ud-heading-md" styleName="attachment__title" data-purpose="resource-title">
            {title}
        </div>
    );
};

ResourceTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

export const EstimatedTime = ({minEstimatedTime, maxEstimatedTime}) => {
    return (
        <span styleName="info-content" data-purpose="estimated-time">
            {interpolate(
                gettext('%(minEstimatedTime)s-%(maxEstimatedTime)smin'),
                {
                    minEstimatedTime,
                    maxEstimatedTime,
                },
                true,
            )}
        </span>
    );
};

EstimatedTime.propTypes = {
    minEstimatedTime: PropTypes.number.isRequired,
    maxEstimatedTime: PropTypes.number.isRequired,
};

export const NumberOfQuestions = ({numberOfQuestions}) => {
    return (
        <span styleName="info-content" data-purpose="number-of-questions">
            {ninterpolate('~%(count)s question', '~%(count)s questions', numberOfQuestions, {
                count: numberOfQuestions,
            })}
        </span>
    );
};

NumberOfQuestions.propTypes = {
    numberOfQuestions: PropTypes.number.isRequired,
};
