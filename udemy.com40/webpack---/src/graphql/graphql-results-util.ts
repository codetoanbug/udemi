import {
    AutocompleteSuggestionsQuery,
    Course,
    CourseInstructor,
    SearchAutocompleteLogItem,
} from './api-platform-graphql';

import {getConfigData} from '@udemy/shared-utils';

import {AutoCompleteResult} from '../search-form-autocomplete.mobx-store';

const constructSearchLogItemUrl = (phrase: string) => {
    const SEARCH_URL = '/courses/search/';
    const UFB_SEARCH_URL = '/organization/search/';
    const url = getConfigData().brand.has_organization ? UFB_SEARCH_URL : SEARCH_URL;
    return `${url}?q=${phrase}`;
};

export const mapGraphqlResultsToAutocompleteResults = (
    results: AutocompleteSuggestionsQuery['searchAutocomplete'],
): AutoCompleteResult[] => {
    const mappedResults: AutoCompleteResult[] = [];

    results.forEach((result) => {
        if (!result) {
            return;
        }

        let name = '';
        const mappedResult: AutoCompleteResult = {id: 0} as unknown as AutoCompleteResult;

        if (result.item?.__typename === 'SearchAutocompleteLogItem') {
            // Since we're using aliasing on the query, we couldn't use real type itself.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            name = (result.item as SearchAutocompleteLogItem).phrase ?? '';
            mappedResult.id = 0;
            // Construct the ulr since graphql is not returning the url unlike the rest endpoint
            mappedResult.link = constructSearchLogItemUrl(name);
            mappedResult.type = 'search_log';
        } else {
            if (result.item?.__typename === 'Course') {
                const item = result.item as Course;
                name = item.title ?? '';
                mappedResult.img_link = item.images.px50x50 ?? '';
                mappedResult.instructor_name = item.instructors?.map((inst) => inst.name);
                mappedResult.type = 'course';
            } else if (result.item?.__typename === 'CourseInstructor') {
                const item = result.item as CourseInstructor;
                name = (result.item as CourseInstructor).name ?? '';
                mappedResult.display_name = name;
                mappedResult.img_link = item.images.px50x50 ?? '';
                mappedResult.type = 'user';
            }

            // Below are common between Course and Instructor
            mappedResult.id = Number(result.item?.id) ?? 0;
            mappedResult.link = result.item?.url;
        }
        mappedResult.label = name;
        mappedResult.result_tracking_id = result.resultTrackingId;
        mappedResult.tracking_id = result.trackingId;
        mappedResults.push(mappedResult);
    });

    return mappedResults;
};
