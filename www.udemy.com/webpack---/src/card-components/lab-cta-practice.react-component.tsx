import classNames from 'classnames';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';

import styles from './lab-cta-practice.module.less';

interface LabCTAPracticeProps {
    hasRunningInstance: boolean;
    size?: 'small' | 'large';
    labId: number | string;
    isMobile: boolean;
}

export const LabCTAPractice = ({
    hasRunningInstance,
    size,
    labId,
    isMobile,
}: LabCTAPracticeProps) => {
    const i18n = useI18n();
    const desktopText = hasRunningInstance
        ? i18n.gettext('Continue practicing')
        : i18n.gettext('Start practicing');
    const mobileText = i18n.gettext('View details');
    const text = isMobile ? mobileText : desktopText;

    return (
        <Button
            data-testid="lab-cta-practice"
            size={size === 'small' ? 'xsmall' : 'small'}
            className={classNames(styles['button'], {
                [styles['small-btn']]: size === 'small',
            })}
            udStyle="link"
            id={`lab-cta-${labId}`}
            aria-labelledby={`lab-cta-${labId} lab-heading-${labId}`}
        >
            {text}
        </Button>
    );
};
