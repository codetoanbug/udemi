import {quizTypes} from '../constants';
import CurriculumItemFormModel from '../curriculum-item-form.mobx-model';

export default class CurriculumQuizFormModel extends CurriculumItemFormModel {
    /**
     * @param type: one of the quizTypes in '../constants'.
     */
    constructor(type) {
        super();
        this.type = type;
    }

    _getInitialData(curriculumItem) {
        const data = {
            title: '',
            description: '',
            type: this.type,
        };
        if (curriculumItem) {
            Object.assign(data, {
                title: curriculumItem.title,
                description: curriculumItem.description,
            });
        }
        if (this.type === quizTypes.practiceTest) {
            if (curriculumItem) {
                Object.assign(data, {
                    duration: curriculumItem.duration,
                    pass_percent: curriculumItem.pass_percent,
                    is_randomized: curriculumItem.is_randomized,
                });
            } else {
                Object.assign(data, {
                    duration: null,
                    pass_percent: null,
                    is_randomized: false,
                });
            }
        }
        return data;
    }
}
