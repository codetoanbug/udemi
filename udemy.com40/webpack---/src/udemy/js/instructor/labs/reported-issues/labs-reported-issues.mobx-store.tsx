import {action, computed, observable, IReactionDisposer, reaction} from 'mobx';

import {THREAD_DETAIL_PATH_REGEX} from 'instructor/common/constants';
import LabsStore from 'instructor/labs/labs.mobx-store';
import TwoPaneStore from 'instructor/layout/two-pane.mobx-store';
import {LABS_BASE_API_URL} from 'labs/apis';
import {LAB_STATUS, LAB_TYPE} from 'labs/constants';
import {LAB_SURVEY_CODES} from 'labs/lab-survey/constants';
import Lab from 'labs/lab.mobx-model';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import {API_SETTINGS, ISSUE_TYPES_ALL, SORT_LABELS} from '../constants';
import {
    LabAPIData,
    ReportAPIData,
    ReportDetailAPIData,
    SurveyAnswerOptionApiData,
    SurveyApiData,
} from '../types';

export class LabsReportedIssuesStore {
    @observable ordering: keyof typeof SORT_LABELS = '-created';
    @observable isLoading = true;
    @observable isLabsListLoading = true;
    @observable isSurveyLoading = true;
    @observable isDetailLoading = false;
    @observable reports: Array<ReportAPIData> = [];
    @observable selectedIssueType = ISSUE_TYPES_ALL;
    @observable filterUnread = false;
    @observable isReadStateSaving = false;

    @observable selectedReportDetail?: ReportDetailAPIData;
    @observable selectedReportId?: number;
    @observable selectedLabId?: number;

    @observable.ref ownedLabs: Lab[] = [];
    @observable.ref issueTypes: Record<string, string> = {};

    baseUrl: string;
    reactionDisposer: IReactionDisposer;
    twoPaneStore: TwoPaneStore;
    labsStore: LabsStore;

    constructor(baseUrl: string, twoPaneStore: TwoPaneStore, labsStore: LabsStore) {
        this.issueTypes = {[ISSUE_TYPES_ALL]: gettext('All issues')};
        this.twoPaneStore = twoPaneStore;
        this.baseUrl = baseUrl;
        this.labsStore = labsStore;

        this.reactionDisposer = reaction(
            () => [this.selectedLabId, this.selectedIssueType, this.ordering, this.filterUnread],
            () => this.loadReports(),
        );
    }

    @computed
    get selectedLab() {
        return this.ownedLabs.filter((lab) => lab.id === this.selectedLabId)[0];
    }

    @computed
    get labFilterTitle() {
        if (this.selectedLab) {
            return this.selectedLab.title;
        }
        if (this.selectedLabId) {
            return gettext('Lab not found');
        }
        return gettext('All labs');
    }

    @computed
    get reportsSearchParams() {
        return {
            ...API_SETTINGS.listParams,
            ordering: this.ordering,
            ...(this.selectedLabId && {lab_id: this.selectedLabId}),
            ...(this.selectedIssueType !== ISSUE_TYPES_ALL && {issue_type: this.selectedIssueType}),
            ...(this.filterUnread && {unread: true}),
        };
    }

    async loadIssueTypes() {
        try {
            const response = await udApi.get(`/surveys/${LAB_SURVEY_CODES.CONTENT_FEEDBACK}/`);
            const data = response.data as SurveyApiData;
            this.setIssueTypes(
                data.question_sets[0]?.questions.filter(
                    (question) => question.question_type === 'choice__dropdown',
                )[0]?.answer_options || [],
            );
        } catch (error) {
            Raven.captureException(error);
        } finally {
            this.setIsSurveyLoading(false);
        }
    }

    async loadOwnedLabs() {
        this.setIsLabsListLoading(true);
        const params = {
            'fields[lab]': 'id,title,status',
            status: LAB_STATUS.published,
            lab_type: LAB_TYPE.modular.key,
            is_owned: 1,
        };
        try {
            const response = await udApi.get(LABS_BASE_API_URL, {
                params,
            });
            this.setOwnedLabs(response.data.results);
        } catch (e) {
            Raven.captureException(e);
        } finally {
            this.setIsLabsListLoading(false);
        }
    }

    async loadReports() {
        this.setIsLoading(true);
        this.setSelectedReportId(undefined);
        this.setReportedIssue(undefined);
        try {
            const response = await udApi.get(API_SETTINGS.apiUrl, {
                params: this.reportsSearchParams,
            });
            this.setReports(response.data.results);

            // set the first report as open when there is no reportId in the URL
            if (!this.selectedReportId && this.reports.length > 0) {
                await this.selectReportDetails(response.data.results[0].id);
            }
        } catch (error) {
            Raven.captureException(error);
        } finally {
            this.setIsLoading(false);
        }
    }

