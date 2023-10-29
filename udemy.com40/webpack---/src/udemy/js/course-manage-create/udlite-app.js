import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import qs from 'utils/query-params';
import udRenderReactComponents from 'utils/ud-render-react-components';

import CreateFlowWrapper from './create-flow-wrapper.react-component';

@observer
export class App extends React.Component {
    static propTypes = {
        returnUrl: PropTypes.string,
    };

    static defaultProps = {
        returnUrl: undefined,
    };

    @autobind
    renderCreateFlowWrapper(props) {
        return <CreateFlowWrapper {...props} {...this.props} />;
    }

    render() {
        const queryParams = qs.parse(window.location.search, {ignoreQueryPrefix: true});
        const isIP = queryParams.isIP === 'true';
        const isInSupplyGapsTargetGroup = queryParams.isInSupplyGapsTargetGroup === 'true';
        return (
            <MemoizedBrowserRouter>
                <Switch>
                    <Route
                        exact={true}
                        path="/:currentPageNum(\d+)/"
                        render={(routeProps) =>
                            this.renderCreateFlowWrapper({
                                ...routeProps,
                                isIP,
                                isInSupplyGapsTargetGroup,
                            })
                        }
                    />
                    <Redirect from="/" to="/1" />
                </Switch>
            </MemoizedBrowserRouter>
        );
    }
}

export default function bootstrap(container, moduleArgs) {
    udRenderReactComponents(container, '.ud-component--course-manage-create--app', App, moduleArgs);
}
