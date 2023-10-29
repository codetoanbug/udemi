import classNames from 'classnames';
import React from 'react';

import {
    FormGroupFoundationalProps,
    FormGroupRenderContentProps,
    FormGroupLabelProps,
    publicFormGroupDefaultProps,
    BaseFormGroup,
    getValidationIcon,
} from '../form-group/form-group.react-component';
import styles from './toggle-input-block-form-group.module.less';

/**
 * React prop interface for the InputPillFormGroup component.
 *
 * @remarks
 * Implements usage with a `<legend>` tag.
 */
export type ToggleInputBlockFormGroupProps = FormGroupFoundationalProps &
    FormGroupLabelProps<'legend'> &
    React.ComponentPropsWithoutRef<'fieldset'>;

/**
 * The ToggleInputBlockFormGroup component.
 *
 * @remarks
 * Renders a {@link BaseFormGroup} for use with ToggleInputs.
 */
export class ToggleInputBlockFormGroup extends React.Component<ToggleInputBlockFormGroupProps> {
    static defaultProps = {
        ...publicFormGroupDefaultProps,
    };

    renderContent(props: FormGroupRenderContentProps) {
        const validationIcon = getValidationIcon(props.validationState);
        const {typography: labelTypography, ...legendHTMLProps} =
            props.labelProps as FormGroupLabelProps<'legend'>;
        const showNotesAboveInput = props.validationState === 'neutral';
        const formNote = props.note && (
            <div
                {...props.noteProps}
                className={classNames(
                    props.noteProps?.className,
                    'ud-form-note',
                    !validationIcon ? 'ud-text-md' : 'ud-text-xs',
                )}
            >
                {validationIcon}
                {props.note}
            </div>
        );
        return (
            <>
                <legend
                    {...legendHTMLProps}
                    className={classNames(
                        legendHTMLProps.className,
                        'ud-toggle-blocks-form-label',
                        labelTypography ?? 'ud-heading-lg',
                    )}
                >
                    {props.label}
                </legend>
                {showNotesAboveInput && formNote}
                {props.children}
                {!showNotesAboveInput && formNote}
            </>
        );
    }

    render() {
        return (
            <BaseFormGroup
                {...this.props}
                className={classNames(this.props.className, styles['ud-form-group-toggle-blocks'])}
                renderContent={this.renderContent}
                udStyle="fieldset"
                usage="ToggleInputBlockFormGroup"
            />
        );
    }
}
