import React from 'react';

import {LEARNING_PROFILE_DEEPLINK} from './constants';
import {MobileAppSMSDownloadForm} from './mobile-app-sms-download-form.react-component';

import './learning-tools.less';

export const MobileAppSMSDownload = () => {
    return (
        <div styleName="mobile-app-download-container">
            <h3 className="ud-heading-lg">{gettext('Push notifications')}</h3>
            <div>
                {gettext(
                    'Don’t want to schedule time blocks? Set a learning reminder to get push notifications from the Udemy mobile app.',
                )}
            </div>
            <h4 className="ud-heading-sm">{gettext('Text me a link to download the app')}</h4>
            <div styleName="form-container">
                <MobileAppSMSDownloadForm deeplinkPath={LEARNING_PROFILE_DEEPLINK} />
            </div>
            <div className="ud-text-xs" styleName="subtext">
                {gettext(
                    'By providing your phone number, you agree to receive a one-time ' +
                        'automated text message with a link to get app. Standard ' +
                        'messaging rates may apply.',
                )}
            </div>
        </div>
    );
};
