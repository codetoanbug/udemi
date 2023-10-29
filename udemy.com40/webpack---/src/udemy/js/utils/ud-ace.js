import {
    ACE_THEME_DEFAULT,
    ACE_THEME_MONOKAI,
    ACE_THEME_TWILIGHT,
    ACE_THEME_TOMORROW_NIGHT_BRIGHT,
} from 'ace/constants';
import handleImportError from 'utils/handle-import-error';
import loaders from 'utils/ud-external-loaders';

// Load ACE asynchronously to reduce bundle sizes.
export async function loadAce() {
    const ace = await import(/* webpackChunkName: "brace" */ 'brace');
    await Promise.all([
        import(/* webpackChunkName: "brace-ext-language-tools" */ 'brace/ext/language_tools'),
        import(/* webpackChunkName: "brace-snippets-text" */ 'brace/snippets/text'),
        import(/* webpackChunkName: "brace-theme-clouds" */ 'brace/theme/clouds'),
    ]);
    return ace;
}

export function loadAceTheme(theme) {
    /* eslint-disable */
    // eslint causes messy formatting here
    switch (theme) {
        case ACE_THEME_DEFAULT:
            return import(/* webpackChunkName: "brace-theme-clouds" */ 'brace/theme/clouds')
                .catch(handleImportError);
        case ACE_THEME_TWILIGHT:
            return import(/* webpackChunkName: "brace-theme-twilight" */ 'brace/theme/twilight')
                .catch(handleImportError);
        case ACE_THEME_MONOKAI:
            return import(/* webpackChunkName: "brace-theme-monokai" */ 'brace/theme/monokai')
                .catch(handleImportError);
        case ACE_THEME_TOMORROW_NIGHT_BRIGHT:
            return import(/* webpackChunkName: "brace-theme-tomorrow-night-bright" */ 'brace/theme/tomorrow_night_bright')
                .catch(handleImportError);
        default:
            throw new Error(`Unknown ace theme: ${theme}`);
    }
    /* eslint-enable */
}

