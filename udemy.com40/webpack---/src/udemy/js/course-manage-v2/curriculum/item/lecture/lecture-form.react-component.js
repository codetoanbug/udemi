import {Button} from '@udemy/react-core-components';
import {TextInputWithCounter, FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ItemStatusIcon} from '../item-icons.react-component';
import CurriculumLectureFormModel from './curriculum-lecture-form.mobx-model';
import CurriculumLectureModel from './curriculum-lecture.mobx-model';
import '../item-form.less';

@observer
export default class LectureForm extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel),
        form: PropTypes.instanceOf(CurriculumLectureFormModel).isRequired,
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
    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.props.form.data);
    }

    render() {
        const {curriculumItem, form, onCancel} = this.props;
        return (
            <form data-purpose="lecture-form" styleName="item-form" onSubmit={this.onSubmit}>
                <div styleName="title">
                    {this.isEditing ? (
                        <>
                            <ItemStatusIcon curriculumItem={curriculumItem} />
                            {curriculumItem.is_published
                                ? `${gettext('Lecture')} ${curriculumItem.object_index}:`
                                : `${gettext('Lecture')}:`}
                        </>
                    ) : (
                        gettext('New Lecture:')
                    )}
                </div>
                <div styleName="flex">
                    <FormGroup
                        label={gettext('Title')}
                        labelProps={{className: 'ud-sr-only'}}
                        data-purpose="lecture-form-group-title"
                        note={form.error.title ? form.error.title.join(' ') : null}
                        validationState={form.error.title ? 'error' : 'neutral'}
                    >
                        <TextInputWithCounter
                            autoFocus={true}
                            maxLength={80}
                            placeholder={gettext('Enter a Title')}
                            data-purpose="lecture-title"
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
                            data-purpose="cancel-lecture-form"
                        >
                            {gettext('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            size="small"
                            data-purpose="submit-lecture-form"
                            disabled={form.isSaving}
                        >
                            {this.isEditing ? gettext('Save Lecture') : gettext('Add Lecture')}
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}
