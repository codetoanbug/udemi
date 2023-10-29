import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {FormGroup, TextInputForm, InputSizes} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getConfigData from 'utils/get-config-data';

@observer
export default class SearchWidget extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        onClear: PropTypes.func.isRequired,
        store: PropTypes.shape({
            searchTerm: PropTypes.string,
            isClearButtonShown: PropTypes.bool.isRequired,
            clearSearchTerm: PropTypes.func.isRequired,
            handleChange: PropTypes.func.isRequired,
        }).isRequired,
        size: PropTypes.oneOf(InputSizes),
        submitButtonProps: PropTypes.object,
    };

    static defaultProps = {
        size: 'large',
        submitButtonProps: {},
    };

    @autobind
    @action
    onSubmit() {
        const searchTerm = this.props.store.searchTerm.trim();
        if (!searchTerm) {
            return this.onClear();
        }
        return this.props.onSubmit(searchTerm);
    }

    @autobind
    @action
    onChangeSearchTerm(event) {
        this.props.store.handleChange(event);
    }

    @autobind
    onClear() {
        this.props.store.clearSearchTerm();
        this.props.onClear();
    }

    get showClear() {
        return this.props.store.searchTerm !== '';
    }

    render() {
        if (!getConfigData().features.course_review.clp_review_search) {
            return null;
        }

        return (
            <FormGroup label={gettext('Search reviews')} labelProps={{className: 'ud-sr-only'}}>
                <TextInputForm
                    submitButtonContent={<SearchIcon label={gettext('Submit search')} />}
                    submitButtonProps={this.props.submitButtonProps}
                    onChange={this.onChangeSearchTerm}
                    onClearInput={this.onClear}
                    onSubmit={this.onSubmit}
                    size={this.props.size}
                    placeholder={gettext('Search reviews')}
                    showClearInputButton={this.showClear}
                    value={this.props.store.searchTerm}
                />
            </FormGroup>
        );
    }
}
