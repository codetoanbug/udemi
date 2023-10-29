import {ConfirmModal} from '@udemy/react-dialog-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AddKnowledgeAreaInput from './add-knowledge-area-input.react-component';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import KnowledgeArea from './knowledge-area.react-component';
import MultipleChoiceAssessmentFormModel from './multiple-choice-assessment-form.mobx-model';

@observer
export default class KnowledgeAreaFormGroup extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        form: PropTypes.instanceOf(MultipleChoiceAssessmentFormModel).isRequired,
    };

    @autobind
    onDeleteKnowledgeAreaConfirm() {
        const {curriculumItem, form} = this.props;
        const selectedIndex = form.data.selectedKnowledgeAreaIndex;
        const toBeDeletedIndex = curriculumItem.knowledgeAreaFormField.toBeDeletedOptionIndex;
        if (toBeDeletedIndex < selectedIndex) {
            form.setField('selectedKnowledgeAreaIndex', selectedIndex - 1);
        } else if (toBeDeletedIndex === selectedIndex) {
            form.setField('selectedKnowledgeAreaIndex', -1);
        }
        curriculumItem.knowledgeAreaFormField.delete();
    }

    render() {
        const formField = this.props.curriculumItem.knowledgeAreaFormField;
        return (
            <FormGroup
                udStyle="fieldset"
                label={gettext('Knowledge Area (Optional)')}
                data-purpose="knowledge-area-form-group"
            >
                <KnowledgeArea form={this.props.form} formField={formField} value="" index={-1} />
                {(formField.options || []).map((option, i) => {
                    return (
                        <KnowledgeArea
                            key={i}
                            form={this.props.form}
                            formField={formField}
                            value={option.value}
                            index={i}
                        />
                    );
                })}
                <AddKnowledgeAreaInput formField={formField} />
                <ConfirmModal
                    onCancel={formField.unmarkAsToBeDeleted}
                    onConfirm={this.onDeleteKnowledgeAreaConfirm}
                    isOpen={formField.toBeDeletedOptionIndex !== null}
                >
                    {gettext(
                        'This will permanently delete this knowledge area. Are you sure you want to continue?',
                    )}
                </ConfirmModal>
            </FormGroup>
        );
    }
}
