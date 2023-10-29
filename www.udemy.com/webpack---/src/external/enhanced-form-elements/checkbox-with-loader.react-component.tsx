import classNames from 'classnames';
import React from 'react';

import {Checkbox, CheckboxProps} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';

import styles from './checkbox-with-loader.module.less';

export interface CheckboxWithLoaderProps extends CheckboxProps {
    isLoading: boolean;
    children: React.ReactNode;
    title?: string;
}

export const CheckboxWithLoader = ({
    isLoading = false,
    children,
    ...givenProps
}: CheckboxWithLoaderProps) => {
    if (isLoading) {
        return (
            <div className={classNames('ud-text-sm', styles['loader-state'])}>
                <Loader size="xsmall" className={styles['loader-icon']} />
                {children}
            </div>
        );
    }
    return <Checkbox {...givenProps}>{children}</Checkbox>;
};
