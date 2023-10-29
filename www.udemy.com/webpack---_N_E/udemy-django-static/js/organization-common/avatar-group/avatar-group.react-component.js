import { Avatar, DEFAULT_SRC_KEY } from "@udemy/react-core-components";
import PropTypes from "prop-types";
import React, { Component } from "react";

import styles from "./avatar-group.module.less";
import { DEFAULT_MAX_DISPLAY_ITEMS } from "./constants";

/*
 *  TODO: Use AvatarUser interface when this file is converted to TS
 *  Avatar has been converted to TypeScript and no longer uses PropTypes.
 *  This component is the only consumer of this Prop shape.
 */
export const AVATAR_USER_PROP_SHAPE = {
  id: PropTypes.number,
  display_name: PropTypes.string.isRequired,
  [DEFAULT_SRC_KEY]: PropTypes.string,
  initials: PropTypes.string,
};

export default class AvatarGroup extends Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape(AVATAR_USER_PROP_SHAPE))
      .isRequired,
    alt: PropTypes.string,
    count: PropTypes.number,
    maxDisplayItems: PropTypes.number,
    srcKey: PropTypes.string,
  };

  static defaultProps = {
    alt: "DISPLAY_NAME",
    srcKey: undefined,
    // pass this when you know the total number of users but don't want to fetch them all to display this component
    count: undefined,
    maxDisplayItems: DEFAULT_MAX_DISPLAY_ITEMS,
  };

  filterMaxUsersDisplay = (_, index) => {
    return index < this.props.maxDisplayItems;
  };

  get users() {
    const { users, alt, maxDisplayItems, ...props } = this.props;
    return users.filter(this.filterMaxUsersDisplay).map((user) => (
      <div
        key={user.id}
        className={styles["avatar-wrapper"]}
        data-purpose="avatar-wrapper"
      >
        <Avatar
          className={styles["avatar-element"]}
          user={user}
          alt={alt}
          {...props}
        />
      </div>
    ));
  }

  get count() {
    return this.props.count > 0 ? this.props.count : this.props.users.length;
  }

  get allOtherUsersAvatar() {
    const { users, alt, maxDisplayItems, srcKey, count, ...props } = this.props;

    return (
      this.count > maxDisplayItems && (
        <div
          className={styles["avatar-wrapper"]}
          data-purpose="avatar-wrapper-total"
        >
          <Avatar
            className={styles["avatar-element"]}
            user={{
              id: 0,
              image_75x75: "anonymous",
              display_name: "",
              initials: `+${this.count - maxDisplayItems}`,
            }}
            alt={alt}
            {...props}
          />
        </div>
      )
    );
  }

  render() {
    return (
      <div className={styles["avatars-group"]}>
        {this.users}
        {this.allOtherUsersAvatar}
      </div>
    );
  }
}
