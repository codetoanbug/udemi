/**
 * Use this module if you want to treat a piece of data as plain text.
 *
 * If your data has some user-generated HTML that you need to sanitize a little
 * see safely-set-inner-html.js.
 *
 * See also: static/src/udemy/js/examples/react-xss
 */

const reUnescapedHtml = /[&<>"']/g;
const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

function escapeHtmlChar(unescapedChar) {
    return htmlEscapes[unescapedChar];
}

export default function escapeHtml(str) {
    return str && reHasUnescapedHtml.test(str) ? str.replace(reUnescapedHtml, escapeHtmlChar) : str;
}
