import qs from 'qs';
import React from 'react';

import {getQueryParams} from '../env/query-params';
import {serverOrClient} from '../env/server-or-client';

interface PaginationQueryParams {
    p: number;
}

function getFirstPageIndicators(queryParams: PaginationQueryParams, currentHref: string) {
    if (!queryParams.p) {
        queryParams.p = 1;
    }

    queryParams.p += 1;
    return <link key="next" rel="next" href={`${currentHref}?${qs.stringify(queryParams)}`} />;
}

function getLastPageIndicators(queryParams: PaginationQueryParams, currentHref: string) {
    queryParams.p -= 1;
    return <link key="prev" rel="prev" href={`${currentHref}?${qs.stringify(queryParams)}`} />;
}

function getSecondPageIndicators(queryParams: PaginationQueryParams, currentHref: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {p, ...prevQueryParams} = queryParams;
    const nextQueryParams = Object.assign({}, queryParams);
    nextQueryParams.p += 1;

    if (Object.keys(prevQueryParams).length === 0) {
        return [
            <link key="prev" rel="prev" href={currentHref} />,
            <link key="next" rel="next" href={`${currentHref}?${qs.stringify(nextQueryParams)}`} />,
        ];
    }
    return [
        <link key="prev" rel="prev" href={`${currentHref}?${qs.stringify(prevQueryParams)}`} />,
        <link key="next" rel="next" href={`${currentHref}?${qs.stringify(nextQueryParams)}`} />,
    ];
}

function getMiddlePageInidicators(queryParams: PaginationQueryParams, currentHref: string) {
    const nextQueryParams = Object.assign({}, queryParams);
    nextQueryParams.p += 1;
    const prevQueryParams = Object.assign({}, queryParams);
    prevQueryParams.p -= 1;
    return [
        <link key="prev" rel="prev" href={`${currentHref}?${qs.stringify(prevQueryParams)}`} />,
        <link key="next" rel="next" href={`${currentHref}?${qs.stringify(nextQueryParams)}`} />,
    ];
}

export interface PaginatedContentIndicatorProps {
    /**
     * The current page number
     */
    currentPage?: number;
    /**
     * The total number of pages
     */
    totalPages?: number;
    /**
     * Custom location object, useful for testing and server-side rendering
     * @default window.location
     */
    location?: Location;
    /**
     * Function that should render the given array of tags into the document head
     * @param tags an array of `<link>` tags to render
     */
    renderTags(tags: React.ReactNode[]): React.ReactElement;
}

/**
 * Component that renders `<link>` tags for paginated content into the document head
 */
export const PaginatedContentIndicator = ({
    currentPage,
    totalPages,
    location,
    renderTags,
}: PaginatedContentIndicatorProps) => {
    location = location ?? serverOrClient.global.location;
    if (!currentPage || !totalPages) {
        return null;
    }

    let linkTags: React.ReactNode[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryParams: any = getQueryParams(location);
    if (queryParams.p) {
        queryParams.p = parseInt(queryParams.p, 10);
    }

    const currentHref = location.origin + location.pathname;

    if (currentPage === 1 && totalPages === 1) {
        linkTags = [];
    } else if (currentPage === totalPages) {
        linkTags.push(getLastPageIndicators(queryParams, currentHref));
    } else if (currentPage === 1) {
        linkTags.push(getFirstPageIndicators(queryParams, currentHref));
    } else if (currentPage === 2) {
        linkTags.push(...getSecondPageIndicators(queryParams, currentHref));
    } else {
        linkTags.push(...getMiddlePageInidicators(queryParams, currentHref));
    }

    return renderTags(linkTags);
};
