import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {ModalTrigger} from '@udemy/react-dialog-components';
import {Dropdown} from '@udemy/react-menu-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, observable, runInAction, toJS} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
    FREE_COURSE_CONTENT_LENGTH_LIMIT_START_DATE,
} from 'course-manage-v2/constants';
import CourseEligibilityModalForm from 'course-manage-v2/settings/course-eligibility-modal-form.react-component';
import {QRPReactivateAjaxModal} from 'instructor/qrp-reactivate/qrp-reactivate-ajax-modal.react-component';
import {showReloadPageErrorToast} from 'instructor/toasts';
import getConfigData from 'utils/get-config-data';
import udApi, {defaultErrorMessage, TIMEOUT} from 'utils/ud-api';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';
import SystemMessage from 'utils/ud-system-message';

import {COMPLY_FORM_STATUS} from '../constants';
import {InstructorEmailOptin} from './instructor-email-optin.react-component';
import OrganizationEligibleReminderAlert from './organization-eligible-reminder-alert.react-component';

import './instructor-alerts.less';

const udConfig = getConfigData();

export const CourseNameList = ({courseList}) => {
    if (courseList.length === 0) {
        return null;
    }
    if (courseList.length === 1) {
        return <CourseLink course={courseList[0]} />;
    }
    if (courseList.length === 2) {
        return (
            <LocalizedHtml
                html={gettext('<a class="course1">course</a> and <a class="course2">course</a>')}
                interpolate={{
                    course1: <CourseLink course={courseList[0]} />,
                    course2: <CourseLink course={courseList[1]} />,
                }}
            />
        );
    }
    return (
        <LocalizedHtml
            html={gettext(
                '<a class="course1">course</a>, <a class="course2">course</a>, and <a class="course3">course</a>.',
            )}
            interpolate={{
                course1: <CourseLink course={courseList[0]} />,
                course2: <CourseLink course={courseList[1]} />,
                course3: <RemainingCourses courseList={courseList} />,
            }}
        />
    );
};
CourseNameList.propTypes = {
    courseList: PropTypes.array.isRequired,
};

const RemainingCourses = ({courseList}) => (
    <Dropdown
        placement="bottom-start"
        styleName="dropdown"
        menuWidth="large"
        trigger={
            <Button className="ud-link-underline" udStyle="link">
                {ninterpolate('%s more course', '%s more courses', courseList.length - 2)}
            </Button>
        }
    >
        <Dropdown.Menu>
            {courseList.slice(2).map((course) => (
                <Dropdown.MenuItem key={course.id} href={course.url}>
                    {course.title}
                </Dropdown.MenuItem>
            ))}
        </Dropdown.Menu>
    </Dropdown>
);
RemainingCourses.propTypes = {
    courseList: PropTypes.array.isRequired,
};

export const CourseLink = ({course}) => (
    <a className="ud-link-underline" href={course.url}>
        {course.title}
    </a>
);
CourseLink.propTypes = {
    course: PropTypes.object.isRequired,
};

const CourseEligibilityModalTrigger = ({courses, children}) => (
    <ModalTrigger
        trigger={
            <Button udStyle="link" className="ud-link-underline" typography="ud-text-sm">
                {children}
            </Button>
        }
        renderModal={(props) => <CourseEligibilityModalForm {...props} courses={courses} />}
    />
);
CourseEligibilityModalTrigger.propTypes = {
    courses: PropTypes.array.isRequired,
};

function pushComplyFormApprovedAlert(alerts, complyFormAlertType, props) {
    pushDismissibleAlert(alerts, {
        key: complyFormAlertType,
        udStyle: 'success',
        onAction: () => SystemMessage.seen(SystemMessage.ids.complyFormApproved),
        ...props,
    });
}

function pushComplyFormUnderReviewAlert(alerts, complyFormAlertType, props) {
    pushDismissibleAlert(alerts, {
        key: complyFormAlertType,
        onAction: () => SystemMessage.seen(SystemMessage.ids.complyFormUnderReview),
        ...props,
    });
}

function pushComplyFormActionRequiredAlert(alerts, complyFormAlertType, props) {
    pushActionableAlert(alerts, {
        key: complyFormAlertType,
        udStyle: 'warning',
        ctaText: gettext('Begin submission'),
        actionButtonProps: {componentClass: 'a', href: '/comply-exchange/redirect'},
        dismissButtonProps: false,
        ...props,
        body: (
            <>
                <p>{props.body}</p>
                <p>
                    {interpolate(
                        gettext(
                            'Please note: You will need your Udemy Instructor ID to complete your form. Your ID is %(instructorId)s.',
                        ),
                        {instructorId: udMe.id},
                        true,
                    )}
                </p>
            </>
        ),
    });
}

