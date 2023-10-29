import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import classNames from 'classnames';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';

import './alternate-redirect.less';

export interface AlternateRedirectProps {
    hasDarkBackground: boolean;
    details?: {
        reason: 'upgraded' | 'unsupported';
        sourceCourseTitle: string;
    };
}

export const AlternateRedirect = ({hasDarkBackground, details}: AlternateRedirectProps) => {
    if (!details) {
        return null;
    }

    return (
        <div
            className={classNames('course-landing-page__main-content', {
                'dark-background-inner-text-container': hasDarkBackground,
            })}
        >
            <div styleName="container" role="alert">
                <div styleName="icon-container">
                    <InfoIcon styleName="icon" size="medium" color="info" label="Info" />
                </div>
                {details.reason === 'upgraded' && (
                    <div data-purpose="course-alternate-reason-upgraded">
                        <div className="ud-heading-md">
                            {gettext(
                                'You have been redirected to the latest version of this course.',
                            )}
                        </div>
                        <div className="ud-text-sm" styleName="subtext">
                            {gettext(
                                'If you have enrolled in an earlier version of this course, you can access it in "my courses".',
                            )}
                        </div>
                    </div>
                )}
                {details.reason === 'unsupported' && (
                    <div data-purpose="course-alternate-reason-unsupported">
                        <div className="ud-heading-md">
                            {interpolate(
                                gettext(
                                    "%(title)s is not published on our platform at this time. You've been redirected to a similar course.",
                                ),
                                {title: details.sourceCourseTitle},
                                true,
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default isomorphic(AlternateRedirect);
