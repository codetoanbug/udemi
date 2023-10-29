export default class SingleCourseUnitStore {
    constructor(unit) {
        this.title = unit.title;
        this.courses = unit.items;
    }
}
