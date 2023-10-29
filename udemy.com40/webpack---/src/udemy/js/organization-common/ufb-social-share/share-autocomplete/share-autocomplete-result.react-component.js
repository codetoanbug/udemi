import PropTypes from 'prop-types';
import React from 'react';

export function getSuggestionText(suggestion) {
    let prefix = '';
    if (suggestion.is_channel) {
        prefix = '#';
    } else if (suggestion.is_user) {
        prefix = '@';
    }
    const valueWithoutPrefix = suggestion.value || suggestion.title;
    return {prefix, valueWithoutPrefix};
}

export default function ShareAutocompleteResult({suggestion, query}) {
    const {prefix, valueWithoutPrefix} = getSuggestionText(suggestion);
    const splitSuggestions = React.useMemo(() => {
        const re = new RegExp(`(${query})`, 'gi');
        const parts = valueWithoutPrefix.split(re);

        if (!parts[0]) {
            parts.splice(0, 1);
        }

        return parts;
    }, [query, valueWithoutPrefix]);

    return (
        <span>
            {splitSuggestions.map((part, index) => {
                if (part.toLowerCase() === query) {
                    return (
                        <span key={index}>
                            {index === 0 ? prefix : ''}
                            <strong>{part}</strong>
                        </span>
                    );
                }
                return (
                    <span key={index}>
                        {index === 0 ? prefix : ''}
                        {part}
                    </span>
                );
            })}
        </span>
    );
}

ShareAutocompleteResult.propTypes = {
    suggestion: PropTypes.object.isRequired,
    query: PropTypes.string.isRequired,
};
