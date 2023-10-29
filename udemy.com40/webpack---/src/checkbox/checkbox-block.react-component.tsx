import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import React from 'react';

import {
    ToggleInputBlock,
    ToggleInputBlockProps,
} from '../toggle-input/toggle-input-block.react-component';

/**
 * The CheckboxBlock component.
 *
 * @remarks
 * This is similar to a {@link Checkbox} component, but wraps the entire component
 * in a clickable `label` tag with hover effect.
 *
 * @privateRemarks
 * Uses the internal component {@link ToggleInputBlock} under the hood.
 */
export class CheckboxBlock extends React.Component<
    Omit<ToggleInputBlockProps, 'fakeInput' | 'inputType'>
> {
    static $$udType = 'CheckboxBlock';

    render() {
        const fakeInput = (
            <TickIcon
                className="ud-fake-toggle-input ud-fake-toggle-checkbox"
                color="inherit"
                size="small"
                label={false}
            />
        );
        return <ToggleInputBlock {...this.props} fakeInput={fakeInput} inputType="checkbox" />;
    }
}
