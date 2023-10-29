import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import SearchInput from './search-input.react-component.js';
import SearchResults from './search-results.react-component.js';

@observer
export default class Search extends Component {
    static propTypes = {
        searchStore: PropTypes.shape({
            searchQuery: PropTypes.string,
            onSearchQueryChanged: PropTypes.func,
            track: PropTypes.func,
        }).isRequired,
    };

    render() {
        return (
            <Provider searchStore={this.props.searchStore}>
                <SearchInput />
                <SearchResults />
            </Provider>
        );
    }
}
