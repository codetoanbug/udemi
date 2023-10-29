import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer, Provider} from 'mobx-react';
import React from 'react';

const PROPERTY_MAP = {
    fullscreen: [
        'fullscreenElement',
        'mozFullScreenElement',
        'webkitFullscreenElement',
        'msFullscreenElement',
    ],
    fullscreenchange: [
        'fullscreenchange',
        'mozfullscreenchange',
        'webkitfullscreenchange',
        'MSFullscreenChange',
    ],
    requestFullscreen: [
        'requestFullscreen',
        'msRequestFullscreen',
        'mozRequestFullScreen',
        'webkitRequestFullscreen',
    ],
    exitFullscreen: [
        'exitFullscreen',
        'msExitFullscreen',
        'mozCancelFullScreen',
        'webkitExitFullscreen',
    ],
};

class FullscreenService {
    getPropertyName(elem: Node, lookupName: keyof typeof PROPERTY_MAP) {
        for (let i = 0; i < PROPERTY_MAP[lookupName].length; i++) {
            const propertyName = PROPERTY_MAP[lookupName][i];
            /**
             * TypeScript doesn't know that a lot of these browser-specific attributes (ms*, moz*, webkit*) exist
             * on a Node, so cast to any here as a workaround
             */
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((elem as any)[propertyName]) {
                return propertyName;
            }
        }
    }

    getProperty(elem: Node, lookupName: keyof typeof PROPERTY_MAP) {
        const propertyName = this.getPropertyName(elem, lookupName);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return propertyName ? (elem as any)[propertyName] : null;
    }

    get changeEvents() {
        return PROPERTY_MAP.fullscreenchange;
    }

    isSupported() {
        return !!this.getProperty(document.documentElement, 'requestFullscreen');
    }

    isFullscreen() {
        return !!this.getProperty(document, 'fullscreen');
    }

    requestFullscreen(elem: Node) {
        if (!this.isSupported()) {
            return false;
        }
        // add Element.ALLOW_KEYBOARD_INPUT later, so users can use keyboard on fullscreen
        return this.getProperty(elem, 'requestFullscreen').call(elem);
    }

    exitFullscreen() {
        if (!this.isSupported()) {
            return false;
        }

        return this.getProperty(document, 'exitFullscreen').call(document);
    }

    toggleFullscreen(elem: Node) {
        if (this.isFullscreen()) {
            this.exitFullscreen();
        } else {
            this.requestFullscreen(elem);
        }
    }
}

export const fullscreenService = new FullscreenService();

/**
 * Props that are injected by the fullscreen HOC. These are convenience props that expose functionality of the
 * underlying FullscreenStore.
 */
export interface FullscreenEnabledComponentProps {
    /**
     * True if the component is currently in fullscreen mode
     */
    isFullscreen: boolean;
    /**
     * Function that can be called to toggle fullscreen mode
     */
    toggleFullscreen(): void;
    /**
     * Function that can be called to exit fullscreen mode
     */
    exitFullscreen(): void;
    /**
     * Function used to set the React ref to the fullscreen element
     */
    setFullscreenRef(ref: React.RefObject<HTMLElement>): void;
}

export function fullscreen<TProps>(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Component: React.ComponentType<TProps>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
    const {
        toggleFullscreen,
        isFullscreen,
        exitFullscreen,
        setFullscreenRef,
        ...wrapperPropTypes
    } = (Component.propTypes ?? {}) as typeof Component['propTypes'] &
        FullscreenEnabledComponentProps;

    return observer(
        class FullscreenEnabledComponent extends React.Component<TProps> {
            static displayName = `Fullscreen-Enabled-${Component.displayName ?? Component.name}`;
            static propTypes = wrapperPropTypes;
            static defaultProps: typeof Component['defaultProps'] = Component.defaultProps ?? {};

            // Useful for testing underlying Component.
            static wrappedComponent = Component;

            private fullscreenStore = new FullscreenStore();

            render() {
                // Store properties passed as props for convenience.
                return (
                    <Provider fullscreenStore={this.fullscreenStore}>
                        <Component
                            toggleFullscreen={this.fullscreenStore.toggleFullscreen}
                            isFullscreen={this.fullscreenStore.isFullscreen}
                            exitFullscreen={this.fullscreenStore.exitFullscreen}
                            setFullscreenRef={this.fullscreenStore.setRef}
                            {...this.props}
                        />
                    </Provider>
                );
            }
        },
    );
}

export class FullscreenStore {
    private focusElement?: HTMLElement;
    private ref?: HTMLElement;
    @observable isFullscreen = false;

    _addFullscreenEvents() {
        fullscreenService.changeEvents.forEach((changeEvent) => {
            document.addEventListener(changeEvent, this.handleFullscreenEvent);
        });
    }

    _removeFullscreenEvents() {
        fullscreenService.changeEvents.forEach((changeEvent) => {
            document.removeEventListener(changeEvent, this.handleFullscreenEvent);
        });
    }

    _exitFullscreen() {
        this._addFullscreenEvents();
        if (fullscreenService.exitFullscreen() === false) {
            this._removeFullscreenEvents();
        }
    }

    @autobind
    toggleFullscreen() {
        if (this.isFullscreen) {
            this._exitFullscreen();
        } else if (!this.isFullscreen && this.ref) {
            this._addFullscreenEvents();
            if (fullscreenService.requestFullscreen(this.ref) === false) {
                this._removeFullscreenEvents();
            }
        }

        if (this.focusElement) {
            this.focusElement.focus();
        }
    }

    @autobind
    exitFullscreen() {
        if (this.isFullscreen) {
            this._exitFullscreen();
        }
    }

    @autobind
    @action
    handleFullscreenEvent() {
        this.isFullscreen = fullscreenService.isFullscreen();
        if (!this.isFullscreen) {
            this._removeFullscreenEvents();
        }
    }

    @autobind
    setRef(ref: HTMLElement) {
        this.ref = ref;
    }

    @autobind
    setFocusElement(element: HTMLElement) {
        this.focusElement = element;
    }
}
