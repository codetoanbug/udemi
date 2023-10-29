import {getUniqueId} from '@udemy/design-system-utils';
import {Button, ButtonSizeType, ButtonStyleType} from '@udemy/react-core-components';
import classNames from 'classnames';
import {observer, MobXProviderContext} from 'mobx-react';
import React, {useState} from 'react';

import {checkFormGroup} from '../form-group/check-form-group';
import {ToggleInputProps} from '../toggle-input/toggle-input.react-component';
import styles from './input-pill.module.less';

/** React props interface for the InputPill component. */
interface InputPillProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
    /**
     * The size of the pill.
     * @see {@link ButtonSizeType}
     *
     * @defaulValue 'large' in `InputPill`
     */
    size?: ButtonSizeType;
    /**
     * The style of the pill.
     * @see {@link ButtonStyleType}
     *
     * @defaulValue 'secondary' in `InputPill`
     */
    udStyle?: ButtonStyleType;
    /**
     * The input type of of the pill: 'checkbox' or 'radio'
     * @see {@link ToggleInputProps}
     *
     * @defaulValue 'checkbox' in `InputPill`
     */
    type?: ToggleInputProps['inputType'];
}

/** The InputPill component. */
export const InputPill = observer(
    Object.assign(
        ({
            size = 'large',
            udStyle = 'secondary',
            type = 'checkbox',
            children,
            className,
            ...htmlProps
        }: InputPillProps) => {
            const [defaultId] = useState(getUniqueId('switch'));
            const id = htmlProps.id ?? defaultId;
            const {$$udFormGroup} = React.useContext(MobXProviderContext);

            checkFormGroup('InputPill', {$$udFormGroup, ...htmlProps}, 'InputPillFormGroup', false);

            return (
                <>
                    <input
                        type={type}
                        id={id}
                        className={classNames(styles.input, 'ud-sr-only', className)}
                        {...htmlProps}
                    />
                    <Button
                        componentClass="label"
                        /* @ts-expect-error TODO: better strongly type polymorphic Button components to accept componentType attributes */
                        htmlFor={id}
                        disabled={htmlProps.disabled}
                        round={true}
                        size={size}
                        udStyle={udStyle}
                        className={styles.label}
                    >
                        {children}
                    </Button>
                </>
            );
        },
        {displayName: 'InputPill'},
    ),
);
