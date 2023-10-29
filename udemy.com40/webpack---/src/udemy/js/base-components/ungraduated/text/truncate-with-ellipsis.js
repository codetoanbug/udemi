export default function truncateWithEllipsis(text, charLimit) {
    if (text.length <= charLimit) {
        return text;
    }
    return `${text.slice(0, charLimit)}\u2026`;
}
