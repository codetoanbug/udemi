import {udApi, fetchCommonAppData} from '@udemy/ud-api';

import {HeaderData} from '../header.mobx-store';
import {NavigationCategory} from '../types/user-specific-context';

export interface CommonAppContext {
    data: {
        header: HeaderData;
    };
}

export async function getNavData(params: {
    locale: string;
    isUFB?: boolean;
}): Promise<NavigationCategory[]> {
    /*
        Mack and his team will eventually update the structure of this response.
        The children of the cat and subcat are SD Tags which will become generic tags.
    */
    const navList = params.isUFB ? 'ufb-main' : 'ud-main';
    const headerNavResponse = await udApi.get(
        `/structured-data/navigation-lists/?list_ids=${navList}&locale=${params.locale}`,
    );

    // TODO: need to come back and rewire the mocks for unit tests
    // For now, write in a fallback to expediate a fix for FRON-487
    // return headerNavResponse.data[navList].items;
    const navListResponse =
        headerNavResponse.data[navList] ??
        headerNavResponse.data['ufb-main'] ??
        headerNavResponse.data['ud-main'];
    return navListResponse.items;
}

export async function loadCommonAppContext(
    locale: string,
    isUFB = false,
    cb?: (response: CommonAppContext) => void,
): Promise<CommonAppContext> {
    const [commonAppDataResponse, navigationCategories] = await Promise.all([
        fetchCommonAppData<{header: HeaderData}>({header: true}),
        getNavData({locale, isUFB}),
    ]);
    commonAppDataResponse.data.header.navigationCategories = navigationCategories;

    cb?.(commonAppDataResponse);
    return commonAppDataResponse;
}

loadCommonAppContext.reset = () => {
    fetchCommonAppData.reset();
};
