import {useUDData} from '@udemy/ud-data';

export function useIsFeatureEnabled() {
    const {Config} = useUDData();

    function isFeatureEnabled(featureName: string) {
        const findKey = ([first, ...rest]: string[], hashmap = Config.features): boolean => {
            if (rest.length === 0) {
                return hashmap[first] || false;
            }

            return hashmap && first ? findKey(rest, hashmap[first]) : false;
        };

        return findKey(featureName.split('.'));
    }

    return isFeatureEnabled;
}
