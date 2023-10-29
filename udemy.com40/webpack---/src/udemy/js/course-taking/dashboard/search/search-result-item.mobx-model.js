export default class SearchResultItem {
    constructor(curriculumItem, matchingResources = [], matchingCues = []) {
        this.curriculumItem = curriculumItem;
        this.matchingResources = matchingResources;
        this.matchingCues = matchingCues;
    }
}
