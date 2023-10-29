import {observer} from 'mobx-react';
import React from 'react';

import {Toast} from './toast.react-component';
import {ToasterStore} from './toaster.mobx-store';
import styles from './toaster.module.less';

/**
 * ### The Toaster component.
 *
 * @remarks
 * Parent component of all Toasts within an application. There should only be one toaster on
 * the page, because it reads from a singleton via `toaster.mobx-store.tsx`.
 *
 * Within the django-website, you never need to render it yourself, because the ui-feedback
 * app renders it. You only need to use the methods on `toaster.mobx-store.js` to add or remove
 * toasts.
 */
export const Toaster = Object.assign(
    observer(() => {
        // A Toaster is a container for Toasts
        if (!ToasterStore.toasts.size) {
            return null;
        }
        const toastComponents: typeof Toast[] = [];
        ToasterStore.toasts.forEach((toast) => toastComponents.push(toast.toastComponent));
        return <div className={styles.toaster}>{toastComponents}</div>;
    }),
    {displayName: 'Toaster'},
);
