import autobind from 'autobind-decorator';
import {observable, action, computed} from 'mobx';

import {showReloadPageErrorToast} from 'course-taking/toasts';
import getConfigData from 'utils/get-config-data';
import {defaultErrorMessage} from 'utils/ud-api';
import udLink from 'utils/ud-link';

const udConfig = getConfigData();

export default class UnenrollStore {
    @observable isConfirmModalOpen = false;

    constructor(courseTakingStore) {
        this.courseTakingStore = courseTakingStore;
    }

    @computed
    get canUnenroll() {
        return (
            udConfig.features.course.students.unenroll && this.courseTakingStore.isEnrolledStudent
        );
    }

    @autobind
    @action
    openConfirmModal() {
        this.isConfirmModalOpen = true;
    }

    @autobind
    @action
    closeConfirmModal() {
        this.isConfirmModalOpen = false;
    }

    @autobind
    unenroll() {
        this.closeConfirmModal();
        this.courseTakingStore.enrollment
            .unenroll()
            .then(() => {
                window.location.href = udLink.toMyCourses();
            })
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }
}
