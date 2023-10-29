import autobind from 'autobind-decorator';

export const isInteractableElement = (element) =>
    ['input', 'textarea', 'button', 'a', 'select', 'option'].includes(
        element.tagName.toLowerCase(),
    ) ||
    element.getAttribute('role') === 'button' ||
    element.getAttribute('role') === 'slider' ||
    element.getAttribute('role') === 'menuitemradio' ||
    element.getAttribute('role') === 'menuitem' ||
    element.getAttribute('contenteditable') === 'true';

export class HotkeyRegistry {
    // We define our hotkeys as a series of modifiers and a logical key, such as `shift+space`. However, on
    // international keyboards the modifiers required to make logical keys can vary wildly for most keys. For example,
    // the logical key `;` is produced by a single key on a US keyboard but is produced by `shift+,` on an Estonian
    // keyboard. This makes the hotkey `ctrl+;` impossible to press on an Estonian keyboard as a `shift` modifier must
    // always be applied. For this reason we only allow modifier hotkeys to be defined for the small subset of keys that
    // always produce the same logical key regardless of modifiers, such as `space`.
    static MODIFIABLE_KEYS = {
        space: ' ',
        left: 'ArrowLeft',
        right: 'ArrowRight',
        down: 'ArrowDown',
        up: 'ArrowUp',
        enter: 'Enter',
        escape: 'Escape',
    };

    // Modifiers are only registered and handled by keys we've marked as modifiable. Other keys can be produced by
    // different modifiers on different keyboards, so any modifiers will be unreliable.
    static MODIFIERS = {
        alt: 'altKey',
        shift: 'shiftKey',
    };

    // Browser modifiers cannot be registered, but are handled for all keys. This stops bindings overridin browser
    // behavior, for example stopping `1` from overriding the browser's `meta+1` shortcut.
    static BROWSER_MODIFIERS = {
        ctrl: 'ctrlKey',
        meta: 'metaKey',
    };

    constructor(container) {
        this.container = container;
        this.registry = {};
    }

    makeReference(modifiers, key) {
        return [...modifiers, key].join('+').toUpperCase();
    }

    keyStringToReference(keyString) {
        const keys = keyString.split('+');
        let key = keys.pop();

        // Remap keystring modifiers to their browser-friendly names.
        const modifiers = keys
            .map((modifier) => {
                if (HotkeyRegistry.MODIFIERS[modifier]) {
                    return HotkeyRegistry.MODIFIERS[modifier];
                }
                if (HotkeyRegistry.BROWSER_MODIFIERS[modifier]) {
                    throw new Error(
                        `${modifier} cannot be as a modifier, it is reserved for the browser.`,
                    );
                }
                throw new Error(`Unknown modifier key, '${modifier}'.`);
            })
            .sort();

        // Remap the keystring logical key to its browser-friendly name.
        if (HotkeyRegistry.MODIFIABLE_KEYS[key]) {
            key = HotkeyRegistry.MODIFIABLE_KEYS[key];
        } else if (modifiers.length) {
            throw new Error(`${key} is not a modifiable key.`);
        }

        return this.makeReference(modifiers, key);
    }

    register(keyString, fn) {
        // Registers a callback function `fn` for a keydown event with the combination of keys given by `keyString`.
        // The format of `keyString` is either:
        //     - A single logical key.
        //     - A logical key from `MODIFIABLE_KEYS`, preceeded by some modifiers from `MODIFIERS` each separated by a
        //       `+` character.
        const keyReference = this.keyStringToReference(keyString);

        if (!Object.keys(this.registry).length) {
            this.container.addEventListener('keydown', this.handleKeyDown);
        }

        if (!this.registry[keyReference]) {
            this.registry[keyReference] = [];
        }
        this.registry[keyReference].push(fn);
    }

    unregister(keyString, fn) {
        const keyReference = this.keyStringToReference(keyString);

        if (!this.registry[keyReference]) {
            return;
        }

        const fnIndex = this.registry[keyReference].indexOf(fn);
        if (fnIndex < 0) {
            return;
        }
        this.registry[keyReference].splice(fnIndex, 1);
        if (!this.registry[keyReference].length) {
            delete this.registry[keyReference];
        }

        if (!Object.keys(this.registry).length) {
            this.container.removeEventListener('keydown', this.handleKeyDown);
        }
    }

    registerMap(hotkeyMap) {
        hotkeyMap.forEach((hotkey) => {
            if (hotkey.fn) {
                this.register(hotkey.key, hotkey.fn);
            }
        });
    }

    unregisterMap(hotkeyMap) {
        hotkeyMap.forEach((hotkey) => {
            if (hotkey.fn) {
                this.unregister(hotkey.key, hotkey.fn);
            }
        });
    }

    getModifiers(key, event) {
        // Get an array of modifier keys given a base key and an event.
        // See docs above for modifier key behaviors.
        const isModifiable = Object.values(HotkeyRegistry.MODIFIABLE_KEYS).includes(key);
        const modifierMapping = Object.assign(
            {},
            HotkeyRegistry.BROWSER_MODIFIERS,
            isModifiable ? HotkeyRegistry.MODIFIERS : {},
        );

        return Object.values(modifierMapping)
            .reduce((acc, modifier) => {
                if (event[modifier]) {
                    acc.push(modifier);
                }
                return acc;
            }, [])
            .sort();
    }

    @autobind
    handleKeyDown(event) {
        const activeElement = event.target || event.toElement || document.activeElement;
        const isInteractable = !!activeElement && isInteractableElement(activeElement);

        const key = event.key;
        const modifiers = this.getModifiers(key, event);
        const reference = this.makeReference(modifiers, key);

        const handlers = this.registry[reference] || [];
        handlers.forEach((handler) => {
            const shouldCall = handler.shouldCall ? handler.shouldCall(event) : !isInteractable;
            shouldCall && handler(event);
        });
    }
}

export default new HotkeyRegistry(document);