    async selectReportDetails(reportId: number) {
        this.setSelectedReportId(reportId);
        this.setIsDetailLoading(true);

        try {
            const response = await udApi.get(API_SETTINGS.apiDetailUrl(reportId), {
                params: API_SETTINGS.detailParams,
            });
            this.setReportedIssue(response.data);
        } catch (error) {
            Raven.captureException(error);
        } finally {
            this.setIsDetailLoading(false);
        }
    }

    async setReportFromPathName(pathname: string) {
        if (!this.baseUrl) {
            return;
        }
        const localPath = pathname.slice(this.baseUrl.length + 1);
        const reportId = Number.parseInt(localPath, 10);

        if (reportId > 0) {
            await this.selectReportDetails(reportId);
        }

        if (this.twoPaneStore) {
            this.twoPaneStore.setShowLeftPane(!localPath.match(THREAD_DETAIL_PATH_REGEX));
        }
    }

    async updateIsReadAttr(report: ReportAPIData | ReportDetailAPIData, newValue: boolean) {
        if (report.is_read === newValue) {
            return;
        }

        try {
            await udApi.patch(API_SETTINGS.apiDetailUrl(report?.id), {
                is_read: newValue,
            });
            this.setReadAttrValue(report.id, newValue);
        } catch (error) {
            Raven.captureException(error);
        }
    }

    @computed
    get selectedReport() {
        return this.findReportById(this.selectedReportId);
    }

    findReportById(reportId?: number) {
        if (reportId) {
            return this.reports.find((report) => report.id == reportId);
        }
    }

    @action
    setFilterUnread(value: boolean) {
        this.filterUnread = value;
    }

    @action
    setReports(reports: Array<ReportAPIData>) {
        this.reports = reports;
    }

    @action
    setOwnedLabs(labs: Array<LabAPIData>) {
        this.ownedLabs = labs.map((lab) => new Lab(lab));
    }

    @action
    setIssueTypes(options: Array<SurveyAnswerOptionApiData>) {
        const issueTypes = options.reduce((acc: Record<string, string>, option) => {
            acc[option.text_code] = option.text;
            return acc;
        }, {});
        this.issueTypes = {...this.issueTypes, ...issueTypes};
    }

    @action
    setReportedIssue(report?: ReportDetailAPIData) {
        this.selectedReportDetail = report;
    }

    @action
    setSelectedReportId(reportId?: number) {
        this.selectedReportId = reportId;
    }

    @action
    setReadAttrValue(reportId: number, newValue: boolean) {
        const report = this.findReportById(reportId);
        if (report) {
            report.is_read = newValue;
        }
        // only updated value if the selectedReportId matches the report id that is marked as read/unread
        if (this.selectedReportDetail?.id === reportId && this.selectedReport) {
            this.selectedReportDetail.is_read = newValue; // it is used to update read/unread action menu
            this.selectedReport.is_read = newValue; // it is used to update unread-indicator in the UserCommunicationCard
        }
    }

    @action
    setIsLoading(value: boolean) {
        this.isLoading = value;
    }

    @action
    setIsLabsListLoading(value: boolean) {
        this.isLabsListLoading = value;
    }

    @action
    setIsDetailLoading(value: boolean) {
        this.isDetailLoading = value;
    }

    @action
    setIsSurveyLoading(value: boolean) {
        this.isSurveyLoading = value;
    }

    @action
    setSelectedLabId(value?: number) {
        this.selectedLabId = value;
    }

    @action
    setSelectedIssueType(value: string) {
        this.selectedIssueType = value;
    }

    @action
    setOrdering(value: keyof typeof SORT_LABELS) {
        this.ordering = value;
    }

    @action
    setIsReadStateSaving(value: boolean) {
        this.isReadStateSaving = value;
    }

    @computed
    get isFilteredSelected() {
        return this.selectedLabId ?? this.selectedIssueType !== ISSUE_TYPES_ALL;
    }

    @action
    async markAsRead(report: ReportDetailAPIData) {
        this.setIsReadStateSaving(true);

        try {
            // Do not decrease numUnreadReports if report is already read.
            !report.is_read &&
                this.labsStore.setUnreadReportedIssues(
                    Math.max(this.labsStore.numUnreadReports - 1, 0),
                );

            await this.updateIsReadAttr(report, true);
        } catch (error) {
            Raven.captureException(error);
        } finally {
            this.setIsReadStateSaving(false);
        }
    }

    @action
    async toggleRead(report: ReportAPIData | ReportDetailAPIData) {
        this.setIsReadStateSaving(true);

        try {
            const count = Math.max(
                report.is_read
                    ? this.labsStore.numUnreadReports + 1
                    : this.labsStore.numUnreadReports - 1,
                0,
            );

            this.labsStore.setUnreadReportedIssues(count);
            await this.updateIsReadAttr(report, !report?.is_read);
        } catch (error) {
            Raven.captureException(error);
        } finally {
            this.setIsReadStateSaving(false);
        }
    }
}
