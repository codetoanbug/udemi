import {LocalizedHtml} from '@udemy/i18n';
import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import {Button} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger, Modal} from '@udemy/react-dialog-components';
import {FormGroup, TextInputContainer, TextInput, Checkbox} from '@udemy/react-form-components';
import {Badge, AlertBanner} from '@udemy/react-messaging-components';
import {Popover} from '@udemy/react-popup-components';
import {Table} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import MainContent from 'course-manage-v2/main-content.react-component';
import {showReloadPageErrorToast} from 'instructor/toasts';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getConfigData from 'utils/get-config-data';
import {defaultErrorMessage} from 'utils/ud-api';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';

import AddCoInstructorStore from './add-co-instructor.mobx-store';
import AddCoInstructor from './add-co-instructor.react-component';
import './course-instructors.less';

const udConfig = getConfigData();

export class PermissionsPopover extends React.Component {
    render() {
        return (
            <>
                <Popover
                    placement="bottom-start"
                    a11yRole="description"
                    trigger={
                        <Button udStyle="link">
                            <InfoOutlineIcon label={gettext('Learn more about permissions')} />
                        </Button>
                    }
                    canToggleOnHover={true}
                >
                    {
                        <LocalizedHtml
                            html={gettext(
                                'Visit <a class="link">the link</a> to ' +
                                    'learn more about permissions.',
                            )}
                            interpolate={{
                                link: (
                                    <a
                                        className="ud-link-underline"
                                        href={udLink.toSupportLink('adding_co_instructors')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    />
                                ),
                            }}
                        />
                    }
                </Popover>
            </>
        );
    }
}

@inject('store')
@observer
export default class CourseInstructors extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        window: PropTypes.object,
    };

    static defaultProps = {
        window,
    };

    renderError(error, props) {
        let title = error;
        if (typeof error !== 'string') {
            title = error.message;
            if (error.isHTML) {
                title = (
                    <span
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'course-instructors:error-message',
                            html: error.message,
                        })}
                    />
                );
            }
        }
        return (
            <AlertBanner
                showCta={false}
                udStyle="error"
                styleName="alert-banner"
                title={title}
                {...props}
            />
        );
    }

    get columns() {
        const hasQA = udConfig.brand.is_discussions_enabled;
        const hasReviews = udConfig.brand.is_add_reviews_enabled;
        const isPaid = this.props.store.instructorStore.course.isPaid;
        return [
            {fieldName: 'instructor', headerName: gettext('Instructor'), width: 144},
            isPaid && {
                fieldName: 'revenueShare',
                headerName: (
                    <div styleName="text-center">
                        <LocalizedHtml html={gettext('Revenue <br /> share')} interpolate={{}} />
                    </div>
                ),
                width: 88,
            },
            {
                fieldName: 'visible',
                headerName: (
                    <div styleName="text-center">
                        <LocalizedHtml html={gettext('Visible')} interpolate={{}} />
                    </div>
                ),
                width: 88,
            },
            {
                fieldName: 'manage',
                headerName: (
                    <div styleName="text-center">
                        <LocalizedHtml html={gettext('Manage')} interpolate={{}} />
                    </div>
                ),
                width: 88,
            },
            {
                fieldName: 'captions',
                headerName: (
                    <div styleName="text-center">
                        <LocalizedHtml html={gettext('Captions')} interpolate={{}} />
                    </div>
                ),
                width: 88,
            },
            {
                fieldName: 'performance',
                headerName: (
                    <div styleName="text-center">
                        <LocalizedHtml html={gettext('Performance')} interpolate={{}} />
                    </div>
                ),
                width: 88,
            },
            hasQA && {
                fieldName: 'qa',
                headerName: (
                    <div styleName="text-center">
                        <LocalizedHtml html={gettext('Q&A')} interpolate={{}} />
                    </div>
                ),
                width: 88,
            },
            {
                fieldName: 'assignments',
                headerName: (
                    <div styleName="text-center">
                        <LocalizedHtml html={gettext('Assignments')} interpolate={{}} />
                    </div>
                ),
                width: 88,
            },
            hasReviews && {
                fieldName: 'reviews',
                headerName: (
                    <div styleName="text-center">
                        <LocalizedHtml html={gettext('Reviews')} interpolate={{}} />
                    </div>
                ),
                width: 88,
            },
            isPaid && {
                fieldName: 'revenueReport',
                headerName: (
                    <div styleName="text-center">
                        <LocalizedHtml html={gettext('Revenue <br /> report')} interpolate={{}} />
                    </div>
                ),
                width: 88,
            },
        ].filter(Boolean);
    }

    @autobind
    pendingRow(invitation) {
        const {instructorStore} = this.props.store;
        const renderCheckbox = (label, props) => (
            <Checkbox styleName="permission-checkbox" disabled={true} {...props}>
                <span className="ud-sr-only">{label}</span>
            </Checkbox>
        );

        const renderPermission = (permission, label, props) => {
            const checked = invitation[permission];
            return renderCheckbox(label, {checked, ...props});
        };

        const renderRevenueShare = () => {
            return (
                <div styleName="revenue-share">
                    <FormGroup
                        label={gettext('Share of Instructor Revenue')}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        <TextInputContainer>
                            <TextInput size="medium" maxLength="3" value="" disabled={true} />
                            <div styleName="percentage">{'%'}</div>
                        </TextInputContainer>
                    </FormGroup>
                </div>
            );
        };

        const renderRevokeInvitation = () => {
            return (
                <Button
                    udStyle="link"
                    className="ud-link-underline"
                    typography="ud-text-md"
                    data-purpose="revoke-invitation-button"
                    styleName="revoke-invitation-button"
                    onClick={() => instructorStore.revokeInvitation(invitation.id)}
                >
                    {gettext('Revoke')}
                </Button>
            );
        };

        return {
            instructor: (
                <div styleName="instructor-cell">
                    {invitation.recipient_email}
                    <div styleName="row">
                        <Badge styleName="pending-badge">{gettext('Pending')}</Badge>
                        {renderRevokeInvitation()}
                    </div>
                </div>
            ),
            visible: renderCheckbox(gettext('Visible'), {
                checked: invitation.visible,
            }),
            manage: renderPermission('instructor:edit_course', gettext('Manage')),
            captions: renderPermission('instructor:manage_captions', gettext('Captions')),
            performance: renderPermission(
                'instructor:manage_course_performance',
                gettext('Performance'),
            ),
            qa: renderPermission('instructor:manage_course_qa', gettext('Q&A')),
            assignments: renderPermission(
                'instructor:manage_course_assignments',
                gettext('Assignments'),
            ),
            reviews: renderPermission('instructor:manage_course_reviews', gettext('Reviews')),
            revenueReport: renderPermission(
                'instructor:view_course_revenue_report',
                gettext('Revenue Report'),
            ),
            revenueShare: renderRevenueShare(),
        };
    }

    @autobind
    row(chi) {
        const {instructorStore, course} = this.props.store;

        const renderCheckbox = (label, props) => (
            <Checkbox styleName="permission-checkbox" {...props}>
                <span className="ud-sr-only">{label}</span>
            </Checkbox>
        );

        const renderPermission = (permission, label, props) => {
            const checked = chi[permission];
            const disabled = chi.is_owner;
            const onChange = (event) => {
                instructorStore.setPermission(chi.user.id, permission, event.target.checked);
            };
            return renderCheckbox(label, {checked, disabled, onChange, ...props});
        };

        const renderRevenueShare = () => {
            const onChange = (event) => {
                if (!/^[0-9]{0,3}$/g.test(event.target.value)) {
                    return event.preventDefault();
                }

                const percentage = Number(event.target.value);
                if (!(0 <= percentage && percentage <= 100)) {
                    return event.preventDefault();
                }

                instructorStore.setRevenuePercentage(chi.user.id, percentage);
                if (percentage > 0) {
                    instructorStore.setPermission(
                        chi.user.id,
                        'instructor:view_course_revenue_report',
                        true,
                    );
                }
            };

            return (
                <div styleName="revenue-share">
                    <FormGroup
                        label={gettext('Share of Instructor Revenue')}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        <TextInputContainer>
                            <TextInput
                                size="medium"
                                maxLength="3"
                                value={chi.revenue_share_percentage}
                                onChange={onChange}
                            />
                            <div styleName="percentage">{'%'}</div>
                        </TextInputContainer>
                    </FormGroup>
                </div>
            );
        };

        const getLeaveCourseButton = () => {
            if (udMe.id === chi.user.id) {
                return (
                    <ModalTrigger
                        trigger={
                            <Button
                                udStyle="link"
                                className="ud-link-underline"
                                typography="ud-text-md"
                                data-purpose="leave-course-button"
                            >
                                {gettext('Leave course')}
                            </Button>
                        }
                        renderModal={({isOpen, onClose}) => (
                            <ConfirmModal
                                confirmText={gettext('Leave course')}
                                isOpen={isOpen}
                                onCancel={onClose}
                                onConfirm={() => {
                                    onClose();
                                    this.props.store
                                        .leaveCourse()
                                        .then(() => {
                                            this.props.window.location.href =
                                                '/instructor/courses/?flash=left-course';
                                        })
                                        .catch(() => showReloadPageErrorToast(defaultErrorMessage));
                                }}
                            >
                                {interpolate(
                                    gettext(
                                        'Do you want to leave the course "%(course_title)s" as a co-instructor?',
                                    ),
                                    {course_title: course.title},
                                    true,
                                )}
                            </ConfirmModal>
                        )}
                    />
                );
            }
            return (
                <Button
                    udStyle="link"
                    className="ud-link-underline"
                    typography="ud-text-md"
                    data-purpose="remove-instructor-button"
                    onClick={() => instructorStore.deleteInstructor(chi.user.id)}
                >
                    {gettext('Remove')}
                </Button>
            );
        };

        return {
            instructor: (
                <div styleName="instructor-cell">
                    {chi.user.title}
                    {chi.is_owner && (
                        <div styleName="row">
                            <Badge styleName="owner-badge">{gettext('Owner')}</Badge>
                        </div>
                    )}
                    {!chi.is_owner && <div styleName="row">{getLeaveCourseButton()}</div>}
                </div>
            ),
            visible: renderCheckbox(gettext('Visible'), {
                checked: chi.visible,
                onChange: (event) => instructorStore.setVisible(chi.user.id, event.target.checked),
            }),
            manage: renderPermission('instructor:edit_course', gettext('Manage'), {
                onChange: (event) => {
                    const userId = chi.user.id;
                    const checked = event.target.checked;
                    instructorStore.setPermission(userId, 'instructor:edit_course', checked);
                    instructorStore.setPermission(userId, 'instructor:manage_captions', checked);
                },
            }),
            captions: renderPermission('instructor:manage_captions', gettext('Captions'), {
                disabled: chi['instructor:edit_course'],
            }),
            performance: renderPermission(
                'instructor:manage_course_performance',
                gettext('Performance'),
            ),
            qa: renderPermission('instructor:manage_course_qa', gettext('Q&A')),
            assignments: renderPermission(
                'instructor:manage_course_assignments',
                gettext('Assignments'),
            ),
            reviews: renderPermission('instructor:manage_course_reviews', gettext('Reviews')),
            revenueReport: renderPermission(
                'instructor:view_course_revenue_report',
                gettext('Revenue Report'),
                chi.revenue_share_percentage > 0 ? {checked: true, disabled: true} : {},
            ),
            revenueShare: renderRevenueShare(chi),
        };
    }

    @autobind
    onCoInstructorModalSubmit(modalProps) {
        modalProps.onClose();
        this.props.store.instructorStore.fetchPendingInstructors();
    }

    @autobind
    onCoInstructorModalCancel(modalProps) {
        modalProps.onClose();
    }

    @autobind
    renderAddInstructorModal(modalProps) {
        const hiddenPermissions = [];
        if (!udConfig.brand.is_discussions_enabled) {
            hiddenPermissions.push('instructor:manage_course_qa');
        }
        if (!udConfig.brand.is_add_reviews_enabled) {
            hiddenPermissions.push('instructor:manage_course_reviews');
        }
        if (!this.props.store.instructorStore.course.isPaid) {
            hiddenPermissions.push('instructor:view_course_revenue_report');
        }
        return (
            <Modal {...modalProps} title={gettext('Add instructors')}>
                <AddCoInstructor
                    onSubmitted={() => this.onCoInstructorModalSubmit(modalProps)}
                    onCancel={() => this.onCoInstructorModalCancel(modalProps)}
                    store={
                        new AddCoInstructorStore(
                            this.props.store.instructorStore.course.id,
                            hiddenPermissions,
                        )
                    }
                />
            </Modal>
        );
    }

    @autobind
    async save() {
        const {instructorStore} = this.props.store;
        await instructorStore.save();
        // if instructor removed their own manage permission, redirect to courses page
        if (instructorStore.instructorRemovedSelfManagePermission) {
            this.props.window.location.href = '/instructor/courses/';
        }
    }

    render() {
        const {instructorStore} = this.props.store;
        if (!instructorStore) {
            return null;
        }
        return (
            <MainContent>
                <div styleName="manage-instructors-header">
                    <div styleName="manage-instructors-permissions-info">
                        <h3 className="ud-heading-md">
                            {gettext('Manage instructor permissions')}
                        </h3>
                        <PermissionsPopover />
                    </div>
                    <div styleName="add-instructor">
                        <ModalTrigger
                            renderModal={this.renderAddInstructorModal}
                            trigger={
                                <Button udStyle="ghost" size="xsmall">
                                    <ExpandPlusIcon size="small" color="info" label={false} />
                                    {gettext('Add instructor')}
                                </Button>
                            }
                        />
                    </div>
                </div>

                <div
                    className={classNames({
                        'full-width-lines': true,
                        'ud-text-sm': true,
                    })}
                    styleName="instructors"
                >
                    <Table
                        columns={this.columns}
                        rows={[
                            ...instructorStore.instructors.map(this.row),
                            ...instructorStore.pendingInstructors
                                .filter(
                                    (inv) => !instructorStore.revokingInvitations.includes(inv.id),
                                )
                                .map(this.pendingRow),
                        ]}
                    />
                    <div styleName="submit-row">
                        <Button
                            data-purpose="save-instructor-button"
                            disabled={!instructorStore.isValidRevenue || instructorStore.isSaving}
                            onClick={this.save}
                        >
                            {gettext('Save')}
                        </Button>
                    </div>
                    {!instructorStore.isValidRevenue &&
                        !instructorStore.isLoading &&
                        this.renderError(gettext('Your total revenue must add up to 100%.'))}
                    {instructorStore.errors.map((error, key) => this.renderError(error, {key}))}
                </div>
            </MainContent>
        );
    }
}
