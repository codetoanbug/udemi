import {ClientEvent} from '@udemy/event-tracking';

import {LAB_MODE} from 'labs/constants';
import {REPORT_ISSUE_ITEMS} from 'labs/lab-survey/constants';

type Keys = keyof typeof LAB_MODE;

type LabMode = typeof LAB_MODE[Keys];

type ReportKeys = keyof typeof REPORT_ISSUE_ITEMS;

type IssueType = typeof REPORT_ISSUE_ITEMS[ReportKeys];

/**
 * Fired when user submits a report issue
 */
export class LabReportIssueEvent extends ClientEvent {
    labId: number;
    labVertical: string;
    labType: string;
    labMode?: LabMode;
    labTaskId?: number;
    issueType: IssueType;
    reportIssueId: string;
    withFile: boolean;

    constructor({
        labId,
        labVertical,
        labType,
        labMode,
        labTaskId,
        issueType,
        reportIssueId,
        withFile,
    }: {
        labId: number;
        labVertical: string;
        labType: string;
        labMode: LabMode;
        labTaskId: number;
        issueType: IssueType;
        reportIssueId: string;
        withFile: boolean;
    }) {
        super('LabReportIssueEvent');
        this.labId = labId;
        this.labVertical = labVertical;
        this.labType = labType;
        this.labMode = labMode;
        this.labTaskId = labTaskId;
        this.issueType = issueType;
        this.reportIssueId = reportIssueId;
        this.withFile = withFile;
    }
}
