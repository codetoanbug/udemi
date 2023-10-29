import {useI18n} from '@udemy/i18n';
import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {AriaAttributes} from 'react';

import {paginatedLink} from './paginated-link';
import styles from './pagination.module.less';

/**
 * Icon with ellipsis.
 *
 * @remarks
 * Separated as a component to use i18n hook.
 */
const PaginationEllipsis = () => {
    const {gettext} = useI18n();

    return <MoreIcon label={gettext('Ellipsis')} size="medium" className={styles.ellipsis} />;
};

/**
 * Interface used for Previous/Next Icon Buttons
 * @internal
 */
interface PaginationIconButtonProps {
    /** Event handler for onClick ev0ent */
    onClick: React.MouseEventHandler<HTMLElement>;
    /** The activePage of the parent `Pagination` component */
    activePage: number;
    /** Flag to determine if the button is disabled */
    disabled?: boolean;
    /** The total page count for the parent `Pagination` component */
    pageCount?: number;
}

/**
 * IconButton to navigate to previous page.
 *
 * @remarks
 * Separated as a component to use i18n hook.
 */
const PaginationPreviousIconButton = ({
    onClick,
    activePage,
    disabled,
}: PaginationIconButtonProps) => {
    const {gettext} = useI18n();

    return (
        <IconButton
            componentClass="a"
            href={paginatedLink(activePage - 1)}
            disabled={activePage <= 1 || disabled}
            size="medium"
            udStyle="secondary"
            round={true}
            onClick={onClick}
            className={styles.prev}
            data-page="-1"
            data-testid="rnc-pagination-previous"
            aria-label={gettext('previous page')}
        >
            <PreviousIcon data-testid="previous-page" label={false} size="small" />
        </IconButton>
    );
};

/**
 * IconButton to navigate to next page.
 *
 * @remarks
 * Separated as a component to use i18n hook.
 */
const PaginationNextIconButton = ({
    onClick,
    activePage,
    disabled,
    pageCount,
}: PaginationIconButtonProps) => {
    const {gettext} = useI18n();

    return (
        <IconButton
            componentClass="a"
            href={paginatedLink(activePage + 1)}
            disabled={(pageCount && activePage >= pageCount) || disabled}
            size="medium"
            udStyle="secondary"
            round={true}
            onClick={onClick}
            className={styles.next}
            data-page="+1"
            data-testid="rnc-pagination-next"
            aria-label={gettext('next page')}
        >
            <NextIcon data-testid="next-page" label={false} size="small" />
        </IconButton>
    );
};

interface PaginationNumericButtonProps {
    pageNumber: number;
    handleClick: React.MouseEventHandler<HTMLElement>;
    disabled?: boolean;
    activePage: number;
    ariaCurrent: AriaAttributes['aria-current'];
}

/**
 * A numeric button, indicating normally search result page numbers
 * between next and previous buttons
 */
const PaginationNumericButton = ({
    pageNumber,
    handleClick,
    disabled,
    activePage,
    ariaCurrent,
}: PaginationNumericButtonProps) => {
    const {interpolate, gettext} = useI18n();

    return (
        <Button
            componentClass="a"
            href={paginatedLink(pageNumber)}
            size="medium"
            udStyle="ghost"
            onClick={handleClick}
            disabled={disabled}
            className={classNames(styles.page, pageNumber === activePage ? styles.active : '')}
            aria-label={interpolate(gettext('Page %(pageNumber)s'), {pageNumber}, true)}
            data-page={pageNumber}
            aria-current={pageNumber === activePage ? ariaCurrent : undefined}
        >
            {pageNumber}
        </Button>
    );
};

/** The React prop interface for the `Pagination` component. */
interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The number of page that the user is currently "on". Starts at & defaults to `1`. */
    activePage?: number;
    /** The total number of pages. */
    pageCount?: number;
    /**
     * The total number of buttons to display between first and last page.
     * An ellipsis is displayed to indicate any other pages in between.
     */
    buttonCount?: number;
    /**
     * Flag to set the last page in pagination as text, not a navigable link.
     *
     *  @remarks
     *  We render pages as links for SEO, but in some cases
     *  we do not want the last page to be crawled because
     *  it tends to contain low-quality content.
     */
    showLastPageAsText?: boolean;
    /** Event handler for when the user navigates to a different page */
    onPageChange?: (activePage: number) => void;
    /** Flag to disable all buttons within the Pagination component */
    disabled?: boolean;
    /** Flag to show/hide the Pagination page buttons */
    showPageButtons?: boolean;
    /** The `aria-current` property type for the active link in `Pagination`.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current}
     *
     * @defaultValue `'page'` in `Pagination`.
     */
    ariaCurrent?: AriaAttributes['aria-current'];
}

