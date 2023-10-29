import {observable, action} from 'mobx';
import React from 'react';

import {AlertBannerProps, AlertBannerContent} from '../alert-banner/alert-banner.react-component';
import {ToastStore} from './toast.mobx-store';
import {Toast, ToastProps} from './toast.react-component';

class ToasterStoreBase {
    _seenToastKeys = new Set();
    toasts = observable.map({}, {deep: false});

    toastComponent: React.ElementType;

    constructor(options: {toastComponent: React.ElementType} = {toastComponent: Toast}) {
        this.toastComponent = options.toastComponent;
    }

    @action
    addToast(
        toastContent: React.ReactChild,
        options: Omit<ToastProps, 'toasterStore' | 'toastStore'> = {},
    ) {
        if (options.toastKey) {
            if (this._seenToastKeys.has(options.toastKey)) {
                return;
            }
            this._seenToastKeys.add(options.toastKey);
        }
        const toastStore = new ToastStore();
        const toast = (
            <this.toastComponent
                toasterStore={this}
                toastStore={toastStore}
                key={toastStore.id}
                {...options}
            >
                {toastContent}
            </this.toastComponent>
        );
        this.toasts.set(toastStore.id, {store: toastStore, toastComponent: toast});

        return toastStore.id;
    }

    /**
     * @param props - {@link AlertBannerProps}
     * @param options - Any additional {@link ToastProps} options to pass on to when this function calls `addToast1`.
     *
     * Note: If you are using this within a TypeScript file, you may need to cast the first parameter
     * (`props`) as `AlertBannerProps` within a TypeScript file.
     *
     * @example
     * ```
     * const bannerProps = {
     *     udStyle: 'success',
     *     title: 'Copied to clipboard',
     *     ctaText: 'Dismiss',
     *     dismissButtonProps: false,
     * } as AlertBannerProps;
     *
     * ToasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
     * ```
     *  */
    addAlertBannerToast(props: AlertBannerProps, options = {}) {
        let toastId: null | string = null;

        const onAction = () => {
            this.dismissToast(toastId);
            props.onAction?.();
        };

        const onDismiss = () => {
            this.dismissToast(toastId);
            props.onDismiss?.();
        };

        const content = <AlertBannerContent {...props} onAction={onAction} onDismiss={onDismiss} />;
        toastId = this.addToast(content, options) as string;
        return toastId;
    }

    // "Dismiss" triggers exit-animation.
    dismissToast = (toastId: string | null) => {
        const toast = this.toasts.get(toastId);
        // Avoid error on double-click of Dismiss button
        if (toast) {
            toast.store.dismissToast();
        }
    };

    // "Remove" cleans up and removes from the DOM.
    @action
    removeToast = (toastId: string | undefined) => {
        this.toasts.delete(toastId);
    };
}

export const ToasterStore = new ToasterStoreBase();
