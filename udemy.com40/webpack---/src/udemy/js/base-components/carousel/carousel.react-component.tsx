import {
    Carousel as DSWCarousel,
    CarouselProps,
    CarouselMutationEvent,
} from '@udemy/react-structure-components';
import {getRequestData, getDisplayName} from '@udemy/shared-utils';
import React from 'react';

export type {CarouselProps, CarouselMutationEvent};

const Carousel = React.forwardRef<DSWCarousel, CarouselProps>((props, ref) => {
    const allowScrolling = getRequestData().isMobile;

    return <DSWCarousel allowScroll={allowScrolling} {...props} ref={ref} />;
});

Carousel.displayName = `WithLegacyCompatibility(${getDisplayName(DSWCarousel)})`;

// eslint-disable-next-line import/no-default-export
export default Carousel;
