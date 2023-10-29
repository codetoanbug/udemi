import AssessmentsStore from 'assessments/assessments.mobx-store';
import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import {VALIDATION, validateUdemyURL} from 'utils/form-validators';
import udApi from 'utils/ud-api';

export default class AssessmentAutosuggestStore extends AutosuggestStore {
    constructor() {
        super();
        this._assessmentStore = new AssessmentsStore();
    }

    async loadSuggestions({q}) {
        const validationOutcome = await validateUdemyURL({text: q.toLowerCase()});
        if (validationOutcome === VALIDATION.success) {
            udApi
                .get('/assessments/by-url/', {
                    params: {
                        url: encodeURIComponent(q),
                    },
                })
                .then((response) => {
                    const assessmentsResult = [
                        {
                            id: String(response.data.id),
                            title: response.data.title,
                            slug: response.data.slug,
                            description: response.data.description,
                        },
                    ];
                    this.setSuggestions(assessmentsResult);
                })
                .catch(() => {
                    this.setSuggestions([]);
                });
        } else {
            if (!this._assessmentStore.groups.length) {
                await this._assessmentStore.loadAllGroups();
            }
            const filtered = this._assessmentStore.groups.filter((group) =>
                group.title.toLowerCase().includes(q.toLowerCase()),
            );
            this.setSuggestions(filtered);
        }
    }
}
