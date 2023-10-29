import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {APIModel} from 'utils/mobx';
import udApi from 'utils/ud-api';

export default class Enrollment extends APIModel {
    @observable favoritedTime = null;
    @observable archivedTime = null;
    @observable notificationSettings = null;

    get apiDataMap() {
        return {
            courseId: 'courseId',
            archivedTime: 'archive_time',
            favoritedTime: 'favorite_time',
            notificationSettings: 'notification_settings',
            wasPurchased: 'was_purchased_by_student',
            wasPaid: 'was_paid_by_student',
            isInRefundPeriod: 'is_in_refund_period',
            availableFeatures: 'available_features',
            created: 'created',
        };
    }

    // Favoriting
    favoriteEndpoint = '/users/me/favorited-courses/';

    favorite() {
        return udApi
            .post(
                this.favoriteEndpoint,
                {
                    course_id: this.courseId,
                },
                {
                    params: {
                        'fields[course]': 'favorite_time',
                    },
                },
            )
            .then(
                action((response) => {
                    this.favoritedTime = response.data.favorite_time;
                    return this.favoritedTime;
                }),
            );
    }

    unfavorite() {
        return udApi.delete(`${this.favoriteEndpoint}${this.courseId}/`).then(
            action(() => {
                this.favoritedTime = null;
            }),
        );
    }

    @autobind
    toggleFavorited() {
        if (!this.favoritedTime) {
            return this.favorite();
        }
        return this.unfavorite();
    }

    // Archiving
    archiveEndpoint = '/users/me/archived-courses/';

    archive() {
        return udApi
            .post(
                this.archiveEndpoint,
                {course_id: this.courseId},
                {params: {'fields[course]': 'archive_time'}},
            )
            .then(
                action((response) => {
                    this.archivedTime = response.data.archive_time;
                }),
            );
    }

    @action
    unarchive() {
        return udApi.delete(`${this.archiveEndpoint}${this.courseId}/`).then(
            action(() => {
                this.archivedTime = null;
            }),
        );
    }

    @autobind
    toggleArchived() {
        if (!this.archivedTime) {
            return this.archive();
        }
        return this.unarchive();
    }

    unenroll() {
        return udApi.delete(`users/me/subscribed-courses/${this.courseId}/`);
    }
}
