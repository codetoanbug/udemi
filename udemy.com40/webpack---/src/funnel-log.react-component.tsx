import Observer from '@researchgate/react-intersection-observer';
import hoistStatics from 'hoist-non-react-statics';
import React from 'react';

import {getDisplayName} from '@udemy/shared-utils';

import {useFunnelLogContextStore} from './funnel-log-context-provider.react-component';
import {FunnelLogContextStore} from './funnel-log-context.mobx-store';
import {FunnelLogCourse} from './funnel-tracking';

export interface FunnelLogProps {
    funnelLogContextStore?: FunnelLogContextStore;
    item?: FunnelLogCourse;
    // Observer defines its own child type, incompatible with React.PropsWithChildren
    children?: React.ComponentProps<typeof Observer>['children'];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FunnelLog = (props: FunnelLogProps): any => {
    const funnelLogContextStore = useFunnelLogContextStore();

    function handleChange(event: IntersectionObserverEntry, unobserve: () => void) {
        if (event.isIntersecting && props.item) {
            unobserve();
            funnelLogContextStore?.markAsSeen(props.item);
        }
    }

    if (!funnelLogContextStore) {
        return props.children;
    }

    // setting the threshold to 1 causes some children to never intersect;
    // not sure why, but .99 seems to fix it well enough
    return (
        <Observer threshold={0.99} onChange={handleChange}>
            {props.children}
        </Observer>
    );
};

/**
 * A HOC that returns a HOC.
 *
 * Ex. EnhancedComponent = withFunnelLog('course')(WrappedComponent)
 *
 * @param {string} itemPropName - name of the parent's prop to pass into the item prop of FunnelLog
 */
export const withFunnelLog =
    (itemPropName: string) =>
    (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        WrappedComponent: React.ComponentType<any>,
    ) => {
        const EnhancedComponent = (props: Record<string, unknown>) => (
            <FunnelLog item={props[itemPropName] as FunnelLogCourse}>
                <WrappedComponent {...props} />
            </FunnelLog>
        );

        EnhancedComponent.displayName = `WithFunnelLog(${getDisplayName(WrappedComponent)})`;

        return hoistStatics(EnhancedComponent, WrappedComponent);
    };
