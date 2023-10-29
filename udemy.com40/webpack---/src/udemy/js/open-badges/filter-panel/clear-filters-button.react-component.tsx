import {Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React from 'react';

import serverOrClient from 'utils/server-or-client';

// Check if we can use abs imports in less
import styles from '../../browse/components/course-directory/filter-container/filter-button-container.less';
import {CertificationStore} from '../certification.mobx-store';
import {FilterPanelProps} from '../common/types';

@inject('certificationStore')
@observer
export class ClearFiltersButton extends React.Component<FilterPanelProps> {
    static defaultProps = {
        certificationStore: CertificationStore,
    };

    get window() {
        return serverOrClient.global as Window;
    }

    clearSearchParams() {
        const url = new URL(this.window.location.href);
        const params = new URLSearchParams();
        url.search = params.toString();
        this.window.history.replaceState({}, '', url);
    }

    handleClick = () => {
        this.clearSearchParams();
        this.props.certificationStore.clearFilters();
        this.props.certificationStore.performSearch();
    };

    render() {
        const shouldShow = this.props.certificationStore.selectedFiltersSize > 0;
        const button = (
            <Button
                udStyle="ghost"
                className={classNames('ud-link-neutral', styles['filter-clear'])}
                onClick={this.handleClick}
                data-purpose="clear-filters"
                aria-label={gettext('Clear applied filters')}
            >
                {gettext('Clear filters')}
            </Button>
        );

        return shouldShow && button;
    }
}
