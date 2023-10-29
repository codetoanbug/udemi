import {action} from 'mobx';

import {assessmentTypes} from '../constants';
import AssessmentFormModel from './assessment-form.mobx-model';
import {parseFITBAssessmentAsTemplate} from './parsers';

export default class FITBAssessmentFormModel extends AssessmentFormModel {
    get type() {
        return assessmentTypes.fitb;
    }

    @action
    reset(assessment) {
        super.reset(assessment);
        if (assessment) {
            this.data.question = parseFITBAssessmentAsTemplate(
                assessment.question,
                assessment.correctResponse,
            );
        }
    }

    @action
    validate(question, correctResponse) {
        this.error = {};
        if (!question) {
            this.error = {detail: gettext('No question is provided')};
        } else if (!correctResponse || correctResponse.length === 0) {
            this.error = {detail: gettext('No answers are provided')};
        }
    }
}
