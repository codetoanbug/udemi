import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

@inject('searchStore')
@observer
export default class SearchInput extends Component {
    static propTypes = {
        searchStore: PropTypes.shape({
            searchQuery: PropTypes.string,
            onSearchQueryChanged: PropTypes.func,
            resetSearchContext: PropTypes.func,
        }).isRequired,
    };

    render() {
        const {searchQuery, onSearchQueryChanged, resetSearchContext} = this.props.searchStore;

        return (
            <FormGroup
                className="ct-dashboard-search-bar"
                label={gettext('Search course content')}
                labelProps={{className: 'ud-sr-only'}}
            >
                <TextInputForm
                    showClearInputButton={!!searchQuery}
                    onClearInput={resetSearchContext}
                    value={searchQuery}
                    onChange={onSearchQueryChanged}
                    placeholder={gettext('Search course content')}
                    submitButtonContent={<SearchIcon label={gettext('Search')} />}
                />
            </FormGroup>
        );
    }
}
