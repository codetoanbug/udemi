import {history} from 'prosemirror-history';

import buildKeymaps from './build-keymaps';

export default function buildPlugins(schema, commands) {
    return [...buildKeymaps(commands), history()];
}
