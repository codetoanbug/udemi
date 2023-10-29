import autobind from 'autobind-decorator';
import {action, observable, set} from 'mobx';

export default class AssessmentFormModel {
    @observable data;
    @observable error;

    constructor() {
        this.reset();
    }

    get type() {
        throw new Error('Not implemented: AssessmentFormModel.type');
    }

    /**
     * @param assessment: an AssessmentModel instance.
     */
    @action
    reset(assessment) {
        set(this, {
            data: {
                assessment_type: this.type,
                question: '',
                correct_response: [],
                related_lecture: '',
            },
            error: {},
        });
        if (assessment) {
            set(this.data, {
                assessmentId: assessment.id,
                question: assessment.question,
                correct_response: assessment.correctResponse,
                related_lecture: assessment.relatedLectureId,
            });
        }
    }

    @autobind
    @action
    setField(fieldName, fieldValue) {
        this.data[fieldName] = fieldValue;
    }
}
