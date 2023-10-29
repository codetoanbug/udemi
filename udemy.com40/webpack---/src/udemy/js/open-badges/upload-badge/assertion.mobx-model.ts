import {APIModel} from 'utils/mobx';

import {CertificationModel} from '../certification.mobx-model';

export class AssertionModel extends APIModel {
    declare id: string;
    declare externalUrl: string;
    declare issuedOn: string;
    declare expires: string;
    declare badgeClass: CertificationModel;
    declare user: User;

    get apiDataMap() {
        return {
            id: 'id',
            externalUrl: 'externalUrl',
            issuedOn: 'issuedOn',
            expires: 'expires',
            badgeClass: 'badgeClass',
            user: 'user',
        };
    }
}

export interface User {
    id: number;
}
