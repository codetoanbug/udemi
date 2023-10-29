import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import Announcement from './announcement.mobx-model';
import {DEFAULT_API_PARAMS, PREVIEW_ANNOUNCEMENT, PAGE_SIZE} from './constants';

const udConfig = getConfigData();

export default class AnnouncementsStore {
    @observable announcements = [];
    @observable selectedAnnouncement;
    @observable pageNumber = 1;
    @observable isLoading = true;
    @observable isFullyLoaded = false;

    constructor(courseTakingStore, hasPreviewAnnouncement) {
        this.courseTakingStore = courseTakingStore;
        this.hasPreviewAnnouncement = hasPreviewAnnouncement;
    }

    @action
    loadPreviewAnnouncement() {
        const uri = new URLSearchParams(window.location.search);
        const previewAnnouncementTitle = uri.get(PREVIEW_ANNOUNCEMENT.TITLE);
        const previewAnnouncementContent = uri.get(PREVIEW_ANNOUNCEMENT.CONTENT);

        const previewAnnouncement = {
            id: -1,
            announcement_group: {
                title: previewAnnouncementTitle,
                content: previewAnnouncementContent,
                created: new Date(),
                user: udMe,
            },
        };
        this.announcements = [new Announcement(previewAnnouncement)];
        this.isFullyLoaded = true;
        this.isLoading = false;
    }

    @autobind
    @action
    loadAnnouncements() {
        this.isLoading = true;
        const params = Object.assign({}, DEFAULT_API_PARAMS, {
            page: this.pageNumber,
            page_size: PAGE_SIZE,
        });

        return udApi
            .get(`/courses/${this.courseTakingStore.courseId}/announcements/`, {
                params,
            })
            .then(
                action((response) => {
                    response.data.results.forEach((announcement) =>
                        this.announcements.push(new Announcement(announcement)),
                    );
                    this.isFullyLoaded = !response.data.next;
                    this.isLoading = false;
                }),
            );
    }

    @action
    loadAnnouncement(announcementId) {
        this.isLoading = true;
        return udApi
            .get(`/courses/${this.courseTakingStore.courseId}/announcements/${announcementId}/`, {
                params: DEFAULT_API_PARAMS,
            })
            .then(
                action((response) => {
                    this.selectedAnnouncement = new Announcement(response.data);
                    this.isLoading = false;
                }),
            )
            .catch(
                action(() => {
                    // announcement ID invalid, show error message
                    this.isLoading = false;
                }),
            );
    }

    @autobind
    @action
    loadMore() {
        this.pageNumber++;
        return this.loadAnnouncements();
    }

    @computed
    get canShowComments() {
        return (
            udConfig.brand.is_feed_commenting_enabled &&
            this.courseTakingStore.course.features.announcements_comments_view &&
            !this.hasPreviewAnnouncement
        );
    }

    @computed
    get isReportAbuseEnabled() {
        return udConfig.features.report_abuse && !this.hasPreviewAnnouncement;
    }
}
