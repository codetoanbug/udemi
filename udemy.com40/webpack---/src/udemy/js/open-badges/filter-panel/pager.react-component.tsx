import {Pagination} from '@udemy/react-navigation-components';
import {PaginatedContentIndicator} from '@udemy/shared-utils';
import React from 'react';
import {Helmet} from 'react-helmet';

interface PagerProps {
    activePage: number;
    pageCount: number;
    onPageChange: (activePage: number) => void;
}

export const Pager = (pagerProps: PagerProps) => {
    return (
        <>
            <PaginatedContentIndicator
                currentPage={pagerProps.activePage}
                totalPages={pagerProps.pageCount}
                renderTags={(tags) => <Helmet>{tags}</Helmet>}
            />
            <Pagination
                activePage={pagerProps.activePage}
                pageCount={pagerProps.pageCount}
                showLastPageAsText={true}
                onPageChange={pagerProps.onPageChange}
            />
        </>
    );
};
