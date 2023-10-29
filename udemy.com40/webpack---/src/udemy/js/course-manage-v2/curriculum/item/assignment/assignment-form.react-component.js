import {Button} from '@udemy/react-core-components';
import {TextInputWithCounter, FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CurriculumAssignmentFormModel from './curriculum-assignment-form.mobx-model';
import CurriculumAssignmentModel from './curriculum-assignment.mobx-model';
import '../item-form.less';

@observer
export default class AssignmentForm extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumAssignmentModel),
        form: PropTypes.instanceOf(CurriculumAssignmentFormModel).isRequired,
        onCancel: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        curriculumItem: null,
    };

    UNSAFE_componentWillMount() {
        this.props.form.reset(this.props.curriculumItem);
    }

    @autobind
    onTitleChange(event) {
        this.props.form.setField('title', event.target.value);
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.props.form.data);
    }

    render() {
        const {form, onCancel} = this.props;
        return (
            <form data-purpose="assignment-form" styleName="item-form" onSubmit={this.onSubmit}>
                <div styleName="flex">
                    <FormGroup
                        label={gettext('Title')}
                        labelProps={{className: 'ud-sr-only'}}
                        data-purpose="assignment-form-group-title"
                        note={form.error.title ? form.error.title.join(' ') : null}
                        validationState={form.error.title ? 'error' : 'neutral'}
                    >
                        <TextInputWithCounter
                            autoFocus={true}
                            maxLength={80}
                            placeholder={gettext('Enter a Title')}
                            data-purpose="assignment-title"
                            value={form.data.title}
                            onChange={this.onTitleChange}
                            size="small"
                        />
                    </FormGroup>
                    <div styleName="submit-row">
                        <Button
                            size="small"
                            className="ud-link-neutral"
                            udStyle="ghost"
                            onClick={onCancel}
                            data-purpose="cancel-assignment-form"
                        >
                            {gettext('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            size="small"
                            data-purpose="submit-assignment-form"
                            disabled={form.isSaving}
                        >
                            {gettext('Add Assignment')}
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}
