import {action, extendObservable, observable, runInAction} from 'mobx';

import {showReloadPageErrorToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage, TIMEOUT} from 'utils/ud-api';

export default class AnnouncementsStore {
    @observable courseId;
    @observable course = {};
    @observable courseLoaded = false;

    constructor(courseId) {
        runInAction(() => {
            this.courseId = courseId;
        });
        this.getAnnouncementsInfo();
    }

    @action
    getAnnouncementsInfo() {
        return udApi
            .get(`/courses/${this.courseId}/`, {
                params: {
                    'fields[course]':
                        'organization_id,can_send_announcements,announcements_left,announcements_max,owner_timezone',
                },
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    extendObservable(this.course, {
                        organizationId: response.data.organization_id,
                        canSend: response.data.can_send_announcements,
                        left: response.data.announcements_left,
                        max: response.data.announcements_max,
                        ownerTimezone: response.data.owner_timezone,
                    });
                    this.courseLoaded = true;
                }),
            )
            .catch(
                action(() => {
                    showReloadPageErrorToast(defaultErrorMessage);
                }),
            );
    }
}
