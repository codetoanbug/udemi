import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {ModalTrigger} from '@udemy/react-dialog-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {observer, PropTypes as MobxPropTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import UserManageAjaxModal from 'user-manage/ajax-modal/user-manage-ajax-modal.react-component';

import CloseAccountInfoStore from './close-account-info.mobx-store';
import {
    SUPPORT_PAGE_LINK_INSTRUCTOR,
    SUPPORT_PAGE_LINK_DELETE,
    SUPPORT_PAGE_LINK_MULTIPLE_INSTRUCTOR,
} from './constants';
import './close-account-info.less';

function renderCloseAccountModal(props) {
    return (
        <UserManageAjaxModal
            {...props}
            url="/user/remove-account-popup/"
            labelledById="close-account-title"
        />
    );
}

export const CloseAccountButton = () => {
    return (
        <ModalTrigger
            renderModal={renderCloseAccountModal}
            trigger={
                <Button styleName="close-account-btn" data-purpose="close-account-modal-trigger">
                    {gettext('Close account')}
                </Button>
            }
        />
    );
};

export const CanDeleteMessage = observer(({numSubscribedCourses}) => {
    return (
        <div>
            <p>
                <b styleName="warning">{gettext('Warning:')} </b>
                {ninterpolate(
                    'If you close your account, you will be unsubscribed' +
                        ' from your %(num_subscribed_courses)s course, and will lose access' +
                        ' forever.',
                    'If you close your account, you will be unsubscribed from all your' +
                        ' %(num_subscribed_courses)s courses, and will lose access forever.',
                    numSubscribedCourses,
                    {num_subscribed_courses: numSubscribedCourses},
                )}
            </p>
            <CloseAccountButton />
        </div>
    );
});

CanDeleteMessage.propTypes = {
    numSubscribedCourses: PropTypes.number.isRequired,
};

