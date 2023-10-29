import {BaseFormGroup} from './form-group.react-component';

/**
 * A runtime check in form control component to verify a wrapping {@link FormGroup} and that it is configured correctly.
 *
 * @param FormControl - The name of the FormControl being checked. Ex: 'InputPill'
 * @param formControlProps  - React props from the FormControl being checked. `id` and `$$udFormGroup` are destructured from this.
 * @param formGroupUsage - Optional form group usage check.
 * @param isFormGroupRequired - Check to see if `FormControl` must be within a FormGroup
 *
 * @returns a console.error will be returned if FormGroup validation fails.
 */
export function checkFormGroup(
    FormControl: string,
    formControlProps: {id?: string; $$udFormGroup?: BaseFormGroup},
    formGroupUsage: string | null,
    isFormGroupRequired: boolean,
) {
    const {$$udFormGroup, id} = formControlProps;
    /* eslint-disable no-console */
    if (isFormGroupRequired && !$$udFormGroup) {
        console.error(
            `${FormControl} must be in a FormGroup; the FormGroup \`label\` is required for A11Y`,
        );
    } else if (id && $$udFormGroup && id !== $$udFormGroup.id) {
        console.error(
            `${FormControl} id "${id}" will be overridden by FormGroup; use \`formControlId\` on FormGroup to avoid this`,
        );
    } else if (formGroupUsage && $$udFormGroup && formGroupUsage !== $$udFormGroup.props.usage) {
        console.error(
            `You wrapped ${FormControl} in the wrong FormGroup; the correct usage is <${formGroupUsage} />`,
        );
    }
    /* eslint-enable no-console */
}
