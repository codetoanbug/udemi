import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import CartIcon from '@udemy/icons/dist/cart.ud-icon';
import {ShoppingList} from '@udemy/shopping';

import {CartBadge} from '../../badges.react-component';
import {useHeaderStore} from '../../hooks/use-header-store';
import styles from '../desktop-header.module.less';
import {HeaderButton, HeaderDropdown, HeaderMenu} from '../header-dropdown.react-component';
import {ShoppingItems} from './shopping-items.react-component';

interface CartDropdownProps {
    className: string;
}

export const CartDropdown = observer(({className}: CartDropdownProps) => {
    const headerStore = useHeaderStore();
    const {gettext, ngettext, interpolate} = useI18n();
    const [shoppingList, _setShoppingList] = React.useState<ShoppingList>();

    const badge = <CartBadge className={styles['dropdown-counter-badge']} />;

    const {urls} = headerStore;
    const cta = {text: gettext('Go to cart'), url: urls.CART};
    const zeroState = {
        text: gettext('Your cart is empty.'),
        cta: {text: gettext('Keep shopping'), url: urls.BROWSE},
    };

    const scroll = {itemCount: 3, maxHeight: '48.8rem'};

    const setShoppingList = () => {
        _setShoppingList(headerStore.shoppingClient.lists.cart);
    };

    return (
        <HeaderDropdown
            trigger={
                <HeaderButton
                    componentClass="a"
                    href={urls.CART}
                    udStyle="icon"
                    overlaychildren={badge}
                    data-testid="cart-icon"
                >
                    <CartIcon
                        color="neutral"
                        label={interpolate(
                            ngettext(
                                'Shopping cart with %(cartCount)s item',
                                'Shopping cart with %(cartCount)s items',
                                headerStore.notificationBadgeContext.cartBuyables,
                            ),
                            {
                                cartCount: headerStore.notificationBadgeContext.cartBuyables,
                            },
                            true,
                        )}
                    />
                </HeaderButton>
            }
            className={className}
            onFirstOpen={setShoppingList}
        >
            <HeaderMenu>
                <ShoppingItems
                    shoppingClient={headerStore.shoppingClient}
                    shoppingList={shoppingList}
                    cta={cta}
                    zeroState={zeroState}
                    scroll={scroll}
                />
            </HeaderMenu>
        </HeaderDropdown>
    );
});
