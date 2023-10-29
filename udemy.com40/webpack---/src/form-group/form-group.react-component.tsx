/* eslint-disable @typescript-eslint/naming-convention */
import {getUniqueId} from '@udemy/design-system-utils';
import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import {BaseIconProps} from '@udemy/react-core-components';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer, Provider} from 'mobx-react';
import React from 'react';

// Note: FormGroup CSS is served up via the react-form-components.global.css file;

/**
 * Foundational interface for `FormGroups`.
 *
 * @privateRemarks
 * Excludes `udStyle`, `renderContent` and `labelProps`.
 */
export interface FormGroupFoundationalProps extends React.ComponentPropsWithoutRef<'div'> {
    /** Unique id of the form control. */
    formControlId?: string;
    /** The form control's label. Text or HTML. */
    label: React.ReactNode;
    /**
     * Optional form control note. Text or HTML.
     *
     * @remarks
     * When validation state is neutral, this content
     * should be appropriate as a semantic description for the contained form
     * control.
     *
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-describedby
     *
     * When the `validationState` is `error`, this content should be an appropriate
     * error message for the form control.
     */
    note?: React.ReactNode;
    /** Extra props passed to form control note. */
    noteProps?: React.ComponentPropsWithoutRef<'div'>;
    /** Validation state for a `FormGroup`. */
    validationState?: 'neutral' | 'error' | null;
}

// Default Props used by FormGroup, CompactFormGroup, InputPillFormGroup, and ToggleInputBlockFormGroup
export const publicFormGroupDefaultProps = {
    labelProps: {},
    note: null,
    noteProps: {},
    validationState: 'neutral',
    formControlId: null,
    className: null,
};

/**
 * The interface for a FormGroup label
 *
 * @privateRemarks
 * `labelProps` is `tag`, `typography`, and any props allowed on either `<legend>` or
 * `<label>`. First create a generic type that supports either of these
 * conditions, then create instances for `<legend>` and `<label>` in the
 * discriminated union below.
 */
export type FormGroupLabelProps<LabelTag extends React.ElementType> = {
    /** Optional descriptor to add to a FormGroup label. Ex: 'Required'  */
    tag?: string;
    /**
     *
     * Optional className to add to Label for typography.
     *
     * @defaultValue
     * `ud-heading-sm`
     */
    typography?: string;
} & React.ComponentPropsWithoutRef<LabelTag>;

// If udStyle ===
// 'default': label rendered as <label> and form group rendered as <div>
interface StyleDefaultProps {
    udStyle: 'default';
    labelProps: FormGroupLabelProps<'label'>;
}

// If udStyle ===
// 'fieldset': label rendered as <legend> and form group rendered as <fieldset>
interface StyleFieldSetProps {
    udStyle: 'fieldset';
    labelProps: FormGroupLabelProps<'legend'>;
}

type StyleDiscriminationProps = StyleDefaultProps | StyleFieldSetProps;

/** The React props interface for `FormGroup` */
export type FormGroupProps = FormGroupFoundationalProps & StyleDiscriminationProps;

/**
 *
 * ValidationState values for a FormGroup
 *
 * @privateRemarks
 * This is somewhat topsy-turvy. Normally we specify a type and then reference that
 * in the interface, not vice versa.
 */
export type ValidationState = FormGroupProps['validationState'];

/**
 * Splice of {@link FormGroupFoundationalProps} and {@link StyleDiscriminationProps}
 * to use for private function `renderContentFromLabel`.
 *
 * @internal
 */
export type FormGroupRenderContentProps = Omit<
    FormGroupFoundationalProps,
    'className' | 'formControlId'
> &
    StyleDiscriminationProps;

/**
 * ### The FormGroup component.
 *
 * @remarks
 * This component requires global CSS.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-form-components/dist/react-form-components.global.css'`
 *
 * @privateRemarks
 * Renders a {@link BaseFormGroup}.
 */
@observer
export class FormGroup extends React.Component<FormGroupProps> {
    static defaultProps = {
        ...publicFormGroupDefaultProps,
        udStyle: 'default',
    };

    // Render the node that serves as the "label" for the form group. Depending
    // on udStyle, the node will either be a <legend> (for a <fieldset>) or a
    // <label>.
    private renderContentFormLabel = (
        props: FormGroupRenderContentProps,
        formControlId: string,
    ) => {
        const {
            tag: tagProp,
            typography: labelTypography,
            className: classNameProp,
        } = props.labelProps;

        const className = classNames(
            classNameProp,
            'ud-form-label',
            labelTypography ?? 'ud-heading-sm',
        );
        const children = (
            <>
                {props.label}
                {getValidationIcon(props.validationState)}
                {tagProp && <span className="ud-text-xs ud-form-label-tag">{tagProp}</span>}
            </>
        );

        // Guard to narrow discriminated prop types:
        if (props.udStyle === 'fieldset') {
            const {tag, typography, ...legendHTMLProps} = props.labelProps;
            return (
                <legend {...legendHTMLProps} className={className}>
                    {children}
                </legend>
            );
        }

        const {tag, typography, ...labelHTMLProps} = props.labelProps;
        return (
            <label {...labelHTMLProps} htmlFor={formControlId} className={className}>
                {children}
            </label>
        );
    };

