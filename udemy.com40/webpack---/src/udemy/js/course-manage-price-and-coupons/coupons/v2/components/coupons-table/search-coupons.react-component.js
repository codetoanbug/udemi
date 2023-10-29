import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

@inject('couponsStore')
@observer
export default class SearchCoupons extends Component {
    static propTypes = {
        couponsStore: PropTypes.object.isRequired,
    };

    @autobind
    onChange(event) {
        this.props.couponsStore.setSearch(event.target.value);
    }

    render() {
        return (
            <FormGroup label={gettext('Search coupon code')} labelProps={{className: 'ud-sr-only'}}>
                <TextInputForm
                    onSubmit={this.props.couponsStore.searchCoupons}
                    data-purpose="search-form-control"
                    onChange={this.onChange}
                    placeholder={gettext('Search coupon code')}
                    value={this.props.couponsStore.searchQuery}
                    submitButtonProps={{disabled: this.props.couponsStore.isLoading}}
                    submitButtonContent={<SearchIcon label={gettext('Search')} />}
                />
            </FormGroup>
        );
    }
}
