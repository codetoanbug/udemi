import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import {Pagination} from '@udemy/react-navigation-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AssetLibraryStore from './asset-library.mobx-store';
import AssetTable from './asset-table.react-component';
import './asset-library.less';

@observer
export default class AssetLibrary extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(AssetLibraryStore).isRequired,
        onSelect: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.store.setPage(1);
    }

    @autobind
    onSearchQueryChange(event) {
        if (!this.props.store.isDisabled) {
            this.props.store.setSearchQuery(event.target.value);
        }
    }

    @autobind
    onAssetSelect(assetId) {
        this.props.store.disableAsset(assetId);
        this.props.onSelect(assetId);
    }

    @autobind
    onToggleInfo(assetId) {
        this.props.store.toggleAssetInfo(assetId);
    }

    renderSearch() {
        const {isLoading, searchQuery} = this.props.store;
        const icon = <SearchIcon label={gettext('Submit search')} color="inherit" size="small" />;
        const loader = isLoading && <Loader color="inherit" size="xsmall" overlay={true} />;
        return (
            <div styleName="search-row">
                <FormGroup
                    label={gettext('Search files by name')}
                    labelProps={{className: 'ud-sr-only'}}
                >
                    <TextInputForm
                        size="small"
                        placeholder={gettext('Search files by name')}
                        value={searchQuery}
                        onChange={this.onSearchQueryChange}
                        submitButtonContent={
                            <>
                                {loader}
                                {icon}
                            </>
                        }
                    />
                </FormGroup>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderSearch()}
                <AssetTable
                    store={this.props.store}
                    onDelete={this.props.store.deleteAsset}
                    onSelect={this.onAssetSelect}
                    onToggleInfo={this.onToggleInfo}
                />
                <Pagination
                    activePage={this.props.store.page}
                    pageCount={this.props.store.numPages}
                    onPageChange={this.props.store.setPage}
                    styleName="pagination"
                />
            </div>
        );
    }
}
