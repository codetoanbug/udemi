import classNames from 'classnames';
import React from 'react';

import LabsIcon from '@udemy/icons/dist/labs.ud-icon';

import styles from './lab-icon.module.less';

interface LabIconProps {
    /**
     * lab status is not available in the labs listing page
     */
    isCompleted?: boolean;
}

export const LabIcon = ({isCompleted = false}: LabIconProps) => {
    return (
        <LabsIcon
            label={false}
            className={classNames(styles['lab-icon'], {[styles['completed']]: isCompleted})}
        />
    );
};
