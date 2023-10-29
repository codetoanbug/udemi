import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

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
    const {gettext} = useI18n();
    const desktopText = hasRunningInstance
        ? gettext('Continue practicing')
        : gettext('Start practicing');
    const mobileText = gettext('View details');
    const text = isMobile ? mobileText : desktopText;

    return (
        <Button
            size={size === 'small' ? 'xsmall' : 'small'}
            className={classNames(styles['button'], {
                [styles['small-btn']]: size === 'small',
            })}
            udStyle="link-underline"
            id={`lab-cta-${labId}`}
            aria-labelledby={`lab-cta-${labId} lab-heading-${labId}`}
        >
            {text}
        </Button>
    );
};
