import {observable, runInAction} from 'mobx';

import {udApi} from '@udemy/ud-api';

import {RelatedLabel} from './cart-success-modal.react-component';

export class RelatedLabelsStore {
    courseId: number;
    sourcePage: string;
    @observable labels: RelatedLabel[] | undefined;
    loading: boolean;

    constructor(courseId: number, sourcePage: string, relatedLabels?: RelatedLabel[]) {
        this.courseId = courseId;
        this.sourcePage = sourcePage;
        this.labels = relatedLabels;
        this.loading = false;
    }

    fetchLabels = async () => {
        if (this.labels) {
            this.loading = false;
            return;
        }
        const url = `/discovery-units/`;
        const params = {
            course_id: this.courseId,
            source_page: this.sourcePage,
            context: 'course-related-topics',
        };

        try {
            this.loading = true;
            const response = await udApi.get(url, {
                params,
            });
            this.loading = false;
            runInAction(() => (this.labels = response.data.units[0].items));
        } catch (e) {
            this.loading = false;
        }
    };
}