export function loadAceMode(mode) {
    // There are a lot of Brace modes. By using a switch statement and hard coding the
    // possible matches, I limit it to creating 14 bundles instead of 143 bundles.
    /* eslint-disable */
    // eslint causes messy formatting here
    switch (mode) {
        case 'c_cpp':
            return import(/* webpackChunkName: "brace-mode-c-cpp" */ 'brace/mode/c_cpp')
                .then(() => import(/* webpackChunkName: "brace-snippets-c_cpp" */ 'brace/snippets/c_cpp'))
                .catch(handleImportError);
        case 'csharp':
            return import(/* webpackChunkName: "brace-mode-csharp" */ 'brace/mode/csharp')
                .then(() => import(/* webpackChunkName: "brace-snippets-csharp" */ 'brace/snippets/csharp'))
                .catch(handleImportError);
        case 'css':
            return import(/* webpackChunkName: "brace-mode-css" */ 'brace/mode/css')
                .then(() => import(/* webpackChunkName: "brace-snippets-css" */ 'brace/snippets/css'))
                // this file has been pulled from https://rawgit.com/nightwing/emmet-core/master/emmet.js into our static folder
                .then(() => loaders.loadEmmetScript())
                .then(() => import(/* webpackChunkName: "brace-ext-emmet" */ 'brace/ext/emmet'))
                .catch(handleImportError);
        case 'html':
            return import(/* webpackChunkName: "brace-mode-html" */ 'brace/mode/html')
                .then(() => import(/* webpackChunkName: "brace-snippets-html" */ 'brace/snippets/html'))
                .then(() => import(/* webpackChunkName: "brace-ext-emmet" */ 'brace/ext/emmet'))
                // this file has been pulled from https://rawgit.com/nightwing/emmet-core/master/emmet.js into our static folder
                .then(() => loaders.loadEmmetScript())
                .catch(handleImportError);
        case 'java':
            return import(/* webpackChunkName: "brace-mode-java" */ 'brace/mode/java')
                .then(() => import(/* webpackChunkName: "brace-snippets-java" */ 'brace/snippets/java'))
                .catch(handleImportError);
        case 'javascript':
            return import(/* webpackChunkName: "brace-mode-javascript" */ 'brace/mode/javascript')
                .then(() => import(/* webpackChunkName: "brace-snippets-javascript" */ 'brace/snippets/javascript'))
                .catch(handleImportError);
        case 'json':
            return import(/* webpackChunkName: "brace-mode-json" */ 'brace/mode/json')
                .then(() => import(/* webpackChunkName: "brace-snippets-json" */ 'brace/snippets/json'))
                .catch(handleImportError);
        case 'jsx':
            return import(/* webpackChunkName: "brace-mode-jsx" */ 'brace/mode/jsx')
                .then(() => import(/* webpackChunkName: "brace-snippets-jsx" */ 'brace/snippets/jsx'))
                .catch(handleImportError);
        case 'kotlin':
            return import(/* webpackChunkName: "brace-mode-kotlin" */ 'brace/mode/kotlin')
                .then(() => import(/* webpackChunkName: "brace-snippets-kotlin" */ 'brace/snippets/kotlin'))
                .catch(handleImportError);
        case 'php':
            return import(/* webpackChunkName: "brace-mode-php" */ 'brace/mode/php')
                .then(() => import(/* webpackChunkName: "brace-snippets-php" */ 'brace/snippets/php'))
                .catch(handleImportError);
        case 'python':
            return import(/* webpackChunkName: "brace-mode-python" */ 'brace/mode/python')
                .then(() => import(/* webpackChunkName: "brace-snippets-python" */ 'brace/snippets/python'))
                .catch(handleImportError);
        case 'r':
            return import(/* webpackChunkName: "brace-mode-r" */ 'brace/mode/r')
                .then(() => import(/* webpackChunkName: "brace-snippets-r" */ 'brace/snippets/r'))
                .catch(handleImportError);
        case 'ruby':
            return import(/* webpackChunkName: "brace-mode-ruby" */ 'brace/mode/ruby')
                .then(() => import(/* webpackChunkName: "brace-snippets-ruby" */ 'brace/snippets/ruby'))
                .catch(handleImportError);
        case 'sh':
            return import(/* webpackChunkName: "brace-mode-sh" */ 'brace/mode/sh')
                .then(() => import(/* webpackChunkName: "brace-snippets-sh" */ 'brace/snippets/sh'))
                .catch(handleImportError);
        case 'sql':
            return import(/* webpackChunkName: "brace-mode-swift" */ 'brace/mode/sql')
                .then(() => import(/* webpackChunkName: "brace-snippets-sql" */ 'brace/snippets/sql'))
                .catch(handleImportError);
        case 'swift':
            return import(/* webpackChunkName: "brace-mode-swift" */ 'brace/mode/swift')
                .then(() => import(/* webpackChunkName: "brace-snippets-swift" */ 'brace/snippets/swift'))
                .catch(handleImportError);
        case 'text':
            return import(/* webpackChunkName: "brace-mode-text" */ 'brace/mode/text')
                .then(() => import(/* webpackChunkName: "brace-snippets-text" */ 'brace/snippets/text'))
                .catch(handleImportError);
        case 'typescript':
            return import(/* webpackChunkName: "brace-mode-typescript" */ 'brace/mode/typescript')
                .then(() => import(/* webpackChunkName: "brace-snippets-typescript" */ 'brace/snippets/typescript'))
                .catch(handleImportError);
        case 'xml':
            return import(/* webpackChunkName: "brace-mode-xml" */ 'brace/mode/xml')
                .then(() => import(/* webpackChunkName: "brace-snippets-xml" */ 'brace/snippets/xml'))
                .catch(handleImportError);
        case 'yaml':
            return import(/* webpackChunkName: "brace-mode-yaml" */ 'brace/mode/yaml')
                .then(() => import(/* webpackChunkName: "brace-snippets-yaml" */ 'brace/snippets/yaml'))
                .catch(handleImportError);
        default:
            throw new Error(`Unknown ace mode: ${mode}`);
    }
    /* eslint-enable */
}
