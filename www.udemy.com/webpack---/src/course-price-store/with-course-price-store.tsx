import classNames from 'classnames';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import {Loader} from '@udemy/react-reveal-components';

import styles from './error-component.module.less';
import {withCoursePriceStoreBase} from './with-course-price-store-base';

export interface ErrorComponentProps {
    className?: string;
}

export interface LoaderComponentProps {
    className?: string;
}

export const ErrorComponent = ({className}: ErrorComponentProps) => {
    const {gettext} = useI18n();

    return (
        <div className={classNames([styles['error-container'], className])}>
            <ErrorIcon label={false} color="negative" />
            <span className={classNames([styles['error-text'], 'ud-heading-xs'])}>
                {gettext('Error loading price')}
            </span>
        </div>
    );
};

export const LoaderComponent = ({className}: LoaderComponentProps) => (
    <div className={classNames([className])}>
        <Loader />
    </div>
);

export const withCoursePriceStore = withCoursePriceStoreBase(LoaderComponent, ErrorComponent);
