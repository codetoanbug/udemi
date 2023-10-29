import {LocalizedHtml} from '@udemy/i18n';
import {Avatar} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import PropTypes from 'prop-types';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import Question from './question.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './practice.less';
import styles from './submission.less';
/* eslint-enable no-unused-vars,import/order */

const Submission = ({submission}) => {
    return (
        <div
            styleName="baseStyles.question-list styles.container"
            data-purpose="practice-submission"
        >
            <div styleName="styles.thread-header">
                <Avatar
                    size="medium"
                    user={{...submission.user, display_name: submission.user.title}}
                    alt="NONE"
                    srcKey="image_50x50"
                />
                <div styleName="styles.thread-header-submission-info">
                    <a href={submission.user.url}>{submission.user.title}</a>
                    {!!submission.submissionTime && (
                        <div data-purpose="submission-time">
                            <LocalizedHtml
                                html={gettext('Posted <span class="timeAgo"></span>')}
                                interpolate={{
                                    timeAgo: (
                                        <RelativeDuration datetime={submission.submissionTime} />
                                    ),
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
            {submission.questions.map((question) => (
                <Question key={question.id} question={question}>
                    <div
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'submission:user-answer-body',
                            html: question.userAnswer.body,
                        })}
                    />
                </Question>
            ))}
        </div>
    );
};

Submission.propTypes = {
    submission: PropTypes.object.isRequired,
};

export {Submission as default};
