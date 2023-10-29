import {observable} from 'mobx';

import {APIModel} from 'utils/mobx';

export class TopicModel extends APIModel {
    @observable declare id: number;
    @observable declare defaultName: string;
    @observable declare isProposedTopic: boolean;

    get apiDataMap() {
        return {
            id: 'id',
            defaultName: {
                source: 'default_name',
            },
            isProposedTopic: {
                source: 'is_proposed_topic',
                defaultValue: false,
            },
        };
    }
}
