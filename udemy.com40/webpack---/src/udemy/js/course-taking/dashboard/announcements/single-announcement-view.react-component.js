import {Button, Link} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import EmptyView from '../../empty-view.react-component';
import {TABS} from '../constants';
import Announcement from './announcement.react-component';

import './announcements.less';

@withRouter
@inject('announcementsStore')
@observer
export default class FullAnnouncementView extends React.Component {
    static propTypes = {
        announcementsStore: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    };

    componentDidMount() {
        const singleAnnouncementId = +this.props.match.params.announcementId;
        this.props.announcementsStore.loadAnnouncement(singleAnnouncementId);
    }

    render() {
        const {isLoading, selectedAnnouncement} = this.props.announcementsStore;

        if (isLoading) {
            return <Loader block={true} size="xxlarge" />;
        }

        if (!selectedAnnouncement) {
            return (
                <EmptyView
                    title={gettext('Oh no!')}
                    messageBody={gettext(
                        "We couldn't find your announcement, please check the link you are trying to access.",
                    )}
                />
            );
        }

        return (
            <>
                <Button
                    componentClass={Link}
                    to={{hash: `#${TABS.ANNOUNCEMENTS}`}}
                    styleName="back-link"
                    udStyle="secondary"
                >
                    {gettext('Back to all announcements')}
                </Button>
                <Announcement announcement={selectedAnnouncement} />
            </>
        );
    }
}
