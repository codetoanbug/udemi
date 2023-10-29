import {Button} from '@udemy/react-core-components';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import React from 'react';

import styles from './get-started-card.less';

interface GetStartedCardProps {
    title: string;
    text: string;
    cta: string;
    link: string;
    onCardClick?: () => void;
    icon?: React.ReactNode;
    size?: 'small' | 'large';
    className?: string;
}

export const GetStartedCard = ({
    title,
    cta,
    text,
    icon = null,
    link,
    onCardClick = noop,
    size = 'large',
    className,
}: GetStartedCardProps) => (
    <a
        href={link}
        onClick={onCardClick}
        className={classNames(className, styles.container, {
            [styles['container--small']]: size === 'small',
        })}
    >
        <div className={styles['info-container']}>
            <h3 className={size === 'large' ? 'ud-heading-md' : 'ud-heading-sm'}>{title}</h3>
            <div className={styles.text}>{text}</div>
            <Button className={styles.button} udStyle="primary" size="medium">
                {cta}
            </Button>
        </div>
        {icon && (
            <div data-purpose="card-icon" className={styles['icon-container']}>
                {icon}
            </div>
        )}
    </a>
);
