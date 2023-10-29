import {Buyable} from 'browse/events';
import isAndroidNative from 'utils/user-agent/is-android-native';

import {isiOSNative} from './is-ios-native';
import {WebviewMessage, OnEnrolledMessage, OnKeepShoppingMessage} from './types';

// Augment `window` interface
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        AndroidClient?: {
            postMessage?: (message: string) => void;
            onEnrolled?: (message: string) => void;
            onEnrolledAdditionalData?: (message: string) => void;
            onKeepShopping?: () => void;
        };
        webkit?: {
            messageHandlers: {
                iOSClient: {
                    postMessage?: (message: string) => void;
                };
            };
        };
    }
}

// Single interface that defines message passing bus to communicate
// with native apps if the user is using navigating within a webview
export interface WebviewBridge {
    sendMessage(message: WebviewMessage): void;
}

// Defines methods currently used by Android apps
// Going forward, this will be deprecated, but it is necessary to ensure
// backwards compatibility for existing and out-of-date Android app installations
export interface LegacyWebviewBridge {
    onKeepShopping(): void;
    onEnrolledAdditionalData(purchasePrice: string, buyables: Array<Buyable>): void;
}

// Exposes both the WebviewBridge implementation and the LegacyWebviewBridge that
// supports backwards compatibility for existing native apps in the wild.
export class NativeAppWebviewBridge implements WebviewBridge, LegacyWebviewBridge {
    constructor(private argWindow?: Window) {
        if (typeof argWindow !== 'undefined') {
            this.argWindow = argWindow;
            // Attempting to assgn window to argWindow during isomorphic rendering results in a TemplateSyntaxError.
            // So, check that the window exists (i.e, we are not in iso rendering) before assigning.
        } else if (typeof window !== 'undefined') {
            this.argWindow = window;
        }
    }

    getAndroidClient() {
        if (isAndroidNative() && typeof this.argWindow?.AndroidClient?.postMessage === 'function') {
            return this.argWindow.AndroidClient.postMessage.bind(this.argWindow.AndroidClient);
        }
        return null;
    }

    getiOSClient() {
        if (
            isiOSNative() &&
            typeof this.argWindow?.webkit?.messageHandlers.iOSClient.postMessage === 'function'
        ) {
            return this.argWindow.webkit.messageHandlers.iOSClient.postMessage.bind(
                this.argWindow.webkit.messageHandlers.iOSClient,
            );
        }
        return null;
    }

    // Generic method that sends any payload to the iOS or Android webview message handlers
    // that conforms to the WebviewMessage interface.
    sendMessage(message: WebviewMessage) {
        const androidClient = this.getAndroidClient();
        if (androidClient) {
            androidClient(JSON.stringify(message));
        } else {
            const iOSClient = this.getiOSClient();
            if (iOSClient) {
                iOSClient(JSON.stringify(message));
            }
        }
    }

    // Legacy shim that encapsulates older usage pattern of AndroidClient. This ensures
    // that older Android clients won't break as we adopt a new webview message passing pattern.
    onEnrolledAdditionalData(purchasePrice: string, buyables: Array<Buyable>) {
        if (
            isAndroidNative() &&
            typeof this.argWindow?.AndroidClient?.onEnrolledAdditionalData === 'function'
        ) {
            this.argWindow.AndroidClient.onEnrolledAdditionalData(
                JSON.stringify({
                    enrolledCourses: buyables,
                    chargedPrice: purchasePrice,
                }),
            );
        } else if (typeof this.argWindow?.AndroidClient?.onEnrolled === 'function') {
            this.argWindow.AndroidClient.onEnrolled(JSON.stringify(buyables));
        } else {
            this.sendMessage(new OnEnrolledMessage(buyables, purchasePrice));
        }
    }

    // Legacy shim for onKeepShopping method from Android JSInterface
    onKeepShopping() {
        // AndroidClient is a built-in JS interface on Android native app
        if (
            isAndroidNative() &&
            typeof this.argWindow?.AndroidClient?.onKeepShopping === 'function'
        ) {
            this.argWindow.AndroidClient.onKeepShopping();
        } else {
            this.sendMessage(new OnKeepShoppingMessage());
        }
    }
}
