import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import MainContent from 'course-manage-v2/main-content.react-component';
import Prompt from 'course-manage-v2/prompt.react-component';
import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';
import getConfigData from 'utils/get-config-data';

import Certificate from './certificate.react-component';
import CourseEligibilityModalForm from './course-eligibility-modal-form.react-component';
import CourseInstructors from './course-instructors.react-component';
import CoursePrivacy from './course-privacy.react-component';
import DeleteCourse from './delete-course.react-component';
import EmailOptions from './email-options.react-component';
import SettingsStore from './settings.mobx-store';
import UnpublishCourse from './unpublish-course.react-component';
import './course-settings.less';

const udConfig = getConfigData();

export function courseStatusContent(store) {
    const content = {
        statusHeader: null,
        organizationSubHeader: null,
        organizationTerms: null,
    };

    if (store.isCoursePublished) {
        if (store.course.isInContentSubscription || store.course.hasOrgOnlySetting) {
            content.statusHeader = (
                <p>
                    <LocalizedHtml
                        html={gettext(
                            'This course is published on the Udemy marketplace and Udemy ' +
                                'Business. If you wish to delete or unpublish this course please ' +
                                'contact the Udemy Business team at: ' +
                                '<a class="ufbEmailLink">ufbcontent@udemy.com</a>',
                        )}
                        interpolate={{
                            ufbEmailLink: (
                                <a
                                    className="ud-link-underline"
                                    href="mailto:ufbcontent@udemy.com"
                                />
                            ),
                        }}
                    />
                </p>
            );
            content.organizationSubHeader = (
                <p>
                    {gettext(
                        'You have opted in to the Udemy Business Program and have agreed to ' +
                            'make all of your courses eligible for inclusion in the Collection.',
                    )}
                </p>
            );
        } else if (store.isUfoContentSubscriptionAgreed && store.course.isOrganizationEligible) {
            content.statusHeader = (
                <p>
                    {gettext(
                        'This course is published on the Udemy marketplace and is eligible for ' +
                            'Udemy Business.',
                    )}
                </p>
            );
            content.organizationSubHeader = (
                <p>
                    {gettext(
                        'You have opted in to the Udemy Business Program and have agreed to ' +
                            'make all of your courses eligible for inclusion in the Collection. ' +
                            '(Note that opting in to these programs does not guarantee ' +
                            'participation.)',
                    )}
                </p>
            );

            content.organizationTerms = (
                <p>
                    <LocalizedHtml
                        html={gettext(
                            'The <a class="termsLink">terms</a> for the Udemy Business ' +
                                'Program include certain exclusivity and termination ' +
                                'requirements. If you believe this course does not meet these ' +
                                'requirements, please <a class="eligibleForm">let us know</a>.',
                        )}
                        interpolate={{
                            termsLink: (
                                <a
                                    className="ud-link-underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://support.udemy.com/hc/en-us/articles/115013339928#ufb-en"
                                />
                            ),
                            eligibleForm: (
                                <Button
                                    className="ud-link-underline"
                                    udStyle="link"
                                    typography="ud-text-md"
                                    onClick={store.openShowOrganizationEligibleForm}
                                />
                            ),
                        }}
                    />
                </p>
            );
        } else if (store.isUfoContentSubscriptionAgreed && !store.course.isOrganizationEligible) {
            content.statusHeader = (
                <p>{gettext('This course is published on the Udemy marketplace.')}</p>
            );
            content.organizationSubHeader = (
                <p>
                    <LocalizedHtml
                        html={gettext(
                            'You have opted in to the Udemy Business Program but have ' +
                                'indicated to us that this course is not eligible for ' +
                                'inclusion in the Collection because it does not meet our ' +
                                '<a class="termsLink">terms</a>.',
                        )}
                        interpolate={{
                            termsLink: (
                                <a
                                    className="ud-link-underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://support.udemy.com/hc/en-us/articles/115013339928#ufb-en"
                                />
                            ),
                        }}
                    />
                </p>
            );
            content.organizationTerms = (
                <p>
                    <LocalizedHtml
                        html={gettext(
                            'If you believe this is no longer the case, please ' +
                                '<a class="eligibleForm">let us know.</a>',
                        )}
                        interpolate={{
                            eligibleForm: (
                                <Button
                                    className="ud-link-underline"
                                    udStyle="link"
                                    typography="ud-text-md"
                                    onClick={store.openShowOrganizationEligibleForm}
                                />
                            ),
                        }}
                    />
                </p>
            );
        } else if (!store.isUfoContentSubscriptionAgreed) {
            content.statusHeader = (
                <p>{gettext('This course is published on the Udemy marketplace.')}</p>
            );
            content.organizationSubHeader = (
                <p>
                    <LocalizedHtml
                        html={gettext(
                            'You have not opted in to the Udemy Business Program. If you ' +
                                'would like to opt in, please update your ' +
                                '<a class="promotionalLink">promotional agreements</a>.',
                        )}
                        interpolate={{
                            promotionalLink: (
                                <a
                                    className="ud-link-underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://www.udemy.com/user/edit-promotional-agreements/"
                                />
                            ),
                        }}
                    />
                </p>
            );
        }
    } else if (store.course.isInContentSubscription) {
        content.statusHeader = (
            <p>
                <LocalizedHtml
                    html={gettext(
                        'This course is not published on the Udemy marketplace but is still ' +
                            'published on Udemy Business. If you wish to delete or ' +
                            'unpublish this course from Udemy Business please contact us' +
                            ' at: <a class="ufbEmailLink">ufbcontent@udemy.com</a>.',
                    )}
                    interpolate={{
                        ufbEmailLink: (
                            <a className="ud-link-underline" href="mailto:ufbcontent@udemy.com" />
                        ),
                    }}
                />
            </p>
        );
        content.organizationSubHeader = (
            <p>
                {gettext(
                    'You have opted in to the Udemy Business Program and have agreed to make ' +
                        'all of your courses eligible for inclusion in the Collection.',
                )}
            </p>
        );
    } else {
        content.statusHeader = (
            <p>{gettext('This course is not published on the Udemy marketplace.')}</p>
        );
    }

    return content;
}

