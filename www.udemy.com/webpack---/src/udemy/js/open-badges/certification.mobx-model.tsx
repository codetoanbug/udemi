import {observable} from 'mobx';

import {APIModel} from 'utils/mobx';

import {AssertionModel} from './upload-badge/assertion.mobx-model';

interface IdInterface {
    id: string;
}
type Criteria = IdInterface;
type Image = IdInterface;
type Topic = IdInterface;

interface Issuer {
    name: string;
}

export class CertificationModel extends APIModel {
    @observable declare id: string;
    @observable declare name: string;
    @observable declare issuer: Issuer;
    @observable declare criteria: Criteria;
    @observable declare description: string;
    @observable declare image: Image;
    @observable declare type: string;
    @observable declare tags: string[];
    @observable declare topic: Topic;
    declare assertions: AssertionModel[];

    get isBadgeUploadedByUser() {
        return this.assertions.length > 0;
    }

    get apiDataMap() {
        return {
            id: 'id',
            name: 'name',
            issuer: {
                source: 'issuer',
                map: (issuer: Issuer) => ({
                    name: issuer.name,
                }),
            },
            criteria: {
                source: 'criteria',
                map: (criteria: Criteria) => ({
                    id: criteria.id,
                }),
            },
            description: 'description',
            image: {
                source: 'image',
                map: (image: Image) => ({
                    id: image.id,
                }),
            },
            type: 'type',
            tags: 'tags',
            topic: {
                source: 'topic',
                map: (topic: Topic) => ({
                    id: topic.id,
                }),
            },
            assertions: 'assertions',
        };
    }
}
