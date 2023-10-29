// QRP criteria comments are stored in the database as plain text but displayed to users as HTML.
// For example, see the canned comments, about half of which contain support URLs that are displayed with <a /> tags.
// select cc.content from canned_comment cc inner join quality_criteria qc on qc.id=cc.relatedobjectid where cc.relatedobjecttype='quality_criteria' limit 1000;
export default function criteriaCommentTextToHTML(text) {
    if (!text) {
        return text;
    }

    // Escape text and replace newlines with proper <br /> tags.
    const container = document.createElement('div');
    container.textContent = text;
    const html = container.innerHTML.replace(/\n/g, '<br/>');

    // Replace URLs with proper <a /> tags.
    // All solutions I found on the Internet break with the repetition of urls. E.g. "www.example www.example".
    // This is why the computation is complex here. The algorithm is dividing the string into chunks,
    // making the replacement, and concatenating the results in the final string.
    const urlPatternRegEx = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/gi;

    const matchIndices = []; // The index of each match.
    const matchedUrls = []; // All matches.

    // This is an iterator each time it finds one instance of urlPatternRegEx.
    let match;
    while ((match = urlPatternRegEx.exec(html)) !== null) {
        matchIndices.push(match.index);
        matchedUrls.push(match[0]);
    }

    // Zero case: If there is no url return the text as it is.
    if (matchIndices.length === 0) {
        return html;
    }

    // Part of the text up to the first URL occurrence.
    let htmlWithLinks = html.substring(0, matchIndices[0]);
    let substring;
    for (let i = 0; i < matchIndices.length; i++) {
        if (i + 1 < matchIndices.length) {
            // Get the text from (i+1)th URL occurrence to the start of the next one.
            substring = html.substring(matchIndices[i], matchIndices[i + 1]);
        } else {
            // Get the text from final URL occurrence to the end of the text.
            substring = html.substring(matchIndices[i]);
        }

        htmlWithLinks += substring.replace(
            matchedUrls[i],
            `<a href="${matchedUrls[i]}" target="_blank" rel="nofollow noreferrer noopener">${matchedUrls[i]}</a>`,
        );
    }

    return htmlWithLinks;
}
