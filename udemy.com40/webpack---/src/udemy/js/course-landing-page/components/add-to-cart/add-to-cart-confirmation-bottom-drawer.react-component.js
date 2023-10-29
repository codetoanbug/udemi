import autobind from 'autobind-decorator';
import {computed, toJS, observable, action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import ConfirmationBottomDrawer from 'course-landing-page/components/confirmation-bottom-drawer/confirmation-bottom-drawer.react-component';
import ShoppingClient from 'shopping-client/shopping-client.mobx-store';
import udMe from 'utils/ud-me';

import {CONFIRMATION_BOTTOM_DRAWER_MESSAGES} from './constants';

@observer
export default class AddToCartConfirmationBottomDrawer extends React.Component {
    static propTypes = {
        addToCartData: PropTypes.object,
        window: PropTypes.object,
    };

    static defaultProps = {
        addToCartData: {},
        window: null,
    };

    componentDidMount() {
        const serverSafeWindow = this.props.window || window;
        this.updateSearchParams(serverSafeWindow?.location.search);
    }

    @autobind
    @action
    updateSearchParams(search) {
        this.searchParams = new URLSearchParams(search);
    }

    @observable
    searchParams = new URLSearchParams();

    get buyables() {
        return toJS(this.props.addToCartData.buyables || []);
    }

    @computed
    get isInCart() {
        return ShoppingClient.lists.cart.hasBuyables(this.buyables);
    }

    get hasAddToCartIntent() {
        return this.searchParams.get('xref') === 'cart';
    }

    @autobind
    removeAddToCartIntent() {
        if (!this.hasAddToCartIntent) {
            return;
        }
        this.searchParams.delete('xref');
        const url = Array.from(this.searchParams).length
            ? `${window.location.pathname}?${this.searchParams.toString()}`
            : window.location.pathname;
        window.history.replaceState({}, '', url);
    }

    @autobind
    handleConfirmation() {
        return ShoppingClient.addToList('cart', this.buyables).then(() =>
            this.removeAddToCartIntent(),
        );
    }

    render() {
        if (udMe.isLoading || !this.buyables.length) {
            return null;
        }

        return (
            <ConfirmationBottomDrawer
                initialOpenState={!this.isInCart && this.hasAddToCartIntent}
                handleConfirmation={this.handleConfirmation}
                onDrawerClose={this.removeAddToCartIntent}
                messages={CONFIRMATION_BOTTOM_DRAWER_MESSAGES}
            />
        );
    }
}
