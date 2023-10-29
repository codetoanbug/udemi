import {Button} from '@udemy/react-core-components';
import {Modal, ModalTrigger} from '@udemy/react-dialog-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {PermissionsPopover} from '../course-manage-v2/settings/course-instructors.react-component';
import {PERMISSION_DISPLAY_MAP} from './constants';

import './co-instructor-invitation.less';

@observer
export default class CoInstructorInvitation extends Component {
    static propTypes = {
        invitation: PropTypes.object.isRequired,
        coInstructorInvitationStore: PropTypes.object.isRequired,
        coursesStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.invitation = this.props.invitation;
        this.coInstructorInvitationStore = this.props.coInstructorInvitationStore;
        this.coursesStore = this.props.coursesStore;
    }

    @autobind
    async handleAccept() {
        await this.coInstructorInvitationStore.acceptCoInstructorInvitation(this.invitation.id);
        if (this.coInstructorInvitationStore.hasAcceptedInvitation) {
            this.coursesStore.resetPaginationAndGetCourseList();
        }
        this.coInstructorInvitationStore.setAcceptedInvitation(false);
    }

    @autobind
    handleDecline() {
        this.coInstructorInvitationStore.declineCoInstructorInvitation(this.invitation.id);
    }

    render() {
        const course = this.invitation.related_object;
        const half = Math.ceil(this.invitation.permissions.length / 2);
        const leftPermissions = this.invitation.permissions.slice(0, half);
        const rightPermissions = this.invitation.permissions.slice(half);

        return (
            <AlertBanner
                title={interpolate(
                    gettext(
                        'You have a pending co-instructor invitation for the course: %(course)s',
                    ),
                    {course: course.title},
                    true,
                )}
                dismissButtonProps={false}
                showCta={false}
                body={
                    <ModalTrigger
                        trigger={
                            <Button size="medium" styleName="alert-banner-button">
                                {gettext('View invitation')}
                            </Button>
                        }
                        renderModal={(props) => (
                            <Modal {...props} title={gettext('Co-instructor invitation')}>
                                <div className="ud-text-bold">{gettext('Course name')}</div>
                                <p styleName="course-title">{course.title}</p>
                                <div styleName="section">
                                    <div styleName="row">
                                        <div styleName="column">
                                            <div className="ud-text-bold">
                                                {gettext('Owner of the course')}
                                            </div>
                                            <p>{course.owner_name}</p>
                                        </div>
                                        <div styleName="column">
                                            <div className="ud-text-bold">
                                                {gettext('Invite sent by')}
                                            </div>
                                            <p>{this.invitation.sender.display_name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div styleName="section">
                                    <div styleName="row">
                                        <div className="ud-text-bold">
                                            {gettext('Your permissions')}
                                        </div>
                                        <div styleName="permissions-info-icon-container">
                                            <PermissionsPopover></PermissionsPopover>
                                        </div>
                                    </div>
                                    <div styleName="row">
                                        <div styleName="column">
                                            <ul styleName="bulleted-list">
                                                {leftPermissions.map((permission) => {
                                                    return (
                                                        <li key={permission}>
                                                            <span>
                                                                {PERMISSION_DISPLAY_MAP[permission]}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <div styleName="column">
                                            <ul styleName="bulleted-list">
                                                {rightPermissions.map((permission) => {
                                                    return (
                                                        <li key={permission}>
                                                            <span>
                                                                {PERMISSION_DISPLAY_MAP[permission]}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    data-purpose="accept-button"
                                    styleName="modal-button"
                                    onClick={this.handleAccept}
                                >
                                    {gettext('Accept')}
                                </Button>
                                <Button
                                    data-purpose="decline-button"
                                    styleName="modal-button"
                                    udStyle="secondary"
                                    onClick={this.handleDecline}
                                >
                                    {gettext('Decline')}
                                </Button>
                            </Modal>
                        )}
                    />
                }
            />
        );
    }
}
