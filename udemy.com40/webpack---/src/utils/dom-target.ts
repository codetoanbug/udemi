import {isBrowser} from './is-browser';
import {isFunction} from './is-utils';

import type {MutableRefObject} from 'react';

type TargetValue<T> = T | undefined | null;

type TargetType = HTMLElement | Element | Window | Document;

export type BasicTarget<T extends TargetType = Element> =
    | (() => TargetValue<T>)
    | TargetValue<T>
    | MutableRefObject<TargetValue<T>>;

export function getTargetElement<T extends TargetType>(target: BasicTarget<T>, defaultElement?: T) {
    if (!isBrowser) {
        return undefined;
    }

    if (!target) {
        return defaultElement;
    }

    let targetElement: TargetValue<T>;

    if (isFunction(target)) {
        targetElement = target() as T;
    } else if ('current' in target) {
        targetElement = target.current;
    } else {
        targetElement = target as T;
    }

    return targetElement;
}
