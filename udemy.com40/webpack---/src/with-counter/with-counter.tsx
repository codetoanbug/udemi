import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

/** React props added to a FormControl via `withCounter` */
export interface WithCounterBaseProps extends React.HTMLAttributes<HTMLInputElement> {
    value?: string;
    defaultValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    maxLength: number;
}

/**
 * ### withCounter
 *
 * @remarks
 * A React higher order component that adds a counter to a form control.
 *
 * @param FormControl - The form control to add a counter to.
 * @returns React.ComponentType<TWrappedComponentProps & WithCounterBaseProps>
 */
export function withCounter<TWrappedComponentProps>(
    FormControl: (props: TWrappedComponentProps) => JSX.Element,
): React.ComponentType<TWrappedComponentProps & WithCounterBaseProps> {
    type TWrappedComponentPropsWithCounter = TWrappedComponentProps & WithCounterBaseProps;

    @observer
    class FormControlWithCounter extends React.Component<TWrappedComponentPropsWithCounter> {
        constructor(props: TWrappedComponentPropsWithCounter) {
            super(props);
            const {value, defaultValue} = this.props;
            this.setInputLength(typeof value !== 'undefined' ? value : defaultValue);
        }

        componentDidUpdate(prevProps: TWrappedComponentPropsWithCounter) {
            prevProps.value !== this.props.value && this.setInputLength(this.props.value);
        }

        @observable inputLength = 0;

        @action setInputLength(inputValue: string | undefined) {
            this.inputLength = (inputValue ?? '').length;
        }

        onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setInputLength(event.target.value);
            this.props.onChange?.(event);
        };

        render() {
            const count = this.props.maxLength - this.inputLength;
            return <FormControl {...this.props} count={count} onChange={this.onChange} />;
        }
    }

    return FormControlWithCounter;
}
