import classNames from 'classnames';
import React, {Key} from 'react';

import {useI18n} from '@udemy/i18n';
import {Meter} from '@udemy/react-messaging-components';
import {ItemCard} from '@udemy/react-structure-components';

import {pathBarStyle} from '../../path-config';
import styles from './compact-program-progress-card.module.less';

export interface CompactProgramProgressCardProps {
    key?: Key;
    className?: string;
    program: {
        id: string;
        level: number;
        completionRatio: number;
        path: string;
        title: string;
        url: string;
    };
}

export const CompactProgramProgressCard = (props: CompactProgramProgressCardProps) => {
    const {program, ...componentProps} = props;
    const {gettext} = useI18n();
    return (
        <ItemCard {...componentProps}>
            <div style={pathBarStyle(program.path)} />
            <div className={styles['program-info']}>
                <ItemCard.Title
                    className={`ud-heading-sm ${classNames(styles['program-title'], {
                        [styles['program-title-condensed']]: program.completionRatio === 0,
                    })}`}
                    data-purpose="program-title"
                    href={program.url}
                >
                    {program.title}
                </ItemCard.Title>
                {program.completionRatio > 0 && (
                    <Meter
                        value={program.completionRatio}
                        min={0}
                        max={100}
                        label={gettext('%(percent)s% complete')}
                    />
                )}
                {program.completionRatio === 0 && (
                    <span className={`ud-heading-sm ${styles['start-learning']}`}>
                        {gettext('Start learning')}
                    </span>
                )}
            </div>
        </ItemCard>
    );
};