    renderContent = (
        props: FormGroupRenderContentProps,
        {formControlId, noteId}: {formControlId: string; noteId: string},
    ) => {
        const formLabel = this.renderContentFormLabel(props, formControlId);

        return (
            <>
                {formLabel}
                {props.children}
                {props.note && (
                    <div
                        {...props.noteProps}
                        id={noteId}
                        role={props.validationState === 'error' ? 'alert' : undefined}
                        className={classNames(
                            props?.noteProps?.className,
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
            <BaseFormGroup
                {...this.props}
                renderContent={this.renderContent}
                usage={`FormGroup udStyle="${this.props.udStyle}"`}
            />
        );
    }
}

/** React props interface for the BaseFormGroup component. */
export type BaseFormGroupProps = {
    /** A pass-through className prop and accessed on BaseFormGroup instances */
    formControlClassName?: string;
    /** Render function for main content of BaseFormGroup */
    renderContent: (
        props: FormGroupRenderContentProps,
        {formControlId, noteId}: {formControlId: string; noteId: string},
    ) => React.ReactNode;
    /**
     * FormGroup usage used by checkFormGroup.
     *
     * @remarks
     * Should be along the lines of: 'FormGroup udStyle="default"'
     */
    usage: string;
} & FormGroupProps;

/**
 * The BaseFromGroup component.
 *
 * @remarks
 * Wraps a `<fieldset>` or `<div>` component in a mobx-react Provider.
 */
@observer
export class BaseFormGroup extends React.Component<BaseFormGroupProps> {
    static defaultProps = {
        ...publicFormGroupDefaultProps,
    };

    constructor(props: BaseFormGroupProps) {
        super(props);
        this.defaultId = getUniqueId('form-group');
        this.defaultNoteId = getUniqueId('form-group-note');
    }

    private readonly defaultId;
    private readonly defaultNoteId;

    get id() {
        const formControlId = this.props?.formControlId;

        /* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */
        return formControlId || this.defaultId;
    }

    get inputAriaProps() {
        const props = this.synthesizedProps;
        const isInvalid = props.validationState === 'error';

        return {
            'aria-errormessage': isInvalid && props.note ? this.noteId : null,
            'aria-describedby': !isInvalid && props.note ? this.noteId : null,
            'aria-invalid': isInvalid,
        };
    }

    get noteId() {
        return this.props.noteProps?.id ?? this.defaultNoteId;
    }

    get synthesizedProps() {
        return {...this.props, ...this.propOverrides};
    }

    @observable.ref propOverrides = {};

    @action setPropOverrides(props: Pick<BaseFormGroupProps, 'note' | 'validationState'>) {
        this.propOverrides = props;
    }

    render() {
        const props = this.synthesizedProps;

        const {
            children,
            className,
            formControlId,
            formControlClassName,
            label,
            labelProps,
            note,
            noteProps,
            renderContent,
            udStyle,
            usage,
            validationState,
            ...htmlProps
        } = props;

        const formGroupClassName = classNames(className, 'ud-form-group', {
            'ud-form-group-error': validationState === 'error',
        });
        const view = renderContent(props, {formControlId: this.id, noteId: this.noteId});
        const wrapper =
            udStyle === 'fieldset' ? (
                <fieldset
                    {...(htmlProps as React.ComponentPropsWithoutRef<'fieldset'>)}
                    className={formGroupClassName}
                >
                    {view}
                </fieldset>
            ) : (
                <div
                    {...(htmlProps as React.ComponentPropsWithoutRef<'div'>)}
                    className={formGroupClassName}
                >
                    {view}
                </div>
            );
        return <Provider $$udFormGroup={this}>{wrapper}</Provider>;
    }
}

/**
 * Returns an ErrorIcon based on {@link ValidationState}
 *
 * @param validationState - the validation state of the FormGroup
 * @param props - optional React props implementing the {@link BaseIconProps} interface
 *
 * @returns An `ErrorIcon` component if `validationSate` is `error`
 */
export function getValidationIcon(validationState?: ValidationState, props?: BaseIconProps) {
    return (
        validationState === 'error' && (
            <ErrorIcon
                {...props}
                className="ud-form-group-validation-icon"
                color="negative"
                label={false}
            />
        )
    );
}
