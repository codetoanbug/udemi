/* eslint-disable @typescript-eslint/naming-convention */
import {getUniqueId} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {Button} from '@udemy/react-core-components';
import {pxToRem} from '@udemy/styles';
import classNames from 'classnames';
import {useObserver} from 'mobx-react';
import React, {useEffect, useRef, useState} from 'react';

import styles from './table.module.less';

/** The various sizes of Table Padding. This aligns with CSS classnames. */
export type TablePaddingSuffixes = 'zero' | 'xxs' | 'xs' | 'sm' | 'md';
/** Direction that a Table should sort its array of {@link TableRow}  */
export type TableSortOrder = 'ascending' | 'descending';

/**
 * React props interface for the `Table` components `<th>` element.
 *
 * @internal
 */
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableCellElement> {
    /** A numerical key, used for mapping over  */
    key: number;
    /** Sets or retrieves the group of cells in a table to which the object's information applies. */
    scope?: string;
    /** Data attribute for type */
    'data-type'?: string;
    /** Data attribute for purpose */
    'data-purpose'?: string;
    /** A11y related attribute for `Table` sort order */
    'aria-sort'?: TableSortOrder;
    /** Data attribute for the initial sort order of the `Table` */
    'data-initial-sort'?: TableSortOrder;
    /** Optional handler when TableCellElement rendered is clicked. */
    onClick?: () => void;
}

/** The object used to control sorting within a Table */
export interface TableSortBy {
    /** The {@link TableColumn} field name to sort by */
    fieldName?: string;
    /** Flag to determine if the sort order is ascending. */
    ascending?: boolean;
}

export type TableCellRenderMethod = (
    row: TableRow,
    rowIndex: number,
    rows: TableRow[],
) => React.ReactNode;

export interface TableColumn {
    /** Unique string associated with a column. (ex: 'title' for a 'Title' `headerName`  ) */
    fieldName: string;
    /** Flag to determine if a fow has a header. */
    hasRowHeader?: boolean;
    /** Flag to turn on ScreenReader only functionality */
    isScreenReaderOnly?: boolean;
    /** The initial sort order of the `Table`. */
    initialSortOrder?: TableSortOrder;
    /** Optional render method to use for rendering content within a specific column. */
    renderMethod?: TableCellRenderMethod;
    /** String used for populating the `data-type` attribute. */
    type?: string;
    /** The rendered node shown in a `<th>` cell. */
    headerName?: React.ReactNode;
    /** Width of a cell, can be either a numerical value (in px) or a CSS dimension.  */
    width?: number | string;
    /** Flag to adjust `nowrap` CSS.  Setting to false sets inline style `white-space: nowrap`. */
    wrap?: boolean;
    /** Optional string used for `data-purpose` attribute. */
    purpose?: string;
}

/** A Table Row.  An Array of Mystery as it can be anything you want rendered. */
export type TableRow = unknown;

/** React Props interface for the `Table` component. */
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
    /** The Column information used to provide context within the `<th>` elements. */
    columns: TableColumn[];
    /** Raw data used to render `Table` rows. */
    rows: TableRow[];
    /**
     * Render function for a `Table` header
     *
     * @defaultValue {@link defaultRenderHeader} in Table
     */
    renderHeader?: TableRenderHeaderFunction;
    /** The render function for a `Table` footer */
    renderFooter?: TableRenderFooterFunction;
    /** Render function for a `Table` header
     * @defaultValue {@link defaultRenderRow} in Table
     */
    renderRow?: TableRenderRowFunction;
    /** Render function for a `Table` row column
     * @defaultValue {@link defaultRenderRowColumn} in Table
     */
    renderRowColumn?: TableRenderRowColumnFunction;
    /** Optional string to render in a `<caption>` element */
    caption?: string;
    /** Direction to sort the Table.  @see {@link TableSortBy}. */
    sortBy?: TableSortBy;
    /** Optional handler to call when the table has been sorted. */
    onSort?: (col: TableColumn) => void;
    /**
     * Flag to disable borders on the side of the rendered `Table` component.
     *
     * @defaultValue false in `Table`
     */
    noBorder?: boolean;
    /**
     * Flag to disable background color of the rendered `Table` component.
     *
     * @defaultValue false in `Table`
     */
    noBackgroundColor?: boolean;
    /**
     * Padding with a table cell.
     *
     * @defaultValue 'sm' in `Table`
     */
    padding?: TablePaddingSuffixes;
    /**
     * Flag to render an inverted version of the Table (similar to dark mode styling)
     *
     * @defaultValue false in `Table`
     */
    invertedColors?: boolean;
    /**
     * Flag to disable CSS gradient shadows on the edge of the table.
     *
     * @defaultValue false in `Table`
     *
     * @remarks
     * This likely should be false if `invertedColors` is `true`.
     */
    scrollShadow?: boolean;
}

