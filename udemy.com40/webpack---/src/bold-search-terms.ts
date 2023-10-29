import {escapeHtml, escapeRegex} from '@udemy/shared-utils';

function createSearchTermRegex(term: string) {
    // Only match words that start with term. E.g. the term "pot" should match
    // the phrase "pottery" and "harry potter", but not "despotism". Also it is
    // acceptable to have special characters in front of the matched phrase.
    // Ex. ".net" should be bolded by "net".
    const specialCharactersPrefix = '(\\s|^[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]*)';
    return new RegExp(`(${specialCharactersPrefix}${escapeRegex(escapeHtml(term))})`, 'ig');
}

export function boldSearchTerms(text: string, searchPhrase: string) {
    const searchTerms = searchPhrase.split(/\s+/g);
    return escapeHtml(text)
        .split(' ')
        .map((word: string) => {
            let i, regex;
            for (i = 0; i < searchTerms.length; i++) {
                regex = createSearchTermRegex(searchTerms[i]);
                const bolded = word.replace(regex, '<strong>$1</strong>');
                if (word !== bolded) {
                    return bolded;
                }
            }
            return word;
        })
        .join(' ');
}
