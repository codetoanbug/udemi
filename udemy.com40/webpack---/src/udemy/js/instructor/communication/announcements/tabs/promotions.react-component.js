import {LocalizedHtml} from '@udemy/i18n';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CourseAnnouncementAnalytics from '../course-announcement-analytics.react-component';
import PromotionsStore from './promotions.mobx-store';
import SendDialog from './send-dialog.react-component';
import '../announcements.less';

@observer
export default class Promotions extends Component {
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
        this.store = props.store || new PromotionsStore(props.courseId);
    }

    render() {
        if (!this.store.courseLoaded) {
            return null;
        }
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
                    {theStore.course.isPaid && !theStore.course.organizationId ? (
                        <p>
                            <LocalizedHtml
                                html={gettext(
                                    'Promote your courses by sending up to two promotional emails a month. ' +
                                        '<a class="howTo">Learn more</a>',
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
                    ) : (
                        <p>
                            {gettext(
                                'Promotional announcements are only available for paid courses.',
                            )}
                        </p>
                    )}
                    {isInstructorSendAnnouncementEnabled && (
                        <SendDialog store={theStore} sendUrl={sendUrl} type="Promotional" />
                    )}
                </div>

                <CourseAnnouncementAnalytics announcementType="promotional" {...frameProps} />
            </>
        );
    }
}
