import {Provider} from 'mobx-react';
import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router';
import {Redirect, RouteProps, Switch} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';
import {AnyObject} from 'utils/types';
import udRenderReactComponents from 'utils/ud-render-react-components';

import {CertificationDetailPage} from './certification-detail-page/certification-detail-page';
import {CertificationLandingPage} from './certification-landing-page.react-component';
import {CertificationStore} from './certification.mobx-store';
import {
    CERTIFICATION_DETAIL_PAGE_TABS,
    CERTIFICATION_LANDING_PAGE_TABS,
    MY_CERTIFICATION_PREPARATION_PATH,
    OPEN_BADGES_BASE_PATH,
    routes,
} from './constants';
import {translationStrings} from './frontends-translations';

// Import translation strings before they are used, using a noop so that Webpack + LocalizationTerser plugin doens't remove them
translationStrings();

export class App extends Component<RouteComponentProps> {
    certificationStore = new CertificationStore();

    render() {
        return (
            <MemoizedBrowserRouter>
                <Provider
                    certificationStore={this.certificationStore}
                    enableUBListExperiment={false}
                >
                    <Switch>
                        <PageTrackingRoute
                            pageKey="certifications_start_page"
                            exact={true}
                            path={OPEN_BADGES_BASE_PATH}
                            component={CertificationLandingPage}
                        />

                        <PageTrackingRoute
                            pageKey="my_certification_preparation_page"
                            exact={true}
                            path={MY_CERTIFICATION_PREPARATION_PATH}
                            render={(props: RouteProps) => (
                                <CertificationLandingPage
                                    certificationStore={this.certificationStore}
                                    {...props}
                                    activeTabId={
                                        CERTIFICATION_LANDING_PAGE_TABS.MY_CERTIFICATION_PREPARATION
                                    }
                                />
                            )}
                        />

                        <PageTrackingRoute
                            pageKey="certifications_detail_page"
                            exact={true}
                            path={routes.certificationDetailPath(':id(\\d+)')}
                            component={CertificationDetailPage}
                        />

                        <PageTrackingRoute
                            pageKey="certifications_detail_learning_in_progress_page"
                            exact={true}
                            path={routes.learningInProgressPath(':id(\\d+)')}
                            render={(props: RouteComponentProps) => (
                                <CertificationDetailPage
                                    certificationStore={this.certificationStore}
                                    {...props}
                                    activeTabId={
                                        CERTIFICATION_DETAIL_PAGE_TABS.LEARNING_IN_PROGRESS
                                    }
                                />
                            )}
                        />
                        <Redirect to={OPEN_BADGES_BASE_PATH} />
                    </Switch>
                </Provider>
            </MemoizedBrowserRouter>
        );
    }
}

export default function bootstrap(container: HTMLElement, moduleArgs: AnyObject) {
    udRenderReactComponents(container, '.ud-component--open-badges--app', App, moduleArgs);
}
