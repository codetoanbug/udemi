// This is the entry point for all pages.
//
// This is third party stuff that's used everywhere.
// Webpack splits this to a vendor.js file.
// https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroups
//
// [1] This is internally used by babel-plugin-react-css-modules whenever it needs to apply a
//     styleName dynamically, e.g. `styleName={foo ? 'foo' : 'not-foo'}`.
import './pre';

import 'babel-plugin-react-css-modules/dist/browser/getClassName'; // [1]
// DO NOT import anything that would potentially use a global store before base-components/universal/index.
// This file includes global CSS including reset CSS and needs to be imported first.
import 'base-components/universal/index';
import {
    detectKeyboardNavigation,
    // eslint-disable-next-line no-unused-vars
    AboveTheFoldProvider,
    // eslint-disable-next-line no-unused-vars
    injectIsAboveTheFold,
} from '@udemy/design-system-utils';
import {setUpTrackingForOneTrust} from '@udemy/onetrust';
import {udPerf} from '@udemy/performance-rum-client';
import {ShoppingClient} from '@udemy/shopping';
import {extendObservable} from 'mobx';
import '@researchgate/react-intersection-observer';
import 'qs';
import 'uuid/v4';

// This is our stuff that's commonly used. This stays in this file.
// There's a tradeoff here: if we add something here, we reduce
// duplication in our app.js files, but if we add too much stuff here, then the browser has
// to spend more time parsing the JS, which delays the execution of udAppLoader.
// Hence, relatively big JS like header and footer aren't imported here even though they
// are commonly used. This is why we have a "common" app.
// See https://github.com/udemy/website-django/pull/35215 for how we determine what's commonly used.
import {includeTranslations as includeBaseComponentTranslations} from 'base-components/l10n';
import {includeTranslations as includeHeaderTranslations} from 'header/l10n';
import dynamicImports from 'loaders/dynamic-imports';
import udAppLoader from 'loaders/ud-app-loader';
import 'utils/escape/escape-html';
import 'utils/escape/safely-set-inner-html';
import 'utils/isomorphic-rendering';
import 'utils/ud-api-stat';
import 'utils/ud-expiring-local-storage';
import 'utils/ud-link';
import 'utils/ud-render-react-components';
import loadGlobalContext, {loadGlobalMeContext} from 'utils/load-global-context';
import {initPerformanceCollection} from 'utils/performance';
import Raven from 'utils/ud-raven';
import initializeSentryLoader from 'utils/ud-sentry-loader';
import {createGlobalStores} from 'utils/with-global-providers';

import loadThirdPartyJS from './load-third-party-js';

// IMPORTANT! This needs to be called so that Webpack's dead code elimination doesn't remove
// l10n.ts from the build output
includeBaseComponentTranslations();
includeHeaderTranslations();

udPerf.start('js_entry_main');

extendObservable(UD, {isGlobalMeContextLoading: false});

createGlobalStores();

const SentryStub = initializeSentryLoader();
if (SentryStub) {
    SentryStub.onLoad((Sentry) => Raven.initializeSentry(Sentry));
    Raven.setSentryInstance(SentryStub);
}

window.setTimeout(() => {
    dynamicImports();
    const appLoaderCallback = () => {
        detectKeyboardNavigation();
        loadThirdPartyJS(loadGlobalMeContext());

        udPerf.end('js_entry_main');
    };
    loadGlobalContext(() => {
        udAppLoader(document, appLoaderCallback);
    });

    setUpTrackingForOneTrust();
    initPerformanceCollection();
    ShoppingClient.fetch();
}, 0);
