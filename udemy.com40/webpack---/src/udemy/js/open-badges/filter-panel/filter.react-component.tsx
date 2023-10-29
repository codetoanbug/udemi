import {Checkbox} from '@udemy/react-form-components';
import {SkipToContentButton} from '@udemy/react-navigation-components';
import {ShowMore} from '@udemy/react-reveal-components';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';

import {CertificationStore} from '../certification.mobx-store';
import {ISSUER_FILTER_KEY, SUBJECT_AREA_FILTER_KEY} from '../constants';

interface FilterParams {
    aggregation: {
        title: string;
        key: string;
        options: {
            key: string;
            value: string;
            title: string;
            count: number;
        }[];
    };
    certificationStore: CertificationStore;
}

@inject('certificationStore')
@observer
export class Filter extends React.Component<FilterParams> {
    static defaultProps = {
        certificationStore: CertificationStore,
    };

    a11yConfig = new Map([
        [ISSUER_FILTER_KEY, `[data-purpose="aggregation-filter-${SUBJECT_AREA_FILTER_KEY}"]`],
        [SUBJECT_AREA_FILTER_KEY, '[data-purpose="certification-tiles-container"]'],
    ]);

    @computed
    get currentFilterSet() {
        const {selectedFilters} = this.props.certificationStore;
        return selectedFilters.get(this.props.aggregation.key) ?? new Set<string>();
    }

    render() {
        return (
            <ShowMore collapsedHeight={145} withGradient={true}>
                <SkipToContentButton
                    label={gettext('Skip filter')}
                    goToContentSelector={this.a11yConfig.get(this.props.aggregation.key) ?? ''}
                />
                <div>
                    {this.props.aggregation.options.map((option) => (
                        <Checkbox
                            key={option.title}
                            value={option.value}
                            name={option.key}
                            checked={this.currentFilterSet.has(option.value)}
                            readOnly={true}
                        >
                            {/* eslint-disable-next-line gettext/no-variable-string */}
                            <span>{gettext(option.title)}</span>
                        </Checkbox>
                    ))}
                </div>
            </ShowMore>
        );
    }
}
