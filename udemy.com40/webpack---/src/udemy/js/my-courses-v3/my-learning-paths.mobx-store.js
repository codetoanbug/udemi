import autobind from 'autobind-decorator';
import {action, observable, computed} from 'mobx';

import udApi from 'utils/ud-api';

export default class MyLearningPathsStore {
    constructor(activeTab) {
        this.activeTab = activeTab;
    }

    @observable isLoading = false;
    @observable learningPaths = [];
    @observable count = 0;
    @observable currentPage = 1;

    pageSize = 12;
    requestParams = {};

    @computed
    get pageCount() {
        return this.count > 0 ? Math.ceil(this.count / this.pageSize) : 0;
    }

    @autobind
    @action
    changePage(page) {
        this.currentPage = page;
        this.loadLearningPaths();
    }

    @action
    loadLearningPaths() {
        this.isLoading = true;

        udApi
            .get('/users/me/enrolled-paths/', {
                params: {
                    'fields[learning_path]': '@all',
                    page: this.currentPage,
                    page_size: this.pageSize,
                },
            })
            .then(
                action((response) => {
                    this.learningPaths = response.data.results || [];
                    this.count = response.data.count;
                }),
            )
            .finally(
                action(() => {
                    this.isLoading = false;
                }),
            );
    }
}
