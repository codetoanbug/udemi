import LabsIcon from '@udemy/icons/dist/labs.ud-icon';
import classNames from 'classnames';
import React from 'react';

import './lab-icon.less';

interface LabIconProps {
    /**
     * lab status is not available in the labs listing page
     */
    isCompleted?: boolean;
}

export const LabIcon = ({isCompleted = false}: LabIconProps) => {
    return <LabsIcon label={false} styleName={classNames('lab-icon', {completed: isCompleted})} />;
};
