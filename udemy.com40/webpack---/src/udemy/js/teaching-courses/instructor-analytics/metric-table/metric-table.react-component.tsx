import {Pagination} from '@udemy/react-navigation-components';
import {Table, TableProps, TableRow} from '@udemy/react-structure-components';
import {TableColumn} from '@udemy/react-structure-components/dist/@types/table/table.react-component';
import React from 'react';

import styles from './metric-table.less';

interface MetricTableProps {
    columns: TableColumn[];
    rows: TableRow[];
    pageCount?: number;
    activePage?: number;
    onPageChange?: (page: number) => void;
    tableProps?: Partial<TableProps>;
}

export const MetricTable = ({
    columns,
    rows,
    pageCount,
    activePage,
    onPageChange,
    tableProps,
}: MetricTableProps) => {
    return (
        <div>
            <Table
                data-purpose="metric-table-component"
                className={styles['table-margin']}
                columns={columns}
                rows={rows}
                {...tableProps}
            />
            <Pagination
                data-purpose="metric-table-pagination"
                pageCount={pageCount}
                activePage={activePage}
                onPageChange={onPageChange}
            />
        </div>
    );
};
