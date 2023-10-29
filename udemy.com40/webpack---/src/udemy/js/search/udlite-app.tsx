import './app.global.less';
import React from 'react';
import {Route} from 'react-router-dom';

import IsomorphicRouter from 'base-components/router/isomorphic-router.react-component';
import {
    EXPERIMENT_TYPE_SEARCH_RESULT_PAGE,
    EXPERIMENT_TYPE_BROWSE_LIST_VIEW_PAGES,
    EXPERIMENT_TYPE_TOPIC_AND_SEARCH,
} from 'browse/lib/constants';
/**
 * TB-7034 : This provider will be moved out from the CLP codebase and will be placed in a common place. Since we
 * want to use for any feature, not only for CLP.
 */
import {FeatureContextProvider} from 'course-landing-page/feature-context';
import {ExperimentProvider} from 'experiment';
import getConfigData from 'utils/get-config-data';
import udRenderReactComponents from 'utils/ud-render-react-components';
import {withGlobalProviders} from 'utils/with-global-providers';

import {MX_SEARCH_URL, UFB_SEARCH_URL} from './constants';
import {Search} from './search.react-component';

const udConfig = getConfigData();

const {supported_languages: supportedLanguages = []} = udConfig;

const langPrefixes = (supportedLanguages as {lang: string}[])
    .filter((item) => item.lang !== 'en')
    .map((item) => item.lang);

export type ModuleArgs = React.ComponentProps<typeof Search>;

export function App(props: ModuleArgs) {
    const searchUrl = getConfigData().brand.has_organization ? UFB_SEARCH_URL : MX_SEARCH_URL;
    const path = `/:langPrefix(${langPrefixes.join('|')})?${searchUrl}`;

    return (
        <IsomorphicRouter>
            <Route path={path}>
                <FeatureContextProvider
                    asyncFeatureContext={Promise.resolve({
                        showCodingExerciseCount: {
                            enabled: props.showCodingExerciseCount ?? false,
                        },
                    })}
                >
                    <ExperimentProvider
                        experimentSet={[
                            EXPERIMENT_TYPE_SEARCH_RESULT_PAGE,
                            EXPERIMENT_TYPE_BROWSE_LIST_VIEW_PAGES,
                            EXPERIMENT_TYPE_TOPIC_AND_SEARCH,
                        ]}
                    >
                        <Search {...props} />
                    </ExperimentProvider>
                </FeatureContextProvider>
            </Route>
        </IsomorphicRouter>
    );
}

export const AppWithProviders = withGlobalProviders(App);

export default function bootstrap(container: HTMLElement, moduleArgs: ModuleArgs) {
    udRenderReactComponents(
        container,
        '.ud-component--search--search',
        AppWithProviders,
        moduleArgs,
    );
}