function pushComplyExchangeInstructorAlert(alerts, complyFormAlertType) {
    switch (complyFormAlertType) {
        case COMPLY_FORM_STATUS.BEFORE_HOLD_APPROVED:
            return pushComplyFormApprovedAlert(alerts, complyFormAlertType, {
                title: gettext('Your tax documentation has been approved.'),
            });
        case COMPLY_FORM_STATUS.BEFORE_HOLD_UNDER_REVIEW:
            return pushComplyFormUnderReviewAlert(alerts, complyFormAlertType, {
                title: gettext('Your tax documentation has been received and is under review.'),
            });
        case COMPLY_FORM_STATUS.BEFORE_HOLD_ACTION_REQUIRED:
            return pushComplyFormActionRequiredAlert(alerts, complyFormAlertType, {
                title: gettext('Udemy needs some basic tax information from you.'),
                body: gettext(
                    'If your tax documentation has not been reviewed and approved by February 28, your next payout may be delayed.',
                ),
            });
        case COMPLY_FORM_STATUS.DURING_HOLD_APPROVED:
            return pushComplyFormApprovedAlert(alerts, complyFormAlertType, {
                title: gettext('Your tax documentation has been approved.'),
                body: gettext(
                    'However, because your submission was not approved by February 28, ' +
                        'your most recent payout has been paused. It will be issued on the next expected payout date.',
                ),
            });
        case COMPLY_FORM_STATUS.DURING_HOLD_UNDER_REVIEW:
            return pushComplyFormUnderReviewAlert(alerts, complyFormAlertType, {
                title: gettext('Your tax documentation is under review.'),
                body: gettext(
                    'Because your submission was not approved by February 28, your most recent payout has been paused. ' +
                        'It will be issued on the next expected payout date.',
                ),
            });
        case COMPLY_FORM_STATUS.DURING_HOLD_ACTION_REQUIRED:
            return pushComplyFormActionRequiredAlert(alerts, complyFormAlertType, {
                title: gettext(
                    'Your most recent payout has been paused because you have not provided your tax information.',
                ),
                body: gettext(
                    'It will be issued on the next expected payout date. If your tax documentation ' +
                        'hasn’t been reviewed and approved by April 1, we’ll apply maximum withholding to ' +
                        'future payouts. Please submit your tax documentation to avoid excess withholding.',
                ),
            });
        case COMPLY_FORM_STATUS.NEW_INSTRUCTOR_APPROVED:
            return pushComplyFormApprovedAlert(alerts, complyFormAlertType, {
                title: gettext('Your tax documentation has been approved.'),
            });
        case COMPLY_FORM_STATUS.NEW_INSTRUCTOR_UNDER_REVIEW:
            return pushComplyFormUnderReviewAlert(alerts, complyFormAlertType, {
                title: gettext('Your tax documentation has been received and is under review.'),
            });
        case COMPLY_FORM_STATUS.NEW_INSTRUCTOR_ACTION_REQUIRED:
            return pushComplyFormActionRequiredAlert(alerts, complyFormAlertType, {
                title: gettext('Udemy needs some basic tax information from you.'),
                body: gettext(
                    'If your tax documentation hasn’t been reviewed and approved by the next payout date, ' +
                        'we’ll apply maximum withholding to payout. Please submit your tax documentation to avoid excess withholding.',
                ),
            });
    }
}

function pushActionableAlert(alerts, props) {
    alerts.push(<AlertBanner {...props} />);
}

function pushDismissibleAlert(alerts, props) {
    alerts.push(<AlertBanner ctaText={gettext('Dismiss')} dismissButtonProps={false} {...props} />);
}

function pushAlert(alerts, props) {
    alerts.push(<AlertBanner showCta={false} {...props} />);
}

@observer
export default class InstructorAlerts extends Component {
    static propTypes = {
        appLinkPage: PropTypes.string,
        courseStore: PropTypes.object,
        showOnlyAppLink: PropTypes.bool,
        isInstructorOptOut: PropTypes.bool,
    };

    static defaultProps = {
        appLinkPage: 'courses',
        courseStore: null,
        showOnlyAppLink: false,
        isInstructorOptOut: false,
    };

