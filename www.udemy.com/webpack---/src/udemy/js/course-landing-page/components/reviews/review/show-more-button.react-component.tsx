import {Button, ButtonProps} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import styles from './show-more-button.less';

export const ShowMoreButton = ({className, ...rest}: ButtonProps) => {
    return (
        <Button
            {...rest}
            udStyle="ghost"
            className={classNames(className, 'ud-link-underline', styles.button)}
        />
    );
};