const defaultActivePage = 1;
const defaultPageCount = 0;
const defaultButtonCount = 5;
const defaultShowLastPageAsText = false;

/** The Pagination component */
@observer
export class Pagination extends React.Component<PaginationProps> {
    static defaultProps: PaginationProps = {
        disabled: false,
        activePage: defaultActivePage,
        pageCount: defaultPageCount,
        buttonCount: defaultButtonCount,
        showLastPageAsText: defaultShowLastPageAsText,
        showPageButtons: true,
        onPageChange: noop,
        ariaCurrent: 'page',
    };

    componentDidUpdate(prevProps: PaginationProps) {
        if (prevProps.activePage !== this.props.activePage) {
            this.setActivePage(this.props.activePage ?? defaultActivePage);
        }
    }

    @observable activePage: number = this.props.activePage ?? defaultActivePage;

    @action setActivePage(value: number) {
        this.activePage = value;
    }

    handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        event.preventDefault();

        const page = event.currentTarget.dataset.page as string;
        const prevActivePage = this.activePage;
        if (page[0] === '-' || page[0] === '+') {
            this.setActivePage(this.activePage + Number(page));
        } else {
            this.setActivePage(Number(page));
        }
        if (prevActivePage !== this.activePage) {
            this.props.onPageChange?.(this.activePage);
        }
    };

    renderEllipsis(key: string) {
        return <PaginationEllipsis key={key} />;
    }

    renderPageButton = (pageNumber: number) => (
        <PaginationNumericButton
            key={pageNumber}
            disabled={this.props.disabled}
            handleClick={this.handleClick}
            pageNumber={pageNumber}
            activePage={this.activePage}
            ariaCurrent={this.props.ariaCurrent}
        />
    );

    renderPageText(pageNumber: number) {
        return (
            <span key={pageNumber} className={classNames('ud-heading-sm', styles.page)}>
                {pageNumber}
            </span>
        );
    }

    fillWithPageButtons(buttons: [JSX.Element?], startPageNumber: number, count: number) {
        for (let i = 0; i < count; i++) {
            buttons.push(this.renderPageButton(startPageNumber + i));
        }
    }

    renderPageButtons(pageCount: number, buttonCount: number, showLastPageAsText: boolean) {
        const buttons: [JSX.Element?] = [];
        if (buttonCount >= pageCount) {
            this.fillWithPageButtons(buttons, 1, pageCount);
        } else if (this.activePage <= buttonCount - 2) {
            this.fillWithPageButtons(buttons, 1, buttonCount - 2);
            buttons.push(this.renderEllipsis('pre-ellipsis'));
            if (showLastPageAsText) {
                buttons.push(this.renderPageText(pageCount));
            } else {
                buttons.push(this.renderPageButton(pageCount));
            }
        } else if (this.activePage > pageCount - (buttonCount - 2)) {
            buttons.push(this.renderPageButton(1));
            buttons.push(this.renderEllipsis('post-ellipsis'));
            this.fillWithPageButtons(buttons, pageCount - (buttonCount - 2) + 1, buttonCount - 2);
        } else {
            buttons.push(this.renderPageButton(1));
            buttons.push(this.renderEllipsis('pre-ellipsis'));
            this.fillWithPageButtons(buttons, this.activePage, buttonCount - 4);
            buttons.push(this.renderEllipsis('post-ellipsis'));
            if (showLastPageAsText) {
                buttons.push(this.renderPageText(pageCount));
            } else {
                buttons.push(this.renderPageButton(pageCount));
            }
        }

        return buttons;
    }

    render() {
        const {
            activePage,
            pageCount = defaultPageCount,
            onPageChange,
            buttonCount = defaultButtonCount,
            showLastPageAsText = defaultShowLastPageAsText,
            disabled,
            showPageButtons,
            ariaCurrent,
            ...props
        } = this.props;
        if (pageCount < 2 && showPageButtons) {
            return null;
        }

        return (
            <nav
                {...props}
                className={classNames(props.className, styles.container)}
                data-testid="rnc-pagination"
            >
                <PaginationPreviousIconButton
                    onClick={this.handleClick}
                    activePage={this.activePage}
                    disabled={disabled}
                />
                {showPageButtons &&
                    this.renderPageButtons(pageCount, buttonCount, showLastPageAsText)}
                <PaginationNextIconButton
                    onClick={this.handleClick}
                    pageCount={pageCount}
                    activePage={this.activePage}
                    disabled={disabled}
                />
            </nav>
        );
    }
}
