import hoistStatics from 'hoist-non-react-statics';
import {inject, Provider} from 'mobx-react';
import React, {ComponentType} from 'react';

import {getDisplayName} from '@udemy/shared-utils';

import {ComponentProps} from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TrackingContext = Record<string, any>;

interface TrackingContextProviderProps {
    parentTrackingContext: TrackingContext;
    trackingContext: TrackingContext;
    children: React.ReactNode;
}

@inject(({trackingContext}) => ({parentTrackingContext: trackingContext}))
export class TrackingContextProvider extends React.Component<TrackingContextProviderProps> {
    static defaultProps = {
        parentTrackingContext: {},
        trackingContext: {},
    };

    constructor(props: TrackingContextProviderProps) {
        super(props);
        this.trackingContext = {
            ...props.parentTrackingContext,
            ...props.trackingContext,
        };
    }

    trackingContext: TrackingContext;

    render() {
        return (
            <Provider trackingContext={this.trackingContext}>
                {React.Children.only(this.props.children)}
            </Provider>
        );
    }
}

export const withTrackingContextProvider =
    <TComponent extends React.Component>(opts: TrackingContext) =>
    (WrappedComponent: ComponentType) => {
        const EnhancedComponent = (props: ComponentProps<TComponent>) => (
            <TrackingContextProvider trackingContext={opts}>
                <WrappedComponent {...props} />
            </TrackingContextProvider>
        );

        EnhancedComponent.displayName = `WithTrackingContextProvider(${getDisplayName(
            WrappedComponent,
        )})`;

        return hoistStatics(EnhancedComponent, WrappedComponent);
    };
