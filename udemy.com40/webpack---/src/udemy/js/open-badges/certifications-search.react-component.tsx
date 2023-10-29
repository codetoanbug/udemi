import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import {inject, observer} from 'mobx-react';
import React, {ChangeEvent, Component} from 'react';

import {CertificationStore} from './certification.mobx-store';
import styles from './certifications-page.less';
import {FilterPanelProps} from './common/types';
import {DISCOVERY_PAGE_MESSAGES} from './constants';

@inject('certificationStore')
@observer
export class CertificationsSearch extends Component<FilterPanelProps> {
    static defaultProps = {
        certificationStore: CertificationStore,
    };

    submit = async () => {
        if (this.props.certificationStore.searchQuery?.length === 0) {
            return;
        }
        // See if we need to move this to a reaction once search bar behaviour is finalized
        await this.props.certificationStore.performSearch();
    };

    change = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.certificationStore.setSearchQuery(event.target.value);
    };

    clearInput = () => {
        this.props.certificationStore.setSearchQuery('');
        // Couldn't find a way to do this reactively just for clear input
        this.props.certificationStore.performSearch();
    };

    showClearInputButton = () => {
        return !!this.props.certificationStore.searchQuery;
    };

    render() {
        const {searchFormLabel, searchPlaceholder, searchSubmit} = DISCOVERY_PAGE_MESSAGES;
        return (
            <div className={styles['search-panel']}>
                <FormGroup
                    label={searchFormLabel}
                    className={styles['search-form-group-certifications-list']}
                    onSubmit={() => this.submit()}
                >
                    <TextInputForm
                        data-purpose="learning-path-list-search"
                        showClearInputButton={this.showClearInputButton()}
                        onClearInput={this.clearInput}
                        value={this.props.certificationStore.searchQuery}
                        onChange={this.change}
                        placeholder={searchPlaceholder}
                        submitButtonContent={<SearchIcon label={searchSubmit} />}
                    />
                </FormGroup>
            </div>
        );
    }
}
