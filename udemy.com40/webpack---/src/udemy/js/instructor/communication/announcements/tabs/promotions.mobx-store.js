import {action, extendObservable, observable, runInAction} from 'mobx';

import {showReloadPageErrorToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage, TIMEOUT} from 'utils/ud-api';

export default class PromotionsStore {
    @observable courseId;
    @observable course = {};
    @observable courseLoaded = false;

    constructor(courseId) {
        runInAction(() => {
            this.courseId = courseId;
        });
        this.getPromotionsInfo();
    }

    @action
    getPromotionsInfo() {
        return udApi
            .get(`/courses/${this.courseId}/`, {
                params: {
                    'fields[course]':
                        'organization_id,is_paid,can_send_promotions,promotions_left,promotions_max,owner_timezone',
                },
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    extendObservable(this.course, {
                        organizationId: response.data.organization_id,
                        isPaid: response.data.is_paid,
                        canSend: response.data.can_send_promotions,
                        left: response.data.promotions_left,
                        max: response.data.promotions_max,
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
