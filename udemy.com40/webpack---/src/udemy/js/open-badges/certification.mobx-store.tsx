import {action, computed, observable, runInAction} from 'mobx';

import {
    BadgeClassEnrollmentsByBadgeClassIdQuery,
    BadgeClassIssuerFiltersQuery,
    BadgeClassQuery,
    SubjectAreasQuery,
    useActiveBadgeClassesQuery,
    useBadgeClassQuery,
    useBadgeClassEnrollmentsByBadgeClassIdQuery,
    useBadgeClassesByTopicQuery,
    useBadgeClassIssuerFiltersQuery,
    useSearchBadgeClassesQuery,
    useSubjectAreasQuery,
} from 'gql-codegen/api-platform-graphql';

import {CertificationModel} from './certification.mobx-model';
import {sendCertificateSearchEvent} from './common/utils/event-helpers';
import {
    ALLOWED_SUBJECT_AREAS,
    DEFAULT_API_PAGE_SIZE,
    DISCOVERY_PAGE_MESSAGES,
    ISSUER_FILTER_KEY,
    SUBJECT_AREA_FILTER_KEY,
} from './constants';
import {CourseModel} from './course.mobx-model';
import {ProLearningPathModel} from './pro-learning-path.mobx-model';

export class CertificationStore {
    @observable certification?: CertificationModel;
    @observable certificationsList?: CertificationModel[];
    @observable isCertificationListLoaded = false;
    @observable isAggregationsListLoaded = false;
    @observable isLoading = true;
    @observable.ref subjectAreas?: SubjectAreasQuery['badgeCertificationSubjectAreas'] | null;
    @observable.ref issuers?: BadgeClassIssuerFiltersQuery['badgeClassIssuers'] | null;
    @observable searchQuery?: string;
    @observable currentPage?: number;
    @observable pageCount?: number;

    @observable selectedFilters: Map<string, Set<string>>;

    @observable preparationCertificationsList?: CertificationModel[];
    @observable preparationCertificationCount = 0;
    @observable isPreparationCertsLoaded = false;

    @observable enrolledBadgeCourseList: CourseModel[] = [];
    @observable isBadgeClassEnrollmentsLoaded = false;
    @observable
    badgeClassEnrollments: BadgeClassEnrollmentsByBadgeClassIdQuery['badgeClassEnrollmentsByBadgeClassId'] = [];

    constructor() {
        this.selectedFilters = this.getEmptyFilterSet();
    }

    @computed get selectedIssuers() {
        return this.selectedFilters.get(ISSUER_FILTER_KEY) ?? new Set<string>();
    }

    @computed get selectedSubjectAreas() {
        return this.selectedFilters.get(SUBJECT_AREA_FILTER_KEY) ?? new Set<string>();
    }

    @action
    async getCertification(certificationId: string) {
        const response = await useBadgeClassQuery.fetcher({id: certificationId})();

        const badgeItem = response.badgeClass;

        if (badgeItem === undefined) {
            return;
        }
        this.setCertificationFromResponse(badgeItem);
    }

    @action
    async getCertificationsByTopic(topicId: string) {
        const response = await useBadgeClassesByTopicQuery.fetcher({topicId})();
        const badgeItem = response.badgeClassesByTopic;
        this.setCertificationListFromResponse(badgeItem);
    }

    @action
    setCertificationFromResponse(badgeClass: BadgeClassQuery['badgeClass']) {
        this.certification = new CertificationModel(badgeClass);
    }

    @action
    unsetCertification() {
        this.certification = undefined;
    }

    @action
    setCertificationListFromResponse(badgeClasses: any) {
        // TODO: use the correct type
        this.certificationsList = badgeClasses.map((badgeClass: any) => {
            return new CertificationModel(badgeClass);
        });
    }

    @action
    setPreparationCertificationsList(badgeClasses: any) {
        this.preparationCertificationsList = badgeClasses.map((badgeClass: any) => {
            return new CertificationModel(badgeClass);
        });
    }

    @action
    setPreparationCertificationCount(count: number) {
        this.preparationCertificationCount = count;
    }

    @action
    setIsPreparationCertsLoaded(state: boolean) {
        this.isPreparationCertsLoaded = state;
    }

    @action
    setCurrentPage(pageNumber: number | undefined) {
        this.currentPage = pageNumber;
    }

    @action
    setPageCount(pageCount: number | undefined) {
        this.pageCount = pageCount;
    }

    @action
    addFilter(key: string, value: string) {
        this.selectedFilters.get(key)?.add(value);
    }

    @action
    removeFilter(key: string, value: string) {
        this.selectedFilters.get(key)?.delete(value);
    }

    @action
    setSearchQuery(searchQuery: string) {
        this.searchQuery = searchQuery;
    }

    @action
    setLoadingState(state: boolean) {
        this.isLoading = state;
    }

    @action
    setIsCertificationListLoaded(state: boolean) {
        this.isCertificationListLoaded = state;
    }

    @action
    clearFilters() {
        this.selectedFilters = this.getEmptyFilterSet();
    }

    @action
    async fetchAggregations() {
        await Promise.all([this.fetchSubjectAreas(), this.fetchIssuers()]);
        this.isAggregationsListLoaded = true;
    }

    @action
    _setSubjectAreas(subjectAreas: SubjectAreasQuery['badgeCertificationSubjectAreas']) {
        this.subjectAreas = subjectAreas;
    }

    @action
    _setIssuers(issuers: BadgeClassIssuerFiltersQuery['badgeClassIssuers']) {
        this.issuers = issuers;
    }

