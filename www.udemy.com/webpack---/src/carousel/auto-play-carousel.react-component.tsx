import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {Carousel, CarouselProps, CarouselMutationEvent} from './carousel.react-component';

/** Event dispatched when the `AutoplayCarousel` has a change to it's autoplay interval */
export interface AutoPlayCarouselIntervalEvent {
    /** Flag set to true if the user has paused the auto play feature temporarily */
    isPaused: boolean;
    /** The interval duration per slide for the AutoPlayCarousel */
    intervalDuration: number;
}

/** The React props interface for the AutoPlayCarousel component */
export interface AutoPlayCarouselProps extends CarouselProps {
    /** If set to true, the component will prioritize interactions to use touch events */
    prioritizeTouch?: boolean;
    /**
     * The duration of a slide interval, in milliseconds
     *
     * @defaultValue 7000 in `AutoPlayCarousel`
     */
    intervalDuration?: number;
    /**
     * Event dispatched when the carousel pauses or resumes.  A resume event is dispatched
     * on component mount if there is more than one slide in the carousel.
     */
    onIntervalUpdate?: (event: AutoPlayCarouselIntervalEvent) => void;
}

/**
 * The AutoPlayCarousel component.
 *
 * @remarks
 * This component currently only works on carousels that show one item at a time.
 * To make auto play possible, we insert the last item of the carousel in the front of the carousel
 * and the first item of the carousel in the end of the carousel to make an infinite scroll.
 * Then, we update the scroll port position to the real first or last item.
 */
@observer
export class AutoPlayCarousel extends React.Component<AutoPlayCarouselProps> {
    static defaultProps = {
        ...Carousel.defaultProps,
        showPager: null,
        prioritizeTouch: false,
        intervalDuration: 7000,
    };

    @action componentDidMount() {
        const hasMoreThanOneChild = React.Children.count(this.props.children) > 1;
        if (hasMoreThanOneChild) {
            // AutoPlayCarousel only works on carousels that show one item at a time.
            // Assume the item takes up the entire width of the carousel and
            // compare the width of an item to the carousel width.
            if (this.ref.current) {
                const scrollPort = this.ref.current.scrollPortRef.current;
                const firstChild = scrollPort?.firstChild as HTMLDivElement;
                const carouselItemWidth = firstChild.clientWidth;
                const roundedCarouselItemWidth = Math.ceil(carouselItemWidth / 5) * 5;
                const carouselWidth = scrollPort?.clientWidth;
                if (carouselWidth) {
                    const roundedCarouselWidth = Math.ceil(carouselWidth / 5) * 5;

                    if (carouselWidth > 0 && roundedCarouselItemWidth === roundedCarouselWidth) {
                        this.canAutoPlay = true;
                        this.isPaused = false;
                        scrollPort.scrollLeft = carouselItemWidth;
                        this.resumeCarousel();
                    }
                }
            }
        }
    }

    componentWillUnmount() {
        this.pauseCarousel();
    }

    @observable canAutoPlay = false;
    @observable allowAutoPlay = true;
    @observable isPaused = true;

    autoPlayInterval?: ReturnType<typeof setInterval> | number;
    ref = React.createRef<Carousel>();

    get items() {
        const children = React.Children.toArray(this.props.children);
        if (this.canAutoPlay) {
            // Append the first item to the end, and prepend the last item to the front,
            // so the last item auto plays to the first, and the first item scrolls to last item
            // when the previous button is clicked if auto play is active.
            const lastItem = children[children.length - 1];
            const firstItem = children[0];
            children.unshift(lastItem);
            children.push(firstItem);
        }
        return children;
    }

    pageCount(scrollPort: HTMLDivElement) {
        const extraWidth = scrollPort.clientWidth * 2;
        return Math.floor((scrollPort.scrollWidth - extraWidth) / scrollPort.clientWidth);
    }

    visiblePageIndex(scrollPort: HTMLDivElement) {
        return Math.floor(
            (scrollPort.scrollLeft - scrollPort.clientWidth) / scrollPort.clientWidth,
        );
    }

    @action
    handleCarouselMutation = (event: CarouselMutationEvent) => {
        if (this.canAutoPlay && this.ref.current) {
            const carousel = this.ref.current;
            const scrollPort = carousel.scrollPortRef.current;
            // Update the scroll port position to the real first or last item.
            if (scrollPort) {
                if (carousel.isLastPage) {
                    scrollPort.scrollLeft = scrollPort.clientWidth;
                } else if (carousel.isFirstPage) {
                    scrollPort.scrollLeft = scrollPort.clientWidth * (this.items.length - 2);
                }

                const mutationEvent = {
                    isLastPage: event.isLastPage,
                    isPageable: event.isPageable,
                    pageCount: this.pageCount(scrollPort),
                    visiblePageIndex: this.visiblePageIndex(scrollPort),
                };

                this.props.onMutation?.(mutationEvent);
            }
        }
    };

    @action
    handleIntervalUpdate = () => {
        const event = {
            isPaused: this.isPaused,
            intervalDuration: this.props.intervalDuration as number,
        };

        this.props.onIntervalUpdate?.(event);
    };

    advanceCarousel = () => {
        if (this.ref.current) {
            const scrollPort = this.ref.current.scrollPortRef.current;
            scrollPort?.scrollBy({left: scrollPort.clientWidth, behavior: 'smooth'});
        }
    };

    resumeCarousel = () => {
        if (!this.autoPlayInterval && this.allowAutoPlay) {
            this.isPaused = false;
            this.autoPlayInterval = setInterval(this.advanceCarousel, this.props.intervalDuration);
            this.handleIntervalUpdate();
        }
    };

    pauseCarousel = () => {
        clearInterval(this.autoPlayInterval as number);
        this.isPaused = true;
        this.autoPlayInterval = 0;
        this.handleIntervalUpdate();
    };

    /* Disable autoplay all together when there is user interaction */
    onInteraction = () => {
        if (this.allowAutoPlay) {
            this.allowAutoPlay = false;
            this.pauseCarousel();
        }
    };

    render() {
        const {prioritizeTouch, allowScroll, onIntervalUpdate, intervalDuration, ...props} =
            this.props;
        const allowScrolling = allowScroll == true ? allowScroll : prioritizeTouch;
        const autoPlayControls = prioritizeTouch
            ? {
                  onTouchStart: this.canAutoPlay ? this.onInteraction : undefined,
                  onTouchEnd: this.canAutoPlay ? this.resumeCarousel : undefined,
              }
            : {
                  onMouseEnter: this.canAutoPlay ? this.pauseCarousel : undefined,
                  onMouseLeave: this.canAutoPlay ? this.resumeCarousel : undefined,
                  onMouseDown: this.canAutoPlay ? this.onInteraction : undefined,
              };

        return (
            <div {...autoPlayControls}>
                <Carousel
                    {...props}
                    showPager={
                        this.props.showPager && React.Children.count(this.props.children) > 1
                    }
                    allowScroll={allowScrolling}
                    isInfiniteScroll={true}
                    pageByFullWidth={true}
                    gridFullWidthItems={true}
                    onMutation={this.handleCarouselMutation}
                    ref={this.ref}
                >
                    {this.items}
                </Carousel>
            </div>
        );
    }
}
