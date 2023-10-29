import {FormGroup, Select} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';

import AssessmentFormModel from './assessment-form.mobx-model';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';

@observer
export default class RelatedLectureFormGroup extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        form: PropTypes.instanceOf(AssessmentFormModel).isRequired,
    };

    componentDidMount() {
        this.props.curriculumItem
            .getRelatedLectureOptions(!this.props.curriculumItem.course.isOrganizationOnly)
            .catch(handleUnexpectedAPIError);
    }

    @autobind
    setRelatedLecture(event) {
        this.props.form.setField('related_lecture', event.target.value);
    }

    render() {
        const {curriculumItem, form} = this.props;
        return (
            <FormGroup
                label={gettext('Related Lecture')}
                note={gettext(
                    'Select a related video lecture to help students answer this question.',
                )}
            >
                <Select
                    data-purpose="related-lecture-select"
                    value={form.data.related_lecture}
                    onChange={this.setRelatedLecture}
                    required={false}
                >
                    <option value="">{`-- ${gettext('Select One')} --`}</option>
                    {(curriculumItem.relatedLectureOptions || []).map((lecture) => {
                        return (
                            <option key={lecture.id} value={`${lecture.id}`}>
                                {lecture.title}
                            </option>
                        );
                    })}
                </Select>
            </FormGroup>
        );
    }
}
