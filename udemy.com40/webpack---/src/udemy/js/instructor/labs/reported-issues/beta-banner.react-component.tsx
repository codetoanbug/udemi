import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import React from 'react';

import {useSystemMessageWithOpenFlag} from 'instructor/hooks/use-system-message';

import './beta-banner.less';

interface BetaBadgeProps {
    isBadgeOnly?: boolean;
}
export const BetaBadge = ({isBadgeOnly = false}: BetaBadgeProps) => {
    const i18n = useI18n();

    return (
        <Badge
            data-purpose="beta-badge"
            styleName={classNames('yellow', {
                'badge-only': isBadgeOnly,
            })}
        >
            {i18n.gettext('Beta')}
        </Badge>
    );
};

export const BetaBanner: React.FC = () => {
    const i18n = useI18n();
    const [isOpen, onClose] = useSystemMessageWithOpenFlag('hasSeenReportIssuesBanner');

    if (!isOpen) return null;
    return (
        <div styleName="beta-banner" data-purpose="beta-banner">
            <div>
                <BetaBadge />
            </div>
            <div styleName="content">
                <div className="ud-heading-md">
                    {i18n.gettext('You can now view issues reported by learners on your labs')}
                </div>
                <div className="ud-text-sm" styleName="description">
                    {i18n.gettext(
                        'Get an early view of the content-related issues that learners are reporting through the lab-taking experience.',
                    )}
                </div>
                <div styleName="dismiss-btn">
                    <Button
                        udStyle="ghost"
                        size="medium"
                        className="ud-link-neutral"
                        onClick={onClose}
                    >
                        {i18n.gettext('Dismiss')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
