import {computed, extendObservable} from 'mobx';

export default class AssessmentModel {
    constructor(data) {
        extendObservable(this, data);
    }

    @computed
    get question() {
        return this.prompt.question || '';
    }

    /**
     * @returns an array containing the correct response to the question.
     * For assessmentTypes.fitb, the array contains each blank. If the question template is
     * '__foo__ __bar__', then it contains ['foo', 'bar'].
     * For assessmentTypes.multipleChoice and assessmentTypes.multipleSelect, the array contains
     * the letter corresponding to each correct answer option. If the multiple choice question is
     * 'One plus one equals?', and the answers are ['one', 'two', 'three'], then it contains ['b'].
     * If the multiple select question is 'One plus one does not equal?', with the same answers,
     * then it contains ['a', 'c'].
     */
    @computed
    get correctResponse() {
        return this.correct_response || [];
    }

    /**
     * @returns the related lecture id of the assessment as a string
     * @returns empty string if there is no related lecture
     * Although backend model supports multiple related lectures, frontend UI assumes there can
     * only be one related lecture.
     */
    @computed
    get relatedLectureId() {
        const lectureIds = this.prompt.relatedLectureIds || [];
        return lectureIds.length > 0 ? lectureIds[0].toString() : '';
    }

    /**
     * @returns the knowledge area of a multiple choice or multiple select assessment
     * Backend calls this "section", but given frontend displays "Knowledge Area", and section
     * can be confused with e.g. a curriculum item section, frontend calls this "knowledgeArea".
     * This is only relevant for practice tests.
     */
    @computed
    get knowledgeArea() {
        return this.section || '';
    }

    /**
     * @returns the array of answers for a multiple choice or multiple select assessment
     */
    @computed
    get answers() {
        return this.prompt.answers || [];
    }

    /**
     * @returns the array of feedbacks for a multiple choice or multiple select assessment
     * The length of this array should match the length of the `answers` array.
     * This is only relevant for simple quizzes.
     */
    @computed
    get feedbacks() {
        return this.prompt.feedbacks || [];
    }

    /**
     * @returns the explanation for a multiple choice or multiple select assessment
     * This is only relevant for practice tests.
     */
    @computed
    get explanation() {
        return this.prompt.explanation || '';
    }
}
