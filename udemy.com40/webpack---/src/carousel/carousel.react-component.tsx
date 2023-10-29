import {findFocusables, getUniqueId} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {IconButton, ButtonStyleType} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import {debounce, noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {IReactionDisposer, action, computed, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import React, {AriaAttributes} from 'react';
import UAParser from 'ua-parser-js';

import styles from './carousel.module.less';

/** Number of milliseconds to debounce the {@link Carousel} scrollHandler */
export const CAROUSEL_ON_SCROLL_DEBOUNCE_INTERVAL = 100;
/** Names of events to listen to, to allow external pager control */
export const CAROUSEL_NEXT_PAGE_EVENT = 'CarouselNextPageEvent';
export const CAROUSEL_PREV_PAGE_EVENT = 'CarouselPrevPageEvent';

/** Utility functions to make external page control easier to integrate. */
export const dispatchCarouselNextPageEvent = (eventTarget: EventTarget) => {
    eventTarget.dispatchEvent(new Event(CAROUSEL_NEXT_PAGE_EVENT));
};
export const dispatchCarouselPreviousPageEvent = (eventTarget: EventTarget) => {
    eventTarget.dispatchEvent(new Event(CAROUSEL_PREV_PAGE_EVENT));
};

export interface CarouselPagerButtonProps {
    className?: string;
    disabled?: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    pagerButtonSize?: CarouselProps['pagerButtonSize'];
    isLoading?: boolean;
    udStyle?: ButtonStyleType;
}

export const CarouselPreviousButton = ({
    className,
    pagerButtonSize,
    onClick,
    disabled,
    udStyle = 'primary',
}: CarouselPagerButtonProps) => {
    return (
        <IconButton
            className={classNames(
                'ud-carousel-pager-button',
                'ud-carousel-pager-button-prev',
                className,
                styles.button,
                styles['prev-button'],
            )}
            size={
                pagerButtonSize ??
                (Carousel.defaultProps.pagerButtonSize as CarouselProps['pagerButtonSize'])
            }
            udStyle={udStyle}
            round={true}
            onClick={onClick}
            data-pager-type="prev"
            disabled={disabled}
        >
            <CarouselPreviousIcon />
        </IconButton>
    );
};

export const CarouselNextButton = ({
    className,
    pagerButtonSize,
    onClick,
    disabled,
    isLoading,
    udStyle = 'primary',
}: CarouselPagerButtonProps) => {
    const nextIcon = isLoading ? <Loader color="inherit" /> : <CarouselNextIcon />;

    return (
        <IconButton
            className={classNames(
                'ud-carousel-pager-button',
                'ud-carousel-pager-button-next',
                className,
                styles.button,
                styles['next-button'],
            )}
            size={
                pagerButtonSize ??
                (Carousel.defaultProps.pagerButtonSize as CarouselProps['pagerButtonSize'])
            }
            udStyle={udStyle}
            round={true}
            onClick={onClick}
            data-pager-type="next"
            disabled={disabled}
        >
            {nextIcon}
        </IconButton>
    );
};

/**
 * Icon for button to navigate to next set of children.
 *
 * @remarks
 * Separated as a functional component to use i18n hook.
 */
const CarouselNextIcon = () => {
    const {gettext} = useI18n();

    return <NextIcon size="large" color="inherit" label={gettext('Next')} />;
};

/**
 * Icon for button to navigate to previous set of children.
 *
 * @remarks
 * Separated as a functional component to use i18n hook.
 */
const CarouselPreviousIcon = () => {
    const {gettext} = useI18n();

    return <PreviousIcon size="large" color="inherit" label={gettext('Previous')} />;
};

/** Event dispatched when the carousel mounts, when the children nodes change, or when the user scrolls the carousel. */
export interface CarouselMutationEvent {
    /** True if last carousel item has been scrolled into view. */
    isLastPage: boolean;
    /**
     * True there are carousel items not currently visible in the scroll container
     * (i.e., there's content to scroll/page to).
     */
    isPageable: boolean;
    /**
     * The number of calculated pages that can be advanced to.
     * If `isInfiniteScroll` is `true`, then this value is `null`.
     */
    pageCount: number | null;
    /**
     * The index of the currently visible page.
     * If `isInfiniteScroll` is `true`, then this value is `null`.
     *
     * Note that there are some issues with using this value at very small screen sizes; see
     * https://github.com/udemy/design-system-web/pull/544 for more info.
     */
    visiblePageIndex: number | null;
}

interface CarouselRegionProps extends React.ComponentPropsWithoutRef<'div'> {
    ariaLabel?: AriaAttributes['aria-label'];
}

/**
 * HTML `section` wrapper used to infer region role to Carousel.
 *
 */
const CarouselRegion = ({ariaLabel, children}: CarouselRegionProps) => {
    const {gettext} = useI18n();
    return (
        <section
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            aria-label={ariaLabel || gettext('Carousel')}
            className={styles.container}
        >
            {children}
        </section>
    );
};

/** The React props interface for the Carousel component. */
export interface CarouselProps extends React.ComponentPropsWithoutRef<'div'> {
    /**
     * If true, we allow horizontal scrolling/swiping. This is independent from `showPager`.
     * This property should be set to `true` when touch events are available.
     */
    allowScroll?: boolean;
    /** Optional className property to pass onto the pager buttons. */
    pagerButtonClassName?: string;
    /** The size of the Pager Buttons. */
    pagerButtonSize?: 'medium' | 'large';
    /** Optional className property to pass onto an individual item in the Carousel. */
    itemClassName?: string;
    /**
     * Event handler called when the last carousel item is scrolled into view.
     * If you load carousel items dynamically, use this as a trigger to fetch more.
     */
    onLoadMore?: () => Promise<void> | void;
    /**
     * Event dispatched when the carousel mounts, when the children nodes change,
     * or when the user scrolls the carousel.
     */
    onMutation?: (event: CarouselMutationEvent) => void;
    /**
     * Flag to turn on `small-grid` styling on Carousel.
     *
     * @deprecated
     * Use `gridSize`
     */
    smallGrid?: boolean;
    /**
     * Control of grid size within the Carousel when `grid` is `true`. Controls `grid-gap` CSS property.
     *
     * @defaultValue 'medium'
     */
    gridSize?: 'small' | 'medium' | 'large';
    /**
     * If true, then we show pager buttons to allow navigating by click/press when there is content
     * to page to, left and/or right.
     *
     * @remarks
     * Due to a11y concerns, this should not be set to `false` unless there is another way
     * a user can advance the carousel rather than swiping.
     * @see {@link https://udemyjira.atlassian.net/jira/software/c/projects/EDST/boards/135?modal=detail&selectedIssue=EDST-1172}
     *
     * @defaultValue `true` in Carousel.
     */
    showPager?: boolean;
    /** Flag assuming there is constantly new slides being added to carousel. Also used for {@link AutoPlayCarousel} */
    isInfiniteScroll?: boolean;
    /** If true, then carousel controls layout of items with a grid; width defaults to max-content */
    gridMode?: boolean;
    /** If true, then in gridMode set width of grid items to 100% of carousel scroll port, overriding max-content */
    gridFullWidthItems?: boolean;
    /** If true, then scroll by 100% of scroll port width with each pager click */
    pageByFullWidth?: boolean;
    /** The `aria-live` property to apply to the wrapping div of the Carousel.
     *
     * @defaultValue 'polite'
     *
     * @remarks
     * Note that choosing `assertive` can be found to be overly noisy to those using screen reader technology.
     */
    ariaLive?: AriaAttributes['aria-live'];
    /** `aria-label` top apply to the wrapper to help describe `role="region"`
     *
     * @defaultValue 'Carousel' in CarouselRegion
     */
    ariaLabel?: AriaAttributes['aria-label'];
    /** Event handler for when the Next Pager button is clicked. */
    onNextClick?: () => void;
    /** Event handler for when the Previous Pager button is clicked. */
    onPreviousClick?: () => void;
    /**
     * Flag to turn on `ud-full-viewport-container` selector on Carousel.
     *
     * @remarks
     * This is useful on mobile devices when you want to have a carousel that spans the full width of the viewport.
     */
    fullViewport?: boolean;
    /**
     * An event target that can be used to control the Carousel's paging behaviour.
     *
     * @remarks
     * To use this, create a new event target with `new EventTarget()` and pass it in as a prop.
     * You can then control the pager behaviour by using the exported `dispatchCarouselNextPageEvent` or `dispatchCarouselPreviousPageEvent` functions.
     */
    pagerEventTarget?: EventTarget;
}

/**
 * The Carousel component.
 *
 * @remarks
 * This component supports both scrolling and pagination.
 * To ensure the best pagination experience, rather than rendering a list of items, render a list of pages.
 * Each page should contain logic to responsively render its own items.
 *
 * If you must render a list of items, in order for pagination to work reliably,
 * i.e., not inadvertently skip items, make sure that the scrollport width is a multiple of the scroll item width, including margins.
 *
 * ex. scrollport width = 500px; scrollitem width = 250px (including borders, margins)
 *
 * This is because we rely on scrollsnap CSS property to align the scroll items after the paging (element.scrollBy) operation,
 * which simply scrolls the scrollport element in the horizontal direction by its own clientWidth.
 *
 * Since scroll snap picks the closest element to snap to the edge,
 * it can potentially skip an element when it lies in the "grey area" between the pages.
 *
 * This component also supports external control of pager state, by listening to events on the given `pagerEventTarget`.
 * Simply pass in an event target, and then use the exported `dispatchCarouselNextPageEvent` or `dispatchCarouselPreviousPageEvent` functions.
 */
@observer
export class Carousel extends React.Component<CarouselProps> {
    static defaultProps = {
        allowScroll: false,
        pagerButtonClassName: undefined,
        pagerButtonSize: 'large',
        pagerEventTarget: undefined,
        className: undefined,
        itemClassName: undefined,
        id: undefined,
        onLoadMore: undefined,
        onMutation: undefined,
        smallGrid: false,
        gridSize: 'medium',
        showPager: true,
        isInfiniteScroll: false,
        gridMode: true,
        gridFullWidthItems: false,
        pageByFullWidth: false,
        ariaLive: 'polite',
        ariaLabel: undefined,
        onNextClick: noop,
        onPreviousClick: noop,
        fullViewport: false,
    };

    constructor(props: CarouselProps) {
        super(props);

        this.scrollPortRef = React.createRef<HTMLDivElement>();
        this.id = this.props.id ?? getUniqueId('scroll-port');
        this.destroy = noop;
        this.shouldFocusOnFirstVisibleItem = false;

        /**
         * TODO: Remove once Safari fixes smooth scrolling issue
         * See https://bugs.webkit.org/show_bug.cgi?id=238497
         * and https://bugs.webkit.org/show_bug.cgi?id=242224
         * 2022-09-13: fix committed, but unclear if released with Safari 16:
         *    https://webkit.org/blog/13152/webkit-features-in-safari-16-0/
         */
        const uaParser = new UAParser();
        this.scrollBehavior = uaParser.getBrowser().name === 'Safari' ? 'auto' : 'smooth';
    }

    @action componentDidMount() {
        if (this.props.onLoadMore) {
            this.destroy = reaction(() => this.isLastPage, this.handleLastChildEnter);
        }

        this.addPageEventListeners(this.props.pagerEventTarget);
        this.handleCarouselMutation();
    }

    componentDidUpdate(prevProps: CarouselProps) {
        if (prevProps.children !== this.props.children) {
            this.handleCarouselMutation();
        }
        if (prevProps.pagerEventTarget !== this.props.pagerEventTarget) {
            this.removePageEventListeners(prevProps.pagerEventTarget);
            this.addPageEventListeners(this.props.pagerEventTarget);
        }
    }

    componentWillUnmount() {
        this.removePageEventListeners(this.props.pagerEventTarget);
        this.destroy();
    }

    destroy: IReactionDisposer | typeof noop;
    lastChild: React.ReactNode;
    scrollPortRef;
    scrollBehavior: ScrollBehavior;
    shouldFocusOnFirstVisibleItem: boolean;
    id;

    @observable scroll = {
        x: 0,
        clientWidth: 0,
        totalWidth: 0,
    };

    @observable isLoading = false;

    @action
    setIsLoading = (isLoading: boolean) => {
        this.isLoading = isLoading;
    };

    /**
     * Computes the gap in the grid for a grid with full-width items.
     * This is used to adjust page index calculations to account for the gap.
     */
    @computed get gridGapForFullWidthItems() {
        // if gridFullWidthItems is set to true, the scroll x has gridGap added to it
        if (this.props.gridFullWidthItems) {
            switch (this.props.gridSize) {
                case 'large':
                    return 24;
                case 'small':
                    return 8;
                case 'medium':
                default:
                    return 16;
            }
        }

        // default to 0 it only takes into account gap in calculations when gridFullWidthItems is true;
        return 0;
    }

    @computed get isFirstPage() {
        return this.scroll.x === 0;
    }

    @computed get isLastPage() {
        const {x, clientWidth, totalWidth} = this.scroll;
        // Round to nearest 5, there can be a small offset due to hidden items / borders
        return this.round(x + clientWidth) === this.round(totalWidth);
    }

    @computed get isPageable() {
        // Usage of nullish coalescing vs OR operator introduces a bug where pager buttons do not appear.
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return this.props.isInfiniteScroll || (this.pageCount as number) > 1;
    }

    @computed get pageCount() {
        if (this.props.isInfiniteScroll) {
            return null;
        }

        return Math.ceil(
            this.scroll.totalWidth / (this.scroll.clientWidth + this.gridGapForFullWidthItems),
        );
    }

    @computed get visiblePageIndex() {
        if (this.props.isInfiniteScroll) {
            return null;
        }

        return Math.ceil(this.scroll.x / (this.scroll.clientWidth + this.gridGapForFullWidthItems));
    }

    round(n: number, precision = 5) {
        return Math.round(n / precision) * precision;
    }

    handleLastChildEnter = async (isLastPage: boolean) => {
        if (!isLastPage) {
            return;
        }

        const {children, onLoadMore} = this.props;
        const lastChild = (children as React.ReactNodeArray)[React.Children.count(children) - 1];
        if (this.lastChild !== lastChild) {
            this.lastChild = lastChild;
            await onLoadMore?.();
        }
    };

    addPageEventListeners(eventTarget?: EventTarget) {
        eventTarget?.addEventListener?.(CAROUSEL_NEXT_PAGE_EVENT, this.handleCustomNextClick);
        eventTarget?.addEventListener?.(CAROUSEL_PREV_PAGE_EVENT, this.handleCustomPrevClick);
    }

    removePageEventListeners(eventTarget?: EventTarget) {
        eventTarget?.removeEventListener?.(CAROUSEL_NEXT_PAGE_EVENT, this.handleCustomNextClick);
        eventTarget?.removeEventListener?.(CAROUSEL_PREV_PAGE_EVENT, this.handleCustomPrevClick);
    }

    // Another layer of function calls to make mocking in tests easier.
    handleCustomNextClick = () => {
        this.handleNextClick();
    };

    handleCustomPrevClick = () => {
        this.handlePrevClick();
    };

    handleNextClick = async () => {
        const {clientWidth, scrollWidth, scrollLeft} = this.scrollPortRef.current as HTMLDivElement;
        const scrollAmount = this.props.pageByFullWidth ? clientWidth : 0.8 * clientWidth;

        this.props.onNextClick?.();
        if (this.props.onLoadMore) {
            const scrollAmountRemaining = scrollWidth - (scrollLeft + clientWidth);
            if (scrollAmountRemaining < scrollAmount) {
                this.setIsLoading(true);

                await this.props.onLoadMore();
            }
        }

        this.setIsLoading(false);

        this.scrollPortRef.current?.scrollBy({
            left: scrollAmount,
            behavior: this.scrollBehavior,
        });

        this.shouldFocusOnFirstVisibleItem = true;
    };

    handlePrevClick = async () => {
        const {clientWidth} = this.scrollPortRef.current as HTMLDivElement;
        const scrollAmount = this.props.pageByFullWidth ? clientWidth : 0.8 * clientWidth;

        this.props.onPreviousClick?.();
        this.scrollPortRef.current?.scrollBy({
            left: -scrollAmount,
            behavior: this.scrollBehavior,
        });

        this.shouldFocusOnFirstVisibleItem = true;
    };

    focusOnFirstVisibleItem() {
        const left = this.scrollPortRef.current?.getBoundingClientRect().left;
        if (this.scrollPortRef.current?.childNodes && left) {
            const items = Array.from(this.scrollPortRef.current?.childNodes);
            const firstVisibleItem = items.find(
                (item) => (item as HTMLDivElement).getBoundingClientRect().left >= left,
            ) as HTMLDivElement;
            const focusable = firstVisibleItem && findFocusables(firstVisibleItem)[0];
            focusable?.focus();
        }
    }

    @action
    handleCarouselMutation = () => {
        if (this.scrollPortRef.current) {
            const {clientWidth, scrollWidth, scrollLeft} = this.scrollPortRef
                .current as HTMLElement;
            this.scroll = {
                x: scrollLeft,
                totalWidth: scrollWidth,
                clientWidth,
            };

            if (this.shouldFocusOnFirstVisibleItem) {
                this.focusOnFirstVisibleItem();
                this.shouldFocusOnFirstVisibleItem = false;
            }

            this.props.onMutation?.({
                isLastPage: this.isLastPage,
                isPageable: this.isPageable,
                pageCount: this.pageCount,
                visiblePageIndex: this.visiblePageIndex,
            });
        }
    };

    scrollHandler = debounce(this.handleCarouselMutation, CAROUSEL_ON_SCROLL_DEBOUNCE_INTERVAL);

    render() {
        const {
            allowScroll,
            children,
            id,
            onLoadMore,
            onMutation,
            pagerButtonClassName,
            pagerButtonSize,
            className,
            itemClassName,
            smallGrid,
            gridSize,
            showPager,
            isInfiniteScroll,
            gridMode,
            gridFullWidthItems,
            pageByFullWidth,
            ariaLive,
            ariaLabel,
            onNextClick,
            onPreviousClick,
            fullViewport,
            pagerEventTarget,
            ...props
        } = this.props;

        const pager = (
            <>
                <CarouselPreviousButton
                    className={pagerButtonClassName}
                    disabled={isInfiniteScroll ? false : this.isFirstPage}
                    onClick={() => {
                        this.handlePrevClick();
                    }}
                    pagerButtonSize={pagerButtonSize}
                />
                <CarouselNextButton
                    className={pagerButtonClassName}
                    disabled={isInfiniteScroll ? false : this.isLastPage}
                    onClick={() => {
                        this.handleNextClick();
                    }}
                    isLoading={this.isLoading}
                    pagerButtonSize={pagerButtonSize}
                />
            </>
        );

        return (
            <CarouselRegion ariaLabel={ariaLabel}>
                <div
                    ref={this.scrollPortRef}
                    className={classNames(className, styles['scroll-port'], {
                        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                        [styles['small-grid']]: smallGrid || gridSize === 'small',
                        [styles['large-grid']]: gridSize === 'large',
                        [styles.grid]: gridMode,
                        [styles['grid-full-width-items']]: gridMode && gridFullWidthItems,
                        [styles['scroll-lock']]: !allowScroll,
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'ud-full-viewport-container': fullViewport,
                        [styles['container-full-viewport']]: fullViewport,
                    })}
                    data-purpose={'scroll-port'}
                    {...props}
                    id={this.id}
                    onScroll={this.scrollHandler}
                    aria-live={ariaLive}
                >
                    {React.Children.map(children, (child, i) => (
                        <div
                            data-index={i}
                            className={classNames(itemClassName, styles['scroll-item'])}
                            key={i}
                        >
                            {child}
                        </div>
                    ))}
                </div>
                {this.isPageable && showPager && pager}
            </CarouselRegion>
        );
    }
}
