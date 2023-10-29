import {ButtonProps} from '@udemy/react-core-components';
import {AlertBannerContent, AlertLevel} from '@udemy/react-messaging-components';
import React from 'react';

export interface LabSystemEventMessageProps {
    level: AlertLevel;
    title: string;
    description: string;
    url?: string;
    isPermanent: boolean;
    onDismiss: () => Promise<void>;
}

export const LabSystemEventMessage = ({
    level,
    title,
    description,
    url,
    isPermanent,
    onDismiss,
}: LabSystemEventMessageProps) => {
    let showCta = false,
        actionButtonProps: Record<string, string> = {},
        ctaText = '',
        dismissButtonProps = isPermanent ? false : ({size: 'small'} as ButtonProps),
        onAction: (() => Promise<void>) | undefined;
    onAction = undefined;
    if (url) {
        // Action url enabled
        showCta = true;
        ctaText = gettext('Learn more');
        actionButtonProps = {
            componentClass: 'a',
            href: url,
            size: 'small',
            target: '_blank',
            rel: 'noopener noreferrer',
        };
    }
    if (!url && !isPermanent) {
        // Action button works for dismiss only if no action url specified
        showCta = true;
        ctaText = gettext('Dismiss');
        actionButtonProps = {
            size: 'small',
            udStyle: 'ghost',
            className: 'ud-link-neutral',
        };
        onAction = onDismiss;
        dismissButtonProps = false;
    }

    return (
        <AlertBannerContent
            title={title}
            body={description}
            udStyle={level}
            ctaText={ctaText}
            showCta={showCta}
            actionButtonProps={actionButtonProps}
            dismissButtonProps={dismissButtonProps}
            onAction={onAction}
            onDismiss={onDismiss}
        />
    );
};
