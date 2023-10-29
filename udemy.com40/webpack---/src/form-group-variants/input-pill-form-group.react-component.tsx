import {PillGroup} from '@udemy/react-navigation-components';
import classNames from 'classnames';
import React from 'react';

import {
    FormGroupFoundationalProps,
    FormGroupLabelProps,
    BaseFormGroup,
    getValidationIcon,
    publicFormGroupDefaultProps,
    FormGroupRenderContentProps,
} from '../form-group/form-group.react-component';
import styles from './input-pill-form-group.module.less';

/**
 * React prop interface for the InputPillFormGroup component
 */
export type InputPillFormGroupProps = FormGroupFoundationalProps &
    FormGroupLabelProps<'legend'> &
    React.ComponentPropsWithoutRef<'fieldset'>;

/**
 * The InputPillFormGroup component.
 *
 * @remarks
 * Used for implementing a {@link BaseFormGroup} with an {@link PillGroup} as child.
 */
export class InputPillFormGroup extends React.Component<InputPillFormGroupProps> {
    static defaultProps = {
        ...publicFormGroupDefaultProps,
    };

    renderContent(props: FormGroupRenderContentProps) {
        const {
            tag,
            typography: labelTypography,
            ...legendHTMLProps
        } = props.labelProps as FormGroupLabelProps<'legend'>;
        return (
            <>
                <legend
                    {...legendHTMLProps}
                    className={classNames(
                        legendHTMLProps.className,
                        'ud-form-label',
                        labelTypography ?? 'ud-heading-xl',
                    )}
                >
                    {props.label}
                    {tag && <span className="ud-text-xs ud-form-label-tag">{tag}</span>}
                </legend>
                <PillGroup>{props.children}</PillGroup>
                {props.note && (
                    <div
                        {...props.noteProps}
                        className={classNames(
                            props.noteProps?.className,
                            'ud-form-note ud-text-sm',
                        )}
                    >
                        {getValidationIcon(props.validationState)}
                        {props.note}
                    </div>
                )}
            </>
        );
    }

    render() {
        return (
            <BaseFormGroup
                {...this.props}
                className={classNames(this.props.className, styles['ud-form-group-input-pills'])}
                renderContent={this.renderContent}
                udStyle="fieldset"
                usage="InputPillFormGroup"
            />
        );
    }
}
