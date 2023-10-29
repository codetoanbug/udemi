/* eslint-disable @typescript-eslint/naming-convention */
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer, Provider} from 'mobx-react';
import React from 'react';

import {
    BaseFormGroup,
    FormGroupFoundationalProps,
    getValidationIcon,
    FormGroupRenderContentProps,
    FormGroupLabelProps,
    publicFormGroupDefaultProps,
} from '../form-group/form-group.react-component';

/**
 * React prop interface for the CompactFormGroup component.
 *
 * @remarks
 * Implements usage with a `<label>` tag
 */
export type CompactFormGroupProps = FormGroupFoundationalProps &
    FormGroupLabelProps<'label'> &
    React.ComponentPropsWithoutRef<'div'>;

/** The CompactFormGroup component.
 *
 * @remarks
 * Renders a FormControl with the label set as a pseudo placeholder,
 * then animating to a smaller position after text is entered.
 * Influenced by Material Design.
 *
 * This component requires global CSS.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-form-components/dist/react-form-components.global.css';`
 */
@observer
export class CompactFormGroup extends React.Component<CompactFormGroupProps> {
    static defaultProps = {
        ...publicFormGroupDefaultProps,
    };

    componentDidMount() {
        const formControlNode = document.getElementById(
            this.baseFormGroupRef?.current?.id ?? '',
        ) as HTMLInputElement;
        formControlNode && this.setHasValue(!!formControlNode.value);
    }

    componentDidUpdate() {
        const formControlNode = document.getElementById(
            this.baseFormGroupRef?.current?.id ?? '',
        ) as HTMLInputElement;
        formControlNode && this.setHasValue(!!formControlNode.value);
    }

    baseFormGroupRef = React.createRef<BaseFormGroup>();
    @observable hasFocus = false;
    @observable hasValue = false;

    @action setHasValue(hasValue: boolean) {
        this.hasValue = hasValue;
    }

    @action onFocus = () => {
        this.hasFocus = true;
    };

    @action onBlur = () => {
        this.hasFocus = false;
    };

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setHasValue(!!event.target.value);
    };

    renderContent = (
        props: FormGroupRenderContentProps,
        {formControlId, noteId}: {formControlId: string; noteId: string},
    ) => {
        const isActive = this.hasFocus || this.hasValue;
        const {tag, ...labelHTMLProps} = props.labelProps;
        return (
            <>
                <div
                    data-testid="ud-compact-form-control-container"
                    className={classNames('ud-compact-form-control-container', {
                        'ud-compact-form-control-container-focus': this.hasFocus,
                        'ud-compact-form-control-container-active': isActive,
                        'ud-compact-form-control-container-tagged': !!tag,
                    })}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onChange={this.onChange}
                >
                    {props.children}
                    <label
                        {...(labelHTMLProps as FormGroupLabelProps<'label'>)}
                        htmlFor={formControlId}
                        className={classNames(
                            labelHTMLProps.className,
                            'ud-form-label ud-heading-sm',
                        )}
                    >
                        <span className="ud-compact-form-label-content">
                            <span className="ud-compact-form-label-text">{props.label}</span>
                            {getValidationIcon(props.validationState)}
                        </span>
                    </label>
                    {tag && <div className="ud-text-xs ud-form-label-tag">{tag}</div>}
                </div>
                {props.note && (
                    <div
                        {...props.noteProps}
                        id={noteId}
                        role={props.validationState === 'error' ? 'alert' : undefined}
                        className={classNames(
                            props.noteProps?.className,
                            'ud-form-note ud-text-xs',
                        )}
                    >
                        {props.note}
                    </div>
                )}
            </>
        );
    };

    render() {
        return (
            <Provider $$udCompactFormGroup={this}>
                <BaseFormGroup
                    {...this.props}
                    ref={this.baseFormGroupRef}
                    className={classNames(this.props.className, 'ud-compact-form-group')}
                    formControlClassName="ud-compact-form-control"
                    renderContent={this.renderContent}
                    udStyle="default"
                    usage={'FormGroup udStyle="default"'}
                />
            </Provider>
        );
    }
}
