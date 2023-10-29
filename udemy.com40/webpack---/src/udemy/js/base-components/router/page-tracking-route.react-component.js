import {Tracker, PageViewEvent, generateTrackingId} from '@udemy/event-tracking';
import PropTypes from 'prop-types';
import React from 'react';
import {Route} from 'react-router-dom';

import serverOrClient from 'utils/server-or-client';
import udUserSpecificTrackingParams from 'utils/ud-user-specific-tracking-params';

/**
 * Catches the route changes and sends PageViewEvents when necessary
 *
 * Should be used in SPAs
 */
export default class PageTrackingRoute extends React.Component {
    static propTypes = {
        ...Route.propTypes,
        pageKey: PropTypes.string.isRequired,
    };

    componentDidMount() {
        this.handlePageChange();
    }

    componentDidUpdate() {
        this.handlePageChange();
    }

    componentWillUnmount() {
        delete udUserSpecificTrackingParams.spaTrackingActive;
    }

    handlePageChange() {
        /*
        The first PageViewEvent on a new page should have isRouteChange=false.
        Next events occurred by SPA route changes should have isRouteChange=true.
        We can understand if this is the first event by checking there is a pageKey set in the
        tracker.context earlier.
         */
        const isRouteChange = !!udUserSpecificTrackingParams.spaTrackingActive;

        /*
        If there is a SPA route change detected while `spaTrackingActive` variable is not true
        this means a SPA is implemented without using PageTrackingRoute.
        This value can also be used to detect this case.
         */
        udUserSpecificTrackingParams.spaTrackingActive = true;

        const previousPath = Tracker.context.pathname;
        const newPath = serverOrClient.global.location.pathname;
        if (newPath === previousPath) {
            // No change, do not send event.
            return;
        }
        const newPageTrackingId = generateTrackingId();
        Tracker.setPageContext(this.props.pageKey, newPageTrackingId);
        Tracker.publishEvent(new PageViewEvent(isRouteChange));
    }

    render() {
        const {pageKey, ...props} = this.props;
        return <Route {...props} />;
    }
}
