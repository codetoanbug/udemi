import CollapseIcon from '@udemy/icons/dist/collapse.ud-icon';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import classNames from 'classnames';
import {observer, MobXProviderContext} from 'mobx-react';
import React, {useContext} from 'react';

import {checkFormGroup} from '../form-group/check-form-group';
import {InputSize} from '../text-input/text-input.react-component';

// Note: Select CSS is served up via the react-form-components.global.css file;

/** The React props interface for the Select component. */
export interface SelectProps extends Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> {
    /** Optional icon to render on the left side of the `Select` */
    icon?: React.ReactElement;
    /**
     * If top, then `ExpandIcon` is shown; if `bottom`, then `CollapseIcon` is shown.
     *
     * @defaultValue 'top'
     */
    placement?: 'top' | 'bottom';
    /**
     * The size of the `Select`.
     * @see {@link InputSize}
     */
    size?: InputSize;
}

/**
 * ### The Select component.
 *
 * @remarks
 * This component wraps and stylizes an HTML `<select>` tag.
 *
 * This component requires global CSS.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-form-components/dist/react-form-components.global.css';`
 */
export const Select = observer(
    Object.assign(
        ({
            icon,
            placement = 'top',
            size = 'large',
            className,
            style = {},
            ...htmlProps
        }: SelectProps) => {
            // Note: If you change the icon sizes here, you also have to update the
            // `@select-icon-space-${size}` LESS variables.

            const {$$udFormGroup} = useContext(MobXProviderContext);
            const ariaProps = $$udFormGroup?.inputAriaProps;

            const renderIcon = (icon: React.ReactElement) => (
                <div className="ud-select-icon-container ud-select-icon-left">
                    {React.cloneElement(icon, {size: size === 'large' ? 'small' : 'xsmall'})}
                </div>
            );

            checkFormGroup('Select', {$$udFormGroup, ...htmlProps}, null, true);

            return (
                <div
                    className={classNames(
                        className,
                        'ud-select-container',
                        `ud-select-container-${size}`,
                    )}
                    style={style}
                >
                    {!!icon && renderIcon(icon)}
                    <select
                        required={true}
                        {...ariaProps}
                        {...htmlProps}
                        id={$$udFormGroup ? $$udFormGroup.id : htmlProps.id}
                        className={classNames(
                            'ud-select',
                            size === 'large' ? 'ud-text-md' : 'ud-text-sm',
                            icon ? 'ud-select-with-icon' : '',
                            $$udFormGroup.props.formControlClassName,
                        )}
                    />
                    <div className="ud-select-icon-container ud-select-icon-right">
                        {placement === 'top' ? (
                            <ExpandIcon label={false} />
                        ) : (
                            <CollapseIcon label={false} />
                        )}
                    </div>
                </div>
            );
        },
        {displayName: 'Select'},
        {$$udType: 'Select'},
        {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Placeholder: ({children}: React.ComponentPropsWithoutRef<'option'>) => {
                return (
                    <option key="placeholder" value="" disabled={true}>
                        {children}
                    </option>
                );
            },
        },
    ),
);
