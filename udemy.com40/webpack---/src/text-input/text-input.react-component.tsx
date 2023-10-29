import classNames from 'classnames';
import {MobXProviderContext, observer} from 'mobx-react';
import React, {useContext} from 'react';

import {checkFormGroup} from '../form-group/check-form-group';

// Note: TextInput CSS is served up via the react-form-components.global.css file;

/**
 * An array of sizes available for use for setting the Input size.
 * Was used when most input components were still Javascript.
 *
 * @deprecated Use the {@link InputSize} type in TypeScript instead.
 *
 * @privateRemarks
 * TODO: InputSize should be set to `'small' | 'medium' | 'large'` directly
 */
export const InputSizes = ['small', 'medium', 'large'] as const;

/** The possible size of an input. */
export type InputSize = typeof InputSizes[number];

/** React props interface for the `TextInput`s component. */
export interface TextInputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
    /**
     * The size of the `TextInput`
     *
     * @defaultValue 'large'
     */
    size?: InputSize;
    /**
     * The performance metric name to "mark" when the component is mounted.
     *
     * @deprecated We no longer call UD.performance.mark.  This relies on a global `UD.performance` object.
     * Only used by one component within the website. (CourseBasicsForm)
     */
    perfMetricName?: string;
}

/**
 * The TextInput component
 *
 * @remarks
 * A Udemy implementation of a `<input>` HTML tag. Default type is `type="text"`.
 *
 * This component requires global CSS.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-form-components/dist/react-form-components.global.css';`
 */
export const TextInput = observer(
    React.forwardRef<HTMLInputElement, TextInputProps>(
        ({size = 'large', type = 'text', perfMetricName, className, ...htmlProps}, inputRef) => {
            const {$$udFormGroup} = useContext(MobXProviderContext);
            const ariaProps = $$udFormGroup?.inputAriaProps;

            checkFormGroup('TextInput', {$$udFormGroup, ...htmlProps}, null, true);

            return (
                <input
                    {...ariaProps}
                    {...htmlProps}
                    ref={inputRef}
                    id={$$udFormGroup ? $$udFormGroup.id : htmlProps.id}
                    type={type}
                    className={classNames(
                        'ud-text-input',
                        `ud-text-input-${size}`,
                        size === 'large' ? 'ud-text-md' : 'ud-text-sm',
                        $$udFormGroup.props.formControlClassName,
                        className,
                    )}
                />
            );
        },
    ),
);

TextInput.displayName = 'TextInput';
