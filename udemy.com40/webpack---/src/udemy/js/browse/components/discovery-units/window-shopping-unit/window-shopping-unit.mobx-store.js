import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

export default class WindowShoppingUnitStore {
    constructor(unit) {
        this.subUnits = observable([]);
        this.items = unit.items;
        if (unit && unit.available_filters && unit.available_filters.units) {
            this.setUnits(unit.available_filters.units);
        }
    }

    @autobind
    @action
    setUnits(skills) {
        skills.forEach((skill, i) => {
            if (i === 0) {
                this.subUnits.push({...skill, items: this.items});
            } else {
                this.subUnits.push({...skill, items: []});
            }
        });
    }
}
