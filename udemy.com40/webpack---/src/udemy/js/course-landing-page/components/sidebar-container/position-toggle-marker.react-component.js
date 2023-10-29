import Observer from '@researchgate/react-intersection-observer';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';

import debounce from 'utils/debounce';

import SidebarPositionManagerStore from './sidebar-position-manager.mobx-store';

function positionToggleMarker(toggleFunc) {
    /*
    This component is expected to toggle the sidebar position state when it enters/leaves the
    viewport according to whatever logic is defined in toggleFunc.
     */
    return class PositionToggleMarker extends React.Component {
        static propTypes = {
            sidebarPositionManagerStore: PropTypes.instanceOf(SidebarPositionManagerStore)
                .isRequired,
        };

        @autobind
        handleIntersection(ioEntry) {
            debounce(toggleFunc(ioEntry, this.props.sidebarPositionManagerStore), 150);
        }

        render() {
            return (
                <Observer onChange={this.handleIntersection}>
                    <span style={{position: 'relative'}} />
                </Observer>
            );
        }
    };
}

function toggleTopPosition(ioEntry, store) {
    if (ioEntry.isIntersecting) {
        store.updatePosition(SidebarPositionManagerStore.TOP);
    } else if (store.position === SidebarPositionManagerStore.TOP) {
        // Only allow this observer to toggle position to sticky if we're transitioning from top to sticky
        store.updatePosition(SidebarPositionManagerStore.STICKY);
    }
}

function toggleBottomPosition(ioEntry, store) {
    if (ioEntry.isIntersecting) {
        store.updatePosition(SidebarPositionManagerStore.BOTTOM);
    } else if (store.position === SidebarPositionManagerStore.BOTTOM) {
        // Only allow this observer to toggle position to sticky if we're transitioning from bottom to sticky
        store.updatePosition(SidebarPositionManagerStore.STICKY);
    }
}

export const TopPositionToggleMarker = positionToggleMarker(toggleTopPosition);
export const BottomPositionToggleMarker = positionToggleMarker(toggleBottomPosition);
