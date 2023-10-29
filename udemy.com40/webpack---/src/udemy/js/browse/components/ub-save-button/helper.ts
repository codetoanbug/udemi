import {ToasterStore, AlertBannerProps, AlertLevel} from '@udemy/react-messaging-components';
import {runInAction} from 'mobx';

export const FAVORITE_ENDPOINT = '/users/me/favorited-courses/';

export const handleToaster = (
    message: string,
    body?: string,
    style?: AlertLevel,
    actionButtonProps?: {
        ctaText: string;
        handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    },
) => {
    const alertBannerProps: AlertBannerProps = {
        udStyle: style ?? 'success',
        title: message,
        body: body ?? '',
        showCta: !!actionButtonProps,
        ctaText: actionButtonProps?.ctaText ?? undefined,
        dismissButtonProps: false,
        actionButtonProps: actionButtonProps
            ? {onClick: actionButtonProps?.handleClick}
            : undefined,
    };

    ToasterStore.addAlertBannerToast(alertBannerProps, {
        autoDismiss: true,
        autoDismissTimeout: 5000,
    });
};

export const triggerClearToastMessages = () => {
    runInAction(() => {
        ToasterStore.toasts.clear();
        ToasterStore._seenToastKeys = new Set();
    });
};
