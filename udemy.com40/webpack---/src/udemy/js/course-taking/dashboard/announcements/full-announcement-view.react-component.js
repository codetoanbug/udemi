import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import EmptyView from '../../empty-view.react-component';
import Announcement from './announcement.react-component';

import './announcements.less';

@inject('announcementsStore')
@observer
export default class FullAnnouncementView extends React.Component {
    static propTypes = {
        announcementsStore: PropTypes.object.isRequired,
    };

    componentDidMount() {
        if (this.props.announcementsStore.hasPreviewAnnouncement) {
            this.props.announcementsStore.loadPreviewAnnouncement();
        } else {
            this.props.announcementsStore.loadAnnouncements();
        }
    }

    renderLoadMoreButton() {
        const {isFullyLoaded, isLoading} = this.props.announcementsStore;
        if (isFullyLoaded || isLoading) {
            return null;
        }
        return (
            <div styleName="load-more">
                <Button
                    udStyle="secondary"
                    onClick={this.props.announcementsStore.loadMore}
                    data-purpose="load-more"
                    styleName="load-more-button"
                    aria-label={gettext('See more announcements')}
                >
                    {gettext('See more')}
                </Button>
            </div>
        );
    }

    render() {
        const {announcements, isLoading, isFullyLoaded} = this.props.announcementsStore;

        const emptyAnnouncementTitle = gettext('No announcements posted yet');
        const emptyAnnouncementBody = gettext(
            'The instructor hasn’t added any announcements to this course yet. ' +
                'Announcements are used to inform you of updates or additions to the course.',
        );

        return (
            <div data-purpose="announcements-list">
                {isFullyLoaded && announcements.length === 0 && (
                    <EmptyView title={emptyAnnouncementTitle} messageBody={emptyAnnouncementBody} />
                )}
                <div>
                    {announcements.map((announcement) => (
                        <Announcement announcement={announcement} key={announcement.id} />
                    ))}
                    {isLoading ? <Loader block={true} size="xxlarge" styleName="loader" /> : null}
                </div>
                {this.renderLoadMoreButton()}
            </div>
        );
    }
}
