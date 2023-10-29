import {Button} from '@udemy/react-core-components';
import {TextInputWithCounter, FormGroup, TextInput, Switch} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';

import {ItemStatusIcon} from '../item-icons.react-component';
import CurriculumQuizFormModel from './curriculum-quiz-form.mobx-model';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import QuizIsSavingBackdrop from './quiz-is-saving-backdrop.react-component';
import '../item-form.less';

@observer
export default class PracticeTestQuizForm extends Component {
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

    get isEditing() {
        return !!this.props.curriculumItem;
    }

    get isValid() {
        const data = this.props.form.data;
        return (
            data.title.trim().length > 0 &&
            data.duration !== null &&
            data.duration > 0 &&
            data.pass_percent !== null &&
            data.pass_percent >= 1 &&
            data.pass_percent <= 100
        );
    }

    @autobind
    onTitleChange(event) {
        this.props.form.setField('title', event.target.value);
    }

    @autobind
    onDescriptionChange(value) {
        this.props.form.setField('description', value);
    }

    @autobind
    onDurationChange(event) {
        let value = event.target.value;
        if (value === '') {
            value = null;
        } else {
            // Force the value to be an int, not a float. Convert minutes to seconds.
            value = parseInt(value, 10) * 60;
        }
        this.props.form.setField('duration', value);
    }

    @autobind
    onPassPercentChange(event) {
        let value = event.target.value;
        if (value === '') {
            value = null;
        } else {
            // Force the value to be an int, not a float, within the range [0, 100].
            value = Math.min(100, Math.max(0, parseInt(value, 10)));
        }
        this.props.form.setField('pass_percent', value);
    }

    @autobind
    onIsRandomizedChange(event) {
        this.props.form.setField('is_randomized', event.target.checked);
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.props.form.data);
    }

    render() {
        const {curriculumItem, form, onCancel} = this.props;
        return (
            <form data-purpose="practice-test-form" styleName="item-form" onSubmit={this.onSubmit}>
                <div styleName="title">
                    {this.isEditing ? (
                        <>
                            <ItemStatusIcon curriculumItem={curriculumItem} />
                            {curriculumItem.is_published
                                ? `${gettext('Practice Test')} ${curriculumItem.object_index}:`
                                : `${gettext('Practice Test')}:`}
                        </>
                    ) : (
                        gettext('New Practice Test:')
                    )}
                </div>
                <div styleName="flex">
                    <FormGroup
                        label={gettext('Title')}
                        data-purpose="practice-test-form-group-title"
                        note={form.error.title ? form.error.title.join(' ') : null}
                        validationState={form.error.title ? 'error' : 'neutral'}
                    >
                        <TextInputWithCounter
                            autoFocus={true}
                            maxLength={80}
                            data-purpose="practice-test-title"
                            value={form.data.title}
                            onChange={this.onTitleChange}
                            size="small"
                        />
                    </FormGroup>
                    <FormGroup
                        label={gettext('Description')}
                        data-purpose="practice-test-form-group-description"
                        note={form.error.description ? form.error.description.join(' ') : null}
                        validationState={form.error.description ? 'error' : 'neutral'}
                    >
                        <RichTextEditor
                            theme={RichTextEditor.THEMES.PRACTICE_TEST_DESCRIPTION}
                            value={form.data.description}
                            onValueChange={this.onDescriptionChange}
                        />
                    </FormGroup>
                    <FormGroup
                        label={gettext('Duration (minutes)')}
                        data-purpose="practice-test-form-group-duration"
                        note={form.error.duration ? form.error.duration.join(' ') : null}
                        validationState={form.error.duration ? 'error' : 'neutral'}
                    >
                        {/* Duration is stored in DB in seconds, but displayed to instructor in minutes */}
                        <TextInput
                            type="number"
                            required={true}
                            data-purpose="practice-test-duration"
                            value={
                                form.data.duration === null
                                    ? ''
                                    : parseInt(form.data.duration / 60, 10)
                            }
                            onChange={this.onDurationChange}
                            size="small"
                        />
                    </FormGroup>
                    <FormGroup
                        label={gettext('Minimum score to pass (percentage)')}
                        data-purpose="practice-test-form-group-pass-percent"
                        note={form.error.pass_percent ? form.error.pass_percent.join(' ') : null}
                        validationState={form.error.pass_percent ? 'error' : null}
                    >
                        <TextInput
                            type="number"
                            required={true}
                            data-purpose="practice-test-pass-percent"
                            value={form.data.pass_percent === null ? '' : form.data.pass_percent}
                            onChange={this.onPassPercentChange}
                            size="small"
                        />
                    </FormGroup>
                    <FormGroup
                        udStyle="fieldset"
                        label={gettext('Randomize Question and Answer Order')}
                        data-purpose="practice-test-form-group-is-randomized"
                        note={form.error.is_randomized ? form.error.is_randomized.join(' ') : null}
                        validationState={form.error.is_randomized ? 'error' : 'neutral'}
                    >
                        <Switch
                            data-purpose="practice-test-is-randomized"
                            checked={form.data.is_randomized}
                            onChange={this.onIsRandomizedChange}
                            size="large"
                            styleName="switch"
                        >
                            <span className="ud-sr-only">
                                {gettext('Randomize Question and Answer Order')}
                            </span>
                        </Switch>
                    </FormGroup>
                    <div styleName="submit-row">
                        <Button
                            size="small"
                            className="ud-link-neutral"
                            udStyle="ghost"
                            onClick={onCancel}
                            data-purpose="cancel-practice-test-form"
                        >
                            {gettext('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            size="small"
                            data-purpose="submit-practice-test-form"
                            disabled={form.isSaving || !this.isValid}
                        >
                            {this.isEditing
                                ? gettext('Save Practice Test')
                                : gettext('Add Practice Test')}
                        </Button>
                    </div>
                </div>
                {form.isSaving && <QuizIsSavingBackdrop />}
            </form>
        );
    }
}
