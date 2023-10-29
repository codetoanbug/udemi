import {AlertBannerContent} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {OPT_INTO_DEAL_PROGRAM_URL} from './links';
import {
    PREMIUM_APPLICATION_WARNING_BUTTON_TEXT,
    PREMIUM_APPLICATION_WARNING_CO_OWNER_TITLE_TEXT,
    PREMIUM_APPLICATION_WARNING_OWNER_BODY_TEXT,
    PREMIUM_APPLICATION_WARNING_OWNER_TITLE_TEXT,
} from './messages';

import './price.less';

export interface PremiumApplicationWarningProps {
    isOwner: boolean;
}

@observer
export class PremiumApplicationWarning extends Component<PremiumApplicationWarningProps> {
    render() {
        let title, body, showCta;
        if (this.props.isOwner) {
            title = PREMIUM_APPLICATION_WARNING_OWNER_TITLE_TEXT;
            body = PREMIUM_APPLICATION_WARNING_OWNER_BODY_TEXT;
            showCta = true;
        } else {
            title = PREMIUM_APPLICATION_WARNING_CO_OWNER_TITLE_TEXT;
            showCta = false;
        }
        return (
            <AlertBannerContent
                udStyle="warning"
                styleName="alert-banner"
                data-purpose="premium-application-warning"
                ctaText={PREMIUM_APPLICATION_WARNING_BUTTON_TEXT}
                showCta={showCta}
                actionButtonProps={{
                    componentClass: 'a',
                    href: OPT_INTO_DEAL_PROGRAM_URL,
                }}
                dismissButtonProps={false}
                title={title}
                body={body}
            />
        );
    }
}
