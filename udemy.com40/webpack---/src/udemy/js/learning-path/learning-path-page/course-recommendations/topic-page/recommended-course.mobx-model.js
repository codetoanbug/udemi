import {observable, action} from 'mobx';

import {APIModel} from 'utils/mobx';

export default class RecommendedCourse extends APIModel {
    @observable isChecked = false;

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            id: 'id',
            title: 'title',
            url: 'url',
            image: 'image_125_H',
            imageMobile: 'image_75x75',
            rating: 'rating',
            numReviews: 'num_reviews',
        };
    }

    @action
    setIsChecked(value) {
        this.isChecked = value;
    }
}