/**
 * React props interface for the `<div>` element wrapping the `<table>` element.
 *
 * @internal
 */
interface TableWrappingDivProps extends React.HTMLAttributes<HTMLDivElement> {
    role: string;
    tabIndex?: number;
    'aria-labelledby': string;
}

/**
 * The function used to render a `<th>` element;
 */
export type TableRenderHeaderFunction = (
    /** The array of TableColumn types */
    columns: TableColumn[],
    /** Unique string for the `th` */
    id: string,
    /** The current {@link TableSortBy} used to render the table */
    sortBy?: TableSortBy,
    /** An optional handler to trigger when the table is sorted. */
    onSort?: (col: TableColumn) => void,
) => React.ReactNode;

/** The default render method used for a `Table` component `<th>` element. */
export const defaultRenderHeader: TableRenderHeaderFunction = (columns, id, sortBy, onSort) => (
    <tr>
        {columns.map((col, index) => {
            const style = {} as React.CSSProperties;
            const props: TableHeaderProps = {
                key: index,
                children: col.headerName,
                scope: 'col',
                'data-type': col.type ?? undefined,
                'data-purpose': col.purpose ?? undefined,
                style,
            };
            if (col.width) {
                // Lots of Type casting has to be done here to make TypeScript happy.
                // We are are allowing col.width to be a string or number, but Typescript does
                // not realize we are munging it so that the style.width value is a string;
                style.width = (
                    /^\d+$/.test(col.width as string)
                        ? `${pxToRem(col.width as number)}rem`
                        : col.width
                ) as string;
            }

            if (col.wrap === false) {
                style.whiteSpace = 'nowrap';
            }

            if (sortBy && sortBy.fieldName === col.fieldName) {
                props['aria-sort'] = sortBy.ascending ? 'ascending' : 'descending';
            }
            if (sortBy && col.initialSortOrder) {
                props['data-initial-sort'] = col.initialSortOrder;
                props.onClick = () => onSort?.(col);
                props.children = (
                    <span id={`${id}-header-${index}`} className={styles['sortable-header-text']}>
                        {props.children}
                        <Button
                            aria-labelledby={`${id}-header-${index}`}
                            udStyle="link"
                            className={classNames(
                                'ud-link-neutral',
                                styles['sortable-header-icon'],
                            )}
                        >
                            <ExpandIcon label={false} size="small" />
                        </Button>
                    </span>
                );
            }

            if (col.isScreenReaderOnly) {
                props.children = <span className="ud-sr-only">{props.children}</span>;
            }

            // `key` is provided via the `props` spread. Eslint cannot seem to see that.
            // eslint-disable-next-line react/jsx-key
            return <th {...props} />;
        })}
    </tr>
);

/**
 * The function used to render a `<tfoot>` element;
 */
export type TableRenderFooterFunction = (
    /** The array of TableColumn types */
    columns: TableColumn[],
    /** Raw data used to render `Table` rows. */
    rows: TableRow[],
    /** Unique string for the `th` */
    id: string,
) => React.ReactNode;

/**
 * The function used to render a `<tr>` element;
 */
export type TableRenderRowFunction = (
    /** The array of TableColumn types */
    columns: TableColumn[],
    rows: TableRow[],
    row: TableRow,
    rowIndex: number,
    renderRowColumn?: TableRenderRowColumnFunction,
) => React.ReactNode;

/** Default rendering function for a Row within the {@link Table} component */
export const defaultRenderRow: TableRenderRowFunction = (
    columns,
    rows,
    row,
    rowIndex,
    renderRowColumn = defaultRenderRowColumn,
) => (
    <tr key={rowIndex}>
        {columns.map((col, colIndex) => renderRowColumn(col, colIndex, rows, row, rowIndex))}
    </tr>
);

/**
 * The function used to render a `<td>` element;
 */
export type TableRenderRowColumnFunction = (
    column: TableColumn,
    colIndex: number,
    rows: TableRow[],
    row: TableRow,
    rowIndex: number,
) => React.ReactNode;

