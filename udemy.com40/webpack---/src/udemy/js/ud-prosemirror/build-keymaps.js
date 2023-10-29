import {baseKeymap, chainCommands} from 'prosemirror-commands';
import {keymap} from 'prosemirror-keymap';

import {HEADING_LEVEL} from 'base-components/ungraduated/form/rich-text-editor/constants';

// For consistency with the `baseKeymap`, this check is copied from
// https://github.com/ProseMirror/prosemirror-commands/blob/1.0.7/src/commands.js#L587
export const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

/**
 * https://prosemirror.net/docs/ref/#keymap
 * https://github.com/ProseMirror/prosemirror-example-setup/blob/1.0.1/src/keymap.js
 * Returns an array of prosemirror-keymap plugin instances.
 * @param commands: the output of build-commands.js, namely a map of (feature, command) pairs
 * that only contains commands for enabled features.
 */
export default function buildKeymaps(commands) {
    const keyNameToCommandList = {};

    // This is the list of all hotkeys. This gets filtered to only include hotkeys corresponding
    // to enabled commands. Then, if there are multiple commands corresponding to the same hotkey,
    // they get combined via `chainCommands`.
    //
    // https://prosemirror.net/docs/ref/#commands.chainCommands
    // Combine a number of command functions into a single function
    // (which calls them one by one until one returns true).
    [
        ['ArrowDown', 'EXIT_LAST_BLOCK'],
        ['ArrowDown', 'ARROW_DOWN_NEAR_IMAGE'],
        ['ArrowLeft', 'ARROW_LEFT_NEAR_IMAGE'],
        ['ArrowRight', 'ARROW_RIGHT_NEAR_IMAGE'],
        ['ArrowUp', 'EXIT_FIRST_BLOCK'],
        ['ArrowUp', 'ARROW_UP_NEAR_IMAGE'],
        ['Ctrl-b', 'TOGGLE_STRONG'],
        ['Ctrl-i', 'TOGGLE_EM'],
        ['Ctrl-k', 'PROMPT_ANCHOR'],
        ['Ctrl-Enter', 'ADD_HARD_BREAK', isMac],
        ['Ctrl-Space', 'ADD_NON_BREAKING_SPACE'],
        ['Enter', 'EXIT_FIGURE'],
        ['Enter', 'SPLIT_LIST_ITEM'],
        ['Mod-[', 'LIFT_LIST_ITEM'],
        ['Mod-]', 'SINK_LIST_ITEM'],
        ['Mod-b', 'TOGGLE_STRONG'],
        ['Mod-i', 'TOGGLE_EM'],
        ['Mod-k', 'PROMPT_ANCHOR'],
        ['Mod-y', 'REDO', !isMac],
        ['Mod-z', 'UNDO'],
        ['Shift-Ctrl-.', 'TOGGLE_BLOCKQUOTE'],
        ['Shift-Ctrl-0', 'SET_PARAGRAPH'],
        [`Shift-Ctrl-${HEADING_LEVEL}`, 'TOGGLE_HEADING'],
        ['Shift-Ctrl-7', 'TOGGLE_ORDERED_LIST'],
        ['Shift-Ctrl-8', 'TOGGLE_BULLET_LIST'],
        ['Shift-Ctrl-m', 'UNDO_FORMAT'],
        ['Shift-Enter', 'ADD_HARD_BREAK'],
        ['Shift-Mod-m', 'UNDO_FORMAT'],
        ['Shift-Mod-z', 'REDO'],
        ['Shift-Space', 'ADD_NON_BREAKING_SPACE'],
        ['Shift-Tab', 'LIFT_LIST_ITEM'],
        ['Tab', 'CONVERT_TAB_TO_SPACES'],
        ['Tab', 'SINK_LIST_ITEM'],
    ].forEach(([keyName, commandName, supportedByOS = true]) => {
        if (commandName in commands && supportedByOS) {
            if (!(keyName in keyNameToCommandList)) {
                keyNameToCommandList[keyName] = [];
            }
            keyNameToCommandList[keyName].push(commands[commandName]);
        }
    });

    const bindings = {};
    Object.entries(keyNameToCommandList).forEach(([keyName, commands]) => {
        if (commands.length === 1) {
            bindings[keyName] = commands[0];
        } else if (commands.length > 1) {
            bindings[keyName] = chainCommands(...commands);
        }
    });

    return [keymap(bindings), keymap(baseKeymap)];
}
