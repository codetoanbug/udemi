import {action, observable} from 'mobx';

import {
    NEW_QUESTION,
    NEW_QUESTION_RELATED_VIEW,
    SUPPORT_REQUEST,
    TRACKING_ACTIONS,
} from './constants';

export default class NewQuestionStore {
    @observable isRelatedFormOpen;
    @observable isSupportFormOpen;
    @observable nextForm;
    @observable supportLink;
    @observable supportLinkCategory;

    constructor(trackAction) {
        this.trackAction = trackAction;
        this.setNextForm('');
        this.showRelatedForm();
    }

    @action
    setNextForm(name) {
        this.nextForm = name;
        if (name) {
            this.trackAction(TRACKING_ACTIONS.CATEGORY_SELECT, undefined, {category: name});
        }
    }

    @action
    openNextForm() {
        if (this.nextForm === NEW_QUESTION) {
            this.trackAction(TRACKING_ACTIONS.COURSE_CONTENT);
            this.isRelatedFormOpen = false;
        } else if (this.nextForm === SUPPORT_REQUEST) {
            this.trackAction(TRACKING_ACTIONS.SOMETHING_ELSE);
            this.isSupportFormOpen = true;
        }
    }

    @action
    setValuesForSupportForm(category, supportLink) {
        this.supportLinkCategory = category;
        this.supportLink = supportLink;
    }

    @action
    showRelatedForm() {
        this.isRelatedFormOpen = true;
        this.isSupportFormOpen = false;
        this.supportLink = '';
    }

    @action
    trackSupportLink() {
        this.trackAction(`${NEW_QUESTION_RELATED_VIEW}.${this.supportLinkCategory}`);
    }
}
