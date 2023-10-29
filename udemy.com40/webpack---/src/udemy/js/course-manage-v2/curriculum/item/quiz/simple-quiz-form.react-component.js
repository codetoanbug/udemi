import {Button} from '@udemy/react-core-components';
import {TextInputWithCounter, FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';

import {ItemStatusIcon} from '../item-icons.react-component';
import CurriculumQuizFormModel from './curriculum-quiz-form.mobx-model';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import '../item-form.less';

@observer
export default class SimpleQuizForm extends Component {
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

    @autobind
    onTitleChange(event) {
        this.props.form.setField('title', event.target.value);
    }

    @autobind
    onDescriptionChange(value) {
        this.props.form.setField('description', value);
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.props.form.data);
    }

    render() {
        const {curriculumItem, form, onCancel} = this.props;
        return (
            <form data-purpose="quiz-form" styleName="item-form" onSubmit={this.onSubmit}>
                <div styleName="title">
                    {this.isEditing ? (
                        <>
                            <ItemStatusIcon curriculumItem={curriculumItem} />
                            {curriculumItem.is_published
                                ? `${gettext('Quiz')} ${curriculumItem.object_index}:`
                                : `${gettext('Quiz')}:`}
                        </>
                    ) : (
                        gettext('New Quiz:')
                    )}
                </div>
                <div styleName="flex">
                    <FormGroup
                        label={gettext('Title')}
                        labelProps={{className: 'ud-sr-only'}}
                        data-purpose="quiz-form-group-title"
                        note={form.error.title ? form.error.title.join(' ') : null}
                        validationState={form.error.title ? 'error' : 'neutral'}
                    >
                        <TextInputWithCounter
                            autoFocus={true}
                            maxLength={80}
                            placeholder={gettext('Enter a Title')}
                            data-purpose="quiz-title"
                            value={form.data.title}
                            onChange={this.onTitleChange}
                            size="small"
                        />
                    </FormGroup>
                    <FormGroup
                        label={gettext('Quiz Description')}
                        labelProps={{className: 'ud-sr-only'}}
                        data-purpose="quiz-form-group-description"
                        note={form.error.description ? form.error.description.join(' ') : null}
                        validationState={form.error.description ? 'error' : 'neutral'}
                    >
                        <RichTextEditor
                            theme={RichTextEditor.THEMES.QUIZ_DESCRIPTION}
                            placeholder={gettext('Quiz Description')}
                            value={form.data.description}
                            onValueChange={this.onDescriptionChange}
                        />
                    </FormGroup>
                    <div styleName="submit-row">
                        <Button
                            size="small"
                            className="ud-link-neutral"
                            udStyle="ghost"
                            onClick={onCancel}
                            data-purpose="cancel-quiz-form"
                        >
                            {gettext('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            size="small"
                            data-purpose="submit-quiz-form"
                            disabled={form.isSaving}
                        >
                            {this.isEditing ? gettext('Save Quiz') : gettext('Add Quiz')}
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}
