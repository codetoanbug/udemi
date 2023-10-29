import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ScrollContainer from '../../../course-content/scroll-container.react-component';
import requires from '../../../registry/requires';
import SidebarHeader from '../../../sidebar/sidebar-header.react-component';
import AutoscrollToggle from './autoscroll-toggle.react-component';
import Transcript from './transcript.react-component';

import './dashboard-transcript.less';

@requires('courseTakingStore')
@observer
export default class DashboardTranscript extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            isTranscriptInDashboard: PropTypes.bool,
            closeSidebar: PropTypes.func,
        }).isRequired,
    };

    render() {
        const {isTranscriptInDashboard, closeSidebar} = this.props.courseTakingStore;
        if (!isTranscriptInDashboard) {
            return null;
        }

        return (
            <>
                <SidebarHeader
                    styleName="header"
                    title={<h2 className="ud-heading-md">{gettext('Transcript')}</h2>}
                    a11yTitle={gettext('Transcript')}
                    onClose={closeSidebar}
                />
                <ScrollContainer styleName="transcript-panel" data-purpose="transcript-panel">
                    <Transcript />
                </ScrollContainer>
                <AutoscrollToggle />
            </>
        );
    }
}
