import {Pagination} from '@udemy/react-navigation-components';
import React, {ComponentProps} from 'react';

import './pagination.less';

interface MyCoursesPaginationStore {
    currentPage: number;
    pageCount: number;
    pageSize: number;
    count: number;
}

type PaginationProps = ComponentProps<typeof Pagination>;

interface MyCoursesPaginationProps {
    store: MyCoursesPaginationStore;
    onPageChange: PaginationProps['onPageChange'];
}

export const getPaginationLabel = (template: string, store: MyCoursesPaginationStore) => {
    if (store.pageCount > 1) {
        const total = store.count;
        const first = (store.currentPage - 1) * store.pageSize + 1;
        const last = Math.min(first + store.pageSize - 1, total);
        return (
            <div className="ud-text-xs" styleName="pagination-label">
                {interpolate(template, {first, last, total}, true)}
            </div>
        );
    }
};

export const getCoursePaginationLabel = (store: MyCoursesPaginationStore) => {
    const template = npgettext(
        'e.g. 1–12 of 24 courses',
        '%(first)s–%(last)s of %(total)s course',
        '%(first)s–%(last)s of %(total)s courses',
        store.count,
    );
    return getPaginationLabel(template, store);
};

export const MyCoursesPagination = ({store, ...props}: MyCoursesPaginationProps) => (
    <Pagination
        styleName="pagination"
        activePage={store.currentPage}
        pageCount={store.pageCount}
        {...props}
    />
);
