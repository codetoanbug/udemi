import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';

export function showErrorToast(message) {
    const bannerProps = {
        udStyle: 'error',
        title: message,
        ctaText: gettext('Dismiss'),
        dismissButtonProps: false,
    };
    toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
}

export function showReloadPageErrorToast(message, extraProps = {}, options = {autoDismiss: true}) {
    const defaultBannerProps = {
        udStyle: 'error',
        title: message,
        ctaText: gettext('Reload page'),
        onAction: () => window.location.reload(),
    };
    const bannerProps = Object.assign({}, defaultBannerProps, extraProps);
    toasterStore.addAlertBannerToast(bannerProps, options);
}

export function showSuccessToast(message) {
    const bannerProps = {
        udStyle: 'success',
        title: message,
        ctaText: gettext('Dismiss'),
        dismissButtonProps: false,
    };
    toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
}
