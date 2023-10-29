import {Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import './lab-cta-practice.less';

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
    const desktopText = hasRunningInstance
        ? gettext('Continue practicing')
        : gettext('Start practicing');
    const mobileText = gettext('View details');
    const text = isMobile ? mobileText : desktopText;

    return (
        <Button
            size={size === 'small' ? 'xsmall' : 'small'}
            styleName={classNames('button', {
                'small-btn': size === 'small',
            })}
            udStyle="link-underline"
            id={`lab-cta-${labId}`}
            aria-labelledby={`lab-cta-${labId} lab-heading-${labId}`}
        >
            {text}
        </Button>
    );
};
