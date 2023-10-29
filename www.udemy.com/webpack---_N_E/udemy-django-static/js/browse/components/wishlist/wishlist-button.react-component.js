import PropTypes from "prop-types";
import React from "react";

import { Button, ButtonSize, IconButton } from "@udemy/react-core-components";
import WishlistedIcon from "@udemy/icons/dist/wishlisted.ud-icon";
import { Loader } from "@udemy/react-reveal-components";

import UnwishlistedIcon from "./unwishlisted-icon.react-component";

export default class WishlistButton extends React.Component {
  static propTypes = {
    isWishlisted: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    round: PropTypes.bool,
    size: PropTypes.oneOf(ButtonSize),
    wishlistCta: PropTypes.string,
    wishlistedCta: PropTypes.string,
    labelPosition: PropTypes.oneOf(["left", "right"]),
    square: PropTypes.bool,
  };

  static defaultProps = {
    round: false,
    size: "medium",
    wishlistCta: null,
    wishlistedCta: null,
    labelPosition: "left",
    square: false,
  };

  get wishlistCta() {
    // Can't use gettext in defaultProps if imported by isocomponent
    return this.props.wishlistCta || gettext("Add to wishlist");
  }

  get wishlistedCta() {
    return this.props.wishlistedCta || gettext("Wishlisted");
  }

  render() {
    const {
      isWishlisted,
      isLoading,
      round,
      size,
      wishlistCta,
      wishlistedCta,
      labelPosition,
      square,
      ...givenButtonProps
    } = this.props;
    const buttonProps = {
      udStyle: "secondary",
      size,
      ...givenButtonProps,
      disabled: !!givenButtonProps.disabled,
      "aria-pressed": isWishlisted,
      "aria-label": this.wishlistCta,
    };
    const WishlistIcon = isWishlisted ? WishlistedIcon : UnwishlistedIcon;
    const label = isWishlisted ? this.wishlistedCta : this.wishlistCta;
    const loader = isLoading ? <Loader color="inherit" /> : null;

    if (square || round) {
      return (
        <IconButton {...buttonProps} round={round}>
          {loader || <WishlistIcon color="inherit" label={false} />}
        </IconButton>
      );
    }
    return (
      <Button {...buttonProps}>
        {loader || (
          <>
            {labelPosition == "left" && <span>{label}</span>}
            <WishlistIcon
              color="inherit"
              size={labelPosition == "right" ? this.props.size : "small"}
              label={false}
            />
            {labelPosition == "right" && <span>{label}</span>}
          </>
        )}
      </Button>
    );
  }
}
