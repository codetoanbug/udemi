import {action, observable} from 'mobx';

import loadInProgressLabsUnit from 'browse/lib/load-in-progress-labs-unit';
import Lab from 'labs/lab.mobx-model';

import {LabInProgressApiData, EMPTY_LAB_OBJECT} from './types';

export class MyLabsStore {
    constructor(source?: string) {
        this.source = source;
    }

    @observable labs: (Lab | typeof EMPTY_LAB_OBJECT)[] = [];
    @observable isLoading = true;
    source;

    async fetchLabs() {
        const results = await loadInProgressLabsUnit();
        this._setLabs(results || []);
        this._setIsLoading(false);
    }

    @action
    _setLabs(results = []) {
        this.labs = [
            ...results.map((data: LabInProgressApiData) => {
                return new Lab(data);
            }),
        ];

        if (this.source === 'my-learning') {
            this.labs.unshift(EMPTY_LAB_OBJECT);
        }
    }

    @action
    _setIsLoading(value: boolean) {
        this.isLoading = value;
    }
}
