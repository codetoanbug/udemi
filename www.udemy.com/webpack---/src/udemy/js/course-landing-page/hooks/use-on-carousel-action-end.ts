import React from 'react';

export function useOnCarouselActionEnd(
    onScrollEnd: () => void,
    action: 'scroll' | 'button-click' = 'scroll',
) {
    const [isScrolling, setIsScrolling] = React.useState(false);

    let props = {};

    if (action === 'scroll') {
        props = {
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
        };
    } else if (action === 'button-click') {
        props = {
            onNextClick() {
                onScrollEnd();
            },
            onPreviousClick() {
                onScrollEnd();
            },
        };
    }

    return props;
}
