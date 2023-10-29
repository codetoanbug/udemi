import {APIModel} from 'utils/mobx';

export default class PracticeQuestionModel extends APIModel {
    get apiDataMap() {
        return {
            id: 'id',
            body: 'body',
            answer: 'answer',
        };
    }
}
