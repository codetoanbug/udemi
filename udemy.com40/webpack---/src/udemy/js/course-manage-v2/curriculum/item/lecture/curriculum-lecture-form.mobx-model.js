import CurriculumItemFormModel from '../curriculum-item-form.mobx-model';

export default class CurriculumLectureFormModel extends CurriculumItemFormModel {
    _getInitialData(curriculumItem) {
        if (curriculumItem) {
            return {
                title: curriculumItem.title,
            };
        }
        return {
            title: '',
        };
    }
}
