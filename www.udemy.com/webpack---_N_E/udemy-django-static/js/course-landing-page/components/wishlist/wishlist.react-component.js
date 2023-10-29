import { observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";

import { SaveToListButtonWrapper } from "udemy-django-static/js/browse/components/save-to-list/save-to-list-button-wrapper.react-component";
import WishlistButton from "udemy-django-static/js/browse/components/wishlist/wishlist-button.react-component";
import { UI_REGION } from "udemy-django-static/js/browse/ui-regions";
import loadCommonAppContext from "udemy-django-static/js/common/load-common-app-context";
import getConfigData from "udemy-django-static/js/utils/get-config-data";
import udMe from "udemy-django-static/js/utils/ud-me";

import WishlistStore from "./wishlist.mobx-store";

@observer
export default class Wishlist extends React.Component {
  static propTypes = {
    wishlistStore: PropTypes.instanceOf(WishlistStore).isRequired,
    round: PropTypes.bool,
    isMobile: PropTypes.bool,
    isCourseInUserSubscription: PropTypes.bool,
    uiRegion: PropTypes.string,
  };

  static defaultProps = {
    round: false,
    isMobile: true,
    isCourseInUserSubscription: false,
    uiRegion: UI_REGION.WISHLIST,
  };

  componentDidMount() {
    loadCommonAppContext().then((response) => {
      runInAction(() => {
        this.isLoadingCommonAppContext = false;
        this.isPersonalPlanSubscriber =
          response.data.header.user.consumer_subscription_active;
      });
    });
  }

  @observable isLoadingCommonAppContext = true;
  @observable isPersonalPlanSubscriber = false;
  render() {
    const {
      wishlistStore,
      round,
      isMobile,
      isCourseInUserSubscription,
      uiRegion,
      ...givenButtonProps
    } = this.props;

    if (this.isLoadingCommonAppContext) {
      return null;
    }

    // Todo: Refactor to pull this out of Wishlist Component; instead, toggle at the higher
    // level between wishlist and SaveToListButton
    if (this.isPersonalPlanSubscriber && isCourseInUserSubscription) {
      return (
        <SaveToListButtonWrapper
          course={{
            id: wishlistStore.course.id,
            is_in_user_subscription: true,
          }}
          uiRegion={uiRegion}
          size="medium"
          labelPosition="left"
        />
      );
    }

    if (!getConfigData().features.wishlist || udMe.isLoading) {
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
          wishlistCta={
            isMobile ? gettext("Add to Wishlist") : gettext("Wishlist")
          }
          style={{ width: "100%" }}
          {...givenButtonProps}
        />
      </div>
    );
  }
}
