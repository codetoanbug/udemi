import {Keys} from '@udemy/design-system-utils';
import React from 'react';

/**
 * Mimic the Event interface through to the data-checked attribute.
 *
 * See {@link isChecked} to help read the checked state from this event object.
 *
 * @remarks
 * Note: the Event interface allows for target property to be null. This is the
 * case when an event object is created `new Event()`. However, when an event
 * is triggered through the DOM via dispatchEvent(), target shouldn't ever be
 * null. Assuming that the DOM events we are mimicking with this interface either
 * define target explicitly or use dispatchEvent(), assuming a defined target
 * simplifies working with target.dataset.checked.
 */
export interface CheckedStateChangeEvent {
    target: {
        id: string;
        dataset: {
            checked?: '' | 'checked';
        };
    };
}

/** A typed version of an Event handler using `CheckedStateChangeEvent` */
export type CheckedStateChangeEventHandler = (event: CheckedStateChangeEvent) => void;

/** The React props interface for a `CheckedState` component. */
export interface CheckedStateProps {
    /** Unique id string applied to the `CheckedState` `span` tag */
    id: string;
    /** The state of the data-checked attribute. Either an empty string or `checked`. */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'data-checked': '' | 'checked';
    /** The onChange Event handler when toggling between checked and un-checked */
    onChange: CheckedStateChangeEventHandler;
    /** Event handler to occur when a user hits the Esc key */
    onEscape?: (inputDOMNode: HTMLSpanElement) => void;
}

/**
 * This component represents the toggle state for {@link CheckedStateCheckbox | CheckedStateCheckbox}
 * and {@link CheckedStateRadioGroup | CheckedStateRadioGroup}.
 *
 * @remarks
 * Thie component renders a span element with a `[data-checked]` attribute that
 * can be toggled between `checked` and `''` (not checked).
 *
 * Components that support CSS toggle mechanism can reference the `[data-checked]`
 * attribute in a CSS selector.
 *
 * Toggle logic is implemented by `CheckedStateCheckbox` and `CheckedStateRadioGroup`.
 *
 * `csstoggle` event is dispatched by the {@link Button} component or non-React script.
 *
 */
export class CheckedState extends React.Component<CheckedStateProps> {
    componentDidMount() {
        document.addEventListener('keydown', this.onKeyDown);

        // @ts-expect-error: TS does not know custom event 'csstoggle'
        this.ref.current?.addEventListener('csstoggle', this.props.onChange);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown);

        // @ts-expect-error: TS does not know custom event 'csstoggle'
        this.ref.current?.removeEventListener('csstoggle', this.props.onChange);
    }

    ref = React.createRef<HTMLSpanElement>();

    onKeyDown = (event: KeyboardEvent) => {
        const code = event.which || event.keyCode;
        if (code === Keys.ESCAPE && this.ref.current) {
            this.props.onEscape?.(this.ref.current);
        }
    };

    render() {
        const {onChange, onEscape, ...props} = this.props;
        return <span {...props} ref={this.ref} style={{display: 'none'}} />;
    }
}

/**
 * Helper function to evaluate the checked state from `CheckedState#onChange` event.
 *
 * @param event - event dispatched via `CheckedState#onChange`
 * @returns true if dataset field `checked` is 'checked'
 */
export function isChecked(event: CheckedStateChangeEvent) {
    return event.target.dataset.checked === 'checked';
}
