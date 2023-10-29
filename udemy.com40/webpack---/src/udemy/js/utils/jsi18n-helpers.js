/**
 * Augment the functionality provided by jsi18n, Django's internationalization library.
 *
 * These functions are a bit weird since they're globally available.
 */

window.ninterpolate = function ninterpolate(singular, plural, count, namedContext) {
    let context = [count],
        named = false;
    if (namedContext) {
        context = namedContext;
        named = true;
    }
    // eslint-disable-next-line gettext/no-variable-string
    return interpolate(ngettext(singular, plural, count), context, named);
};
