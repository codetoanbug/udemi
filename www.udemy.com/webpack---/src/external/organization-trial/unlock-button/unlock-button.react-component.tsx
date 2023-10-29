import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Button, ButtonProps} from '@udemy/react-core-components';

import {LINK_ROUTES} from '../constants';
import styles from './unlock-button.module.less';

interface UnlockButtonProps {
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    ownerName?: string;
    onClick?(): void;
}

export const UnlockButton = ({
    size = 'medium',
    ownerName,
    onClick,
    ...props
}: UnlockButtonProps) => {
    const {gettext, interpolate} = useI18n();

    let unlockButton = {
        props: {
            href: LINK_ROUTES.buy,
            componentClass: 'a',
            className: styles['buy-button'],
            'data-testid': 'buy-button',
        } as ButtonProps,
        buttonContent: (
            <span>
                <span className={styles['button-text-large']}>{gettext('Buy Udemy Business')}</span>
                <span className={styles['button-text-small']}>{gettext('Buy now')}</span>
            </span>
        ),
    };
    if (ownerName) {
        const nudgeButtonMessage = gettext('Send feedback to %(owner)s');
        unlockButton = {
            props: {
                'data-testid': 'nudge-owner-button',
            } as ButtonProps,
            buttonContent: (
                <span>
                    <span className={styles['button-text-large']}>
                        {interpolate(nudgeButtonMessage, {owner: ownerName}, true)}
                    </span>
                    <span className={styles['button-text-small']}>{gettext('Send feedback')}</span>
                </span>
            ),
        };
    }

    return (
        <Button onClick={onClick} size={size} udStyle="brand" {...unlockButton.props} {...props}>
            {unlockButton.buttonContent}
        </Button>
    );
};
