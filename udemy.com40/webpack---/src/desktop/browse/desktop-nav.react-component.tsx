import classNames from 'classnames';
import React from 'react';

import {AnyObject} from '@udemy/shared-utils/types';

import styles from '../list-menu.module.less';

interface MobileNavSectionHeadingProps {
    children: React.ReactNode;
    props?: AnyObject;
}

export const DesktopNavSectionHeading = ({children, props}: MobileNavSectionHeadingProps) => {
    return (
        <h2 className={classNames('ud-heading-sm', styles.heading)} {...props}>
            {children}
        </h2>
    );
};
