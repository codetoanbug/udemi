import {observer} from 'mobx-react';
import React from 'react';

import {withI18n, WithI18nProps} from '@udemy/i18n';
import {ButtonSizeType} from '@udemy/react-core-components';
import {withUDData, WithUDDataProps} from '@udemy/ud-data';

import {WishlistButton} from './wishlist-button.react-component';
import {WishlistStore} from './wishlist.mobx-store';

export interface WishlistProps extends WithUDDataProps, WithI18nProps {
    wishlistStore: WishlistStore;
    round?: boolean;
    isMobile?: boolean;
    size?: ButtonSizeType;
    // isCourseInUserSubscription?: boolean;
    uiRegion?: string;
}

@observer
class InternalWishlist extends React.Component<WishlistProps & WithUDDataProps & WithI18nProps> {
    render() {
        const {
            wishlistStore,
            round,
            isMobile,
            // isCourseInUserSubscription,
            // uiRegion,
            udData,
            gettext,
            ...givenButtonProps
        } = this.props;
        const {Config, me} = udData;

        // Commenting out this for now since we don't need this for LOHP
        // Todo: Refactor to pull this out of Wishlist Component; instead, toggle at the higher
        // level between wishlist and SaveToListButton
        // if (this.isPersonalPlanSubscriber && isCourseInUserSubscription) {
        //     return (
        //         <SaveToListButtonWrapper
        //             course={{id: wishlistStore.course.id, is_in_user_subscription: true}}
        //             uiRegion={uiRegion}
        //             size="medium"
        //             labelPosition="left"
        //         />
        //     );
        // }

        if (!Config.features.wishlist || me.isLoading) {
            return null;
        }

        return (
            <div>
                <WishlistButton
                    data-purpose="toggle-wishlist"
                    isWishlisted={wishlistStore.isWishlisted}
                    isLoading={wishlistStore.apiRequestIsLoading}
                    onClick={wishlistStore.toggleWishlist}
                    round={round}
                    wishlistCta={isMobile ? gettext('Add to Wishlist') : gettext('Wishlist')}
                    {...givenButtonProps}
                />
            </div>
        );
    }
}

export const Wishlist = withI18n(withUDData(InternalWishlist));
