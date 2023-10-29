import {useI18n} from '@udemy/i18n';
import {Button, ButtonHtmlProps} from '@udemy/react-core-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useEffect} from 'react';

import styles from './advertising-banner.module.less';

/** The interface that any dismissible banner MobX store must implement */
export interface AdvertisingDismissibleBannerStoreInterface {
    /** action to take when the dismissible banner store is set up. */
    setUpStorage: () => void;
    /** Action to take when the banner is dismissed. */
    close: () => void;
    /** Getter used to determine if the banner should hide. */
    shouldHide: boolean;
}

/** React props interface for the AdvertisingBanner component. */
interface AdvertisingBannerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The style of the banner background, light or dark.
     * @defaultValue 'dark' in `AdvertisingBanner`
     */
    background?: 'light' | 'dark';
    /** AlertBanner heading */
    title: string;
    /** AlertBanner sub heading */
    subtitle?: string;
    /**
     * Text for the Submit button
     * @defaultValue 'Submit' in `AdvertisingBanner`
     */
    submitButtonText?: React.ReactNode;
    /**
     * Text for the AlertBanner dismiss button
     * @defaultValue 'Dismiss' in `AdvertisingBanner`
     */
    dismissButtonText?: React.ReactNode;
    /** Optional className to apply to the `AdvertisingBanner` heading */
    titleClassName?: string;
    /** Optional className to apply to the `AdvertisingBanner` sub heading */
    subtitleClassName?: string;
    /** {@link ButtonHtmlProps} to apply to the `AdvertisingBanner` submit button */
    submitButtonProps?: ButtonHtmlProps | false;
    /** {@link ButtonHtmlProps} to apply to the `AdvertisingBanner` dismiss button */
    dismissButtonProps?: ButtonHtmlProps;
    /**
     * Optional MobX store for a dismissible `AlertBanner`
     *
     * @remarks
     * The store must implement the {@link AdvertisingDismissibleBannerStoreInterface} interface.
     */
    dismissibleBannerStore?: AdvertisingDismissibleBannerStoreInterface;
}

/**
 * The AdvertisingBanner component.
 */
export const AdvertisingBanner = observer(
    Object.assign(
        ({
            background = 'dark',
            title,
            subtitle,
            titleClassName,
            subtitleClassName,
            submitButtonProps = {},
            dismissButtonProps = {},
            children,
            dismissibleBannerStore,
            className,
            ...props
        }: AdvertisingBannerProps) => {
            const {gettext} = useI18n();
            const {submitButtonText = gettext('Submit'), dismissButtonText = gettext('Dismiss')} =
                props;
            const {onClick, ...dismissButtonRestProps} = dismissButtonProps;
            const isDismissible = !!dismissibleBannerStore;

            const onDismissClick = (event: React.MouseEvent<HTMLElement>) => {
                dismissibleBannerStore?.close();
                if (dismissButtonProps && typeof dismissButtonProps.onClick === 'function') {
                    dismissButtonProps.onClick(event);
                }
            };

            useEffect(() => {
                dismissibleBannerStore?.setUpStorage();
            });

            if (dismissibleBannerStore?.shouldHide) {
                return null;
            }

            return (
                <div
                    className={classNames(className, styles.container, {
                        [styles.dark]: background === 'dark',
                    })}
                >
                    <div className={styles['text-container']}>
                        <h3
                            className={classNames(
                                titleClassName ?? 'ud-heading-serif-xl',
                                styles.title,
                            )}
                            data-purpose="title"
                        >
                            {title}
                        </h3>
                        {subtitle && (
                            <div
                                className={subtitleClassName ?? 'ud-text-md'}
                                data-purpose="subtitle"
                            >
                                {subtitle}
                            </div>
                        )}
                    </div>
                    {children}
                    <div className={styles['action-buttons']}>
                        {submitButtonProps && (
                            <Button
                                data-purpose="submit-button"
                                className={styles['submit-button']}
                                udStyle="primary"
                                {...submitButtonProps}
                            >
                                {submitButtonText}
                            </Button>
                        )}
                        {isDismissible && (
                            <Button
                                data-purpose="dismiss-button"
                                className={styles['dismiss-button']}
                                udStyle="white-outline"
                                {...dismissButtonRestProps}
                                onClick={onDismissClick}
                            >
                                {dismissButtonText}
                            </Button>
                        )}
                    </div>
                </div>
            );
        },
        {displayName: 'AdvertisingBanner'},
    ),
);
