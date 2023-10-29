/* eslint-disable @typescript-eslint/naming-convention */
import {useI18n} from '@udemy/i18n';
import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import {Button, ButtonProps} from '@udemy/react-core-components';
import classNames from 'classnames';
import React, {useState} from 'react';

import styles from './alert-banner.module.less';

export type AlertLevel = 'information' | 'success' | 'error' | 'warning';

/** Shared interface for both `AlertBanner` and `AlertBannerContent` */
interface CommonProps extends Omit<React.HTMLProps<HTMLDivElement>, 'title'> {
    /** Main content of the `AlertBanner` */
    body?: React.ReactNode;
    /** Call to action text for the CTA button */
    ctaText?: string;
    /** Text for the dismiss button on the `AlertBanner` */
    dismissButtonText?: string;
    /**
     * Optional override for an icon for display within the banner.
     * If not set, the {@link alertBannerContentIcon} function will determine
     * which icon to display based on the banner's `udStyle` property.
     */
    icon?: JSX.Element | null;
    /**
     * Properties to pass to the CTA button within the `AlertBanner`.
     * See: {@link ButtonProps | ButtonProps} for interface,
     * {@link @udemy/react-core-components/#ButtonCommonProps | ButtonCommonProps interface} for a deeper dive.
     * If you pass actionButtonProps={false} - it will not render the action button.
     */
    actionButtonProps?: ButtonProps | false;
    /** If you pass dismissButtonProps={false} - it will not render the dismiss button. */
    dismissButtonProps?: ButtonProps | false;
    /**
     * Flag to display the CTA Button.
     * @defaultValue `true`
     */
    showCta?: boolean;
    /**
     * Flag to display the icon set via the `icon` property.
     * @defaultValue `true`
     */
    showIcon?: boolean;
    /**
     * The `AlertBanner` style
     * @defaultValue `AlertLevel.information`.
     * See {@link AlertLevel | AlertLevel interface}
     */
    udStyle?: AlertLevel;
    /**
     * The `AlertBanner` heading.
     *
     * @remarks
     * If you pass title={false} - it will not render the title.
     */
    title: React.ReactNode | false;
}

export interface AlertBannerProps extends CommonProps {
    /** Event handler for when the `AlertBanner`'s main call to action button is interacted with. */
    onAction?: () => void;
    /** Event handler for when the `AlertBanner` is dismissed. */
    onDismiss?: () => void;
}

/** The AlertBanner component.  A wrapper for the {@link AlertBannerContent} component, with some event handlers. */
export const AlertBanner = (props: AlertBannerProps) => {
    const [dismissed, setDismissed] = useState(false);

    function handleAction() {
        setDismissed(true);
        props.onAction?.();
    }

    function handleDismiss() {
        setDismissed(true);
        props.onDismiss?.();
    }

    if (dismissed) {
        return null;
    }
    // eslint-disable-next-line react/jsx-no-bind
    return <AlertBannerContent {...props} onAction={handleAction} onDismiss={handleDismiss} />;
};

export interface AlertBannerContentProps extends CommonProps {
    /** Event handler for when the `AlertBannerContent`'s main call to action button is interacted with. */
    onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Event handler for when the `AlertBannerContent` is dismissed. */
    onDismiss?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/** The AlertBannerContent component is the internal scaffolding of an {@link AlertBanner} component.
 *  This is made to be used within an `AlertBanner`, but can be used in other custom containers as well.
 */
export const AlertBannerContent = ({
    actionButtonProps = {},
    body,
    className,
    dismissButtonProps = {},
    icon,
    onAction,
    onDismiss,
    showCta = true,
    showIcon = true,
    title,
    udStyle = 'information',
    ...props
}: AlertBannerContentProps) => {
    const {gettext} = useI18n();

    const {
        ctaText = gettext('Take action'),
        dismissButtonText = gettext('Dismiss'),
        ...divProps
    } = props;

    const screenReaderLabels = {
        information: gettext('information alert'),
        success: gettext('success alert'),
        error: gettext('error alert'),
        warning: gettext('warning alert'),
    };
    const textFrameIconClass = showIcon ? styles['text-frame-with-icon'] : '';

    return (
        <div
            {...divProps}
            className={classNames(
                styles['alert-banner'],
                styles[`alert-banner-${udStyle}`],
                className,
            )}
        >
            {showIcon && (icon || alertBannerContentIcon(udStyle))}
            <div style={{flex: 1}}>
                <div className={classNames(styles['text-frame'], textFrameIconClass)}>
                    <span className="ud-sr-only">{screenReaderLabels[udStyle]}</span>
                    {title && <h2 className="ud-heading-md">{title}</h2>}
                    {body && <div className={classNames('ud-text-sm', styles.body)}>{body}</div>}
                </div>
                {showCta && (
                    <div className={styles['cta-container']}>
                        {actionButtonProps && (
                            <Button
                                data-purpose="action"
                                onClick={onAction}
                                size="medium"
                                className={styles.button}
                                {...actionButtonProps}
                            >
                                {ctaText}
                            </Button>
                        )}
                        {dismissButtonProps && (
                            <Button
                                data-purpose="dismiss"
                                onClick={onDismiss}
                                size="medium"
                                udStyle="ghost"
                                className={classNames('ud-link-neutral', styles.button)}
                                {...dismissButtonProps}
                            >
                                {dismissButtonText}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Determines which icon to display based on the `AlertLevel` type.
 * @param udStyle The current {@link AlertLevel} of the banner.
 * @returns A `BaseIcon` component
 */
function alertBannerContentIcon(udStyle: AlertLevel) {
    switch (udStyle) {
        case 'success':
            return <SuccessIcon label={false} size="large" />;
        case 'warning':
            return <WarningIcon label={false} size="large" />;
        case 'error':
            return <ErrorIcon label={false} size="large" />;
        case 'information':
            return <InfoIcon label={false} size="large" />;
    }
}
