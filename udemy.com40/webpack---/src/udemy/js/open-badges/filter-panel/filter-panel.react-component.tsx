import {Accordion} from '@udemy/react-reveal-components';
import {inject, observer} from 'mobx-react';
import React from 'react';

import serverOrClient from 'utils/server-or-client';

import {CertificationStore} from '../certification.mobx-store';
import {buildURLParamsFromFormData} from '../common/utils/form-helpers';
import {Filter} from './filter.react-component';
import styles from './filters.less';

interface FilterPanelProps {
    certificationStore: CertificationStore;
}

@inject('certificationStore')
@observer
export class FilterPanel extends React.Component<FilterPanelProps> {
    static defaultProps = {
        certificationStore: CertificationStore,
    };

    async componentDidMount() {
        this.ref.current?.addEventListener('submit', this.handleSubmit);

        // update filters from preset url params
        const urlSearchParams = new URLSearchParams(this.window.location.search);
        this.updateFiltersFromParams(urlSearchParams);

        if (!this.props.certificationStore.isAggregationsListLoaded) {
            await this.props.certificationStore.fetchAggregations();
        }
    }

    componentWillUnmount() {
        this.ref.current?.removeEventListener('submit', this.handleSubmit);
    }

    get window() {
        return serverOrClient.global as Window;
    }

    handleFilterChange = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.target.form?.dispatchEvent(new Event('submit', {cancelable: true}));
    };

    handleSubmit = (event: any) => {
        const formData = new FormData(event.target);
        const params = buildURLParamsFromFormData(formData);
        this.updateFiltersFromParams(params);
        this.updateHistoryFromParams(params);
        this.props.certificationStore.performSearch();
        // Should we call the search here?
    };

    updateHistoryFromParams = (params: URLSearchParams) => {
        const url = new URL(this.window.location.href);
        url.search = params.toString();
        this.window.history.pushState({}, '', url);
    };

    updateFiltersFromParams = (params: URLSearchParams) => {
        const {certificationStore} = this.props;
        certificationStore.clearFilters();
        for (const [key, value] of params.entries()) {
            if (key === 'search') {
                // TODO: query in url search params
                certificationStore.setSearchQuery(value);
            }
            certificationStore.addFilter(key, value);
        }
    };

    ref = React.createRef<HTMLFormElement>();

    render() {
        const aggregations = this.props.certificationStore.allAggregations;
        return (
            <form
                id={'filter-form'}
                className={styles['filters-form']}
                onChange={this.handleFilterChange}
                ref={this.ref}
            >
                <Accordion>
                    {aggregations?.map((aggregation) => (
                        <div // We need this for keyboard a11y
                            data-purpose={`aggregation-filter-${aggregation.key}`}
                            key={aggregation.key}
                        >
                            <Accordion.Panel
                                title={aggregation.title}
                                key={aggregation.key}
                                defaultExpanded={true}
                            >
                                <Filter aggregation={aggregation} />
                            </Accordion.Panel>
                        </div>
                    ))}
                </Accordion>
            </form>
        );
    }
}
