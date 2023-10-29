import {ErrorPage as NotFound} from '@udemy/react-structure-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Switch, Route, Redirect} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';
import Captions from 'course-captions/captions.react-component';
import udRenderReactComponents from 'utils/ud-render-react-components';

import Coupons from '../course-manage-price-and-coupons/coupons/coupons.react-component';
import Price from '../course-manage-price-and-coupons/price/price.react-component';
import Accessibility from './accessibility/accessibility.react-component';
import Availability from './availability/availability.react-component';
import ContentOnly from './content-only/content-only.react-component';
import CourseBasics from './course-basics/course-basics.react-component';
import CourseGoals from './course-goals/course-goals.react-component';
import CourseManageStore from './course-manage.mobx-store';
import CurriculumEditor from './curriculum/curriculum-editor.react-component';
import FullPageTakeoverHeader from './full-page-takeover-header.react-component';
import LiveChat from './live-chat/live-chat.react-component';
import Messages from './messages/messages.react-component';
import QualityFeedback from './quality-feedback/quality-feedback.react-component';
import ScrollToTop from './scroll-to-top.react-component';
import CourseSettings from './settings/course-settings.react-component';
import SideNav from './side-nav/side-nav.react-component';
import Students from './students/students.react-component';
import './app.global.less';
import './app.less';

const propTypes = {
    courseId: PropTypes.number.isRequired,
    isUfoContentSubscriptionAgreed: PropTypes.bool,
    pageStore: PropTypes.object, // Mainly for tests.
    // Captions and localization.
    awsAccessKey: PropTypes.string.isRequired,
    bucketUrl: PropTypes.string.isRequired,
    performanceBaseUrl: PropTypes.string.isRequired,
    // filestack
    filestackPolicy: PropTypes.string,
    filestackSignature: PropTypes.string,
    isCourseVersionEnabled: PropTypes.bool,
    isNewCodingExerciseUIEnabled: PropTypes.bool,
    isCurriculumEditorSectionTopicsEnabled: PropTypes.bool,
};

const defaultProps = {
    pageStore: null,
    isUfoContentSubscriptionAgreed: false,
    filestackPolicy: '',
    filestackSignature: '',
    isCourseVersionEnabled: false,
    isNewCodingExerciseUIEnabled: false,
    isCurriculumEditorSectionTopicsEnabled: false,
};

