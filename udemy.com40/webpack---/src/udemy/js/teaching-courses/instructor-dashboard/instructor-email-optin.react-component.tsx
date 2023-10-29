import {Tracker} from '@udemy/event-tracking';
import {AlertBanner} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import React from 'react';

import {InstructorBannerViewEvent} from 'messaging/events';

import InstructorEmailOptinStore from '../stores/instructor-email-optin.mobx-store';

export const InstructorEmailOptin = observer(() => {
    const [store] = React.useState(() => new InstructorEmailOptinStore());

    React.useEffect(() => {
        Tracker.publishEvent(
            new InstructorBannerViewEvent(
                'instructor-email-optin',
                'instructor_performance_reviews',
            ),
        );
    }, []);

    return (
        <AlertBanner
            ctaText={gettext('Receive emails')}
            onAction={store.updateSettings}
            onDismiss={store.handleAlertDismiss}
            title={gettext('Stop Missing Instructor Emails!')}
            body={gettext(
                'Update your communications settings to receive instructor emails ' +
                    'focused on giving you all the tools you’ll need to be successful ' +
                    'during course creation and beyond. Get started today!',
            )}
        />
    );
});
