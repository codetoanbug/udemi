const browserDefaultFontSizePx = 16;
const rootFontSizePercent = 0.625;

/**
 * Convert length value in `px` to value in `rem`, _assuming_
 * the design system root font ratio of 62.5%.
 *
 * @param px
 * @returns value in `rem` units
 *
 * @remarks
 *
 * This function is suitable for converting to `rem` units when the value is used within
 * the document and _not_ in a media query.
 *
 * @see `mediaQueryPxToRem` if you are working with values used in media queries.
 */
export const pxToRem = (px: number) => px / (rootFontSizePercent * browserDefaultFontSizePx);

/**
 * Convert Px to Em
 *
 * @param px
 * @returns
 *
 * @deprecated
 *
 * @see emToPx for a description of why this is deprecated
 *
 * @remarks
 *
 * For values in the context of media queries, use `mediaQueryPxToRem` instead.
 */
export const pxToEm = (px: number) => Math.round((px / browserDefaultFontSizePx) * 100) / 100;

/**
 * Convert Em to Px, in cases where reverse conversion is needed
 *
 * @param em token value in `em` units
 * @returns token value in `px`
 *
 * @deprecated
 *
 * @remarks
 *
 * This function only applies to `em` unit tokens that are evaluated outside
 * the context of the DOM root font-size value, i.e., only for media queries.
 *
 * `em` units are relative, and can only truly be converted to `px` in the
 * context of the DOM tree.
 *
 * Instead, use `rem` units in media queries and `mediaQueryRemToPx`.
 */
export const emToPx = (em: string | number) => {
    // if string, we assume a string ending with `em`
    const emValue = typeof em === 'string' ? Number(em.replace('em', '')) : em;

    return Math.round(((emValue * browserDefaultFontSizePx) / 100) * 100);
};

/**
 * Convert media query tokens in `rem` units to `px` values, _assuming_ the
 * design system root font ratio of 62.5%.
 *
 * @param rem length token used for media queries in `rem` units
 * @returns token value in `px`
 *
 * @remarks
 *
 * Only apply this function to tokens in `rem` that are meant to be used as media
 * queries. The design system applies a fixed font size ratio to the root of the DOM.
 * Relative units in media queries are evaluated *without respect* to any font sizes
 * applied in CSS.
 *
 * @see {@link https://www.w3.org/TR/mediaqueries-3/#units}
 */
export const mediaQueryRemToPx = (rem: string | number) => {
    // if string, we assume a string ending with `rem`
    const remValue = typeof rem === 'string' ? Number(rem.replace('rem', '')) : rem;

    return Math.round(((remValue * browserDefaultFontSizePx) / 100) * 100);
};

/**
 * Convert length values in `px` units to `rem` units in the context of a media query,
 *  _assuming_ the design system root font ratio of 62.5%.
 *
 * @param px length value in `px` units
 * @returns length value in `rem` units
 *
 * @remarks
 *
 * Only apply this function to values in `px` that are meant to be used in the context
 * of media queries. The design system applies a fixed font size ratio to the root of
 * the DOM. Relative units in media queries are evaluated *without respect* to any font
 * sizes applied in CSS. The `rem` values returned by this function assume that context.
 *
 * Use `pxToRem` for values within DOM, outside of the context of media queries.
 *
 * @see {@link https://www.w3.org/TR/mediaqueries-3/#units}
 */
export const mediaQueryPxToRem = (px: number) =>
    Math.round((px / browserDefaultFontSizePx) * 100) / 100;
