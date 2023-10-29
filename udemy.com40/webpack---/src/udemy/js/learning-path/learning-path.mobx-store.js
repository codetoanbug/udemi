import {Tracker} from '@udemy/event-tracking';
import {ToasterStore} from '@udemy/react-messaging-components';
import {tokens} from '@udemy/styles';
import autobind from 'autobind-decorator';
import {action, computed, observable, reaction} from 'mobx';

import {
    LearningProductType,
    useBadgeClassesByLearningProductsQuery,
} from 'gql-codegen/api-platform-graphql';
import {LearningPathCreated} from 'learning-path/tracking-events-v2';
import {dismissAllToasts} from 'organization-common/toasts';
import {onToastImpressionEvent} from 'ui-feedback/toast-events';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';
import Raven from 'utils/ud-raven';

import {BASE_PATH, LEARNING_PATH_TITLE_PLACEHOLDER, LEARNING_PATH} from './constants';
import {LMS_AUTO_PATH_ENROLL_SOURCE} from './events-v2-constants';
import {
    SECTION_CONTENT_TYPE,
    PUBLIC_VISIBILITY_OPTION,
    LEARNING_PATH_ERROR_MESSAGES,
} from './learning-path-page/constants';
import LearningPath from './learning-path.mobx-model';
import handleError from './utils';

const udConfig = getConfigData();

export default class LearningPathStore {
    @observable learningPath = null;
    @observable isLoading = true;
    @observable isEditModeEnabled = false;
    @observable isSaved = false;
    @observable isCourseRecommendationsVisible = false;
    @observable recommendationSectionIndex = null;
    @observable isMobilePathEditorsModalVisible = false;
    @observable isMobileViewportSize = false;
    @observable isTabletViewportSize = false;
    @observable userHasUBProAccess = !!(
        udConfig.brand.has_organization &&
        (udConfig.features.organization.learning_path.pro_path ||
            udMe.organization?.is_pro_license_holder)
    );

    _mqlDisposers = [];
    pathEditNotificationToast = null;

    constructor(showNewLearningPathPageUIEnabled = false) {
        this.learningPath = new LearningPath({});
        this.showNewLearningPathPageUIEnabled = showNewLearningPathPageUIEnabled;

        reaction(
            () => this.isSaving,
            () => {
                this._setSaved(!this.isSaving && !this.learningPath.apiError);
                this.isSaved && dismissAllToasts();
                this.learningPath.resetLocalEditTimestamp();
            },
        );
    }

    @computed
    get title() {
        return this.learningPath.title;
    }

    @computed
    get description() {
        return this.learningPath.description;
    }

    _setUpMQL(query, flag) {
        const mql = window.matchMedia(query);
        const setMatches = action(({matches}) => {
            this[flag] = matches;
        });
        setMatches(mql);
        mql.addListener(setMatches);
        this._mqlDisposers.push(() => {
            mql.removeListener(setMatches);
        });
    }

    @action
    setUpMQLs() {
        this._setUpMQL(`(max-width: ${tokens['breakpoint-sm-max']})`, 'isMobileViewportSize');
        this._setUpMQL(`(max-width: ${tokens['breakpoint-md-max']})`, 'isTabletViewportSize');
    }

    tearDownMQLs() {
        this._mqlDisposers.forEach((disposer) => disposer());
    }

    @computed
    get isSaving() {
        return this.isEditModeEnabled && this.learningPath.isSavingModeEnabled;
    }

    @computed
    get isSavingFailed() {
        return this.learningPath.isSavingFailed && !this.isSaving;
    }

    @computed
    get shouldShowOrderBar() {
        return !(this.isEditModeEnabled && this.isMobileViewportSize);
    }

    @autobind
    onPublishModeSelect(event) {
        this.learningPath.setIsPublic(event === PUBLIC_VISIBILITY_OPTION);
    }

    @computed
    get shouldDisplayCourseDetails() {
        return !this.isMobileViewportSize && this.isEditModeEnabled;
    }

    async fetchLearningPathAndAutoEnroll(shouldAutoEnroll = false) {
        this._setLoading(true);
        try {
            const response = await udApi.get(this.learningPath.resourceUrl, {
                params: {
                    'fields[learning_path]':
                        '@default,created,is_user_enrolled,is_owner_in_group,is_user_auto_enroll_disabled,' +
                        'num_enrollments,folder_titles,is_pro_path,url,completed_steps,total_steps',
                },
            });
            this.learningPath.setDataFromAPI(response.data);

            // We need to enroll the user into a learning path before setting isLoading to false
            // This prevents user from seeing the unenrolled state of the learning path
            if (shouldAutoEnroll) {
                await this.learningPath.autoEnroll({
                    id: null,
                    type: LMS_AUTO_PATH_ENROLL_SOURCE,
                    deepLink: false,
                });
            }

            this._setLoading(false);
        } catch (e) {
            handleError(e, LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_LOAD);
            // we still can potentially get here in case of JS error
            this._setLoading(false);
        }
    }

