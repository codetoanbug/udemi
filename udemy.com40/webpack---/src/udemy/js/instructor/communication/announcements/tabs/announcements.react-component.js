import {LocalizedHtml} from '@udemy/i18n';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CourseAnnouncementAnalytics from '../course-announcement-analytics.react-component';
import AnnouncementsStore from './announcements.mobx-store';
import SendDialog from './send-dialog.react-component';
import '../announcements.less';

@observer
export default class Announcements extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        howToUrl: PropTypes.string.isRequired,
        sendUrl: PropTypes.string.isRequired,
        store: PropTypes.object, // Mainly for tests.
        isInstructorSendAnnouncementEnabled: PropTypes.bool,
    };

    static defaultProps = {
        store: null,
        isInstructorSendAnnouncementEnabled: true,
    };

    constructor(props) {
        super(props);
        this.store = props.store || new AnnouncementsStore(props.courseId);
    }

    render() {
        // removing testing store from props is important!
        const {
            store,
            howToUrl,
            sendUrl,
            isInstructorSendAnnouncementEnabled,
            ...frameProps
        } = this.props;
        const theStore = store || this.store;
        if (!theStore.courseLoaded) {
            return null;
        }
        return (
            <>
                <div styleName="compose-row">
                    <p>
                        <LocalizedHtml
                            html={gettext(
                                'Support your students’ learning by sending up to four educational announcements ' +
                                    'a month. Your students get these announcements both by email and within their Udemy accounts. <a class="howTo">Learn more</a>',
                            )}
                            interpolate={{
                                howTo: (
                                    <a
                                        className="ud-link-underline"
                                        style={{whiteSpace: 'nowrap'}}
                                        href={howToUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    />
                                ),
                            }}
                        />
                    </p>
                    {isInstructorSendAnnouncementEnabled && (
                        <SendDialog store={theStore} sendUrl={sendUrl} type="Educational" />
                    )}
                </div>
                <CourseAnnouncementAnalytics announcementType="educational" {...frameProps} />
            </>
        );
    }
}
