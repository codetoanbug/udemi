import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import Tabs from 'base-components/tabs/tabs.react-component';

import './tab-chart.less';

@inject('store')
@withRouter
class DesktopTabRoutes extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        routes: PropTypes.array.isRequired,
        redirect: PropTypes.string.isRequired,
        searchParams: PropTypes.string.isRequired,
    };

    componentDidMount() {
        const {routes, match, history, redirect, searchParams} = this.props;
        if (!routes.some((route) => `${match.url}/${route.path}/` === history.location.pathname)) {
            history.replace({pathname: `${match.url}/${redirect}/`, search: searchParams});
        }
    }

    @autobind
    changeRoute(pathname) {
        this.props.history.push({pathname, search: this.props.location.search});
    }

    render() {
        const {routes, match, history} = this.props;
        return (
            <Tabs
                toggleStrategy="add-remove"
                activeTabId={history.location.pathname}
                onSelect={this.changeRoute}
            >
                {routes.map((route) => (
                    <Tabs.Tab key={route.path} id={`${match.url}/${route.path}/`} title={route.tab}>
                        {route.message}
                        {route.content}
                    </Tabs.Tab>
                ))}
            </Tabs>
        );
    }
}

@observer
export default class DesktopTabChart extends Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
    };

    render() {
        if (this.props.routes.some((route) => !route.metrics)) {
            return null;
        }
        return (
            <div styleName="container container-desktop">
                <DesktopTabRoutes {...this.props} />
            </div>
        );
    }
}
