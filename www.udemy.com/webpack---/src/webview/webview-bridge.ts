import {getOSName} from '../env/get-os-name';
import {isMobileApp} from '../env/is-mobile-app';
import {WebviewMessage, WebviewMessagePayload} from './types';

declare global {
    interface Window {
        AndroidClient?: AndroidClient;
        webkit?: {
            messageHandlers: {
                iOSClient: iOSClient;
            };
        };
    }
}

export interface AndroidClient {
    postMessage?: (message: string) => void;
    onEnrolled?: (message: string) => void;
    onEnrolledAdditionalData?: (message: string) => void;
    onKeepShopping?: () => void;
}

export interface iOSClient {
    postMessage?: (message: string) => void;
}

/**
 * Single interface that defines message passing bus to communicate with
 * native apps if the user is using navigating within a webview
 */
export interface WebviewBridge {
    sendMessage<TPayload extends WebviewMessagePayload>(message: WebviewMessage<TPayload>): void;
}

/**
 * Exposes both the WebviewBridge implementation and the LegacyWebviewBridge that
 * supports backwards compatibility for existing native apps in the wild.
 */
export class NativeAppWebviewBridge implements WebviewBridge {
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

    /**
     * Generic method that sends any payload to the iOS or Android webview message handlers
     * that conforms to the WebviewMessage interface.
     */
    sendMessage<TPayload extends WebviewMessagePayload>(message: WebviewMessage<TPayload>) {
        const androidClient = this.getAndroidClient();
        if (androidClient) {
            androidClient(JSON.stringify(message));
            if (message.sendLegacyAndroidMessage && this.argWindow?.AndroidClient) {
                message.sendLegacyAndroidMessage(this.argWindow?.AndroidClient);
            }
        } else {
            const iOSClient = this.getiOSClient();
            if (iOSClient) {
                iOSClient(JSON.stringify(message));
            }
        }
    }
}

function isAndroidNative() {
    return isMobileApp() && getOSName() === 'android';
}

function isiOSNative() {
    return isMobileApp() && getOSName() === 'ios';
}
