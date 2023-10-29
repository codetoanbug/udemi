import {observer} from 'mobx-react';
import React from 'react';

import {attachFrontendTrackingIds} from '@udemy/browse-event-tracking';
import {useI18n} from '@udemy/i18n';
import WishlistedIcon from '@udemy/icons/dist/wishlisted.ud-icon';
import {BaseIconProps} from '@udemy/react-core-components';
import {ShoppingList} from '@udemy/shopping';

import {useHeaderStore} from '../../hooks/use-header-store';
import {HeaderButton, HeaderDropdown, HeaderMenu} from '../header-dropdown.react-component';
import {ShoppingItems} from './shopping-items.react-component';

const unwishlistedStyle = {
    fill: 'transparent',
    padding: '1px',
    stroke: 'currentColor',
    strokeWidth: '2',
};

const UnwishlistedIcon = (props: Partial<BaseIconProps>) => (
    <WishlistedIcon label={false} {...props} style={unwishlistedStyle} />
);

UnwishlistedIcon.$$udType = 'Icon';

interface WishlistDropdownProps {
    className: string;
}

export const WishlistDropdown = observer(({className}: WishlistDropdownProps) => {
    const headerStore = useHeaderStore();
    const {gettext} = useI18n();
    const [shoppingList, _setShoppingList] = React.useState<ShoppingList>();

    const setShoppingList = () => {
        const wishlist = headerStore.shoppingClient.lists.wishlist;
        attachFrontendTrackingIds(wishlist.items.map((item) => item.buyable));
        _setShoppingList(wishlist);
    };

    const {urls} = headerStore;
    const cta = {text: gettext('Go to wishlist'), url: urls.WISHLIST};
    const zeroState = {
        text: gettext('Your wishlist is empty.'),
        cta: {text: gettext('Explore courses'), url: urls.BROWSE},
    };
    const scroll = {itemCount: 2, maxHeight: '50.8rem'};

    return (
        <HeaderDropdown
            trigger={
                <HeaderButton
                    componentClass="a"
                    href={urls.WISHLIST}
                    udStyle="icon"
                    data-purpose="wishlist-icon"
                >
                    <UnwishlistedIcon color="neutral" label={gettext('Wishlist')} />
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
                    showAddToCart={true}
                    showTotal={false}
                />
            </HeaderMenu>
        </HeaderDropdown>
    );
});
