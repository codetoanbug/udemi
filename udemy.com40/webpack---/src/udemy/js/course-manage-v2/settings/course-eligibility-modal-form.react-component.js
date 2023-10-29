import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup, TextArea, Select} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CourseEligibilityModalFormStore from './course-eligibility-modal-form.mobx-store';
import './course-eligibility-modal-form.less';

function serializeCourseOption(course) {
    return `${course.id}:${course.isOrganizationEligible}`;
}

function deserializeCourseOption(str) {
    const values = str.split(':');
    const isOrganizationEligible = values[1] === 'true';
    return {id: parseInt(values[0], 10), isOrganizationEligible};
}

@observer
export default class CourseEligibilityModalForm extends Component {
    static propTypes = {
        courses: PropTypes.array.isRequired,
        isOpen: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.sortedCourses = [];
        this.defaultCourse = null;
        if (props.courses.length) {
            this.sortedCourses = props.courses.slice().sort((c1, c2) => {
                return c2.title > c1.title ? -1 : 1;
            });
            this.defaultCourse = this.sortedCourses[0];
        }
        this.store = new CourseEligibilityModalFormStore(this.defaultCourse);
    }

    @autobind
    onDetailChange({target}) {
        this.store.updateDetail(target.value);
    }

    @autobind
    onCourseIdActionChange({target}) {
        const courseValues = deserializeCourseOption(target.value);
        this.store.updateSelectedCourseId(courseValues.id, courseValues.isOrganizationEligible);
    }

    @autobind
    onEligibleActionChange({target}) {
        this.store.updateOrganizationEligible(target.value);
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.store.postOrganizationCourseEligible(this.props.onClose);
    }

    render() {
        const {courses, ...props} = this.props;
        const courseOptions = this.sortedCourses.map((course) => (
            <option
                key={course.id}
                value={serializeCourseOption({
                    id: course.id,
                    isOrganizationEligible: course.isOrganizationEligible,
                })}
            >
                {course.title}
            </option>
        ));
        const subHeader = gettext(
            'If you believe your course does not meet the requirements in the Udemy Business ' +
                'Program terms, let us know below. By opting into the program, all of your ' +
                'courses are eligible unless you specify otherwise. If this changes in the ' +
                'future, you can resubmit the form below.',
        );

        return (
            <Modal {...props} title={gettext('Course eligibility for the UB program')}>
                <form onSubmit={this.onSubmit} styleName="form">
                    <p styleName="subheader">{subHeader}</p>
                    <FormGroup label={gettext('Course name')}>
                        <Select
                            defaultValue={this.defaultCourse}
                            onChange={this.onCourseIdActionChange}
                        >
                            {courseOptions}
                        </Select>
                    </FormGroup>
                    <FormGroup label={gettext('Change course eligibility to')}>
                        <Select
                            value={this.store.newIsOrganizationEligible}
                            onChange={this.onEligibleActionChange}
                        >
                            <option key="is-eligible" value="true">
                                {gettext('Is eligible')}
                            </option>
                            <option key="is-not-eligible" value="false">
                                {gettext('Is not eligible')}
                            </option>
                        </Select>
                    </FormGroup>
                    <FormGroup label={gettext('Details on course eligibility')}>
                        <TextArea
                            placeholder={gettext(
                                'Please explain why this course is or is not eligible',
                            )}
                            onChange={this.onDetailChange}
                            value={this.store.detail}
                        />
                    </FormGroup>
                    <FooterButtons>
                        <Button onClick={props.onClose} udStyle="ghost">
                            {gettext('Cancel')}
                        </Button>
                        <Button type="submit" disabled={this.store.disableSubmitButton}>
                            {gettext('Submit')}
                        </Button>
                    </FooterButtons>
                </form>
            </Modal>
        );
    }
}
