import autobind from 'autobind-decorator';
import {action, set, observable, runInAction} from 'mobx';

import {showSuccessToast, showReloadPageErrorToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage, TIMEOUT} from 'utils/ud-api';

export default class CourseManageStore {
    @observable courseId;
    @observable course = {};
    @observable courseLoaded = false;
    @observable menuLoaded = false;
    @observable menuData;
    @observable isUfoContentSubscriptionAgreed = false;
    @observable headerActions;
    @observable isCourseVersionEnabled = false;
    @observable isNewCodingExerciseUIEnabled = false;
    @observable isCurriculumEditorSectionTopicsEnabled = false;

    constructor(
        courseId,
        isUfoContentSubscriptionAgreed,
        isCourseVersionEnabled,
        isNewCodingExerciseUIEnabled,
        isCurriculumEditorSectionTopicsEnabled,
    ) {
        runInAction(() => {
            this.courseId = courseId;
            this.isUfoContentSubscriptionAgreed = isUfoContentSubscriptionAgreed;
            this.isCourseVersionEnabled = isCourseVersionEnabled;
            this.isNewCodingExerciseUIEnabled = isNewCodingExerciseUIEnabled;
            this.isCurriculumEditorSectionTopicsEnabled = isCurriculumEditorSectionTopicsEnabled;
        });
        this.getMenu();
        this.getCommonCourseInfo();
    }

    @action
    setHeaderActions(actions) {
        this.headerActions = actions;
    }

    @action
    cleanHeaderActions(actions) {
        if (this.headerActions === actions) {
            this.headerActions = null;
        }
    }

    @autobind
    @action
    getMenu() {
        return udApi
            .get(`/courses/${this.courseId}/manage-menu/`)
            .then(
                action((response) => {
                    this.menuData = JSON.parse(response.data.menuJson);
                    this.menuLoaded = true;
                }),
            )
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    // Don't give error message for permission denied.
                    return;
                }

                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @autobind
    @action
    updateMenuCheckbox() {
        if (this.menuData && this.menuData.with_completion) {
            this.getMenu();
        }
    }

    @autobind
    refreshPublishCourseStatus() {
        // is_live is not depending only of is_publish value
        this.getCommonCourseInfo();
        this.getMenu();
    }

    @autobind
    getContentLengthVideo() {
        return udApi
            .get(`/courses/${this.courseId}/`, {
                params: {
                    'fields[course]':
                        'content_length_video,is_paid,price_updated_date,can_toggle_curriculum_published_state',
                },
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    set(this.course, {
                        contentLengthVideo: response.data.content_length_video,
                        isPaid: response.data.is_paid,
                        priceUpdatedDate: response.data.price_updated_date,
                        canTogglePublishedState:
                            response.data.can_toggle_curriculum_published_state,
                    });
                    return response.data.content_length_video;
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @action
    getCommonCourseInfo() {
        return udApi
            .get(`/courses/${this.courseId}/`, {
                params: {
                    'fields[course]':
                        'title,status_label,learn_url,' +
                        'image_200_H,image_480x270,visible_instructors,can_edit,is_live,' +
                        'is_paid,is_draft,published_time,num_invitation_requests,is_published,' +
                        'organization_id,is_high_quality,content_length_video, price_updated_date,' +
                        'can_toggle_curriculum_published_state,is_owner_opted_into_deals',
                },
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    set(this.course, {
                        id: response.data.id,
                        title: response.data.title,
                        statusLabel: response.data.status_label,
                        learnUrl: response.data.learn_url,
                        image200H: response.data.image_200_H,
                        image480x270: response.data.image_480x270,
                        isPublished: response.data.is_published,
                        visibleInstructors: response.data.visible_instructors,
                        canEdit: response.data.can_edit,
                        isLive: response.data.is_live,
                        isPaid: response.data.is_paid,
                        isDraft: response.data.is_draft,
                        numInvitationRequests: response.data.num_invitation_requests,
                        organizationId: response.data.organization_id,
                        isHighQuality: response.data.is_high_quality,
                        wasPublished: Boolean(response.data.published_time),
                        contentLengthVideo: response.data.content_length_video,
                        priceUpdatedDate: response.data.price_updated_date,
                        canTogglePublishedState:
                            response.data.can_toggle_curriculum_published_state,
                        isOwnerOptedIntoDeals: response.data.is_owner_opted_into_deals,
                    });
                    this.courseLoaded = true;
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @autobind
    async publishChanges() {
        return udApi
            .patch(`/courses/${this.courseId}/publish-draft-version/`, {})
            .then(() => {
                showSuccessToast(gettext('Your changes have been successfully updated'));
            })
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }
}
