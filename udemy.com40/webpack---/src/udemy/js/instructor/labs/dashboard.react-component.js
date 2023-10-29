import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Redirect, Switch} from 'react-router-dom';

import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';
import {REPORTED_ISSUES_BASE_URL} from 'instructor/labs/constants';
import {LabsReportedIssues} from 'instructor/labs/reported-issues/labs-reported-issues.react-component';

import {LabsModular} from './labs-modular.react-component';
import {LabsWorkspace} from './labs-workspace.react-component';
import LabsStore from './labs.mobx-store';

@inject('labsStore')
@observer
export default class LabsDashboard extends Component {
    static propTypes = {
        labsStore: PropTypes.instanceOf(LabsStore).isRequired,
    };

    render() {
        const redirect = '/labs/modular/';
        /* eslint-disable react/jsx-no-bind */
        return (
            <Provider labsStore={this.props.labsStore}>
                <Switch>
                    <PageTrackingRoute
                        pageKey="instructor_labs_modular"
                        path="/labs/modular/"
                        render={(props) => <LabsModular {...props} />}
                    />
                    <PageTrackingRoute
                        pageKey="instructor_labs_workspaces"
                        path="/labs/workspaces/"
                        render={(props) => <LabsWorkspace {...props} />}
                    />
                    <PageTrackingRoute
                        pageKey="instructor_labs_reported_issues"
                        path={REPORTED_ISSUES_BASE_URL}
                        render={(props) => (
                            <LabsReportedIssues {...props} baseUrl={REPORTED_ISSUES_BASE_URL} />
                        )}
                    />
                    <Redirect to={redirect} />
                </Switch>
            </Provider>
        );
        /* eslint-enable react/jsx-no-bind */
    }
}
