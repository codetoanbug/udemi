import {
    CheckedStateChangeEvent,
    CheckedStateChangeEventHandler,
    CheckedStateRadioGroup,
} from '@udemy/react-checked-state-components';
import classNames from 'classnames';
import React from 'react';

import {WAIT_FOR_CSS_TRANSITIONS} from '../side-drawer/helpers';
import styles from '../side-drawer/side-drawer.module.less';
import {SideDrawerContext} from '../side-drawer/side-drawer.react-component';

/** React props interface for SideDrawerRadio component */
interface SideDrawerRadioProps {
    id: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: CheckedStateChangeEventHandler;
}

/**
 * SideDrawerRadio component
 * @internal
 */
export const SideDrawerRadio = (radioProps: SideDrawerRadioProps) => {
    /** Internally used to access the parent SideDrawers. */
    const sideDrawerRef = React.useContext(SideDrawerContext);

    const onChange = (event: CheckedStateChangeEvent) => {
        const {onChange} = radioProps;

        setTimeout(() => {
            if (event.target.dataset.checked) {
                const dialogInstance = sideDrawerRef.current;
                const firstFocusable = dialogInstance?.findFirstFocusable();
                firstFocusable?.focus();
            }
        }, WAIT_FOR_CSS_TRANSITIONS);

        onChange?.(event);
    };

    return (
        <CheckedStateRadioGroup.Radio
            {...radioProps}
            className={classNames('js-drawer-radio', styles['drawer-radio'])}
            onChange={onChange}
        />
    );
};
