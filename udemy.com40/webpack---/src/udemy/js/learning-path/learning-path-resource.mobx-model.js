import {observable} from 'mobx';

import {APIModel} from 'utils/mobx';

export default class LearningPathResource extends APIModel {
    @observable image = '';

    get apiDataMap() {
        return {
            id: 'id',
            title: 'title',
            url: 'url',
            image: 'image',
        };
    }

    get copyLinkUrl() {
        return this.url;
    }
}
