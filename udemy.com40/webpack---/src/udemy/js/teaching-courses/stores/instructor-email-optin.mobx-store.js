import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';

import {showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import {InstructorBannerActionEvent} from 'messaging/events';
import udApi from 'utils/ud-api';

export default class InstructorEmailOptinStore {
    updateSystemMessage() {
        return udApi.post('/users/me/system-messages/instructor_email_optin/seen/');
    }

    @autobind
    handleAlertDismiss() {
        Tracker.publishEvent(
            new InstructorBannerActionEvent(
                'dismiss',
                'instructor-email-optin',
                'instructor_performance_reviews',
            ),
        );
        return this.updateSystemMessage();
    }

    @autobind
    updateSettings() {
        const data = [
            {setting: 'udemy-promotional', value: 'on'},
            {setting: 'disableAllEmails', value: 'off'},
        ];

        return udApi
            .post('/users/me/notification-preferences/', data)
            .then(() => {
                this.updateSystemMessage();
                Tracker.publishEvent(
                    new InstructorBannerActionEvent(
                        'optin',
                        'instructor-email-optin',
                        'instructor_performance_reviews',
                    ),
                );
                showSuccessToast(
                    gettext('Success! You have updated your instructor email preferences.'),
                );
            })
            .catch(() => {
                showReloadPageErrorToast(
                    gettext(
                        'Unexpected error occurred. Unable to update email preferences at this time.',
                    ),
                );
            });
    }
}
