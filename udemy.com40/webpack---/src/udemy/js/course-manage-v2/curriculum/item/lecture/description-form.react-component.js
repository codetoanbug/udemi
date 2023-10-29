import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';

import CurriculumLectureModel from './curriculum-lecture.mobx-model';
import '../item-form.less';

@observer
export default class DescriptionForm extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
    };

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.props.curriculumItem
            .partialUpdate({
                description: this.props.curriculumItem.description,
            })
            .then(this.props.curriculumItem.closeDescriptionForm)
            .catch(handleUnexpectedAPIError);
    }

    render() {
        const curriculumItem = this.props.curriculumItem;
        return (
            <form data-purpose="description-form" onSubmit={this.onSubmit}>
                <FormGroup label={gettext('Lecture Description')}>
                    <RichTextEditor
                        theme={RichTextEditor.THEMES.LECTURE_DESCRIPTION}
                        autoFocus={true}
                        placeholder={gettext(
                            'Add a description. Include what students will be able to do after completing the lecture.',
                        )}
                        value={curriculumItem.description}
                        onValueChange={curriculumItem.setDescription}
                    />
                </FormGroup>
                <div styleName="submit-row">
                    <Button
                        size="small"
                        className="ud-link-neutral"
                        udStyle="ghost"
                        onClick={curriculumItem.closeDescriptionForm}
                    >
                        {gettext('Cancel')}
                    </Button>
                    <Button type="submit" size="small" disabled={curriculumItem.isSaving}>
                        {gettext('Save')}
                    </Button>
                </div>
            </form>
        );
    }
}
