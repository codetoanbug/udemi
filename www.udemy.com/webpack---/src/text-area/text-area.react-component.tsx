/* eslint-disable @typescript-eslint/naming-convention */
import classNames from 'classnames';
import {MobXProviderContext, observer} from 'mobx-react';
import React from 'react';

import {checkFormGroup} from '../form-group/check-form-group';
import styles from './text-area.module.less';

/** React props for the TextArea component. */
export interface TextAreaProps extends React.ComponentPropsWithoutRef<'textarea'> {
    /**
     * The size of the `TextArea`
     *
     * @defaultvalue 'large'
     */
    size?: 'small' | 'large';
}

/**
 * The TextArea component.
 *
 * @remarks
 * A Udemy implementation of a `<textarea>` HTML tag.
 *
 * This component requires global CSS from the `TextInput` component.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-form-components/dist/react-form-components.global.css';`
 */
export const TextArea = observer(
    React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
        ({size = 'large', className, ...htmlProps}, ref) => {
            // $$udFormGroup is the parent FormGroup passed down via a Context Provider
            const {$$udFormGroup} = React.useContext(MobXProviderContext);
            const ariaProps = $$udFormGroup?.inputAriaProps;

            checkFormGroup('TextArea', {$$udFormGroup, ...htmlProps}, null, true);

            return (
                <textarea
                    rows="2"
                    ref={ref}
                    {...ariaProps}
                    {...htmlProps}
                    id={$$udFormGroup ? $$udFormGroup.id : htmlProps.id}
                    className={classNames(
                        'ud-text-input',
                        [styles[`ud-text-area-${size}`]],
                        {
                            'ud-text-md': size === 'large',
                            'ud-text-sm': size === 'small',
                        },
                        className,
                    )}
                />
            );
        },
    ),
);

TextArea.displayName = 'TextArea';
