import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {isomorphic} from 'utils/isomorphic-rendering';

import './draft-warning.less';

interface DraftWarningProps {
    title: string;
    subtitle: string;
}

export const DraftWarning = ({title, subtitle}: DraftWarningProps) => {
    return (
        <div className="course-landing-page__main-content" styleName="draft-warning-container">
            <div styleName="draft-warning" data-purpose="course-warnings" role="alert">
                <div styleName="draft-warning-icon-container">
                    <WarningIcon label="Warning" size="large" color="neutral" />
                </div>
                <div data-purpose="course-draft-warning">
                    <div
                        className="ud-heading-md"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'draft-warning:title',
                            html: title,
                        })}
                    />
                    <div
                        className="ud-text-sm"
                        styleName="draft-warning-subtext"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'draft-warning:subtitle',
                            html: subtitle,
                            domPurifyConfig: {ADD_ATTR: ['target']},
                        })}
                    />
                </div>
            </div>
        </div>
    );
};

export default isomorphic(DraftWarning);
