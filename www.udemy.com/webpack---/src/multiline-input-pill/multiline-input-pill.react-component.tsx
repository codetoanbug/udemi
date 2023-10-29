import classNames from 'classnames';
import {observer, MobXProviderContext} from 'mobx-react';
import React, {useState} from 'react';

import {getUniqueId} from '@udemy/design-system-utils';
import {checkFormGroup} from '@udemy/react-form-components';

import styles from './multiline-input-pill.module.less';

/** React prop interface for the MultilineInputPill component */
export interface MultilineInputPillProps extends React.ComponentPropsWithoutRef<'input'> {
    /** Title, reserved for main purpose of the pill */
    title: string;
    /** Subtitle, usually used to indicate secondary information */
    subtitle: React.ReactNode;
}

/**
 * ### MultilineInputPill
 *
 * For future use in SkillsHub module and elsewhere
 */
export const MultilineInputPill = observer(
    Object.assign(
        ({
            title,
            subtitle,
            type = 'checkbox',
            className,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            children,
            ...htmlProps
        }: MultilineInputPillProps) => {
            const [defaultId] = useState(getUniqueId('switch'));
            const id = htmlProps.id ?? defaultId;
            const {$$udFormGroup} = React.useContext(MobXProviderContext);

            checkFormGroup(
                'MultilineInputPill',
                {$$udFormGroup, ...htmlProps},
                'InputPillFormGroup',
                false,
            );

            return (
                <>
                    <input
                        type={type}
                        id={id}
                        className={classNames(styles.input, 'ud-sr-only', className)}
                        tabIndex={-1}
                        {...htmlProps}
                    />
                    <label htmlFor={id} className={styles['multiline-input-pill']} tabIndex={0}>
                        <span className={classNames('ud-heading-md', styles.title)}>{title}</span>
                        <span className={classNames('ud-text-xs', styles.subtitle)}>
                            {subtitle}
                        </span>
                    </label>
                </>
            );
        },
        {displayName: 'MultilineInputPill'},
    ),
);
