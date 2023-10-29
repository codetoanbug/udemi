import {APIModel} from 'utils/mobx';

export default class Instructor extends APIModel {
    get apiDataMap() {
        return {
            id: 'id',
            title: 'title',
            url: 'url',
        };
    }
}
