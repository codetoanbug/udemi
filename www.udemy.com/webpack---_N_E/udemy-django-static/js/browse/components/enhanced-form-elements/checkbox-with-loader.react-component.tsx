import classNames from 'classnames';
import React from 'react';

import {Checkbox, CheckboxProps} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import styles from './checkbox-with-loader.module.less';

export interface CheckboxWithLoaderProps {
    isLoading: boolean;
    checked?: boolean;
    name?: number | string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    children: React.ReactNode;
    title?: string;
}
export const CheckboxWithLoader = ({
    isLoading = false,
    children,
    ...givenProps
}: CheckboxWithLoaderProps) => {
    if (isLoading) {
        const loader = <Loader size="xsmall" className={styles['loader-icon']} />;
        return (
            <div className={classNames('ud-text-sm', styles['loader-state'])}>
                {loader}
                {children}
            </div>
        );
    }
    return <Checkbox {...(givenProps as CheckboxProps)}>{children}</Checkbox>;
};