    async componentDidMount() {
        try {
            const alerts = await udApi.get('/users/me/instructor-alerts/current/', {
                timeout: TIMEOUT,
            });
            runInAction(() => {
                this.freePreviewCourses = alerts.data.free_preview_courses;
                this.priceRevisit = alerts.data.price_revisit || false;
                this.qrpReactivationUrl = alerts.data.qrp_reactivation_url;
                this.qrpReactivationModalShown = !!this.qrpReactivationUrl;
                this.showFreeCourseLengthUpdate = alerts.data.show_free_course_length_update;
                this.showInstructorEmailOptin = alerts.data.instructor_email_optin || false;
                this.showAppLink = !!alerts.data[`show_app_link_${this.props.appLinkPage}`];
                this.showInstructorCategoryMigration = alerts.data.instructor_category_migration;
                this.showDirectMessageTurnedOffAlert =
                    alerts.data.show_direct_message_turned_off_alert;
                this.showOrganizationEligibleFeatureAlert =
                    alerts.data.show_organization_eligible_feature_alert;
                this.complyFormAlertType = alerts.data.comply_form_alert_type;
            });
        } catch (error) {
            runInAction(() => {
                const headers = error.response && error.response.headers;
                if (headers && headers['x-ui-message'] === 'USER_IS_NOT_INSTRUCTOR') {
                    this.isNotInstructor = true;
                    return;
                }
                showReloadPageErrorToast(defaultErrorMessage);
            });
        }
    }

    @observable.ref freePreviewCourses;
    @observable isNotInstructor = false;
    @observable priceRevisit;
    @observable qrpReactivationUrl;
    @observable qrpReactivationModalShown = false;
    @observable showFreeCourseLengthUpdate = false;
    @observable showInstructorEmailOptin;
    @observable showAppLink = false;
    @observable showInstructorCategoryMigration = false;
    @observable showOrganizationEligibleFeatureAlert = false;
    @observable complyFormAlertType;
    @observable showCourseGrpDelay = false; // to make it re-usable when needed
    @observable showDirectMessageTurnedOffAlert = false;

    @autobind
    @action
    onQRPReactivateClose() {
        this.qrpReactivationModalShown = false;
        SystemMessage.seen(SystemMessage.ids.qrpReactivate);
    }

