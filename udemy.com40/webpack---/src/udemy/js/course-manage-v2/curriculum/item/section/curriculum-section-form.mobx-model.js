import CurriculumItemFormModel from '../curriculum-item-form.mobx-model';

export default class CurriculumSectionFormModel extends CurriculumItemFormModel {
    _getInitialData(curriculumItem) {
        if (curriculumItem) {
            return {
                title: curriculumItem.title,
                description: curriculumItem.description,
            };
        }
        return {
            title: '',
            description: '',
        };
    }
}
