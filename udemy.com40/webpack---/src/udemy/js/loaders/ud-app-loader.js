import {noop} from 'utils/noop';
import udPerf from 'utils/ud-performance';
import Raven from 'utils/ud-raven';

import {UNLOAD_APP_EVENT} from './constants';
import doDynamicImport from './dynamic-imports/do-dynamic-import';

const selectorModules = getSelectorModules();

export const _skipBootstrap = false;

/**
 * Dynamically require an app.
 * Before this function is called, dynamicImports must have been called.
 *
 * You can dynamically load an app via markup such as the following:
 *
 *     <div class="ud-app-loader"
 *          data-module-id="app-name"
 *          data-module-args="{{ argsFromDjango|json|force_escape }}"
 *          data-module-priority="integer-priority">
 *     </div>
 *
 * See the examples in the examples directory.
 *
 * If you don't already have a file that matches the pattern app-name/app.js, you'll
 * need to create one.
 *
 * There can be multiple apps on the page. Each is loaded independently. Though, ideally,
 * you'd group multiple render calls into a single app.js bootstrap to avoid unnecessary
 * network traffic.
 *
 * `modulePriority` is used to create a nested Promise chain that favors calling `bootstrap`
 * methods of modules with higher priority over lower priority-ed modules. Cross-cutting apps
 * like `header`, `footer` have negative priority values to allow other apps to be loaded first.
 * Page-level apps like `browse` should be given a positive value (`10` is the convention).
 * All other apps have a priority `0` by default.
 *
 * This function is initially called by entry/main.js.
 *
 * This function returns a `udAppUnloader` function, which may be called to unload all the apps
 * that were loaded. The unloader simply dispatches the UNLOAD_APP_EVENT event
 * on the `container`, leaving it to the bootstrap helpers, e.g. udRenderReactComponents, to undo
 * their own effects once the event is received. It's important that the unloader is returned
 * immediately, not after all apps have loaded, because it allows the caller to unload
 * the first k out of n loaded apps.
 *
 * This function accepts a `callback` function, which is called once all apps have been
 * successfully loaded.
 *
 * This function is idempotent, so it's safe to call it again if you add more elements with
 * the class ud-app-loader.
 */
export default function udAppLoader(container = document, callback = noop) {
    const appContainers = {};

    Array.from(container.querySelectorAll('.ud-app-loader')).forEach((elem) => {
        const priority = Number(elem.dataset.modulePriority || 0);
        appContainers[priority] = appContainers[priority] || [];
        appContainers[priority].push(elem);
    });

    Object.entries(selectorModules).forEach(([selector, module]) => {
        Array.from(container.querySelectorAll(selector)).forEach((elem) => {
            const priority = Number(module.modulePriority || 0);
            elem.dataset.moduleId = module.moduleId;
            elem.dataset.moduleArgs = JSON.stringify(module.moduleArgs);

            appContainers[priority] = appContainers[priority] || [];
            appContainers[priority].push(elem);
        });
    });

    const orderedAppContainers = [];
    Object.keys(appContainers)
        .sort((a, b) => (Number(a) < Number(b) ? 1 : -1))
        .forEach((key) => {
            orderedAppContainers.push(appContainers[key]);
        });

    function load(elem) {
        const moduleId = elem.dataset.moduleId,
            moduleArgsString = elem.dataset.moduleArgs,
            moduleArgs = moduleArgsString ? JSON.parse(moduleArgsString) : {};

        if (elem.classList.contains('ud-app-loading') || elem.classList.contains('ud-app-loaded')) {
            return Promise.resolve([]);
        }

        elem.classList.add('ud-app-loading');

        function requireCallback(appModule) {
            if (!_skipBootstrap) {
                appModule.default(elem, moduleArgs);
            }
            elem.classList.remove('ud-app-loading');
            elem.classList.add('ud-app-loaded');
        }

        return _importApp(moduleId)
            .then(requireCallback)
            .catch((error) => {
                Raven.captureException(error);
            });
    }

    orderedAppContainers
        .reduce((chain, elems) => {
            return chain.then(() => {
                return Promise.all(elems.map(load));
            });
        }, Promise.resolve())
        .then(callback);

    return function udAppUnloader() {
        Object.values(orderedAppContainers).forEach((elems) => {
            elems.forEach((elem) => {
                elem.dispatchEvent(new Event(UNLOAD_APP_EVENT));
            });
        });
    };
}

/**
 * In some cases, it may not be easy to add the `ud-app-loader` class
 * to the element that we want to bootstrap our app on. We work around these cases by mapping
 * the element's selector to the moduleId and moduleArgs of our app. We primarily
 * use this to load snippets on Django admin pages, where we have limited control
 * over the HTML.
 */
function getSelectorModules() {
    return {
        'form#experiment_form': {moduleId: 'tapen/experiment-form-admin', moduleArgs: {}},
        'form[id$="unit_form"]': {moduleId: 'tapen/discovery-unit-form-admin', moduleArgs: {}},
        'div#discoveryunitconfiguration_set-group': {
            moduleId: 'tapen/discovery-context-admin',
            moduleArgs: {},
        },
        'div#content-main': {moduleId: 'tapen/jsoneditor-admin', moduleArgs: {}},
    };
}

export function _importApp(moduleId) {
    const perfAppName = `_${moduleId.replace(/[-/]/g, '_')}_app`;
    udPerf.start(perfAppName);

    return new Promise((resolve, reject) => {
        doDynamicImport(
            'ud-app',
            moduleId,
            (appImport) => {
                udPerf.end(perfAppName);
                resolve(appImport);
            },
            reject,
        );
    });
}
