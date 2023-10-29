import {useEffect, useRef} from 'react';

import {getTargetElement} from '../utils/dom-target';

import type {BasicTarget} from '../utils/dom-target';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Noop = (...p: any) => void;

export type EventListenerTarget = BasicTarget<HTMLElement | Element | Window | Document>;

export interface EventListenerOptions<T extends EventListenerTarget = EventListenerTarget> {
    target?: T;
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
}

function useEventListener<K extends keyof HTMLElementEventMap>(
    eventName: K,
    handler: (ev: HTMLElementEventMap[K]) => void,
    options?: EventListenerOptions<HTMLElement>,
): void;
function useEventListener<K extends keyof ElementEventMap>(
    eventName: K,
    handler: (ev: ElementEventMap[K]) => void,
    options?: EventListenerOptions<Element>,
): void;
function useEventListener<K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (ev: DocumentEventMap[K]) => void,
    options?: EventListenerOptions<Document>,
): void;
function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (ev: WindowEventMap[K]) => void,
    options?: EventListenerOptions<Window>,
): void;

function useEventListener(eventName: string, handler: Noop, options: EventListenerOptions): void;

function useEventListener(eventName: string, handler: Noop, options: EventListenerOptions = {}) {
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

    useEffect(() => {
        const targetElement = getTargetElement(options.target, window);
        if (!targetElement?.addEventListener) {
            return;
        }

        const eventListener = (event: Event) => {
            return handlerRef.current(event);
        };

        targetElement.addEventListener(eventName, eventListener, {
            capture: options.capture,
            once: options.once,
            passive: options.passive,
        });

        return () => {
            targetElement.removeEventListener(eventName, eventListener, {
                capture: options.capture,
            });
        };
    });
}

export {useEventListener};
