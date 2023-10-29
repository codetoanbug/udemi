import React from 'react';

import {
    ToggleInputBlock,
    ToggleInputBlockProps,
} from '../toggle-input/toggle-input-block.react-component';
import {FakeRadio} from './radio.react-component';

export class RadioBlock extends React.Component<
    Omit<ToggleInputBlockProps, 'fakeInput' | 'inputType'>
> {
    static $$udType = 'RadioBlock';

    render() {
        const fakeInput = <FakeRadio size="large" />;
        return <ToggleInputBlock {...this.props} fakeInput={fakeInput} inputType="radio" />;
    }
}
