import {Button} from '@udemy/react-core-components';
import {TextInputWithCounter, FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CurriculumSectionFormModel from './curriculum-section-form.mobx-model';
import CurriculumSectionModel from './curriculum-section.mobx-model';
import '../item-form.less';
import {SectionHasTopicStore} from './topic/section-has-topic.mobx-store';
import {SectionTopicFormInput} from './topic/section-topic-form-input.react-component';

@observer
export default class SectionForm extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumSectionModel),
        form: PropTypes.instanceOf(CurriculumSectionFormModel).isRequired,
        onCancel: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        hasSectionTopicsEnabled: PropTypes.bool,
    };

    static defaultProps = {
        curriculumItem: null,
        hasSectionTopicsEnabled: false,
    };

    constructor(props) {
        super(props);
        if (props.curriculumItem) {
            this.sectionHasTopicStore = new SectionHasTopicStore(props.curriculumItem);
        }
    }

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
    onDescriptionChange(event) {
        this.props.form.setField('description', event.target.value);
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.props.form.data);
    }

    render() {
        const {curriculumItem, form, onCancel} = this.props;
        return (
            <form data-purpose="section-form" styleName="item-form" onSubmit={this.onSubmit}>
                <div className="ud-text-bold" styleName="title">
                    {this.isEditing ? (
                        <>
                            {curriculumItem.is_published
                                ? `${gettext('Section')} ${curriculumItem.object_index}:`
                                : `${gettext('Section')}:`}
                        </>
                    ) : (
                        gettext('New Section:')
                    )}
                </div>
                <div styleName="flex">
                    <FormGroup
                        label={gettext('Title')}
                        labelProps={{className: 'ud-sr-only'}}
                        data-purpose="section-form-group-title"
                        note={form.error.title ? form.error.title.join(' ') : null}
                        validationState={form.error.title ? 'error' : 'neutral'}
                    >
                        <TextInputWithCounter
                            autoFocus={true}
                            maxLength={80}
                            placeholder={gettext('Enter a Title')}
                            data-purpose="section-title"
                            value={form.data.title}
                            onChange={this.onTitleChange}
                            size="small"
                        />
                    </FormGroup>
                    {this.props.hasSectionTopicsEnabled && (
                        <div styleName="form-section">
                            <SectionTopicFormInput
                                sectionHasTopicStore={this.sectionHasTopicStore}
                            />
                        </div>
                    )}
                    <FormGroup
                        label={gettext(
                            'What will students be able to do at the end of this section?',
                        )}
                        data-purpose="section-form-group-description"
                        note={form.error.description ? form.error.description.join(' ') : null}
                        validationState={form.error.description ? 'error' : 'neutral'}
                    >
                        <TextInputWithCounter
                            maxLength={200}
                            placeholder={gettext('Enter a Learning Objective')}
                            data-purpose="section-objective"
                            value={form.data.description}
                            onChange={this.onDescriptionChange}
                            size="small"
                        />
                    </FormGroup>
                    <div styleName="submit-row">
                        <Button
                            size="small"
                            className="ud-link-neutral"
                            udStyle="ghost"
                            onClick={onCancel}
                            data-purpose="cancel-section-form"
                        >
                            {gettext('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            size="small"
                            data-purpose="submit-section-form"
                            disabled={form.isSaving}
                        >
                            {this.isEditing ? gettext('Save Section') : gettext('Add Section')}
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}
