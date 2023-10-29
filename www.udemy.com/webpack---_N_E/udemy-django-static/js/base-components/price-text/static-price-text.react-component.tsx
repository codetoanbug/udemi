import React from 'react';

import {StaticPriceText as DSWStaticPriceText} from '@udemy/react-merchandising-components';
import {trackPriceImpression, PriceTextProps} from './price-impression-event';

const StaticPriceText = (props: PriceTextProps) => {
    const onView = () => {
        props.onView?.();
        trackPriceImpression(props);
    };
    const dswProps = {
        ...props,
        onView,
    };

    return <DSWStaticPriceText {...dswProps} />;
};

export {StaticPriceText};
