export default class RecentlyLoadedCoursesStore {
    constructor({maxSize = 12, units = []} = {}) {
        this.maxSize = maxSize;
        this.recentCourseIds = [];
        if (units.length) {
            this.addUnits(units);
        }
    }

    addCourses(courses) {
        this.filterItemsByType(courses, 'course').forEach(({id}) => this.recentCourseIds.push(id));
        this.trimList();
    }

    resetCourses() {
        this.recentCourseIds = [];
    }

    addUnits(units) {
        this.filterUnitsByType(units, 'course').forEach((unit) => {
            this.addCourses(unit.items);
        });
    }

    filterUnitsByType(units, type) {
        return units.filter((unit) => unit.item_type === type);
    }

    filterItemsByType(items, type) {
        return items.filter((item) => item._class === type);
    }

    trimList() {
        if (this.recentCourseIds.length > this.maxSize) {
            this.recentCourseIds.splice(0, this.recentCourseIds.length - this.maxSize);
        }
    }
}
