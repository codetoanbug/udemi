import {FooterData, FooterServerData} from '@udemy/footer';
import {HeaderData} from '@udemy/react-header';

import {getRuntimeConfig} from 'src/pages/api/config.api';

import {udemyApi} from './ud-global-fetch';

interface HeaderAndFooterServerResponse {
    header: HeaderData;
    footer: FooterServerData;
}
export interface HeaderAndFooterClientResponse {
    header: HeaderData;
    footer: FooterData;
}

export interface MarketplaceLayoutParams {
    header: string;
    footer: string;
    for_public_caching?: string;
    locale?: string;
}

const fetchHeaderAndFooterServerProps = async (locale: string) => {
    const data = await _fetchHeaderAndFooterProps({
        locale,
        for_public_caching: 'true',
        isServer: true,
    });
    return data as HeaderAndFooterServerResponse;
};

export const fetchHeaderAndFooterClientProps = async (locale: string) => {
    const data = await _fetchHeaderAndFooterProps({locale});
    return data as HeaderAndFooterClientResponse;
};

const _fetchHeaderAndFooterProps = async ({
    locale = 'en',
    for_public_caching,
    isServer = false,
}: {
    locale: string;
    for_public_caching?: string;
    isServer?: boolean;
}) => {
    const params: MarketplaceLayoutParams = {
        header: 'true',
        footer: 'true',
    };
    if (locale) {
        params.locale = locale;
    }
    /*
        In django monolith/varnish, there is 'uses_public_caching' attached to the request object.
        In order to trigger that, we pass a query param called 'for_public_caching'.
        The usage of this query param is to ask the api for non user specific data so we can
        eventually cache the server side rendered page.
    */
    if (for_public_caching) {
        params.for_public_caching = for_public_caching;
    }

    const url = isServer
        ? `${getRuntimeConfig('MONOLITH_URL')}/api-2.0/contexts/me/`
        : `/contexts/me/`;

    const response = await udemyApi.get(url, {
        params,
        headers: {
            credentials: 'include',
        },
    });

    /*
        Mack and his team will eventually update the structure of this response.
        The children of the cat and subcat are SD Tags which will become generic tags.
    */
    const navList = 'ud-main';
    const headerNavUrl = isServer
        ? `${getRuntimeConfig(
              'MONOLITH_URL',
          )}/api-2.0/structured-data/navigation-lists/?list_ids=${navList}`
        : `/structured-data/navigation-lists/?list_ids=${navList}`;

    const headerNavResponse = await udemyApi.get(headerNavUrl, {
        params,
        headers: {
            credentials: 'include',
        },
    });

    response.data.header.navigationCategories = headerNavResponse.data[navList].items;

    return response.data;
};

export const fetchHeaderAndFooterProps = async (locale: string) => {
    const {header, footer} = await fetchHeaderAndFooterServerProps(locale);

    return {
        headerProps: header,
        footerProps: footer,
    };
};