/** Default rendering function for a Row Column within the {@link Table} component */
export const defaultRenderRowColumn: TableRenderRowColumnFunction = (
    column,
    colIndex,
    rows,
    row,
    rowIndex,
) => {
    const value = column.renderMethod
        ? column.renderMethod(row, rowIndex, rows)
        : (row as Record<string, unknown>)[column.fieldName];

    const props = {
        key: colIndex,
        children: value as React.ReactNode,
        'data-type': column.type ?? null,
        'data-purpose': column.purpose ?? null,
        'data-sortable': !!column.initialSortOrder || null,
    };

    if (column.hasRowHeader) {
        return <th {...props} scope="row" />;
    }

    return <td {...props} />;
};

/**
 * ### The Table Component.
 *
 * @remarks
 * Renders an `<table>` element with sorting capabilities.  This is a very, very flexible component in terms of how it renders and what
 * data model can be used to render rows.  As such, some notes for helping developer sanity using this in a TypeScript file:
 *
 * - This component uses `unknown` to type TableRow. You may need to occasionally cast a `row` as `Record<string, unknown>` if trying to index off it.
 *   Example:
 *   ```
 *   const foo = (row as Record<string, string>).fooBar
 *   ```
 * - The `column` prop will frequently return type errors unless you cast your column data `as TableColumn[]`.
 *   Example:
 *   ```
 *   const columns = [
 *       {
 *          fieldName: 'id',
 *       },
 *       ...
 *   ] as TableColumn[]
 *   ```
 */
export const Table = ({
    columns,
    rows,
    renderHeader = defaultRenderHeader,
    renderFooter,
    renderRow = defaultRenderRow,
    renderRowColumn = defaultRenderRowColumn,
    caption = '',
    sortBy = undefined,
    onSort = undefined,
    noBorder = false,
    noBackgroundColor = false,
    padding = 'sm',
    invertedColors = false,
    scrollShadow = true,
    ...props
}: TableProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [id] = useState(getUniqueId('table'));
    const [tabIndex, setTabIndex] = useState<number | undefined>(undefined);
    const {gettext} = useI18n();

    // componentDidMount
    useEffect(() => {
        const {scrollWidth, clientWidth} = containerRef.current as HTMLDivElement;
        const scrollable = scrollWidth > clientWidth;
        setTabIndex(scrollable ? 0 : undefined);
    }, []);

    return useObserver(() => {
        const wrapperProps: TableWrappingDivProps = {
            role: 'group',
            tabIndex,
            'aria-labelledby': '',
        };

        const captionProps: React.HTMLAttributes<HTMLTableCaptionElement> = {
            className: 'ud-sr-only',
            children: caption,
        };

        if (sortBy) {
            const sortableCaption = gettext('Column headers with buttons are sortable.');
            captionProps.children = `${captionProps.children} ${sortableCaption}`.trim();
        }

        if (captionProps.children) {
            // WAI-ARIA-1.1 region (role): https://www.w3.org/TR/wai-aria-1.1/#region
            // A perceivable section containing content that is relevant to a specific, author-specified
            // purpose and sufficiently important that users will likely want to be able to navigate to
            // the section easily and to have it listed in a summary of the page. Such a page summary
            // could be generated dynamically by a user agent or assistive technology.
            // ...
            // Authors MUST give each element with role region a brief label that describes the
            // purpose of the content in the region. Authors SHOULD reference a visible label with
            // aria-labelledby if a visible label is present.
            captionProps.id = `${id}-caption`;
            wrapperProps['aria-labelledby'] = `${id}-caption`;
            wrapperProps.role = 'section';
        }

        const classes = classNames(
            props.className,
            styles.container,
            styles[`padding-${padding}`],
            {
                [styles['no-border']]: noBorder,
                [styles['no-background-color']]: noBackgroundColor,
                [styles['inverted-colors']]: invertedColors,
                [styles['no-scroll-shadow']]: !scrollShadow,
            },
        );

        return (
            <div {...wrapperProps} ref={containerRef} {...props} className={classes}>
                <table>
                    {!!captionProps.children && <caption {...captionProps} />}
                    <thead>{renderHeader(columns, id, sortBy, onSort)}</thead>
                    {rows.length > 0 && (
                        <tbody>
                            {rows.map((row, i) =>
                                renderRow(columns, rows, row, i, renderRowColumn),
                            )}
                        </tbody>
                    )}
                    {renderFooter?.(columns, rows, id)}
                </table>
            </div>
        );
    });
};
