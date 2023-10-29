import {observable, action} from 'mobx';

import {AlertLevel} from '@udemy/react-messaging-components';
import {udApi} from '@udemy/ud-api';

import {API_ROUTES} from '../constants';

/**
 * Store to handle sending `Nudge Organization owner` and showing relevant notifications
 */
export class NudgeOwnerModalStore {
    private readonly udApi = udApi;
    @observable message = '';
    @observable isNotificationVisible = false;
    @observable notificationText = '';
    @observable notificationType?: AlertLevel;
    @observable userRating = 2;

    constructor(readonly ownerName: string, private readonly gettext: (message: string) => string) {
        this.setDefaultMessage();
    }

    @action
    setDefaultMessage = () => {
        this.message = '';
    };

    @action
    onMessageChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.message = event.target.value;
    };

    @action
    setUserRating = (rating: number) => {
        this.userRating = rating;
    };

    @action
    sendNudgeOwnerMessage = (onSuccess: () => void) => {
        const payload = {
            message_body: this.message,
            user_rating: this.userRating,
        };
        return this.udApi
            .post(API_ROUTES.nudgeOwner, payload)
            .then(
                action(() => {
                    onSuccess();
                    this.showNotification(this.gettext('Message sent'), 'success');
                    return 'success';
                }),
            )
            .catch(() => {
                this.showNotification(
                    this.gettext('Something went wrong! Please try again later.'),
                    'error',
                );
                return 'error';
            });
    };

    @action
    showNotification = (text: string, type: AlertLevel) => {
        this.isNotificationVisible = true;
        this.notificationText = text;
        this.notificationType = type;
    };

    @action
    hideNotification = () => {
        this.isNotificationVisible = false;
        this.notificationType = undefined;
        this.notificationText = '';
    };
}
