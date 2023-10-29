import {getVariantValueFromUdRequest} from 'utils/get-experiment-data';

export function useIsOutputEnabled(language?: string) {
    if (!language) return false;
    const enabledLanguages = getVariantValueFromUdRequest('is_output_enabled', 'languages', ['']);
    return enabledLanguages.includes(language.toLowerCase());
}
