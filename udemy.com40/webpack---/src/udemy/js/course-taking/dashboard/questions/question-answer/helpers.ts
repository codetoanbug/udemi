export function sanitizeUserGeneratedContent(rawInput: string): string {
    const phraseRegex = /\/etc\/hosts\/?|`curl/gi;
    const matches = rawInput.match(phraseRegex);

    if (matches && matches.length > 0) {
        matches.forEach((value) => {
            const encodedMatch = btoa(value);
            rawInput = rawInput.replaceAll(value, `#UDEMYSEPSTART#${encodedMatch}#UDEMYSEPEND#`);
        });
    }

    return rawInput;
}
