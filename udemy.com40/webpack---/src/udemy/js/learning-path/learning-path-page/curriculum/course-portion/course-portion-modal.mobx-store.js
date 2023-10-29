import autobind from 'autobind-decorator';
import {computed, observable} from 'mobx';

export default class CoursePortionModalStore {
    @observable isReadOnly = false;

    constructor(portion, isReadyOnly) {
        this.portion = portion;
        this.isReadOnly = isReadyOnly;
    }

    @computed
    get alertTitle() {
        if (this.isReadOnly) {
            return gettext(
                'This course was previously added to your path. See selected items below.',
            );
        }
        return gettext('Note: Courses are updated by instructors and content might change.');
    }

    @autobind
    loadContentCurriculum() {
        if (this.portion.isCurriculumLoading) {
            return false;
        }
        this.portion.loadCurriculum();
    }

    @autobind
    handleChange(e) {
        this.portion.setIsSelectAllChecked(e.target.checked);
    }
}
