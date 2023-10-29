import {APIModel} from 'utils/mobx';

export default class CoursePortionModel extends APIModel {
    get apiDataMap() {
        return {
            ...super.apiDataMap,
            id: 'id',
            numSelectedItems: 'num_selected_items',
            selectedItemsMap: {
                // Pre loaded map of selected items
                source: 'items',
                map: (items) => {
                    const res = {};
                    items.forEach((item) => {
                        res[item] = 1;
                    });
                    return res;
                },
            },
        };
    }
}
