import {action, computed, observable} from 'mobx';

import {ASSET_TYPE} from '../../asset/constants';
import CurriculumItem from './curriculum-item.mobx-model';

export default class CurriculumSection extends CurriculumItem {
    @observable items = [];
    @observable isRecommendationAssessmentTopic = false;
    @observable recommendationAssessmentTitle;

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            chapterGtAssignmentIds: {
                source: 'gt_assignments',
                map: (gtAssignments) => {
                    return gtAssignments.map((gtAssignment) => gtAssignment.gt_instance.id);
                },
                defaultValue: [],
            },
        };
    }

    @action
    addItem(item) {
        this.items.push(item);
    }

    @computed
    get isSelected() {
        // Used if curriculum section needs some UI checkbox selection if all items are selected
        return this.items.every((item) => item.isSelected);
    }

    get legend() {
        const text = this.isPublished
            ? gettext('Section %(index)s: ')
            : gettext('Unpublished Section  %(index)s: ');

        // for the case when instructor adds the first lecture outside of a section.
        if (this.objectIndex === undefined) {
            return interpolate(text, {index: 0}, true);
        }

        return interpolate(text, {index: this.objectIndex}, true);
    }

    @computed
    get publishedItems() {
        return CurriculumSection.filterPublishedItems(this.items);
    }

    @computed
    get numPublishedItems() {
        return this.items.filter((item) => item.isPublished).length;
    }

    @computed
    get numCompletedItems() {
        return this.items.filter((item) => item.isCompleted && item.isPublished).length;
    }

    get timeEstimation() {
        return CurriculumSection.calculateEstimatedTime(this.items);
    }

    static filterPublishedItems(items) {
        return items.filter((item) => item.isPublished);
    }

    static calculateEstimatedTime(items) {
        return items.reduce((acc, item) => {
            if (item.asset) {
                acc += item.asset.timeEstimation;
            }
            return acc;
        }, 0);
    }

    @action
    setIsSelected(value) {
        this.items.forEach((item) => {
            item.setIsSelected(value);
        });
    }

    @action
    setIsRecommendationAssessmentTopic(value) {
        this.isRecommendationAssessmentTopic = value;
    }

    @action
    setRecommendationAssessmentTitle(value) {
        this.recommendationAssessmentTitle = value;
    }

    @computed
    get isRecommendationChapterSectionCompleted() {
        if (!this.isRecommendationAssessmentTopic) {
            return false;
        }
        return !this.items.some((item) => {
            return !item.isCompleted;
        });
    }

    @computed
    get areVideoAndAudioLecturesInSectionCompleted() {
        /* Checks if user finished all the video and audio Lectures in a given Chapter.
        i.e. Suppose a chapter has 2 video lectures, 1 article lecture, and a quiz.
        If the user finishes the 2 video lectures, this function will return true.
        */
        return !this.items
            .filter(
                (item) =>
                    item.type === 'lecture' &&
                    item.asset &&
                    (item.asset.type === ASSET_TYPE.VIDEO || item.asset.type === ASSET_TYPE.AUDIO),
            )
            .some((item) => {
                return !item.isCompleted;
            });
    }
}
