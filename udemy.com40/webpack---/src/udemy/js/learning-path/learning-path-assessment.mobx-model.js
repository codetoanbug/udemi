import {observable} from 'mobx';

import {APIModel} from 'utils/mobx';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';

import {ASSESSMENT_COLLECTION_BASE_PATH} from './learning-path-page/constants';

export default class LearningPathAssessment extends APIModel {
    @observable id;
    @observable title;
    @observable slug;
    @observable duration;
    @observable isBeta;

    get apiDataMap() {
        return {
            id: 'id',
            title: 'title',
            url: {
                source: 'slug',
                map: (slug) => {
                    return udLink.makeAbsolute(`${ASSESSMENT_COLLECTION_BASE_PATH}${slug}/`);
                },
                defaultValue: (apiData) => apiData?.url,
            },
            duration: 'duration',
            isBeta: 'is_beta',
            description: 'description',
        };
    }

    get copyLinkUrl() {
        return this.url;
    }

    get isStudent() {
        return udMe.organization.isStudent;
    }
}
