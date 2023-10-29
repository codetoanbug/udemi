/* eslint-disable @typescript-eslint/no-explicit-any */
import hoistNonReactStatics from 'hoist-non-react-statics';
import React from 'react';

interface MakeHocOptions<TInput, TOutput> {
    useGetData(input: TInput): TOutput;
    getDisplayName(componentName: string): string;
    getPropTypes(componentPropTypes: Record<string, any>): Record<string, any>;
}

export function makeHoc<TInput, TOutput>({
    useGetData,
    getDisplayName,
    getPropTypes,
}: MakeHocOptions<TInput, TOutput>) {
    return <TComponent extends React.ComponentType<any>>(Component: TComponent) => {
        const WrapperComponent = React.forwardRef<
            any,
            Partial<Omit<React.ComponentProps<TComponent>, keyof TOutput>> & TInput
        >((props, ref) => {
            const data = useGetData(props);
            return <Component ref={ref} {...(data as any)} {...props} />;
        });

        const componentName = Component.displayName ?? Component.name ?? 'Component';
        WrapperComponent.displayName = getDisplayName(componentName);
        WrapperComponent.defaultProps = Component.defaultProps;
        if (Component.propTypes) {
            WrapperComponent.propTypes = getPropTypes(Component.propTypes);
        }

        return hoistNonReactStatics(WrapperComponent, Component);
    };
}
