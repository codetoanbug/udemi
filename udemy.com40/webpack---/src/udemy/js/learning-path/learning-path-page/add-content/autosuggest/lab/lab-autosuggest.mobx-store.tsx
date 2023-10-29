import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import {LABS_API_URL} from 'labs-landing/constants';
import LabsStore from 'labs-landing/labs.mobx-store';
import {VALIDATION, validateUdemyURL} from 'utils/form-validators';
import udApi from 'utils/ud-api';

import {LabType} from './types';

export class LabAutosuggestStore extends AutosuggestStore<LabType> {
    _labStore: LabsStore;
    constructor() {
        super();
        this._labStore = new LabsStore();
    }

    async loadSuggestions({q}: {q: string}) {
        const validationOutcome = await validateUdemyURL({text: q.toLowerCase()});
        if (validationOutcome === VALIDATION.success) {
            udApi
                .get(LABS_API_URL.labByUrl, {
                    params: {
                        url: encodeURIComponent(q),
                    },
                })
                .then((response) => {
                    const labsResult = [
                        {
                            id: response.data.id,
                            title: response.data.title,
                            labOverview: response.data.lab_overview,
                        },
                    ];
                    this.setSuggestions(labsResult);
                })
                .catch(() => {
                    this.setSuggestions([]);
                });
        } else {
            if (!this._labStore.labs.length) {
                await this._labStore.loadLabs();
            }
            const filtered = this._labStore.labs.filter((lab) =>
                lab.title.toLowerCase().includes(q.toLowerCase()),
            );
            this.setSuggestions(filtered);
        }
    }
}
