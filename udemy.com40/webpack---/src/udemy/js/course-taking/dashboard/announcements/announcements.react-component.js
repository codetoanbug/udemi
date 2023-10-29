import {Loader} from '@udemy/react-reveal-components';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {withRouter, Route} from 'react-router-dom';

import requires from '../../registry/requires';
import HashSwitch from '../../utils/hash-switch.react-component';
import AnnouncementsStore from './announcements.mobx-store';
import {PREVIEW_ANNOUNCEMENT} from './constants';
import FullAnnouncementView from './full-announcement-view.react-component';
import SingleAnnouncementView from './single-announcement-view.react-component';

import './announcements.less';

@withRouter
@requires('courseTakingStore')
@observer
export default class Announcements extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.hasPreviewAnnouncement = !!new URLSearchParams(window.location.search).get(
            PREVIEW_ANNOUNCEMENT.HAS_PREVIEW_ANNOUNCEMENT_QUERY_PARAMS,
        );
        this.announcementsStore = new AnnouncementsStore(
            this.props.courseTakingStore,
            this.hasPreviewAnnouncement,
        );
    }

    render() {
        if (this.props.courseTakingStore.isLoading) {
            return <Loader block={true} size="xxlarge" />;
        }

        return (
            <Provider announcementsStore={this.announcementsStore}>
                <HashSwitch location={this.props.location}>
                    <Route
                        path="announcements/:announcementId"
                        component={SingleAnnouncementView}
                    />
                    <Route path="announcements" component={FullAnnouncementView} />
                </HashSwitch>
            </Provider>
        );
    }
}
