/* eslint-disable @typescript-eslint/naming-convention */
import {getUniqueId} from '@udemy/design-system-utils';
import classNames from 'classnames';
import {observer, MobXProviderContext} from 'mobx-react';
import React, {useState} from 'react';

import {checkFormGroup} from '../form-group/check-form-group';
import styles from './switch.module.less';

/** React props interface for the Switch component. */
interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /**
     * The size of the `Switch` component.
     *
     * @defaultValue 'small'
     */
    size?: 'small' | 'large';
}

/**
 * The Switch component.
 *
 * @privateRemarks
 * This is a basic Toggle Input component, though it does not implement {@link ToggleInput}
 */
export const Switch = observer(({children, className, size = 'small', ...props}: SwitchProps) => {
    const [defaultId] = useState(getUniqueId('switch'));
    const id = props.id ?? defaultId;
    const {$$udFormGroup} = React.useContext(MobXProviderContext);
    checkFormGroup(
        'ToggleInput',
        {$$udFormGroup, id: props.id},
        'FormGroup udStyle="fieldset"',
        false,
    );
    return (
        <div className={className}>
            <label
                className={classNames(styles['ud-switch-container'], {
                    [styles['ud-switch-disabled']]: props.disabled,
                    'ud-text-sm': size === 'small',
                    'ud-text-md': size === 'large',
                })}
                htmlFor={id}
            >
                <input
                    {...props}
                    className={classNames('ud-sr-only', styles['ud-real-toggle-input'])}
                    id={id}
                    type="checkbox"
                />
                {children}
                <span
                    className={classNames(styles['ud-switch'], {
                        [styles['ud-switch-small']]: size === 'small',
                        [styles['ud-switch-large']]: size === 'large',
                    })}
                />
            </label>
        </div>
    );
});
