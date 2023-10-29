import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './exitable-search-bar.less';

@observer
export default class ExitableSearchBar extends Component {
    static propTypes = {
        className: PropTypes.string,
        placeholder: PropTypes.string,
        searchThreads: PropTypes.func.isRequired,
    };

    static defaultProps = {
        placeholder: gettext('Search by keyword'),
        className: '',
    };

    @observable _searchQuery = '';
    @observable _searchComplete = false;

    @autobind
    @action
    changeQuery(event) {
        this._searchQuery = event.target.value;
        this._searchComplete = false;
    }

    @autobind
    @action
    searchThreads() {
        this.props.searchThreads(this._searchQuery);
        this._searchComplete = !!this._searchQuery;
    }

    @autobind
    @action
    onClearInput() {
        this._searchQuery = '';
        this.searchThreads();
    }

    render() {
        const {className, placeholder} = this.props;
        return (
            <FormGroup
                label={gettext('Search')}
                labelProps={{className: 'ud-sr-only'}}
                className={className}
                styleName="search-bar"
            >
                <TextInputForm
                    size="medium"
                    onSubmit={this.searchThreads}
                    placeholder={placeholder}
                    onChange={this.changeQuery}
                    value={this._searchQuery}
                    submitButtonContent={<SearchIcon label={gettext('Search')} />}
                    submitButtonProps={{udStyle: 'ghost'}}
                    showClearInputButton={this._searchComplete}
                    onClearInput={this.onClearInput}
                />
            </FormGroup>
        );
    }
}
