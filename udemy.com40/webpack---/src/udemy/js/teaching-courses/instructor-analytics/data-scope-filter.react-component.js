import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import Tabs, {Tab} from 'base-components/tabs/tabs.react-component';
import qs from 'utils/query-params';

import {DATA_SCOPE_FILTERS} from './constants';
/* eslint-disable no-unused-vars,import/order */
import styles from './engagement/engagement-route.less';

@inject('instructorStore')
@withRouter
@observer
export default class DataScopeFilter extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        instructorStore: PropTypes.object.isRequired,
        courseId: PropTypes.number.isRequired,
        isEnabled: PropTypes.bool.isRequired,
        dataTourStep: PropTypes.string,
    };

    static defaultProps = {
        dataTourStep: '',
    };

    componentDidMount() {
        const willBeNull = this.dataScopeFilterWillBeNull();
        if (!willBeNull && this.props.instructorStore.isReadyToOpenWelcomeModal) {
            this.props.instructorStore.setIsWelcomeModalOpen(true);
        }
    }

    @autobind
    toggleFilter(filter) {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        queryParams.data_scope = filter;
        this.props.history.push({
            pathname: this.props.location.pathname,
            search: qs.stringify(queryParams),
        });
    }

    @autobind
    dataScopeFilterWillBeNull() {
        const {isEnabled, courseId} = this.props;
        if (!isEnabled) {
            return true;
        }
        if (!isNaN(courseId)) {
            const isCourseInUbEver = this.props.instructorStore.isCourseInUbEver(courseId);
            if (!isCourseInUbEver) {
                return true;
            }
        }
        return false;
    }

    render() {
        const isDataScopeFilterNull = this.dataScopeFilterWillBeNull();
        if (isDataScopeFilterNull) {
            return null;
        }
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const ubTabTitle = <>{gettext('Udemy Business')}</>;
        return (
            <Tabs
                activeTabId={queryParams.data_scope}
                data-purpose="data-scope-filter-container"
                onSelect={this.toggleFilter}
            >
                <Tab id={DATA_SCOPE_FILTERS.ALL} title={gettext('All')}></Tab>
                <Tab id={DATA_SCOPE_FILTERS.UB} title={ubTabTitle}></Tab>
            </Tabs>
        );
    }
}
