import React from "react";

import camelToSnakeCase from "udemy-django-static/js/utils/case-change/camel-to-snake-case";

export function snakeCaseCopy(object) {
  const output = {};
  Object.keys(object).forEach((key) => {
    output[camelToSnakeCase(key)] = object[key];
  });
  return output;
}

/**
 * String formatter that supports JSX.
 * Returns an array of React fragments, suitable for using in a component's render method.
 *
 * Basic example:
 *   jsxFormat('Hello {}. I like {}.', ['World', <strong>turtles!</strong>]);
 *
 *   ['Hello ', 'world', '. I like ', <strong>turtles!</strong>]
 *
 * An error will be thrown if a replacement cannot be found:
 *   jsxFormat('Replace this: {}', [])
 */
export function jsxFormat(string, replacements) {
  let curIndex = 0;
  return string.split(/({})/).map((fragment, i) => {
    if (fragment === "{}") {
      if (curIndex >= replacements.length) {
        throw new Error(
          `Missing replacement for fragment at index ${curIndex}`
        );
      }
      return (
        <React.Fragment key={i}>{replacements[curIndex++]}</React.Fragment>
      );
    }
    return fragment;
  });
}

export const getDisplayName = (Component) => {
  return Component.displayName || Component.name || "Component";
};
