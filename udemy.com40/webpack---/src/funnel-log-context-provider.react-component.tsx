import hoistStatics from 'hoist-non-react-statics';
import {Provider, MobXProviderContext} from 'mobx-react';
import React from 'react';

import {getDisplayName, makeHoc} from '@udemy/shared-utils';
import {withStores, WithStoresProps} from '@udemy/store-provider';

import {funnelTrackingConstants} from './constants';
import {FunnelLogContextStore} from './funnel-log-context.mobx-store';
import {FunnelLogContext} from './funnel-tracking';
import {CoursePriceStore} from './types/fake-browse-course-types';

export interface FunnelLogContextProviderProps extends FunnelLogContext, WithStoresProps {
    pageType?: keyof typeof funnelTrackingConstants.channelContextMap;
    funnelLogContextStore?: FunnelLogContextStore;
}

class InternalFunnelLogContextProvider extends React.Component<
    React.PropsWithChildren<FunnelLogContextProviderProps>
> {
    funnelLogContextStore = new FunnelLogContextStore(
        {
            context:
                this.props.context ??
                (this.props.pageType
                    ? funnelTrackingConstants.channelContextMap[this.props.pageType]
                    : undefined),
            context2: this.props.context2,
            subcontext: this.props.subcontext,
            subcontext2: this.props.subcontext2,
        },
        this.props.stores[0],
    );

    render() {
        return (
            <Provider
                funnelLogContextStore={
                    this.props.funnelLogContextStore || this.funnelLogContextStore
                }
            >
                {React.Children.only(this.props.children)}
            </Provider>
        );
    }
}

export const FunnelLogContextProvider = withStores(
    [CoursePriceStore],
    InternalFunnelLogContextProvider,
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withFunnelLogContextProvider = () => (WrappedComponent: React.ComponentType<any>) => {
    const EnhancedComponent = (props: Record<string, unknown>) => (
        <FunnelLogContextProvider>
            <WrappedComponent {...props} />
        </FunnelLogContextProvider>
    );

    EnhancedComponent.displayName = `WithFunnelLogContextProvider(${getDisplayName(
        WrappedComponent,
    )})`;

    return hoistStatics(EnhancedComponent, WrappedComponent);
};

export function useFunnelLogContextStore() {
    const context = React.useContext(MobXProviderContext);
    return context.funnelLogContextStore as FunnelLogContextStore;
}

export const withFunnelLogContextStore = makeHoc({
    useGetData: () => {
        const funnelLogContextStore = useFunnelLogContextStore();
        return {funnelLogContextStore};
    },
    getDisplayName: (name: string) => `WithFunnelLogContextStore(${name})`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getPropTypes: (propTypes: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {funnelLogContextStore, ...propTypesWithoutStore} = propTypes;
        return propTypesWithoutStore;
    },
});
