import {Modal} from '@udemy/react-dialog-components';
import {FormGroup, Select} from '@udemy/react-form-components';
import {AlertBannerProps, ToasterStore} from '@udemy/react-messaging-components';
import {AnyObject} from '@udemy/shared-utils/types';
import autobind from 'autobind-decorator';
import {createHash} from 'crypto';
import {action, computed} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {LAB_MODE} from 'labs/constants';
import LabTask from 'labs/lab-task.mobx-model';
import Lab from 'labs/lab.mobx-model';
import {sendLabReportIssueEvent} from 'labs/utils';
import SurveyStore from 'survey/survey.mobx-store';
import getRequestData from 'utils/get-request-data';

import {
    LAB_TECHNICAL_ISSUE_CODE,
    LAB_TECHNICAL_ISSUE_SUBJECTS,
    REPORT_ISSUE_ITEMS,
} from './constants';
import {LabFeedbackSurveyForm} from './lab-feedback-survey-form.react-component';
import {LabReportTechnicalIssueForm} from './lab-report-technical-issue-form.react-component';

import './lab-report-issue-modal.less';

interface LabReportIssueModalProps {
    surveyNames: string[];
    isOpen: boolean;
    onClose: () => void;
    selectedSurvey: string;
    onSurveySelected: (surveyName: string) => void;
    lab: Lab;
    currentTask?: LabTask;
    currentCurriculumItemType?: string;
    currentCurriculumItemId?: number;
    surveySource?: string;

    reportTechnicalIssueSource?: string;
}

@observer
export class LabReportIssueModal extends React.Component<LabReportIssueModalProps> {
    constructor(props: LabReportIssueModalProps) {
        super(props);
        this._initStores();
    }

    async componentDidMount() {
        await Promise.all(
            this.props.surveyNames.map((surveyName: string) => {
                return this.surveyStores[surveyName].getSurvey().then(() => {
                    this.surveyStores[surveyName].setUserAnswers({});
                    this.surveyStores[surveyName].setUserAnswerData(this.answerMetadata);
                });
            }),
        );
    }

    _locale() {
        return getRequestData().locale;
    }

    generateId() {
        const hash = createHash('sha256');
        hash.update(Math.random().toString());
        hash.update(Date.now().toString());
        return hash.digest('hex');
    }

    @computed
    get currentTaskNumber() {
        if (this.props.currentTask) {
            return (
                this.props.lab.tasks.findIndex((task) => task.id === this.props.currentTask?.id) + 1
            );
        }
    }

    @computed
    get answerMetadata() {
        const lab = this.props.lab;
        const data: AnyObject = {
            requestLocale: this._locale(),
        };
        if (lab.currentMode) {
            data.labMode = lab.currentMode;
        }
        if (this.props.currentTask) {
            data.labTask = this.props.currentTask.id;
        }
        if (this.props.currentCurriculumItemId) {
            data.currentCurriculumItemType = this.props.currentCurriculumItemType;
            data.currentCurriculumItemId = this.props.currentCurriculumItemId;
        }
        if (this.props.surveySource) {
            data.surveySource = this.props.surveySource;
        }
        return data;
    }

    @computed
    get isTechnicalFormSelected() {
        return (
            !!this.props.reportTechnicalIssueSource &&
            this.props.selectedSurvey === LAB_TECHNICAL_ISSUE_CODE
        );
    }

    @computed
    get headline() {
        if (this.isTechnicalFormSelected) {
            return gettext('Report issue');
        }
        return this.surveyStores[this.props.selectedSurvey].headline;
    }

    _initStores() {
        this.props.surveyNames.forEach((surveyName: string) => {
            this.surveyStores[surveyName] = new SurveyStore(
                surveyName,
                undefined,
                null,
                'lab',
                this.props.lab.id,
                false,
                true,
            );
        });
    }

    surveyStores: Record<string, SurveyStore> = {};

    @computed
    get allSurveysLoaded() {
        return this.props.surveyNames.every((surveyName: string) => {
            return this.surveyStores[surveyName].isLoaded;
        });
    }

    @computed
    get technicalIssueSubjects() {
        const {reportTechnicalIssueSource, lab} = this.props;
        const options =
            LAB_TECHNICAL_ISSUE_SUBJECTS[
                reportTechnicalIssueSource as keyof typeof LAB_TECHNICAL_ISSUE_SUBJECTS
            ].options;
        if (lab.hasAutomatedReviewTests && lab.currentMode === LAB_MODE.STRUCTURED) {
            return options.concat(
                LAB_TECHNICAL_ISSUE_SUBJECTS[
                    reportTechnicalIssueSource as keyof typeof LAB_TECHNICAL_ISSUE_SUBJECTS
                ].alrOptions,
            );
        }
        return options;
    }

