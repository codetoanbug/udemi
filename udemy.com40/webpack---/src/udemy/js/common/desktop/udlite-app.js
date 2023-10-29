import '@udemy/react-header/dist/styles/header.global.css';
import './desktop-scaffolding.global.less';

import {TrackerInitializer} from 'event-tracking/tracker-initializer.react-component';
import {bootstrap as bootstrapFooter} from 'footer/bootstrap';
import Header from 'header/desktop/header.react-isocomponent';
import PublicCachingDebug from 'public-caching-debug/components/public-caching-debug.react-component';
import ShoppingClient from 'shopping-client/shopping-client.mobx-store';
import bootstrapUIFeedback from 'ui-feedback/bootstrap';
import udRenderReactComponents from 'utils/ud-render-react-components';

import {checkModernBrowser} from '../browser/browser-warning.react-component';

export default function bootstrap(container, moduleArgs) {
    checkModernBrowser();
    udRenderReactComponents(
        container,
        '.ud-component--header-v6--header',
        moduleArgs.ufbHeaderComponent || Header,
        {...moduleArgs, shoppingClient: ShoppingClient},
    );
    bootstrapFooter(container, moduleArgs);
    bootstrapUIFeedback(container, moduleArgs);

    udRenderReactComponents(
        container,
        '.ud-component--event-tracking--tracker-initializer',
        TrackerInitializer,
        moduleArgs,
    );
    udRenderReactComponents(
        container,
        '.ud-component--public-caching-debug--public-caching-debug',
        PublicCachingDebug,
        moduleArgs,
    );
}
