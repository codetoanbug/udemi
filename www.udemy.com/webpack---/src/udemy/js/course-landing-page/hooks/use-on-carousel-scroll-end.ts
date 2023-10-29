import React from 'react';

/**
 * Convenience hook that provides carousel props covering all the ways that the carousel could
 * be scrolled (swiping, clicking next/previous buttons). Primarily used to track scroll events.
 */
export function useOnCarouselScrollEnd(onScrollEnd: () => void) {
    const [isScrolling, setIsScrolling] = React.useState(false);

    const props = {
        onTouchMove() {
            if (!isScrolling) {
                setIsScrolling(true);
            }
        },
        onTouchEnd() {
            if (isScrolling) {
                onScrollEnd();
                setIsScrolling(false);
            }
        },
        onNextClick() {
            onScrollEnd();
        },
        onPreviousClick() {
            onScrollEnd();
        },
    };

    return {
        isScrolling,
        props,
    };
}