    sendTracking(reportType: string, reportIssueId: string, withFile = false) {
        const {lab, currentTask} = this.props;

        sendLabReportIssueEvent(
            lab.id,
            lab.vertical,
            lab.labType,
            lab.currentMode,
            currentTask?.id,
            reportType,
            reportIssueId,
            withFile,
        );
    }

    @autobind
    onSurveySelected(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.onSurveySelected(event.target.value);
    }

    @autobind
    reset() {
        return this.props.surveyNames.forEach((surveyName: string) => {
            return this.surveyStores[surveyName].setUserAnswers({});
        });
    }

    @autobind
    onTechnicalReportSuccessfulSubmit(ticket: {ticket_id: number}, withFile: boolean) {
        this.onSuccessSurveySubmitted();

        this.sendTracking(
            REPORT_ISSUE_ITEMS[LAB_TECHNICAL_ISSUE_CODE].type,
            ticket.ticket_id.toString(),
            withFile,
        );
    }

    @autobind
    onSuccessSurveySubmitted() {
        this.props.onClose();
        this.showSuccessNotification();
    }

    @autobind
    @action
    async onSurveySubmitted() {
        const {selectedSurvey} = this.props;
        const answerMetadata = this.answerMetadata;
        // to help identify the answers from dropdown + freefrom and link them to a question
        answerMetadata.answerAttemptId = this.generateId();

        try {
            this.surveyStores[selectedSurvey].setUserAnswerData(this.answerMetadata);
            await this.surveyStores[selectedSurvey].saveUserAnswers();
            this.onSuccessSurveySubmitted();

            this.sendTracking(
                REPORT_ISSUE_ITEMS[selectedSurvey as keyof typeof REPORT_ISSUE_ITEMS].type,
                answerMetadata.answerAttemptId as string,
            );
        } catch (e) {
            this.showErrorNotification();
        }
    }

    showSuccessNotification() {
        const bannerProps = {
            udStyle: 'success',
            title: gettext('Your issue has been successfully reported'),
            showCta: false,
        } as AlertBannerProps;
        ToasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
    }

    showErrorNotification() {
        const bannerProps = {
            udStyle: 'error',
            title: gettext('There was an error reporting your issue'),
            showCta: false,
        } as AlertBannerProps;
        ToasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
    }

    renderOptions() {
        const technicalIssueOption = REPORT_ISSUE_ITEMS[LAB_TECHNICAL_ISSUE_CODE];
        return (
            <FormGroup label={gettext('I want to...')} data-purpose="report-issue-options">
                <Select value={this.props.selectedSurvey} onChange={this.onSurveySelected}>
                    {!!this.props.reportTechnicalIssueSource && (
                        <option
                            value={technicalIssueOption.labSurveyCode}
                            key={`option-${technicalIssueOption.type}`}
                        >
                            {technicalIssueOption.text}
                        </option>
                    )}
                    {this.props.surveyNames.map((surveyName) => {
                        const item =
                            REPORT_ISSUE_ITEMS[surveyName as keyof typeof REPORT_ISSUE_ITEMS];
                        return (
                            <option value={item.labSurveyCode} key={`option-${item.type}`}>
                                {item.text}
                            </option>
                        );
                    })}
                </Select>
            </FormGroup>
        );
    }

    render() {
        const {isOpen, lab, onClose, surveyNames, selectedSurvey} = this.props;

        return (
            <Modal
                title={this.headline}
                loading={!this.allSurveysLoaded}
                isOpen={isOpen}
                onOpen={this.reset}
                onClose={onClose}
                styleName="survey-modal"
            >
                {surveyNames.length > 1 && this.renderOptions()}
                {this.isTechnicalFormSelected ? (
                    <LabReportTechnicalIssueForm
                        labId={lab.id}
                        onCancel={() => onClose()}
                        subjects={this.technicalIssueSubjects}
                        onSuccess={this.onTechnicalReportSuccessfulSubmit}
                        onError={this.showErrorNotification}
                        currentMode={lab.currentMode}
                        taskNumber={this.currentTaskNumber}
                    />
                ) : (
                    this.props.surveyNames.map((surveyName: string) => {
                        return (
                            surveyName === selectedSurvey && (
                                <LabFeedbackSurveyForm
                                    key={`lab-feedback-survey-form-${surveyName}`}
                                    surveyStore={this.surveyStores[surveyName]}
                                    selectedSurvey={selectedSurvey}
                                    onCancel={() => onClose()}
                                    onSurveySubmitted={this.onSurveySubmitted}
                                />
                            )
                        );
                    })
                )}
            </Modal>
        );
    }
}
