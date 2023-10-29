import {
    CheckedStateCheckbox as BaseCheckedStateCheckbox,
    CheckedStateProps,
} from '@udemy/react-checked-state-components';
import React from 'react';

import DjangoCheckedState from './_django-checked-state.react-component';

// Inject local component to replace CheckedState rendered by CheckedStateCheckbox
const CheckedStateCheckbox = (
    props: Omit<React.ComponentProps<typeof BaseCheckedStateCheckbox>, 'checkedStateComponent'>,
) => (
    <BaseCheckedStateCheckbox
        {...props}
        checkedStateComponent={
            (DjangoCheckedState as unknown) as React.ComponentType<CheckedStateProps>
        }
    />
);

// Only show one "CheckedStateCheckbox" in React tree
CheckedStateCheckbox.displayName = `withDjangoCheckedState(${BaseCheckedStateCheckbox.name})`;

// eslint-disable-next-line import/no-default-export
export default CheckedStateCheckbox;
