const reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;
const reHasEscapedHtml = RegExp(reEscapedHtml.source);
const htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
};

function unescapeHtmlChar(escapedChar) {
    return htmlUnescapes[escapedChar];
}

export default function unescapeHtml(str) {
    return str && reHasEscapedHtml.test(str) ? str.replace(reEscapedHtml, unescapeHtmlChar) : str;
}