    async fetchProgress() {
        try {
            const response = await udApi.get(`${BASE_PATH}${this.learningPath.id}/progress/`);
            this.learningPath.setCompletedItems(response.data.completed_items);
        } catch (e) {
            handleError(e, LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_LOAD_PROGRESS);
        }
    }

    async createLearningPath() {
        // TODO - consider moving to main store when implemented
        this._setLoading(true);
        try {
            const response = await udApi.post(
                BASE_PATH,
                {
                    title: this.learningPath.title || LEARNING_PATH_TITLE_PLACEHOLDER.TEXT,
                    description: this.learningPath.description || LEARNING_PATH.TEXT,
                },
                {
                    params: {
                        'fields[learning_path]': '@default,is_pro_path',
                    },
                },
            );
            this.learningPath.setDataFromAPI(response.data);
        } catch (e) {
            handleError(e, LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_CREATE);
        } finally {
            this._setLoading(false);
            // Important analytics event!
            Tracker.publishEvent(
                new LearningPathCreated({
                    id: this.learningPath.id,
                    isPublicLearningPath: this.learningPath.isPublic,
                    isUdemyPath: this.learningPath.isProPath,
                }),
            );
        }
    }

    addContentToRoot(position, contentType) {
        // inserts content to learning path
        if (contentType === SECTION_CONTENT_TYPE) {
            this.learningPath.createSection(position, {});
        }
    }

    @autobind
    async insertSectionsAfterCurrent(sections) {
        // if current section index is null - insert as the first section - otherwise insert after the current one
        const startIndex =
            this.recommendationSectionIndex === null ? 0 : this.recommendationSectionIndex + 1;
        await this.learningPath.insertSections(startIndex, sections);
    }

    @autobind
    async insertCoursesInCurrentSection(courseIds) {
        let currentSection;
        if (this.recommendationSectionIndex === null) {
            currentSection = this.learningPath.invisibleSection;
        } else {
            currentSection = this.learningPath.sections[this.recommendationSectionIndex];
        }
        if (currentSection) {
            await currentSection.insertCourses(courseIds);
        }
    }

    @action
    showCourseRecommendations(sectionIndex) {
        this.recommendationSectionIndex = sectionIndex;
        this.isCourseRecommendationsVisible = true;
    }

    @autobind
    @action
    hideCourseRecommendations() {
        this.recommendationSectionIndex = null;
        this.isCourseRecommendationsVisible = false;
    }

    @action
    setPathId(pathId) {
        this.learningPath.id = pathId;
    }

    @action
    setEditMode(isEnabled) {
        this.isEditModeEnabled = isEnabled;
        this.isSaved = false;
    }

    @action
    _setSaved(value) {
        this.isSaved = value;
    }

    @action
    _setLoading(value) {
        this.isLoading = value;
    }

    @autobind
    @action
    showMobilePathEditorsModal() {
        this.isMobilePathEditorsModalVisible = true;
    }

    @autobind
    @action
    hideMobilePathEditorsModal() {
        this.isMobilePathEditorsModalVisible = false;
    }

    async checkPathLastEdit() {
        try {
            const response = await udApi.get(`${BASE_PATH}${this.learningPath.id}/last-edit/`);
            const lastEditTimestamp = response.data;
            this.comparePathEditTimestamps(lastEditTimestamp);
        } catch (e) {
            Raven.captureException(e);
        }
    }

    async fetchCertifications() {
        const learningProductInput = {
            id: this.learningPath.id,
            type: LearningProductType.LearningPath,
        };
        const resp = await useBadgeClassesByLearningProductsQuery.fetcher({
            learningProducts: [learningProductInput],
        })();

        return resp.badgeClassesByLearningProducts ?? [];
    }

    comparePathEditTimestamps(lastEditTimestamp) {
        // compares the timestamp from server with the timestamp on client
        if (!lastEditTimestamp) {
            return;
        }

        if (!this.learningPath.localEditTimestamp) {
            // When first time opening the path page, we store the server version
            this.learningPath.setLocalEditTimestamp(lastEditTimestamp);
        }

        if (this.learningPath.localEditTimestamp !== lastEditTimestamp) {
            // when the timestamps are different, we want to show the warning
            if (!this.pathEditNotificationToast) {
                // if the warning Toaster is already present we do not show another one
                const alertBannerProps = {
                    udStyle: 'warning',
                    title: gettext('Someone has edited this path. Please refresh the page.'),
                    ctaText: gettext('Refresh'),
                    onAction: () => window.location.reload(),
                    onDismiss: () => {
                        this.pathEditNotificationToast = null;
                    },
                };
                const toastProps = {
                    onToastImpression: onToastImpressionEvent,
                    impressionUseCase: 'multiple_editors_conflict_toast',
                };
                this.pathEditNotificationToast = ToasterStore.addAlertBannerToast(
                    alertBannerProps,
                    toastProps,
                );
            }
        }
    }
}
