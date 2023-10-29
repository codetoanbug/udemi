import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import udApi from 'utils/ud-api';

export default class AnnouncementAnalyticsStore {
    @observable announcements = [];
    @observable totalAnnouncementCount = 0;
    @observable activePage = 1;
    @observable sortBy = {fieldName: 'announcement_group__created', ascending: false};

    @observable courseId;
    @observable pageSize;
    announcementType = '';

    constructor(courseId, announcementType, pageSize = 12) {
        this.setCourseId(courseId);
        this.setPageSize(pageSize);
        this.announcementType = announcementType;
    }

    _fetch() {
        let ordering;
        if (this.sortBy.fieldName) {
            ordering = `${this.sortBy.ascending ? '' : '-'}${this.sortBy.fieldName}`;
        }
        const requestConfig = {
            params: {
                is_promotional: this.announcementType === 'promotional',
                page: this.activePage,
                page_size: this.pageSize,
                'fields[course_announcement]': '@default,course,open_rate,click_rate,unsub_rate',
                ordering,
            },
        };
        return udApi.get(`/courses/${this.courseId}/announcements/`, requestConfig);
    }

    @computed
    get pageCount() {
        return Math.ceil(this.totalAnnouncementCount / this.pageSize);
    }

    @autobind
    @action
    loadAnnouncements(page = 1) {
        this.activePage = page;
        return this._fetch().then(this.setData);
    }

    @autobind
    @action
    loadAnnouncementsSort(col) {
        const isActive = col.fieldName === this.sortBy.fieldName;
        this.sortBy = {
            fieldName: col.fieldName,
            ascending: isActive ? !this.sortBy.ascending : col.initialSortOrder === 'ascending',
        };
        this.loadAnnouncements();
    }

    @autobind
    @action
    setData(response) {
        this.totalAnnouncementCount = response.data.count;
        this.announcements = response.data.results;
    }

    @action
    setCourseId(courseId) {
        this.courseId = courseId;
    }

    @action
    setPageSize(pageSize) {
        this.pageSize = pageSize;
    }

    @action
    deleteAnnouncement(announcement) {
        const announcementId = announcement.id;
        const onApiDeleteSuccess = action(() => {
            // close over the announcement to remove it from the collection on success response
            this.announcements.remove(announcement);
        });
        return udApi.delete(`/announcements/${announcementId}/`).then(onApiDeleteSuccess);
    }
}