export const OwnsCoursesWithEnrollments = observer(({visible}) => {
    if (!visible) {
        return null;
    }

    return (
        <p>
            <LocalizedHtml
                html={gettext(
                    'One or more of your courses have students enrolled or are included in the ' +
                        'Udemy Business Content Collection. ' +
                        'Please <a class="supportLink">contact support</a> for further assistance.',
                )}
                interpolate={{
                    supportLink: (
                        <a
                            className="ud-link-underline"
                            href={SUPPORT_PAGE_LINK_INSTRUCTOR}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                }}
            />
        </p>
    );
});

OwnsCoursesWithEnrollments.propTypes = {
    visible: PropTypes.bool.isRequired,
};

export const OwnsCourses = observer(({visible}) => {
    if (!visible) {
        return null;
    }

    return (
        <p>
            <LocalizedHtml
                html={gettext(
                    'You are an instructor of at least one published or draft course. ' +
                        'Please unpublish and delete the course. ' +
                        '<a class="supportLink">Get instructions</a> for further assistance. ' +
                        'Afterwards, you will then have the option to close your account.',
                )}
                interpolate={{
                    supportLink: (
                        <a
                            className="ud-link-underline"
                            href={SUPPORT_PAGE_LINK_DELETE}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                }}
            />
        </p>
    );
});

OwnsCourses.propTypes = {
    visible: PropTypes.bool.isRequired,
};

export const IsCoInstructorWithoutPermission = observer(({visible}) => {
    if (!visible) {
        return null;
    }

    return (
        <p>
            <LocalizedHtml
                html={gettext(
                    'You are a co-instructor without manage permissions for one or more courses. ' +
                        'Please ask the course owner to remove you as a co-instructor. ' +
                        '<a class="supportLink">Get instructions</a>. ' +
                        'Afterwards, you will then have the option to close your account.',
                )}
                interpolate={{
                    supportLink: (
                        <a
                            className="ud-link-underline"
                            href={SUPPORT_PAGE_LINK_MULTIPLE_INSTRUCTOR}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                }}
            />
        </p>
    );
});

IsCoInstructorWithoutPermission.propTypes = {
    visible: PropTypes.bool.isRequired,
};

export const IsCoInstructor = observer(({visible}) => {
    if (!visible) {
        return null;
    }
    return (
        <p>
            <LocalizedHtml
                html={gettext(
                    'You are a co-instructor with manage permissions for one or more courses. ' +
                        'Please remove yourself from the course. ' +
                        '<a class="supportLink">Get instructions</a>. ' +
                        'Afterwards, you will then have the option to close your account.',
                )}
                interpolate={{
                    supportLink: (
                        <a
                            className="ud-link-underline"
                            href={SUPPORT_PAGE_LINK_MULTIPLE_INSTRUCTOR}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                }}
            />
        </p>
    );
});

IsCoInstructor.propTypes = {
    visible: PropTypes.bool.isRequired,
};

export const HasPayout = observer(({visible}) => {
    if (!visible) {
        return null;
    }

    return (
        <p>
            <LocalizedHtml
                html={gettext(
                    'You have a pending payment from Udemy. ' +
                        'See <a class="supportLink">Revenue Report</a> here. ' +
                        'You will then have the option to close your account once you have been paid.',
                )}
                interpolate={{
                    supportLink: (
                        <a
                            className="ud-link-underline"
                            href="/revenue-report/"
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                }}
            />
        </p>
    );
});

HasPayout.propTypes = {
    visible: PropTypes.bool.isRequired,
};

export const OrganizationMembershipItem = observer(({data}) => {
    const {account_name: accountName, domain, contact} = data;
    return (
        <li styleName="organization">
            <div>
                <strong>{gettext('Account Name:')}</strong> {accountName}
            </div>
            <div>
                <strong>{gettext('Domain:')}</strong> {domain}
            </div>
            <div>
                <strong>{gettext('Contact:')}</strong> {contact}
            </div>
        </li>
    );
});

OrganizationMembershipItem.propTypes = {
    data: PropTypes.shape({
        account_name: PropTypes.string.isRequired,
        domain: PropTypes.string.isRequired,
        contact: PropTypes.string.isRequired,
    }).isRequired,
};

export const OrganizationMembership = observer(({activeOrganizationMembershipData}) => {
    const visible = activeOrganizationMembershipData && activeOrganizationMembershipData.length;
    if (!visible) {
        return null;
    }

    return (
        <>
            <h2 className="ud-heading-lg">{gettext('Udemy Business users:')}</h2>
            <p>
                {gettext(
                    'You need to contact the administrator for the Udemy Business ' +
                        'accounts listed below and request that they delete you from their ' +
                        'organization’s account.',
                )}
            </p>

            <ul className="ud-unstyled-list" styleName="organization-list">
                {activeOrganizationMembershipData.map((data) => (
                    <OrganizationMembershipItem key={data.domain} data={data} />
                ))}
            </ul>
            <p>
                {gettext(
                    'When you are no longer a user in any Udemy Business account you ' +
                        'will then have the option to close your Udemy account.',
                )}
            </p>
        </>
    );
});

OrganizationMembership.propTypes = {
    activeOrganizationMembershipData: MobxPropTypes.arrayOrObservableArray.isRequired,
};

@observer
export default class CloseAccountInfo extends Component {
    static propTypes = {
        store: PropTypes.object,
    };

    static defaultProps = {
        store: undefined,
    };

    constructor(props) {
        super(props);
        this.store = props.store || new CloseAccountInfoStore();
    }

    componentDidMount() {
        this.store.fetchUserData();
    }

    render() {
        const {
            isLoaded,
            numSubscribedCourses,
            canBeDeleted,
            ownsCourses,
            isCoInstructor,
            isCoInstructorWithEditPermission,
            hasPaymentDependencyForDeletion,
            ownsCoursesInUfbContentCollections,
            ownsCoursesWithEnrollments,
            activeOrganizationMembershipData,
        } = this.store;
        const withEnrollments = ownsCoursesWithEnrollments || ownsCoursesInUfbContentCollections;

        if (!isLoaded) {
            return <MainContentLoader />;
        }

        if (canBeDeleted) {
            return (
                <div data-purpose="close-account" styleName="content">
                    <CanDeleteMessage numSubscribedCourses={numSubscribedCourses} />
                </div>
            );
        }

        return (
            <div data-purpose="close-account" styleName="content">
                {(ownsCourses || isCoInstructor) && (
                    <h2 className="ud-heading-lg">{gettext('Instructors:')} </h2>
                )}
                <OwnsCoursesWithEnrollments visible={withEnrollments} />
                <OwnsCourses visible={ownsCourses && !withEnrollments} />
                <IsCoInstructor visible={isCoInstructor && isCoInstructorWithEditPermission} />
                <IsCoInstructorWithoutPermission
                    visible={isCoInstructor && !isCoInstructorWithEditPermission}
                />
                <HasPayout visible={hasPaymentDependencyForDeletion} />
                <OrganizationMembership
                    activeOrganizationMembershipData={activeOrganizationMembershipData}
                />
            </div>
        );
    }
}
