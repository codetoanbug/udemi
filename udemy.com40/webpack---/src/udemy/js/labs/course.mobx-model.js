import {observable} from 'mobx';

import {APIModel} from 'utils/mobx';

export default class Course extends APIModel {
    @observable id;
    /** @type {String} title */
    @observable title;

    get apiDataMap() {
        return {
            id: 'id',
            title: 'title',
        };
    }
}
