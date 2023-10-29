import {FormGroup, TextInput, Radio} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import './learning-reminder-form.less';
import {CourseType} from '../types';
import {CourseSearch} from './course-search.react-component';
import {LearningReminderFormStore} from './learning-reminder-form.mobx-store';

interface ReminderNameProps {
    store: LearningReminderFormStore;
}
@observer
export class ReminderName extends Component<ReminderNameProps> {
    componentDidMount() {
        if (this.props.store.showCourseSelect) {
            this.props.store.loadRecentCourses();
        }
    }

    @autobind
    onUpdateCourse(e: React.ChangeEvent<HTMLInputElement>) {
        const id = e.target.value !== 'none' ? Number(e.target.value) : 'none';
        this.props.store.updateCourse(id);
    }

    @autobind
    onChangeFormField(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.store.setFormFieldValue(event.target.name, event.target.value);
    }

    render() {
        const {store} = this.props;

        const recentCourses = store.courseOptions?.map((course: CourseType) => {
            return (
                <Radio
                    key={course.id}
                    value={course.id}
                    onChange={this.onUpdateCourse}
                    checked={course.id === store.formFields.selectedContentObject.value.id}
                >
                    {course.title}
                </Radio>
            );
        });

        return (
            <>
                <div className="ud-text-sm" styleName="progress-text">
                    {gettext('Step 1 of 3')}
                </div>
                <FormGroup
                    styleName="form-group-container"
                    label={gettext('Name')}
                    labelProps={{tag: gettext('Optional')}}
                >
                    <TextInput
                        name="title"
                        value={store.formFields.title.value}
                        placeholder={gettext('Time to learn!')}
                        onChange={this.onChangeFormField}
                    />
                </FormGroup>
                {store.showCourseSelect && (
                    <>
                        <FormGroup
                            udStyle="fieldset"
                            styleName="form-group-container"
                            label={gettext('Course')}
                            labelProps={{tag: gettext('Optional')}}
                        >
                            <div styleName="description">
                                {gettext(
                                    'Choose from your most recent or search from your courses',
                                )}
                            </div>
                            {recentCourses ?? <Loader />}
                            <Radio
                                value={'none'}
                                onChange={this.onUpdateCourse}
                                checked={store.formFields.selectedContentObject.value.id === null}
                            >
                                {gettext('None')}
                            </Radio>
                        </FormGroup>
                        <CourseSearch onCourseSelect={store.updateCourseFromSearch} />
                    </>
                )}
            </>
        );
    }
}