export const CourseManageFrame = withRouter(
    observer((props) => {
        if (!props.pageStore.courseLoaded) {
            return null;
        }

        const course = props.pageStore.course;
        const isUFB = Boolean(course && course.organizationId);
        let defaultPage = '/404';
        const path = props.location.pathname;
        if (course && (path === '/' || path === '/price-and-promotions/')) {
            defaultPage = '/promotions/';
            if (isUFB) {
                defaultPage = '/curriculum/';
            } else if (!course.isHighQuality) {
                if (course.qualityReviewProcess && course.qualityReviewProcess.id) {
                    defaultPage = '/feedback/';
                } else {
                    defaultPage = '/goals/';
                }
            }
        }

        /* eslint-disable react/jsx-no-bind */
        return (
            <ScrollToTop>
                <Switch>
                    <PageTrackingRoute
                        pageKey="course_manage_goals"
                        exact={true}
                        path="/goals/"
                        render={() => (
                            <CourseGoals pageStore={props.pageStore} courseId={props.courseId} />
                        )}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_curriculum"
                        exact={true}
                        path="/(curriculum|practice-tests)/"
                        render={() => (
                            <CurriculumEditor
                                pageStore={props.pageStore}
                                courseId={props.courseId}
                                exportLecturesUrl={props.exportLecturesUrl}
                                filestackPolicy={props.filestack_policy}
                                filestackSignature={props.filestack_signature}
                            />
                        )}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_captions"
                        path="/captions/"
                        render={() => (
                            <Captions
                                courseId={props.courseId}
                                awsAccessKey={props.awsAccessKey}
                                bucketUrl={props.bucketUrl}
                            />
                        )}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_accessibility"
                        path="/accessibility/"
                        render={() => <Accessibility courseId={props.courseId} />}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_basics"
                        exact={true}
                        path="/basics/"
                        render={() => (
                            <CourseBasics pageStore={props.pageStore} courseId={props.courseId} />
                        )}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_pricing"
                        exact={true}
                        path="/pricing/"
                        render={(routerProps) => (
                            <Price
                                pageStore={props.pageStore}
                                courseId={props.courseId}
                                onSaveComplete={props.pageStore.getMenu}
                                {...routerProps}
                            />
                        )}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_promotions"
                        exact={true}
                        path="/promotions/"
                        render={(routerProps) => (
                            <Coupons
                                courseId={props.courseId}
                                onSaveComplete={props.pageStore.getMenu}
                                {...routerProps}
                            />
                        )}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_structure"
                        exact={true}
                        path="/course-structure/"
                        render={() => (
                            <ContentOnly
                                pageType="course-structure"
                                courseId={props.courseId}
                                onPageOpen={props.pageStore.getMenu}
                            />
                        )}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_film"
                        exact={true}
                        path="/film/"
                        render={() => (
                            <ContentOnly
                                pageType="film"
                                courseId={props.courseId}
                                onPageOpen={props.pageStore.getMenu}
                            />
                        )}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_setup"
                        exact={true}
                        path="/setup/"
                        render={() => (
                            <ContentOnly
                                pageType="setup"
                                courseId={props.courseId}
                                onPageOpen={props.pageStore.getMenu}
                            />
                        )}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_settings"
                        exact={true}
                        path="/settings/"
                        render={() => (
                            <CourseSettings courseId={props.courseId} pageStore={props.pageStore} />
                        )}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_students"
                        exact={true}
                        path="/students/"
                        render={() => <Students courseId={props.courseId} />}
                    />
                    <PageTrackingRoute
                        pageKey="course_manage_feedback"
                        path="/feedback/"
                        render={() => <QualityFeedback {...props} />}
                    />

                    <PageTrackingRoute
                        pageKey="course_manage_communications"
                        path="/communications/"
                        render={() => <Messages pageStore={props.pageStore} />}
                    />

                    <PageTrackingRoute
                        pageKey="course_manage_availability"
                        path="/availability/"
                        render={() => <Availability pageStore={props.pageStore} />}
                    />

                    <Route exact={true} path="/404" render={() => <NotFound />} />
                    <Redirect to={defaultPage} />
                </Switch>
            </ScrollToTop>
        );
        /* eslint-enable react/jsx-no-bind */
    }),
);

CourseManageFrame.propTypes = propTypes;

CourseManageFrame.defaultProps = defaultProps;

@observer
export class App extends Component {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);
        this.pageStore =
            props.pageStore ||
            new CourseManageStore(
                props.courseId,
                props.isUfoContentSubscriptionAgreed,
                props.isCourseVersionEnabled,
                props.isNewCodingExerciseUIEnabled,
                props.isCurriculumEditorSectionTopicsEnabled,
            );
    }

    render() {
        // It's important to remove this.props.pageStore so that it doesn't replace `pageStore={ this.pageStore }`.
        const {pageStore, performanceBaseUrl, isCourseVersionEnabled, ...frameProps} = this.props;
        return (
            <MemoizedBrowserRouter>
                <>
                    <FullPageTakeoverHeader pageStore={this.pageStore} />
                    <LiveChat />
                    <div className="ud-container" styleName="container">
                        <SideNav pageStore={this.pageStore} />
                        <div styleName="content">
                            <CourseManageFrame
                                pageStore={this.pageStore}
                                {...frameProps}
                                performanceBaseUrl={performanceBaseUrl}
                            />
                        </div>
                    </div>
                </>
            </MemoizedBrowserRouter>
        );
    }
}

export default function bootstrap(container, moduleArgs) {
    udRenderReactComponents(container, '.ud-component--course-manage-v2--app', App, moduleArgs);
}
