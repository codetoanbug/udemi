import {observable} from 'mobx';

import LearningPath from '../learning-path/learning-path.mobx-model';

export class ProLearningPathModel extends LearningPath {
    @observable declare id: number;
    @observable declare title: string;
    @observable declare description: string;
    @observable declare is_pro_path: boolean;
    @observable declare total_steps: string;
    @observable declare show_only_item_count: boolean;

    constructor(apiData: any) {
        super(apiData);
    }

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            id: 'id',
            title: 'learningPathTitle',
            description: 'description',
            total_steps: 'itemCount',
            is_pro_path: 'is_pro_path',
            show_only_item_count: 'show_only_item_count',
        };
    }
}
