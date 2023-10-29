import {computed} from 'mobx';

import CurriculumSection from '../../curriculum/curriculum-section.mobx-model';

export default class SearchResultSection {
    constructor(section, matchingItems = []) {
        this.section = section;
        this.matchingItems = matchingItems;
    }

    addSearchResultItem(searchResultItem) {
        this.matchingItems.push(searchResultItem);
    }

    @computed
    get matchingCurriculumItems() {
        return this.matchingItems.map((searchResult) => searchResult.curriculumItem);
    }

    @computed
    get timeEstimation() {
        return CurriculumSection.calculateEstimatedTime(this.matchingCurriculumItems);
    }
}
