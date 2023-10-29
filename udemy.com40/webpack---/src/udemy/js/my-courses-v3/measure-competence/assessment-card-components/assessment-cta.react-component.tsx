import {Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import React, {MouseEventHandler} from 'react';

import styles from './assessment-cta.less';

interface AssessmentCTAProps {
    text: string;
    size?: 'small' | 'large';
    onClick?: MouseEventHandler<HTMLElement>;
    href?: string;
    id?: string;
    ariaLabelledBy?: string;
}

export const AssessmentCTA = ({
    text,
    size,
    onClick,
    href,
    id,
    ariaLabelledBy,
}: AssessmentCTAProps) => {
    return (
        <Button
            componentClass={href ? 'a' : 'button'}
            size={size === 'small' ? 'xsmall' : 'small'}
            className={classNames('button', {[styles['small-btn']]: size === 'small'})}
            udStyle="link-underline"
            onClick={onClick}
            href={href}
            id={id}
            aria-labelledby={ariaLabelledBy}
        >
            {text}
        </Button>
    );
};
