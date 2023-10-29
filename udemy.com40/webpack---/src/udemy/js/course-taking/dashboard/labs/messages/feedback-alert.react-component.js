import FlagIcon from '@udemy/icons/dist/flag.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {LAB_CLICK_TRACKING_ACTIONS} from 'labs/constants';
import {LAB_SURVEY_CODES} from 'labs/lab-survey/constants';
import {LabReportIssueModal} from 'labs/lab-survey/lab-report-issue-modal.react-component';
import {sendLabClickEvent} from 'labs/utils';

import LabsStore from '../labs.mobx-store';

import './messages.less';

@observer
export default class FeedbackAlert extends React.Component {
    static propTypes = {
        labsStore: PropTypes.instanceOf(LabsStore).isRequired,
        currentCurriculumItemType: PropTypes.string,
        currentCurriculumItemId: PropTypes.number,
    };

    static defaultProps = {
        currentCurriculumItemType: null,
        currentCurriculumItemId: null,
    };

    @observable showSurveyModal = false;
    @observable surveyName = LAB_SURVEY_CODES.WORKSPACE_FEEDBACK_V2;

    @autobind
    @action
    dismissSurveyModal() {
        this.showSurveyModal = false;
    }

    @autobind
    @action
    reportIssueClick() {
        this.showSurveyModal = true;
        sendLabClickEvent(
            this.props.labsStore.labs[0],
            LAB_CLICK_TRACKING_ACTIONS.MODULAR_LAB_REPORT_TASK_ISSUE_CLICK,
        );
    }

    @autobind
    @action
    setSurveyName(name) {
        this.surveyName = name;
    }

    render() {
        return (
            <div data-purpose="labs-feedback">
                <h3 className="ud-heading-md">
                    {gettext('Having a problem with the Udemy workspace?')}
                </h3>
                <Button
                    onClick={this.reportIssueClick}
                    udStyle="secondary"
                    styleName="feedback-link"
                    size="medium"
                    data-purpose="feedback"
                >
                    <FlagIcon label={false} size="small" />
                    {gettext('Report issue')}
                </Button>
                <LabReportIssueModal
                    surveyNames={[LAB_SURVEY_CODES.WORKSPACE_FEEDBACK_V2]}
                    onSurveySelected={this.setSurveyName}
                    isOpen={this.showSurveyModal}
                    onClose={this.dismissSurveyModal}
                    selectedSurvey={this.surveyName}
                    lab={this.props.labsStore.labs[0]}
                    currentCurriculumItemType={this.props.currentCurriculumItemType}
                    currentCurriculumItemId={this.props.currentCurriculumItemId}
                />
            </div>
        );
    }
}
