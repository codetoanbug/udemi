import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {ToastStore} from './toast.mobx-store';
import styles from './toast.module.less';
import {ToasterStore} from './toaster.mobx-store';

/** Default auto dismiss timeout interval for a Toast, 6s (6000ms). */
const DEFAULT_AUTODISMISS_TIMEOUT = 6000;

/** React props interface for the Toast component. */
export interface ToastProps {
    /** The Toaster Mobx store */
    toasterStore: typeof ToasterStore;
    /** The individual Mobx store for this Toast */
    toastStore: ToastStore;
    /**
     * Unique identifier used by Toaster MobX store to determine if a Toast as been "seen".
     *
     * @remarks
     * The key is added to a Set (`ToasterStore._seenToastKeys`), thus a consumer could possible
     * check to see if a Toast has been seen by a user.
     */
    toastKey?: string;
    /**
     * Flag to determine if the `Toast` should auto dismiss itself from the viewport.
     *
     * @defaultValue `false` in `Toast`
     */
    autoDismiss?: boolean;
    /** The length of time, in milliseconds before a Toast dismisses itself from the viewport.
     *
     * @defaultValue `6000` in `Toast`
     */
    autoDismissTimeout?: number;
    /**
     * Optional identifier to pass to event tracking when Toast is displayed to user.
     */
    impressionUseCase?: string;
    /** Optional Event handler to trigger when Toast is first displayed.  */
    onFirstVisible?: () => void;
    /**
     * Optional event handler to fire if `impressionUseCase` is set
     *
     * @privateRemarks
     * Event tracking has not been fully exported from the monolith.  We handle this event externally to the component now.
     */
    onToastImpression?: (useCase: string) => void;
}

/**
 * ### The Toast component.
 */
@observer
export class Toast extends Component<React.PropsWithChildren<ToastProps>> {
    static defaultProps = {
        autoDismiss: false,
        autoDismissTimeout: DEFAULT_AUTODISMISS_TIMEOUT,
        impressionUseCase: undefined,
        onFirstVisible: noop,
        onToastImpression: undefined,
    };

    componentDidMount() {
        // setTimeout here allows the component to render once pre-animation,
        // i.e. gives the animation a place to start
        setTimeout(() => {
            this.props.toastStore.showToast();
            this.props.onFirstVisible?.();
        }, 100);
        if (this.props.autoDismiss) {
            setTimeout(this.props.toastStore.dismissToast, this.props.autoDismissTimeout);
        }
        if (this.props.impressionUseCase) {
            this.props.onToastImpression?.(this.props.impressionUseCase);
        }
    }

    handleTransitionEnd = () => {
        // wait until the animation is over before removing from the DOM
        if (!this.props.toastStore.isVisible) {
            this.props.toasterStore.removeToast(this.props.toastStore.id);
        }
    };

    render() {
        return (
            <div
                className={classNames(styles.container, {
                    [styles.visible]: this.props.toastStore.isVisible,
                })}
                onTransitionEnd={this.handleTransitionEnd}
                role="status"
            >
                {this.props.children}
            </div>
        );
    }
}
