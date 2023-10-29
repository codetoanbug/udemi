import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';

export function showErrorToast(message, props = null) {
    const bannerProps = {
        udStyle: 'error',
        title: message,
        ...props,
        ctaText: gettext('Dismiss'),
        dismissButtonProps: false,
    };
    toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
}

export function showReloadPageErrorToast(message) {
    const bannerProps = {
        udStyle: 'error',
        title: message,
        ctaText: gettext('Reload page'),
        onAction: () => window.location.reload(),
    };
    toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
}

export function showSuccessToast(message, props = null) {
    const bannerProps = {
        udStyle: 'success',
        title: message,
        ...props,
        ctaText: gettext('Dismiss'),
        dismissButtonProps: false,
    };
    toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
}
