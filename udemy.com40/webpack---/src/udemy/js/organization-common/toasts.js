import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';

export function showErrorToast(message, overrides = {}) {
    const bannerProps = {
        udStyle: 'error',
        title: message,
        ctaText: gettext('Dismiss'),
        dismissButtonProps: false,
    };
    toasterStore.addAlertBannerToast({...bannerProps, ...overrides});
}

export function showInformationToast(message, overrides = {}) {
    const bannerProps = {
        udStyle: 'information',
        title: message,
        ctaText: gettext('Dismiss'),
        dismissButtonProps: false,
    };
    toasterStore.addAlertBannerToast({...bannerProps, ...overrides});
}

export function showWarningToast(message, overrides = {}) {
    const bannerProps = {
        udStyle: 'warning',
        title: message,
        ctaText: gettext('Dismiss'),
        dismissButtonProps: false,
    };
    toasterStore.addAlertBannerToast({...bannerProps, ...overrides});
}

export function showSuccessToast(message, overrides = {}) {
    const bannerProps = {
        udStyle: 'success',
        title: message,
        ctaText: gettext('Dismiss'),
        dismissButtonProps: false,
    };
    toasterStore.addAlertBannerToast({...bannerProps, ...overrides}, {autoDismiss: true});
}

export function dismissAllToasts() {
    Array.from(toasterStore.toasts.keys()).forEach((toastId) => {
        toasterStore.dismissToast(toastId);
    });
}

export function isAnyToastVisible() {
    return toasterStore.toasts.size > 0;
}
