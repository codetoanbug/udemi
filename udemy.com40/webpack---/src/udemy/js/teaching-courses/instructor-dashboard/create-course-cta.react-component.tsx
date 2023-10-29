import {Tracker} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import React, {Component} from 'react';

import './instructor-dashboard.less';

import {InstructorCourseListActionEvent} from 'instructor/events';
import udLink from 'utils/ud-link';

export class CreateCourseCTA extends Component {
    @autobind
    clickNewCourse() {
        Tracker.publishEvent(
            new InstructorCourseListActionEvent({
                category: 'create_course',
                input: '',
                action: 'click',
            }),
        );
    }

    render() {
        return (
            <div styleName="panel create-cta-panel">
                <h1 styleName="create-cta-title">{gettext('Jump Into Course Creation')}</h1>
                <Button
                    componentClass="a"
                    href={udLink.to('course', 'create')}
                    styleName="create-cta-button"
                    udStyle="brand"
                    data-purpose="click-new-course"
                    onClick={this.clickNewCourse}
                >
                    {gettext('Create Your Course')}
                </Button>
            </div>
        );
    }
}
