import {LocalizedHtml} from '@udemy/i18n';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {MFA_INFO_LINK, MX_MFA_INFO_LINK} from 'auth/two-factor/constants';

import './show-mfa.less';

export default class MFADescriptionBody extends Component {
    static propTypes = {
        userType: PropTypes.string,
    };

    static defaultProps = {
        userType: 'student',
    };

    render = () => {
        const helpCenterLink = this.props.userType == 'student' ? MX_MFA_INFO_LINK : MFA_INFO_LINK;
        return (
            <div styleName="mfa-description">
                <h2 styleName="mfa-title" className="ud-heading-md">
                    {gettext('Multi-factor Authentication')}
                </h2>
                <LocalizedHtml
                    className="ud-text-with-links"
                    html={gettext(
                        'Increase your account security by requiring that a code emailed to you be entered when you log in. ' +
                            'For more information on how multi-factor authentication works, refer to our ' +
                            '<a class="mfaInfoLink">Help Center article</a>.',
                    )}
                    interpolate={{
                        mfaInfoLink: <a href={helpCenterLink} />,
                    }}
                />
            </div>
        );
    };
}