export const DangerZone = observer(({store}) => {
    if (!store.courseLoaded) {
        return null;
    }
    const course = store.course;
    const {statusHeader, organizationSubHeader, organizationTerms} = courseStatusContent(store);
    const isUB = udConfig.brand.has_organization;
    const content = [
        !isUB && (
            <React.Fragment key="status-section">
                <h3 className="ud-heading-md" styleName="mb-xs">
                    {gettext('Course Status')}
                </h3>
                {statusHeader}
            </React.Fragment>
        ),
        !course.isInContentSubscription && !course.hasOrgOnlySetting && (
            <React.Fragment key="buttons-section">
                <UnpublishCourse
                    courseId={course.id}
                    disabled={!store.isCoursePublished}
                    hasOrganization={Boolean(course.organizationId)}
                    onUnpublish={store.setUnpublished}
                />
                <DeleteCourse
                    courseId={course.id}
                    disabled={!course.canDelete}
                    hasOrganization={Boolean(course.organizationId)}
                    canNotDeleteReason={course.canNotDeleteReason}
                />
            </React.Fragment>
        ),
        store.course.isOwner && !isUB && (organizationSubHeader || organizationTerms) && (
            <React.Fragment key="ub-section">
                <h3 className="ud-heading-md" styleName="mt-lg mb-xs">
                    {gettext('Udemy Business Program')}
                </h3>
                {organizationSubHeader}
                {organizationTerms}
            </React.Fragment>
        ),
    ].filter(Boolean);
    return !content.length ? null : (
        <MainContent>
            <CourseEligibilityModalForm
                courses={[store.course]}
                isOpen={store.showOrganizationEligibleForm}
                onClose={store.closeShowOrganizationEligibleForm}
            />
            <div styleName="danger-zone">{content}</div>
        </MainContent>
    );
});

DangerZone.propTypes = {
    store: PropTypes.object.isRequired,
};

@observer
export default class CourseSettings extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        pageStore: PropTypes.object.isRequired,
        store: PropTypes.object, // Mainly for tests.
    };

    static defaultProps = {
        store: undefined,
    };

    constructor(props) {
        super(props);
        this.store = props.store || new SettingsStore(props.pageStore);
    }

    componentDidMount() {
        this.store.getCourseSettings();
    }

    renderActionButtons() {
        return <EmailOptions store={this.store} />;
    }

    render() {
        const isDirty = this.store.courseLoaded && this.store.isDirty();
        return (
            <Provider store={this.store}>
                <div>
                    <SubHeader
                        title={gettext('Settings')}
                        actionButtons={this.renderActionButtons()}
                    />
                    <DangerZone store={this.store} />
                    <CoursePrivacy />
                    <CourseInstructors />
                    <Certificate />
                    <Prompt when={isDirty} />
                </div>
            </Provider>
        );
    }
}
