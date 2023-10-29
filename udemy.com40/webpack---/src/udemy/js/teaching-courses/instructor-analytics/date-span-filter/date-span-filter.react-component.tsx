import {Dropdown} from '@udemy/react-menu-components';
import React from 'react';

import {DateSpan} from './types';

interface DateSpanFilterProps {
    dateSpans: Array<DateSpan>;
    handleOnClick: (dateSpan: DateSpan) => void;
    selectedDate: DateSpan;
    size?: 'xsmall' | 'small' | 'medium' | 'large' | undefined;
}

export const DateSpanFilter = ({
    dateSpans,
    selectedDate,
    handleOnClick,
    size = 'xsmall',
}: DateSpanFilterProps) => {
    return (
        <Dropdown
            placement={'bottom-start'}
            trigger={<Dropdown.Button size={size}>{selectedDate.expression}</Dropdown.Button>}
        >
            <Dropdown.Menu>
                {dateSpans.map((dateSpan: DateSpan) => (
                    <Dropdown.MenuItem key={dateSpan.value} onClick={() => handleOnClick(dateSpan)}>
                        {dateSpan.expression}
                    </Dropdown.MenuItem>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};
