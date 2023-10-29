export function convertToPlainText(html) {
    return (html || '').replace(/<img[^>]+>/gm, gettext('[image]')).replace(/<[^>]+>/g, '');
}

export function hasHTMLContent(html) {
    if (html.search(/<img src/g, '') > 0) {
        return true;
    }
    return !!html.replace(/\s|&nbsp;/g, '').replace(/<[^>]+>/g, '');
}
