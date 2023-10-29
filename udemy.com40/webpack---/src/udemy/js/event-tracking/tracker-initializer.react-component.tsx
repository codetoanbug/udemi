import {
    Tracker,
    TrackingContext,
    TrackerDebugger,
    EventInfoStore,
    TrackingEvent,
    ClientLoadEvent,
    PageViewEvent,
} from '@udemy/event-tracking';
import {FullstoryBrowser, isEventAllowed} from '@udemy/fullstory';
import autobind from 'autobind-decorator';
import {when} from 'mobx';
import React, {Component} from 'react';

import loadCommonAppContext from 'common/load-common-app-context';
import serverOrClient from 'utils/server-or-client';
import udMe from 'utils/ud-me';
import udUserSpecificTrackingParams from 'utils/ud-user-specific-tracking-params';
import udVisiting from 'utils/ud-visiting';

import {getExternalTrackerParameters, getUserDataFromAppContext} from './helpers';

export class TrackerInitializer extends Component {
    constructor(props: Record<string, never>) {
        super(props);
        this.eventInfoStore = new EventInfoStore();
        serverOrClient.global.UD.tracking = serverOrClient.global.UD.tracking || {};
        serverOrClient.global.UD.tracking.eventInfoStore = this.eventInfoStore;
    }

    @autobind
    async componentDidMount() {
        await this.checkDependencies();
        /** Following 2 lines are added for getting the D2C subscription information from the web client header.
            Will be deleted after UD me context refactoring is done for subscription information. **/
        const commonAppContext = await loadCommonAppContext();
        const {user} = getUserDataFromAppContext(commonAppContext);
        const externalTrackingParameters: Partial<TrackingContext> = getExternalTrackerParameters(
            user,
        );

        Tracker.initialize(externalTrackingParameters, this.publishHook);

        Tracker.setPublishHook(this.publishHook);
        Tracker.setPageContext(Tracker.context.pageKey as string, Tracker.context.pageTrackingId);

        Tracker.publishEvent(new ClientLoadEvent());

        this.initializePageTracking();
    }

    private readonly eventInfoStore;
    debugRef = React.createRef<TrackerDebugger>();

    initializePageTracking() {
        if (udUserSpecificTrackingParams.spaTrackingActive) {
            /*
            If the page is a SPA and if there is a PageTrackingRoute that has already sent the first
            PageViewEvent, do not send one here.
            */
            return;
        }
        Tracker.publishEvent(new PageViewEvent(false));
    }

    /**
     Waiting for tracker data dependencies before initialization.
     This is because user specific data such as udMe, udUserSpecificTrackingParams etc.
     may be loaded asynchronously.
     Note that this does not prevent publishing events before initialization
     Those early arriving events will await too, then will be eventually published
     with their data filled correctly.
     */
    checkDependencies() {
        return when(
            () =>
                !udMe.isLoading && !udUserSpecificTrackingParams.isLoading && !udVisiting.isLoading,
        );
    }

    @autobind
    // Disable TS rule is a temporary work around for providing a status argument to isEventAllowed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publishHook(event: TrackingEvent, status: any, failureReason?: string) {
        this.eventInfoStore.updateEventStatus(event, status, failureReason);
        // Relay events to Fullstory
        if (FullstoryBrowser.isInitialized() && isEventAllowed(event, status)) {
            FullstoryBrowser.event(event._type, {
                status_str: status.toString(),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                failureReason_str: failureReason ?? '',
            });
        }
    }

    render() {
        return <TrackerDebugger ref={this.debugRef} eventInfoStore={this.eventInfoStore} />;
    }
}
