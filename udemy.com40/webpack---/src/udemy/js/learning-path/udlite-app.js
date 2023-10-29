import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {Switch, Redirect} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';
import BrowseService from 'browse/lib/browse-service';
import createUFBContextMenu from 'organization-common/resource-context-menu/create-ufb-context-menu';
import getConfigData from 'utils/get-config-data';
import udRenderReactComponents from 'utils/ud-render-react-components';

import {BASE_PATH} from './constants';
import LearningPathPage from './learning-path-page/learning-path-page.react-component';
import LearningPathStore from './learning-path.mobx-store';
import ListPageStore from './list-page/list-page.mobx-store';
import ListPage from './list-page/list-page.react-component';

import './app.less';

const udConfig = getConfigData();

@observer
export class App extends Component {
    static propTypes = {
        showNewLearningPathPageUIEnabled: PropTypes.bool,
    };

    static defaultProps = {
        showNewLearningPathPageUIEnabled: false,
    };

    constructor(props) {
        super(props);
        this.stores = {
            learningPathStore: new LearningPathStore(props.showNewLearningPathPageUIEnabled),
            listPageStore: new ListPageStore(),
            browseService: new BrowseService(),
            resourceContextMenu: createUFBContextMenu(),
        };
        this.stores.learningPathStore.setUpMQLs();
    }

    componentWillUnmount() {
        this.stores.learningPathStore.tearDownMQLs();
    }

    render() {
        const {listPageStore} = this.stores;
        const learningPathListPageTitle = () => {
            const suffix = udConfig.brand.product_name;
            const pageTitle = listPageStore.isProTabActive ? 'Udemy paths' : 'Learning paths';
            return (
                <Helmet>
                    <title>
                        {interpolate(
                            gettext('%(learningPathTitle)s | %(suffix)s'),
                            {
                                learningPathTitle: pageTitle,
                                suffix,
                            },
                            true,
                        )}
                    </title>
                </Helmet>
            );
        };
        return (
            <Provider {...this.stores}>
                <>
                    {learningPathListPageTitle()}
                    <div styleName="page-grid">
                        <MemoizedBrowserRouter>
                            <Switch>
                                <PageTrackingRoute
                                    pageKey="learning_path"
                                    exact={true}
                                    path={`${BASE_PATH}:pathId(\\d+)/:action(edit)?/`}
                                    component={LearningPathPage}
                                />
                                <PageTrackingRoute
                                    pageKey="learning_path_list"
                                    exact={true}
                                    path={`${BASE_PATH}:activeListType?/:folderId?/:action(edit)?/`}
                                    component={ListPage}
                                />
                                <Redirect to={BASE_PATH} />
                            </Switch>
                        </MemoizedBrowserRouter>
                    </div>
                </>
            </Provider>
        );
    }
}

export default function bootstrap(container, moduleArgs) {
    udRenderReactComponents(container, '.ud-component--learning-path--app', App, moduleArgs);
}
