import Observer from '@researchgate/react-intersection-observer';
import {FunnelLogContextStore, withFunnelLogContextStore} from '@udemy/funnel-tracking';
import PropTypes from 'prop-types';
import React from 'react';

import {funnelTrackingConstants} from 'browse/lib/constants';

class InternalCarouselItemFunnelTracker extends React.Component {
    static propTypes = {
        item: PropTypes.shape({id: PropTypes.number.isRequired}).isRequired,
        pageType: PropTypes.string.isRequired,
        funnelLogContextStore: PropTypes.instanceOf(FunnelLogContextStore).isRequired,
    };

    onChange = (event, unobserve) => {
        window.setTimeout(() => {
            if (event.isIntersecting) {
                this.props.funnelLogContextStore.markAsSeen(this.props.item, {
                    context: funnelTrackingConstants.channelContextMap[this.props.pageType],
                    context2: funnelTrackingConstants.featuredContext,
                    subcontext: 'Continue learning',
                });
                unobserve();
            }
        }, 0);
    };

    render() {
        return <Observer onChange={this.onChange}>{this.props.children}</Observer>;
    }
}

const CarouselItemFunnelTracker = withFunnelLogContextStore(InternalCarouselItemFunnelTracker);

export default CarouselItemFunnelTracker;
