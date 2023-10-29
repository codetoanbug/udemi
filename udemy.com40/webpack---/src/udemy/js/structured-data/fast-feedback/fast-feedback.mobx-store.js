import {Tracker} from '@udemy/event-tracking';
import {action, computed, extendObservable, observable} from 'mobx';

import {ITEM_TYPES} from 'course-taking/curriculum/constants';
import getRequestData from 'utils/get-request-data';
import udGraphql from 'utils/ud-graphql';
import Raven from 'utils/ud-raven';

import {
    FastFeedbackState,
    STORE_FEEDBACK_MUTATION,
    THUMB_DOWN_VALUE,
    THUMB_UP_VALUE,
} from './constants';
import {
    ACTION_ENTERED,
    ACTION_SEEN,
    ACTION_SELECTED,
    ACTION_SENT,
    ACTION_TYPED,
    FastFeedbackActionEvent,
} from './events';

export default class FastFeedbackStore {
    @observable feedback = null;
    @observable textFeedback = '';
    @observable state = FastFeedbackState.INITIAL;
    @observable hasMouseEntered = false;
    @observable hasTyped = false;
    @observable hasSkipped = false;

    constructor(experiment, courseTakingStore) {
        extendObservable(this, experiment);
        this.courseTakingStore = courseTakingStore;
    }

    @computed
    get fastFeedbackVariant() {
        return this.fast_feedback_course_taking_variant;
    }

    @computed
    get isAfterLecture() {
        return this.userLocale !== 'en-US' && this.fastFeedbackVariant === 'after_lecture';
    }

    @computed
    get isAfterSection() {
        return this.userLocale === 'en-US' || this.fastFeedbackVariant === 'after_section';
    }

    @computed
    get userLocale() {
        const udRequest = getRequestData();
        return udRequest.locale ? udRequest.locale.replace('_', '-') : '';
    }

    @computed
    get isDisplayed() {
        if (this.hasSkipped === true) {
            return false;
        }
        const {currentCurriculumSection, numCompletedItems} = this.courseTakingStore;

        if (numCompletedItems >= 2) {
            if (this.isAfterLecture) {
                return true;
            }
            if (this.isAfterSection) {
                return currentCurriculumSection.areVideoAndAudioLecturesInSectionCompleted;
            }
        }
        return false;
    }

    @computed
    get isInitial() {
        return this.state === FastFeedbackState.INITIAL;
    }

    @computed
    get isTextEntry() {
        return this.state === FastFeedbackState.TEXT_ENTRY;
    }

    @computed
    get isResult() {
        return this.state === FastFeedbackState.RESULT;
    }

    @computed
    get targetType() {
        if (this.isAfterLecture) {
            return 'lecture';
        } else if (this.isAfterSection) {
            return 'chapter';
        }
        return null;
    }

    @computed
    get targetId() {
        if (this.isAfterLecture) {
            return this.courseTakingStore.currentCurriculumItem.id;
        } else if (this.isAfterSection) {
            return this.courseTakingStore.currentCurriculumSection.id;
        }
        return null;
    }

    @computed
    get placeholderText() {
        if (this.feedback === THUMB_UP_VALUE) {
            return gettext('What went well?');
        } else if (this.feedback === THUMB_DOWN_VALUE) {
            return gettext('What could have gone better?');
        }
        return null;
    }

    @action
    setTextFeedback(textFeedback) {
        this.textFeedback = textFeedback;
    }

    @action
    thumbUp() {
        this.feedback = THUMB_UP_VALUE;
        this.state = FastFeedbackState.TEXT_ENTRY;
        this.sendStoreFeedbackMutation();
    }

    @action
    thumbDown() {
        this.feedback = THUMB_DOWN_VALUE;
        this.state = FastFeedbackState.TEXT_ENTRY;
        this.sendStoreFeedbackMutation();
    }

    @action
    sendFeedback() {
        if (this.textFeedback !== '') {
            this.sendStoreFeedbackMutation();
        }
        this.state = FastFeedbackState.RESULT;
    }

    @action
    skip() {
        this.hasSkipped = true;
    }

    async sendStoreFeedbackMutation() {
        try {
            await udGraphql.query({
                query: STORE_FEEDBACK_MUTATION,
                variables: {
                    answerText: this.textFeedback,
                    answerOption: this.feedback,
                    targetType: this.targetType,
                    targetId: this.targetId,
                },
            });
        } catch (e) {
            Raven.captureException(e);
        }
    }

    _track(action) {
        const {currentCurriculumItem, currentCurriculumSection, course} = this.courseTakingStore;

        const contextTitles = {
            courseTitle: course.title,
            lectureTitle:
                currentCurriculumItem?.type === ITEM_TYPES.LECTURE
                    ? currentCurriculumItem.title
                    : null,
            sectionTitle: currentCurriculumSection.title,
        };

        const context = {
            action,
            selection: this.feedback,
            hasText: this.textFeedback.length > 0,
            entityType: this.targetType,
            entityId: this.targetId,
            ...contextTitles,
        };
        Tracker.publishEvent(new FastFeedbackActionEvent(context));
    }

    @action
    trackSeen() {
        this._track(ACTION_SEEN);
    }

    @action
    trackMouseEnter() {
        if (!this.hasMouseEntered) {
            this._track(ACTION_ENTERED);
        }
        this.hasMouseEntered = true;
    }

    @action
    trackSelected() {
        this._track(ACTION_SELECTED);
    }

    @action
    trackTyped() {
        if (!this.hasTyped) {
            this._track(ACTION_TYPED);
        }
        this.hasTyped = true;
    }

    @action
    trackSent() {
        this._track(ACTION_SENT);
    }
}
