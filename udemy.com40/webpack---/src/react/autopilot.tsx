import hoistStatics from 'hoist-non-react-statics';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {noop} from '../lodashy/noop';

/**
 * Type for "on change" handler for internal state maintained by `autopilot`
 *
 * @typeParam TValue - type of internal state maintained by `autopilot`
 */
export type AutopilotChangeHandler<TValue> = (value: TValue, ...args: unknown[]) => void;

/**
 * Helper type that extracts the keys from a type that are bound to values matching
 * type criteria. For example: all keys from component props for string values (the criteria)
 *
 * @typeParam TProps - component props, for example, from which to extract individual keys
 * @typeParam TCriteria - type that key values must extend in order to be extracted
 *
 * @example Extracting all keys from props that are strings
 * ```ts
 * KeysForPropType<MyComponentProps, string>
 * ```
 */
type KeysForPropType<TProps, TCriteria> = {
    [Key in keyof TProps]: TProps[Key] extends TCriteria ? Key : never;
}[keyof TProps];

/**
 * Wraps a component with behavior that allows it to be used as either a controlled or
 * uncontrolled component. Can be used as a decorator in JavaScript, but only as a plain
 * function in TypeScript.
 *
 * @typeParam TWrappedComponentProps - props of the wrapped component
 * @typeParam TValue - (optional, defaults to string) type of internal state maintained by `autopilot` and type of parameter passed to onChange handler
 * @typeParam TForwardedRefReferent - (optional) type to which a forwarded ref on the wrapped component refers; omit if ref points to the wrapped class component
 * @param valueProp - name of prop for the controlled component value/internal state
 * @param changeProp - name of the prop for the "on change" handler for updates to the value/internal state
 *
 * @remarks
 *
 * `autopilot` manages a state value on behalf a wrapped component. Depending on the props passed by
 * a parent component, that state value is either maintained internally by `autopilot` or it is passed through
 * via props. In either case, the wrapped component receives this state value via props. This means it can
 * be written as a {@link https://reactjs.org/docs/uncontrolled-components.html controlled component}, but
 * can be used by parent components as _either_ controlled or uncontrolled.
 *
 * The name of the props for the state value and the onChange/update event prop are specified by parameters
 * to `autopilot`.
 *
 * @example
 * ```ts
 * interface Props {
 *     // Props passed in/through by `autopilot`
 *     fooValue: string;
 *     fooOnChange: AutopilotChangeHandler<string>;
 *     // Other props
 *     bar?: string;
 * }
 *
 * const TrackingInputWithAutoPilot = autopilot<Props>('fooValue', 'fooOnChange')(
 *     class TrackingInput extends React.Component<Props> {
 *         static defaultProps = {
 *             fooValue: 'default value',
 *         };
 *
 *         onChange = (fooValue: string) => {
 *             trackChange(fooValue);
 *             this.props.onChange(fooValue);
 *         }
 *
 *         render() {
 *             return <Input value={this.props.fooValue} onChange={this.fooOnChange} />;
 *         }
 *     }
 * );
 * * ```
 *
 * The parent component can render `TrackingInputWithAutoPilot` with or without a
 * `fooValue` or `fooOnChange` prop.
 *
 */
export function autopilot<TWrappedComponentProps, TValue = string, TForwardedRefReferent = never>(
    // Constrain prop names to be both strings and keys in the wrapped component props
    valueProp: string & KeysForPropType<TWrappedComponentProps, TValue>,
    changeProp: string & KeysForPropType<TWrappedComponentProps, AutopilotChangeHandler<TValue>>,
) {
    /**
     * @typeParam TWrappedComponentType - inferred from the WrappedComponent param
     * @param WrappedComponent - component type to decorate with controlled component behavior
     */
    return function <TWrappedComponentType>(
        // Constrain type to be a component type _and_ bind its type name to the generic so that
        // it may be inferred and used later.
        WrappedComponent: TWrappedComponentType extends React.ComponentType<TWrappedComponentProps>
            ? TWrappedComponentType
            : never,
    ) {
        // Referent is the type of ref applied to the wrapped component. If TForwardedRefReferent
        // is not provided, then default to the wrapped component type itself (i.e., ref to a
        // class component)
        type Referent = TForwardedRefReferent extends never
            ? TWrappedComponentType
            : TForwardedRefReferent;

        type WrappedComponentPropsWithForwardedRef = TWrappedComponentProps & {
            forwardedRef: React.Ref<Referent>;
        };

        @observer
        class AutopilotWrapper extends React.Component<WrappedComponentPropsWithForwardedRef> {
            componentDidUpdate(prevProps: WrappedComponentPropsWithForwardedRef) {
                if (
                    (prevProps[valueProp] === undefined && this.props[valueProp] !== undefined) ||
                    (prevProps[valueProp] !== undefined && this.props[valueProp] === undefined)
                ) {
                    throw new Error(
                        'Controlled components should not switch to become uncontrolled, or vice versa.',
                    );
                }
            }

            get isControlled() {
                return this.props[valueProp] !== undefined;
            }

            @observable value: TValue | undefined = undefined;

            @action
            onChange = (newValue: TValue, ...args: unknown[]) => {
                if (!this.isControlled) {
                    this.value = newValue;
                }

                (this.props[changeProp] as AutopilotChangeHandler<TValue>)?.(newValue, ...args);
            };

            render() {
                const {forwardedRef, ...passedProps} = this.props;
                const props = {
                    ...(passedProps as TWrappedComponentProps),
                    [valueProp]: this.isControlled
                        ? (passedProps as TWrappedComponentProps)[valueProp]
                        : this.value,
                    [changeProp]: this.isControlled
                        ? (passedProps as TWrappedComponentProps)[changeProp]
                        : this.onChange,
                };

                // Even though the parameter is constrained to types that extend from a component,
                // TS cannot guarantee that WrappedComponent can be rendered as a component. Cast it.
                const WrappedComponentCasted =
                    WrappedComponent as React.ComponentType<TWrappedComponentProps>;
                return <WrappedComponentCasted {...props} ref={forwardedRef} />;
            }
        }

        const RefForwardedAutopilotWrapper = React.forwardRef<Referent, TWrappedComponentProps>(
            (props, ref) => <AutopilotWrapper {...props} forwardedRef={ref} />,
        );

        // Copy up static properties, defaultProps, displayName, propTypes from wrapped
        // component to the outer component.
        return Object.assign(hoistStatics(RefForwardedAutopilotWrapper, WrappedComponent), {
            displayName: `WithAutopilot(${
                WrappedComponent.displayName || WrappedComponent.name || 'Component'
            })`,
            // Omit valueProp and force changeProp to be a noop.
            defaultProps: {
                ...Object.entries(WrappedComponent.defaultProps || {}).reduce(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (acc: Record<string, any>, [key, val]) => {
                        if (key !== valueProp) {
                            acc[key] = val;
                        }
                        return acc;
                    },
                    {},
                ),
                ...{
                    [changeProp]: noop,
                },
            },
            propTypes: {
                ...WrappedComponent.propTypes,
                // Make sure the change callback prop is not required.
                [changeProp]: PropTypes.func,
            },
            wrappedComponent: WrappedComponent,
        });
    };
}
