import hoistNonReactStatics from 'hoist-non-react-statics';
import React from 'react';

export const makeHoC = <TInput, TOutput>(useHooks: (input: TInput) => TOutput) => {
    return <TProps extends TOutput>(Component: React.ComponentType<TProps & TInput>) => {
        const HooksProvider = (props: Omit<TProps, keyof TOutput> & TInput) => {
            return <Component {...(useHooks(props) as TProps)} {...props} />;
        };

        HooksProvider.displayName = `makeHoC(${
            Component.displayName || Component.name || 'Component'
        })`;

        return hoistNonReactStatics(HooksProvider, Component);
    };
};
