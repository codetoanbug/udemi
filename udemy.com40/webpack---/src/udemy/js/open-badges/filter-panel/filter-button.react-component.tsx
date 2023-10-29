import FilterIcon from '@udemy/icons/dist/filter.ud-icon';
import {Button} from '@udemy/react-core-components';
import {noop} from '@udemy/shared-utils';
import {inject, observer} from 'mobx-react';
import React from 'react';

import {CertificationStore} from '../certification.mobx-store';
import {FilterPanelProps} from '../common/types';
import styles from './filters.less';

@inject('certificationStore')
@observer
export class FilterButton extends React.Component<FilterPanelProps> {
    static defaultProps = {
        certificationStore: CertificationStore,
    };

    render() {
        const numFiltersApplied = this.props.certificationStore.selectedFiltersSize;
        return (
            <Button
                udStyle="secondary"
                onClick={noop}
                cssToggleId={'filter-button'}
                data-purpose="open-filters"
                className={styles['filter-button']}
            >
                <FilterIcon label={false} />
                {gettext('Filter')}
                {numFiltersApplied > 0 ? `(${numFiltersApplied})` : null}
            </Button>
        );
    }
}
