import React from 'react';
import ReactDOM from 'react-dom';

import {UNLOAD_APP_EVENT} from 'loaders/constants';
import getConfigData from 'utils/get-config-data';

const udConfig = getConfigData();

/**
 * This is a wrapper for ReactDOM.render that takes care of memory management
 * issues.
 *
 * See the examples in the examples directory.
 *
 * Note, the className should match the pattern:
 *
 *     .ud-component--app-name--component-name
 *
 * This is to facilitate static analysis.
 */
export default function udRenderReactComponents(container, className, Component, props = {}) {
    // Ensure render task is put on next frame to optimize TBT
    setTimeout(() => {
        _udRenderReactComponents(container, className, Component, props);
    }, 0);
}
export function _udRenderReactComponents(container, className, Component, props = {}) {
    if (!className.match(/^\.ud-component--[\w-]+--[\w-]+$/)) {
        throw new Error(
            'className should follow the pattern ' +
                `.ud-component--{app-name}--{component-name}': received '${className}'`,
        );
    }

    const matches = findMatches(container, className);

    if (!matches.length) {
        return;
    }

    matches.forEach((elem) => {
        const componentPropsString = elem.dataset.componentProps,
            componentPropsFromHtml = componentPropsString ? JSON.parse(componentPropsString) : {},
            componentProps = Object.assign({}, componentPropsFromHtml, props);

        if (Component.hasGlobalProviders) {
            componentProps.udData = window.UD;
            componentProps.translations = window.django.catalog;
        }

        if (!Component.isIsomorphicComponent || elem.dataset.forceRender) {
            ReactDOM.render(React.createElement(Component, componentProps), elem);
            return;
        }

        const firstChild = elem.firstChild;
        let errorMessage = '';

        if (!firstChild) {
            errorMessage =
                `No server-rendered HTML found for "${className}". ` +
                'Did you forget to call {% render_isomorphically %} from a Django template?';
        } else if (firstChild.dataset.isomorphicRenderingFailed) {
            errorMessage =
                `Isomorphic rendering failed for "${className}". ` +
                'Falling back to ReactDOM.render.';
        }

        if (errorMessage) {
            if (udConfig.env !== 'PROD') {
                // eslint-disable-next-line no-console
                console.error(errorMessage);
            }

            // Try to render client-side anyway, even if there were errors server-side
            ReactDOM.render(React.createElement(Component, componentProps), elem);
        } else if (!elem.dataset.skipHydration) {
            componentProps.serverUniqueId = firstChild.dataset.uniqueId;
            elem.removeChild(firstChild);
            ReactDOM.hydrate(React.createElement(Component, componentProps), elem);
        }
    });

    container.addEventListener(UNLOAD_APP_EVENT, unload);

    function unload() {
        findMatches(container, className).forEach((elem) => {
            ReactDOM.unmountComponentAtNode(elem);
        });
        container.removeEventListener(UNLOAD_APP_EVENT, unload);
    }
}

function findMatches(container, className) {
    const matches = Array.from(container.querySelectorAll(className));
    if (container.classList.contains(className.replace(/^\./, ''))) {
        matches.unshift(container);
    }
    return matches;
}
