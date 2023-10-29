import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import styles from './dialog-close-button.module.less';

/** React props interface for the `DialogCloseButton` component. */
interface DialogCloseButtonProps {
    /** Optional className to apply */
    className?: string;
    /** Unique id for the button, used for `cssToggleId` */
    id: string;
    /** A11y label to apply to the `CloseIcon` within `DialogCloseButton` */
    label: string;
}

/** The DialogCloseButton component. */
export const DialogCloseButton = ({className, id, label}: DialogCloseButtonProps) => (
    <IconButton
        className={classNames(styles['close-btn'], className)}
        data-purpose="close-btn"
        cssToggleId={id}
        round={true}
        udStyle="white-solid"
        aria-label={label}
    >
        <CloseIcon color="neutral" label={false} />
    </IconButton>
);
