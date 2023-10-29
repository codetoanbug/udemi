import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Loader from 'course-manage-v2/loader.react-component';
import MainContent from 'course-manage-v2/main-content.react-component';
import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';

import InvitationRequestTable from './invitation-request-table.react-component';
import InviteStudentsLink from './invite-students-link.react-component';
import StudentsList from './students-list.react-component';
import StudentsStore from './students.mobx-store';
import './students-list.less';

const NoStudentsInfo = () => {
    return <p styleName="no-students">{gettext('No students enrolled in this course')}</p>;
};

@observer
export default class Students extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.studentsStore = new StudentsStore();
    }

    componentDidMount() {
        this.studentsStore.getStudentsCourseInfo(this.props.courseId);
    }

    renderActionButtons() {
        if (!this.studentsStore.course.canInvite) {
            return null;
        }
        return <InviteStudentsLink courseId={this.props.courseId} />;
    }

    renderStudents() {
        return (
            <>
                <InvitationRequestTable courseId={this.props.courseId} />
                {this.studentsStore.course.hasStudents ? (
                    <StudentsList courseId={this.props.courseId} />
                ) : (
                    <NoStudentsInfo />
                )}
            </>
        );
    }

    render() {
        const loading = !this.studentsStore.studentsCourseInfoLoaded;
        const actionButtons = loading ? null : this.renderActionButtons();
        return (
            <div>
                <SubHeader title={gettext('Students')} actionButtons={actionButtons} />
                <MainContent>{loading ? <Loader /> : this.renderStudents()}</MainContent>
            </div>
        );
    }
}
