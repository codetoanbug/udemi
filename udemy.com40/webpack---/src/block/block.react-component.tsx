import classNames from 'classnames';
import React from 'react';

import styles from './block.module.less';

/**
 * The Block component. Used to signify a gray piece of content.
 *
 * @privateRemarks
 * This ideally is a private component used only in design-system-web, but we expose it to keep
 * the django-website code pointing to this.
 */
export const Block = ({className, ...htmlProps}: React.ComponentPropsWithRef<'span'>) => {
    return <span {...htmlProps} className={classNames(styles.block, className)} />;
};
