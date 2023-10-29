import React from "react";

import WishlistedIcon from "@udemy/icons/dist/wishlisted.ud-icon";

const unwishlistedStyle = {
  fill: "transparent",
  padding: "1px",
  stroke: "currentColor",
  strokeWidth: "2",
};

const UnwishlistedIcon = (props) => (
  <WishlistedIcon {...props} style={unwishlistedStyle} />
);

UnwishlistedIcon.$$udType = "Icon";

export default UnwishlistedIcon;
