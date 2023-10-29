/**
 * Filter given search params from the given path
 * @param pathWithParams
 * @param searchParamsToKeep
 */
export const filterSearchParamsFromPath = (
    pathWithParams: string,
    searchParamsToKeep: string[] = [],
) => {
    const url = new URL(pathWithParams, 'https://www.udemy.com');
    const params = url.searchParams;
    const keys = Array.from(params.keys());
    const keysToRemove = keys.filter((key) => !searchParamsToKeep.includes(key));
    keysToRemove.forEach((key) => params.delete(key));
    return url.pathname + url.search;
};

/**
 * Constructing the Udemy's canonical URL from given URL with search params to keep
 * In default, it will remove all the search params except the ones in searchParamsToKeep array.
 *
 * If defaultLocale is given, it will remove the default locale from the path. We're not using defaultLocale in general
 * on our canonical urls. For example, we're not including "en" in our canonical urls.
 *
 * @param url
 * @param searchParamsToKeep
 * @param defaultLocale
 */
export const constructCanonicalUrl = (
    url: string,
    searchParamsToKeep: string[] = [],
    defaultLocale?: string,
) => {
    const urlToFilter = new URL(url);

    let pathAndParamsToFilter = urlToFilter.pathname + urlToFilter.search;

    // Scrape default locale from the path
    if (defaultLocale) {
        pathAndParamsToFilter = pathAndParamsToFilter.replace(`/${defaultLocale}/`, '/');
    }

    const filteredPathAndParams = filterSearchParamsFromPath(
        pathAndParamsToFilter,
        searchParamsToKeep,
    );

    return urlToFilter.origin + filteredPathAndParams;
};