    @computed
    get allAggregations() {
        const aggregations = [];
        const {issuerFilterLabel, subjectAreaFilterLabel} = DISCOVERY_PAGE_MESSAGES;

        if (this.issuers) {
            aggregations.push({
                title: issuerFilterLabel,
                key: ISSUER_FILTER_KEY,
                id: ISSUER_FILTER_KEY,
                options: this.issuerFilterOptions,
            });
        }

        if (this.subjectAreas) {
            aggregations.push({
                title: subjectAreaFilterLabel,
                key: SUBJECT_AREA_FILTER_KEY,
                id: SUBJECT_AREA_FILTER_KEY,
                options: this.subjectAreaOptions,
            });
        }
        return aggregations;
    }

    @computed
    get issuerFilterOptions() {
        return (
            this.issuers?.map((issuer) => {
                return {
                    title: issuer.name,
                    key: ISSUER_FILTER_KEY,
                    value: issuer.id,
                    count: 0,
                };
            }) ?? []
        );
    }

    @computed
    get subjectAreaOptions() {
        const allowedSubjectAreaOptions = this.subjectAreas
            ?.filter((subject) => {
                return ALLOWED_SUBJECT_AREAS.some(
                    (allowedSubject) => allowedSubject.id === subject.id,
                );
            })
            .sort((a, b) => (a.name < b.name ? -1 : 1));

        return (
            allowedSubjectAreaOptions?.map((subjectArea) => {
                return {
                    title: subjectArea.name,
                    key: SUBJECT_AREA_FILTER_KEY,
                    value: subjectArea.id,
                    count: 0,
                };
            }) ?? []
        );
    }

    @computed
    get selectedFiltersSize() {
        let total = 0;
        this.selectedFilters.forEach((val) => {
            total += val.size;
        });
        return total;
    }

    @computed
    get loadedCertificationCount() {
        return this.certificationsList?.length;
    }

    @computed
    get enrolledCourses() {
        return this.badgeClassEnrollments
            .filter((enrollment) => {
                return enrollment.learningProduct.__typename === 'Course';
            })
            .map((enrollment) => {
                return new CourseModel({
                    completionPercentage: enrollment.completionPercentage,
                    ...enrollment.learningProduct,
                });
            });
    }

    @computed
    get enrolledLearningPaths() {
        return this.badgeClassEnrollments
            .filter((enrollment) => {
                return enrollment.learningProduct.__typename === 'ProLearningPath';
            })
            .map((enrollment) => {
                return new ProLearningPathModel({
                    is_pro_path: true,
                    owner: {id: ''},
                    show_only_item_count: true,
                    ...enrollment.learningProduct,
                });
            });
    }

    @action
    async fetchBadgeClassEnrollments(badgeId: string) {
        const response = await useBadgeClassEnrollmentsByBadgeClassIdQuery.fetcher({
            badgeClassId: badgeId,
        })();
        const enrollments = response?.badgeClassEnrollmentsByBadgeClassId;

        runInAction(() => {
            this.setBadgeClassEnrollments(enrollments);
            this.isBadgeClassEnrollmentsLoaded = true;
        });
    }

    @action
    setBadgeClassEnrollments(
        badgeClassEnrollments: BadgeClassEnrollmentsByBadgeClassIdQuery['badgeClassEnrollmentsByBadgeClassId'],
    ) {
        this.badgeClassEnrollments = badgeClassEnrollments;
    }

    async fetchSubjectAreas() {
        const response = await useSubjectAreasQuery.fetcher()();
        this._setSubjectAreas(response?.badgeCertificationSubjectAreas);
    }

    async fetchIssuers() {
        const response = await useBadgeClassIssuerFiltersQuery.fetcher()();
        this._setIssuers(response?.badgeClassIssuers);
    }

    async fetchCertifications(
        query = '',
        issuerIds: string[] = [],
        certificationAreaIds: string[] = [],
        page?: number,
    ) {
        const size = DEFAULT_API_PAGE_SIZE;
        const response = await useSearchBadgeClassesQuery.fetcher({
            query,
            issuerIds,
            certificationAreaIds,
            page,
            size,
        })();
        this.setCurrentPage(response.searchBadgeClasses?.page);
        this.setPageCount(response.searchBadgeClasses?.pageCount);
        this.setCertificationListFromResponse(response.searchBadgeClasses?.items);
    }

    async performSearch(page = 0) {
        this.setLoadingState(true);
        sendCertificateSearchEvent(
            this.searchQuery,
            Array.from(this.selectedIssuers.values()),
            Array.from(this.selectedSubjectAreas.values()),
        );
        try {
            await this.fetchCertifications(
                this.searchQuery,
                Array.from(this.selectedIssuers.values()),
                Array.from(this.selectedSubjectAreas.values()),
                page,
            );
            this.setIsCertificationListLoaded(true);
        } finally {
            this.setLoadingState(false);
        }
    }

    async callEnrolledCertifications() {
        const resp = await useActiveBadgeClassesQuery.fetcher()();
        return resp?.activeBadgeClasses ?? [];
    }

    async fetchPreparationCertifications() {
        const badgeClasses = await this.callEnrolledCertifications();
        this.setPreparationCertificationsList(badgeClasses);
        this.setIsPreparationCertsLoaded(true);
        this.setPreparationCertificationCount(badgeClasses.length);
    }

    getEmptyFilterSet = () => {
        return new Map<string, Set<string>>([
            [ISSUER_FILTER_KEY, new Set<string>()],
            [SUBJECT_AREA_FILTER_KEY, new Set<string>()],
        ]);
    };
}
