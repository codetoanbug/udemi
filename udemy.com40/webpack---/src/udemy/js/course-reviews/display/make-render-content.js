import React from 'react';

import escapeRegex from 'utils/escape/escape-regex';

/*
 * This function is responsible for:
 *  - Splitting review/response content up into paragraphs.
 *  - Adding highlighting around search terms.
 */
export default function makeRenderContent(query) {
    function renderContent(content, shouldUseSeparateParagraphs = true) {
        let lines = content.split(/\n+/);
        if (query) {
            const queryWords = query.split(/\s+/);
            const queryRegExp = RegExp(queryWords.map(escapeRegex).join('|'), 'gi');
            lines = lines.map((line) => {
                const parts = [];
                let strongKey = 0;
                queryRegExp.lastIndex = 0; // Maybe not necessary but safer since we reuse queryRegExp.
                while (true) {
                    const lastIndex = queryRegExp.lastIndex;
                    const match = queryRegExp.exec(line);
                    if (!match) {
                        // No more matches, output the rest of the string.
                        parts.push(line.substring(lastIndex));
                        break;
                    }
                    // Output the unmatched portion.
                    parts.push(line.substring(lastIndex, match.index));
                    // Output the matched portion.
                    parts.push(<strong key={strongKey++}>{match[0]}</strong>);
                }
                return parts.filter((x) => x !== '');
            });
        }
        if (shouldUseSeparateParagraphs) {
            return lines.map((line, i) => <p key={i}>{line}</p>);
        }
        return lines.map((line, i) => <span key={i}>{line}</span>);
    }
    return renderContent;
}
