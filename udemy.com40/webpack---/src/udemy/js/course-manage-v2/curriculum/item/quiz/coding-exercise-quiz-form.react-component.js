import {Button} from '@udemy/react-core-components';
import {TextInputWithCounter, FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CurriculumQuizFormModel from './curriculum-quiz-form.mobx-model';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';

import '../item-form.less';

@observer
export default class CodingExerciseQuizForm extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel),
        form: PropTypes.instanceOf(CurriculumQuizFormModel).isRequired,
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
            <form
                data-purpose="coding-exercise-form"
                styleName="item-form"
                onSubmit={this.onSubmit}
            >
                <div styleName="flex">
                    <FormGroup
                        label={gettext('Title')}
                        labelProps={{className: 'ud-sr-only'}}
                        data-purpose="coding-exercise-form-group-title"
                        note={form.error.title ? form.error.title.join(' ') : null}
                        validationState={form.error.title ? 'error' : 'neutral'}
                    >
                        <TextInputWithCounter
                            autoFocus={true}
                            maxLength={100}
                            placeholder={gettext('Enter a Title')}
                            data-purpose="coding-exercise-title"
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
                            data-purpose="cancel-coding-exercise-form"
                        >
                            {gettext('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            size="small"
                            data-purpose="submit-coding-exercise-form"
                            disabled={form.isSaving}
                        >
                            {gettext('Add Coding Exercise')}
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}