    // eslint-disable-next-line max-statements
    renderAlerts() {
        const alerts = [];
        const {appLinkPage, courseStore} = this.props;
        let directMessageTurnedOffAlertProps = null; // to handle to make it the last message in the queue even with the showOnlyAppLink
        if (appLinkPage === 'reviews') {
            pushAlert(alerts, {
                key: 'review_delay_alert',
                title: gettext(
                    'It can take up to 48 hours for approved student ratings ' +
                        'to show on your course landing page.',
                ),
            });
            return alerts;
        }
        if (
            courseStore &&
            courseStore.courses &&
            courseStore.courses.some((course) => course.is_cleaned_course)
        ) {
            pushAlert(alerts, {
                key: 'course_cleanup_alert',
                udStyle: 'warning',
                title: (
                    <LocalizedHtml
                        html={gettext(
                            'One or more of your courses has been unpublished as part of the  ' +
                                '<a class="link">Marketplace Maintenance program</a>.',
                        )}
                        interpolate={{
                            link: (
                                <a
                                    className="ud-link-neutral ud-link-underline"
                                    href={udLink.toSupportLink('marketplace_maintenance_program')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        }}
                    />
                ),
            });
        }
        if (!udConfig.brand.has_organization && this.showCourseGrpDelay) {
            pushDismissibleAlert(alerts, {
                key: 'show-course-grp-delay',
                onAction: () => SystemMessage.seen(SystemMessage.ids.showCourseGrpDelay),
                title: gettext(
                    'Due to increased volume of new courses being submitted for review, ' +
                        'the Quality Review Process may take up to 6 days.',
                ),
                body: (
                    <LocalizedHtml
                        html={gettext(
                            'In order to avoid any additional delays, be sure that your course is in compliance with Udemy’s ' +
                                '<a class="getCourseGuidelines">Course Materials Guidelines</a>.',
                        )}
                        interpolate={{
                            getCourseGuidelines: (
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ud-link-underline"
                                    style={{whiteSpace: 'nowrap'}}
                                    href={udLink.toSupportLink(
                                        'course_material_basics',
                                        false,
                                        'sections',
                                    )}
                                />
                            ),
                        }}
                    />
                ),
            });
        }
        if (this.showAppLink) {
            let appLinkTitle = '';
            let appLinkBody = null;
            if (appLinkPage === 'reviews') {
                appLinkTitle = gettext(
                    'Read and respond to reviews faster with the instructor mobile experience.',
                );
            } else if (appLinkPage === 'qa') {
                appLinkTitle = gettext(
                    'Read and respond to questions faster with the instructor mobile experience.',
                );
            } else if (appLinkPage === 'messages') {
                appLinkTitle = gettext(
                    'Read and respond to messages faster with the instructor mobile experience.',
                );
            } else if (appLinkPage === 'revenue') {
                appLinkTitle = gettext(
                    'Easily monitor your revenue and more with the instructor mobile experience.',
                );
            } else {
                appLinkTitle = gettext('Get a better mobile experience with the Udemy app.');
                appLinkBody = gettext(
                    'View key course metrics, reply to your students, and get instant notifications.',
                );
            }
            pushActionableAlert(alerts, {
                key: 'app-link',
                ctaText: gettext('Get the app'),
                actionButtonProps: {
                    componentClass: 'a',
                    href: 'https://udemy.app.link/VXij7K7UqP',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
                onDismiss: () => SystemMessage.seen(`show_app_link_${appLinkPage}`),
                title: appLinkTitle,
                body: appLinkBody,
            });
        }

        if (
            appLinkPage === 'messages' &&
            this.showDirectMessageTurnedOffAlert &&
            this.props.isInstructorOptOut
        ) {
            directMessageTurnedOffAlertProps = {
                key: 'direct_message_turned_off_alert',
                title: gettext('You have turned off direct messaging for your instructor account'),
                body: gettext(
                    'You can still send direct messages to other instructors as a student',
                ),
                ctaText: gettext('View message settings'),
                actionButtonProps: {componentClass: 'a', href: '/instructor/account/messages/'},
                onDismiss: () => SystemMessage.seen(SystemMessage.ids.showDirectMessageTurnedOff),
            };
        }

        if (this.showAppLink) {
            if (this.props.showOnlyAppLink) {
                if (directMessageTurnedOffAlertProps) {
                    pushActionableAlert(alerts, directMessageTurnedOffAlertProps);
                }
                return alerts;
            }
        }

        if (this.showInstructorEmailOptin) {
            alerts.push(<InstructorEmailOptin key="instructor_email_optin" />);
        }

        if (this.showInstructorCategoryMigration) {
            pushDismissibleAlert(alerts, {
                key: 'category_migrate_alert',
                onAction: () => SystemMessage.seen(SystemMessage.ids.instructorCategoryMigrate),
                title: gettext(
                    'We’re rolling out updates to our category and subcategory navigation.',
                ),
                body: (
                    <LocalizedHtml
                        html={gettext(
                            'As part of these updates, we’ve adjusted the category and/or subcategory ' +
                                'of one or more of your courses. <a class="link">Learn more</a>.',
                        )}
                        interpolate={{
                            link: (
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ud-link-underline"
                                    href="/udemy-teach-hub/announcing_taxonomy_improvements/"
                                />
                            ),
                        }}
                    />
                ),
            });
        }

        alerts.push(
            <QRPReactivateAjaxModal
                key="qrp_reactivate_modal"
                url={this.qrpReactivationUrl || ''}
                onClose={this.onQRPReactivateClose}
                isOpen={this.qrpReactivationModalShown}
            />,
        );

        if (this.priceRevisit) {
            pushAlert(alerts, {
                key: 'price_revisit',
                udStyle: 'error',
                title: gettext(
                    'Due to the recent updates to our Pricing and ' +
                        'Promotions Policy, some of your coupons may be terminated. Please ' +
                        'check your courses’ Price & Coupons pages.',
                ),
            });
        }

        if (this.freePreviewCourses && this.freePreviewCourses.length > 0) {
            pushAlert(alerts, {
                key: 'free_preview_courses',
                udStyle: 'error',
                title: (
                    <>
                        {gettext(
                            'We’ve automatically enabled free preview for video lectures in your paid courses:',
                        )}
                        &nbsp;
                        <CourseNameList courseList={this.freePreviewCourses} />
                    </>
                ),
            });
        }

        if (!udConfig.brand.has_organization && this.showFreeCourseLengthUpdate) {
            pushDismissibleAlert(alerts, {
                key: 'free_course_length_update',
                onAction: () => SystemMessage.seen(SystemMessage.ids.freeCourseLengthUpdate),
                title: gettext(
                    'We’re updating the free course experience for students and instructors.',
                ),
                body: (
                    <LocalizedHtml
                        html={ninterpolate(
                            '<ul class="bulletedList">' +
                                '<li>New free courses (<strong>published after %(date)s</strong>) ' +
                                'must have less than %(hours)s hour of video content.</li>' +
                                '<li>Existing free courses (<strong>published before %(date)s</strong>) ' +
                                'that contain more than %(hours)s hour of video content will remain published.</li>' +
                                '<li>All free courses will only consist of video content and resources. ' +
                                'Certificate of completion, Q&A, and direct messaging will <strong>only</strong> be available for paid enrollments.</li>' +
                                '</ul>' +
                                'To learn more about the new free course experience and policy read our ' +
                                '<a class="freeCourseFAQLink">FAQ on the teaching center</a>.',
                            '<ul class="bulletedList">' +
                                '<li>New free courses (<strong>published after %(date)s</strong>) ' +
                                'must have less than %(hours)s hours of video content.</li>' +
                                '<li>Existing free courses (<strong>published before %(date)s</strong>) ' +
                                'that contain more than %(hours)s hours of video content will remain published.</li>' +
                                '<li>All free courses will only consist of video content and resources. ' +
                                'Certificate of completion, Q&A, and direct messaging will <strong>only</strong> be available for paid enrollments.</li>' +
                                '</ul>' +
                                'To learn more about the new free course experience and policy read our ' +
                                '<a class="freeCourseFAQLink">FAQ on the teaching center</a>.',
                            FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
                            {
                                hours: FREE_COURSE_CONTENT_LENGTH_LIMIT_HOURS,
                                date: FREE_COURSE_CONTENT_LENGTH_LIMIT_START_DATE,
                            },
                        )}
                        interpolate={{
                            bulletedList: <ul styleName="free-course-updates" />,
                            freeCourseFAQLink: (
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ud-link-underline"
                                    href={udLink.toFreeCourseFAQLink(udMe.language)}
                                />
                            ),
                        }}
                    />
                ),
            });
        }

        if (
            this.showOrganizationEligibleFeatureAlert &&
            courseStore &&
            courseStore.coursesLoaded &&
            courseStore.marketplaceOnlyCourses.length
        ) {
            pushDismissibleAlert(alerts, {
                key: 'organization_eligible_alert',
                onAction: () =>
                    SystemMessage.seen(SystemMessage.ids.organizationEligibleFeatureAlert),
                title: ngettext(
                    'Please ensure your course meets Udemy Business requirements.',
                    'Please ensure your courses meet Udemy Business requirements.',
                    courseStore.marketplaceOnlyCourses.length,
                ),
                body: (
                    <LocalizedHtml
                        html={gettext(
                            'The <a class="termsLink">terms</a> for the Udemy Business Program include ' +
                                'certain exclusivity and termination requirements for participating ' +
                                'courses. Please use the ineligibility form in your course settings to ' +
                                '<a class="eligibleForm">let us know</a> if any of your courses do not meet these ' +
                                'requirements.',
                        )}
                        interpolate={{
                            termsLink: (
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ud-link-underline"
                                    href="https://support.udemy.com/hc/en-us/articles/115013339928#ufb-en"
                                />
                            ),
                            eligibleForm: (
                                <CourseEligibilityModalTrigger
                                    courses={toJS(courseStore.marketplaceOnlyCourses)}
                                />
                            ),
                        }}
                    />
                ),
            });
        }
        if (courseStore) {
            courseStore.courses.forEach((course) => {
                alerts.push(
                    <OrganizationEligibleReminderAlert
                        course={course}
                        key={`organization_eligible_reminder-${course.id}`}
                    />,
                );
            });
        }

        if (this.complyFormAlertType) {
            pushComplyExchangeInstructorAlert(alerts, this.complyFormAlertType);
        }

        if (directMessageTurnedOffAlertProps) {
            pushActionableAlert(alerts, directMessageTurnedOffAlertProps);
        }

        return alerts;
    }

    render() {
        if (this.isNotInstructor) {
            return null;
        }

        return <div styleName="instructor-alerts">{this.renderAlerts()}</div>;
    }
}
