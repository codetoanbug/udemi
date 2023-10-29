import autobind from 'autobind-decorator';
import {action} from 'mobx';

import udApi from 'utils/ud-api';

import {QUIZ_TYPES} from './constants';
import CurriculumItem from './curriculum-item.mobx-model';

export default class Quiz extends CurriculumItem {
    get apiDataMap() {
        return {
            ...super.apiDataMap,
            quizType: 'type',
            description: 'description',
            numAssessments: 'num_assessments',
            version: 'version',

            // These fields only matter for practice tests. Expect the API data to
            // be undefined for the other quiz types.
            durationHours: {
                source: 'duration',
                map: (duration) => {
                    return Math.floor(duration / 3600);
                },
            },
            durationMinutes: {
                source: 'duration',
                map: (duration) => {
                    return Math.floor(duration / 60) % 60;
                },
            },
            isDraft: 'is_draft',
            passPercent: 'pass_percent',
            changelog: 'changelog',
        };
    }

    get titleIndex() {
        if (!this.isPublished) {
            return this.unpublishedTitle;
        }

        if (this.quizType === QUIZ_TYPES.CODING_EXERCISE) {
            return interpolate(
                gettext('Coding Exercise %(index)s:'),
                {index: this.objectIndex},
                true,
            );
        } else if (this.quizType === QUIZ_TYPES.PRACTICE_TEST) {
            return interpolate(
                gettext('Practice Test %(index)s:'),
                {index: this.objectIndex},
                true,
            );
        }
        return interpolate(gettext('Quiz %(index)s:'), {index: this.objectIndex}, true);
    }

    get unpublishedTitle() {
        if (this.quizType === QUIZ_TYPES.CODING_EXERCISE) {
            return gettext('Unpublished Coding Exercise:');
        } else if (this.quizType === QUIZ_TYPES.PRACTICE_TEST) {
            return gettext('Unpublished Practice Test:');
        }
        return gettext('Unpublished Quiz:');
    }

    get canBeCompleted() {
        return super.canBeCompleted && this.quizType !== QUIZ_TYPES.PRACTICE_TEST;
    }

    @autobind
    @action
    markAsComplete() {
        if (this.isCompleted) {
            return Promise.resolve();
        }

        this.isLoading = true;
        this.setComplete();

        const url = `/users/me/subscribed-courses/${this.courseId}/quizzes/${this.id}/user-attempted-quizzes/`;
        const data = {marked_completed: true};
        return udApi
            .post(url, data)
            .catch(this.setIncomplete)
            .finally(
                action(() => {
                    this.isLoading = false;
                }),
            );
    }

    get markIncompleteUrl() {
        return `/users/me/subscribed-courses/${this.courseId}/completed-quizzes/${this.id}/`;
    }
}
