import {LABS_MODULAR_URL_PATTERN} from 'labs/constants';
import udLink from 'utils/ud-link';

import LearningPathItemContent from './learning-path-item-content.mobx-model';

export default class LearningPathLab extends LearningPathItemContent {
    get apiDataMap() {
        return {
            ...super.apiDataMap,
            title: 'title',
            description: 'description',
        };
    }

    get url() {
        return `${window.location.origin}${LABS_MODULAR_URL_PATTERN}${this.id}/`;
    }

    get image() {
        return udLink.toStorageStaticAsset('labs/card-icon.png');
    }

    get imageMobile() {
        return udLink.toStorageStaticAsset('labs/card-icon-mobile.png');
    }

    get copyLinkUrl() {
        return this.url;
    }
}
