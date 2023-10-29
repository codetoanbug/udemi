import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Loader, ShowMore} from '@udemy/react-reveal-components';
import {observable, action} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {FeatureState} from 'browse/components/feature-discovery/feature-discoverability.mobx-store';
import {FeatureDiscoverability} from 'browse/components/feature-discovery/feature-discoverability.react-component';
import FeatureList from 'browse/components/feature-discovery/feature-discovery.json';
import {GoogleCalendarAuthStore} from 'learning-calendar-reminders/calendar-button/google-calendar-auth.mobx-store';
import {LearningReminderBanner} from 'learning-calendar-reminders/learning-reminder-banner/learning-reminder-banner.react-component';
import {LearningReminderDiscoveryModal} from 'learning-calendar-reminders/learning-reminder-modal/learning-reminder-discovery-modal.react-component';
import BranchMetrics from 'utils/branch-metrics/branch-metrics';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

import CpeGetCertificate from '../../certificate/cpe-get-certificate.react-component';
import requires from '../../registry/requires';
import InstructorProfile from './instructor-profile.react-component';
import './course-overview.less';

const CourseDescriptionSet = (descriptionSet, setIndex) => {
    if (!descriptionSet.items) {
        return null;
    }

    return (
        <React.Fragment key={setIndex}>
            <h4 className="ud-heading-sm">{descriptionSet.label}</h4>
            <ul>
                {descriptionSet.items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </React.Fragment>
    );
};

const CourseInfoItem = (item, index) => {
    return <div key={index}>{`${item.label}: ${item.value}`}</div>;
};

const ShowMoreButton = (props) => (
    <Button {...props} className={props.className} styleName="show-more-btn" />
);

ShowMoreButton.propTypes = {className: PropTypes.string};
ShowMoreButton.defaultProps = {className: null};

@requires('courseTakingStore', 'certificateStore')
@inject(({googleClientId}) => ({
    googleClientId,
}))
@observer
export default class CourseOverview extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        certificateStore: PropTypes.object.isRequired,
        googleClientId: PropTypes.string,
    };

    static defaultProps = {
        googleClientId: null,
    };

    constructor(props) {
        super(props);
        this.googleAuthStore = props.googleClientId
            ? new GoogleCalendarAuthStore(props.googleClientId)
            : null;
        if (
            !getConfigData().brand.organization &&
            this.googleAuthStore &&
            !this.googleAuthStore.googleAuth
        ) {
            this.googleAuthStore.loadGoogleAuth();
        }
    }

    componentDidMount() {
        const {courseId} = this.props.courseTakingStore;
        BranchMetrics.createiOSLinkWithDesktop({data: {courseId}}).then(
            action((link) => {
                this.iosAppStoreLink = link;
            }),
        );
        BranchMetrics.createAndroidLinkWithDesktop({data: {courseId}}).then(
            action((link) => {
                this.androidAppStoreLink = link;
            }),
        );
    }

    @observable iosAppStoreLink = null;
    @observable androidAppStoreLink = null;

    get course() {
        return this.props.courseTakingStore.course;
    }

    get commonCourseInfo() {
        return [
            {label: gettext('Skill level'), value: this.course.instructionalLevel},
            {label: gettext('Students'), value: this.course.numSubscribers},
            // eslint-disable-next-line gettext/no-variable-string
            {label: gettext('Languages'), value: gettext(this.course.locale.simple_english_title)},
            {
                label: gettext('Captions'),
                value: this.course.hasClosedCaptions ? gettext('Yes') : gettext('No'),
            },
        ];
    }

    get additionalCourseInfo() {
        const {numPublishedPracticeTests, numPublishedLectures} = this.props.courseTakingStore;
        return [
            {label: gettext('Practice tests'), value: numPublishedPracticeTests},
            {label: gettext('Questions'), value: this.course.numPracticeTestQuestions},
            {label: gettext('Lectures'), value: numPublishedLectures},
            {label: gettext('Video'), value: this.course.contentLengthText},
        ].filter((item) => item.value);
    }

    get courseTakingFeatures() {
        return {
            lifetimeAccess:
                this.course.features.course_landing_page &&
                this.course.features.course_landing_page.incentives.lifetime_access &&
                !this.props.courseTakingStore.isProgramTakingExperience,
            canProvideCertificate:
                this.course.hasCertificate &&
                !this.course.isPracticeTestCourse &&
                !this.props.courseTakingStore.isProgramTakingExperience,
            canShowAppStoreLink:
                !this.course.isPracticeTestCourse &&
                !this.props.courseTakingStore.isProgramTakingExperience &&
                this.iosAppStoreLink &&
                this.androidAppStoreLink,
        };
    }

    get descriptionSets() {
        return [
            {label: gettext('What you’ll learn'), items: this.course.objectives},
            {
                label: gettext('Are there any course requirements or prerequisites?'),
                items: this.course.prerequisites,
            },
            {label: gettext('Who this course is for:'), items: this.course.targetAudiences},
        ];
    }

    get subHeading() {
        return (
            <div styleName="heading" data-purpose="course-headline">
                <h2 className="ud-heading-xl">{gettext('About this course')}</h2>
                <h3>{this.course.headline}</h3>
            </div>
        );
    }

    get courseStats() {
        return (
            <div styleName="grid-row">
                <dt>{gettext('By the numbers')}</dt>
                <dd data-purpose="course-main-stats">
                    {this.commonCourseInfo.map(CourseInfoItem)}
                </dd>
                <dd data-purpose="course-additional-stats">
                    {!this.course.isPracticeTestCourse &&
                        this.additionalCourseInfo.map(CourseInfoItem)}
                </dd>
            </div>
        );
    }

    get courseFeatures() {
        const {numPublishedCodingExercises} = this.props.courseTakingStore;
        const features = [
            this.courseTakingFeatures.lifetimeAccess && (
                <div key="lifetime-access">{gettext('Lifetime access')}</div>
            ),
            this.courseTakingFeatures.canShowAppStoreLink && (
                <LocalizedHtml
                    key="mobile-app-access"
                    html={gettext(
                        'Available on <a class="iosLink">iOS</a> and <a class="androidAppStoreLink">Android</a>',
                    )}
                    interpolate={{
                        iosLink: (
                            <a
                                className="ud-text-bold ud-link-underline"
                                href={this.iosAppStoreLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        ),
                        androidAppStoreLink: (
                            <a
                                className="ud-text-bold ud-link-underline"
                                href={this.androidAppStoreLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        ),
                    }}
                />
            ),
            !!numPublishedCodingExercises && (
                <div key="coding-exercises">{gettext('Coding exercises')}</div>
            ),
        ].filter(Boolean);
        if (features.length === 0) {
            return null;
        }
        return (
            <div styleName="grid-row" data-purpose="course-features">
                <dt>{gettext('Features')}</dt>
                <dd styleName="wide">{features}</dd>
            </div>
        );
    }

    _renderUdemyCertificateSection() {
        const {certificate, isCertificateReady} = this.props.certificateStore;
        return (
            <>
                <p>{gettext('Get Udemy certificate by completing entire course')}</p>
                <Button
                    size="small"
                    componentClass="a"
                    href={isCertificateReady ? certificate.url : null}
                    disabled={!isCertificateReady}
                    target="_blank"
                    data-purpose="get-udemy-certificate"
                    styleName="certificate-button text-gap-sm"
                    udStyle="secondary"
                >
                    {gettext('Udemy certificate')}
                </Button>
            </>
        );
    }

    _renderCpeCertificateSection() {
        const {course} = this.props.courseTakingStore;
        const {cpeFieldOfStudy, cpeProgramLevel} = course;
        return (
            <div styleName="text-gap-sm" data-purpose="cpe-certificate-section">
                <p className="ud-text-bold">
                    {gettext('National Association of State Boards of Accountancy (NASBA)')}
                </p>
                <p data-purpose="num-cpe-credits">
                    {interpolate(
                        gettext('NASBA CPE credits: %(numCpeCredits)s'),
                        {
                            numCpeCredits: course.numCpeCredits.toFixed(1),
                        },
                        true,
                    )}
                </p>
                <div styleName="text-gap-sm">
                    <span className="ud-text-bold">{gettext('To earn NASBA CPE credits:')}</span>
                    <ul>
                        <li>{gettext('Complete all videos')}</li>
                        <li>{gettext('Score 70% or higher on final exam')}</li>
                    </ul>
                </div>
                <div styleName="text-gap-md">
                    <p>
                        <span className="ud-text-bold">{`${gettext('Glossary')}: `}</span>
                        {gettext('Find PDF attached to the first lecture of this course.')}
                    </p>
                    <p>
                        {gettext(
                            'Completion to obtain CPE should be accomplished a year after purchase date.',
                        )}
                    </p>
                </div>
                <CpeGetCertificate
                    label={gettext('NASBA certificate')}
                    styleName="certificate-button text-gap-sm"
                />
                <div styleName="text-gap-md">
                    {cpeFieldOfStudy && (
                        <p data-purpose="cpe-field-of-study">
                            <span className="ud-text-bold">
                                {interpolate(
                                    gettext(
                                        'Recommended NASBA field of study: %(cpeFieldOfStudy)s',
                                    ),
                                    {cpeFieldOfStudy},
                                    true,
                                )}
                            </span>
                        </p>
                    )}
                    {cpeProgramLevel && (
                        <p data-purpose="cpe-program-level">
                            <span className="ud-text-bold">
                                {interpolate(
                                    gettext('Program level: %(cpeProgramLevel)s'),
                                    {cpeProgramLevel},
                                    true,
                                )}
                            </span>
                        </p>
                    )}
                </div>
                <p styleName="text-gap-md">
                    <LocalizedHtml
                        key="mobile-app-access"
                        html={gettext(
                            'If you undertake this course for NASBA CPE credits, please complete the' +
                                ' <a class="evaluationLink">Self Study Course Evaluation</a>.',
                        )}
                        interpolate={{
                            evaluationLink: (
                                <a
                                    className="ud-link-underline"
                                    href={udLink.toHardLink('cpe_course_evaluation')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        }}
                    />
                </p>
                <p styleName="text-gap-md">
                    <LocalizedHtml
                        key="mobile-app-access"
                        html={gettext(
                            'Udemy is registered with the National Association of State Boards of Accountancy (NASBA)' +
                                ' as a sponsor of continuing professional education on the National Registry of CPE Sponsors.' +
                                ' State boards of accountancy have the final authority on the acceptance of individual courses for CPE credit.' +
                                ' Complaints regarding registered sponsors may be submitted to the National Registry of CPE Sponsors' +
                                ' through its website: <a class="nasbaLink">www.nasbaregistry.org</a>. ' +
                                'For additional information including refunds and complaints, please see <a class="termsPageLink" target="_blank">Udemy Terms of Use</a>. ' +
                                'For more information regarding administrative policies, please contact our <a class="supportLink" target="_blank">support</a>.',
                        )}
                        interpolate={{
                            nasbaLink: (
                                <a
                                    className="ud-link-underline"
                                    href={udLink.toHardLink('nasba_registry')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                            termsPageLink: (
                                <a
                                    className="ud-link-underline"
                                    href={udLink.to('terms')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                            supportLink: (
                                <a
                                    className="ud-link-underline"
                                    href={udLink.toSupportHome()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        }}
                    />
                </p>
            </div>
        );
    }

    renderCertificatesSection() {
        if (!this.courseTakingFeatures.canProvideCertificate) {
            return null;
        }
        const {course} = this.props.courseTakingStore;
        return (
            <div styleName="grid-row" data-purpose="course-certificates">
                <dt>{gettext('Certificates')}</dt>
                <dd styleName="wide">
                    {this._renderUdemyCertificateSection()}
                    {course.isCpeCompliant && this._renderCpeCertificateSection()}
                </dd>
            </div>
        );
    }

    renderDescription() {
        return (
            <div styleName="grid-row">
                <dt>{gettext('Description')}</dt>
                <dd styleName="wide" data-purpose="course-description">
                    <div
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'course-taking:course-description',
                            html: this.course.description,
                        })}
                    />
                    <div styleName="course-description-sets">
                        {this.descriptionSets.map(CourseDescriptionSet)}
                    </div>
                </dd>
            </div>
        );
    }

    renderCourseInstructors() {
        return this.course.visibleInstructors.map((instructor) => (
            <div key={instructor.id} styleName="grid-row">
                <dt>{gettext('Instructor')}</dt>
                <dd styleName="wide">
                    <InstructorProfile instructor={instructor} />
                </dd>
            </div>
        ));
    }

    renderLearningReminderFeatureDiscoverability() {
        if (!this.props.googleClientId) return null;

        return (
            <FeatureDiscoverability
                config={FeatureList.learning_event_scheduler}
                renderingStrategy={{
                    [FeatureState.PASSIVE]: {
                        component: (
                            <LearningReminderBanner
                                googleAuthStore={this.googleAuthStore}
                                shouldRedirect={false}
                            />
                        ),
                        primaryComponentType: 'banner',
                    },
                    [FeatureState.ACTIVE]: {
                        component: (
                            <>
                                <LearningReminderBanner
                                    googleAuthStore={this.googleAuthStore}
                                    shouldRedirect={false}
                                />
                                <LearningReminderDiscoveryModal
                                    googleAuthStore={this.googleAuthStore}
                                    shouldRedirect={false}
                                />
                            </>
                        ),
                        primaryComponentType: 'modal',
                    },
                }}
            />
        );
    }

    render() {
        if (this.props.courseTakingStore.isLoading) {
            return <Loader block={true} size="xxlarge" styleName="loader" />;
        }
        return (
            <ShowMore collapsedHeight={650} withGradient={true} buttonComponent={ShowMoreButton}>
                <div data-purpose="dashboard-overview-container">
                    {this.renderLearningReminderFeatureDiscoverability()}
                    {this.subHeading}
                    <dl>
                        {this.courseStats}
                        {this.renderCertificatesSection()}
                        {this.courseFeatures}
                        {this.renderDescription()}
                        {this.renderCourseInstructors()}
                    </dl>
                </div>
            </ShowMore>
        );
    }
}
