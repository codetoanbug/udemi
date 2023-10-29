import {NewBadge} from '@udemy/browse-course';
import {FunnelLogContextProvider} from '@udemy/funnel-tracking';
import {withMatchMedia} from '@udemy/hooks';
import {withI18n} from '@udemy/i18n';
import {ProBadge} from '@udemy/learning-path';
import {Link} from '@udemy/react-core-components';
import {withUDData} from '@udemy/ud-data';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {matchPath, Switch, withRouter} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';
import Tabs from 'base-components/tabs/tabs.react-component';
import {BetaBadge} from 'browse/components/badge/beta-badge.react-component';
import {LearningTools} from 'learning-calendar-reminders/learning-tools/learning-tools.react-component';
import {isBadgingAssertionsEnabled, isBadgingCertPrepEnabled} from 'open-badges/common/utils/utils';
import {MyCertificationPreparation} from 'open-badges/my-learning/my-certification-preparation.react-component';
import {MyCertifications} from 'open-badges/my-learning/my-certifications.react-component';
import createUFBContextMenu from 'organization-common/resource-context-menu/create-ufb-context-menu';
import MyLearningPrograms from 'subscription-browse/pages/my-learning-programs/my-learning-programs.react-component';
import udRenderReactComponents from 'utils/ud-render-react-components';
import {withGlobalProviders} from 'utils/with-global-providers';

import {GoogleCalendarAuthStore} from '../learning-calendar-reminders/calendar-button/google-calendar-auth.mobx-store';
import Archived from './archived.react-component';
import Collections from './collections.react-component';
import ConsumerSubscriptionCoursesCollections from './consumer-subscription-courses-collections.react-component';
import {MyLabs} from './labs/my-labs.react-component.tsx';
import MyMeasureCompetence from './measure-competence/my-measure-competence.react-component';
import MyCoursesSubscriptionContext from './my-courses-subscription-context';
import MyCourses from './my-courses.react-component';
import MyLearningPaths from './my-learning-paths.react-component';
import WishlistedCourses from './wishlisted-courses.react-component';
import './app.global.less';
import './app.less';

@withRouter
@withMatchMedia({hasPrimaryCoarsePointer: '(pointer: coarse)'})
@observer
export class App extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        enrolled_course_count: PropTypes.number.isRequired,
        sms_subscriptions_active: PropTypes.bool,
        consumer_subscription_active: PropTypes.bool,
        google_client_id: PropTypes.string,
        careerTrackUnitData: PropTypes.array,
        enableLabsInPersonalPlan: PropTypes.bool,
        userHasUBProAccess: PropTypes.bool,
        showWishlistedCourseQuickViewBox: PropTypes.bool,
        udData: PropTypes.object.isRequired,
        gettext: PropTypes.func.isRequired,
        hasPrimaryCoarsePointer: PropTypes.bool,
        enableUBListExperiment: PropTypes.bool,
    };

    static defaultProps = {
        sms_subscriptions_active: false,
        consumer_subscription_active: false,
        google_client_id: null,
        careerTrackUnitData: [],
        enableLabsInPersonalPlan: false,
        userHasUBProAccess: false,
        showWishlistedCourseQuickViewBox: false,
        hasPrimaryCoarsePointer: null,
        enableUBListExperiment: false,
    };

    constructor(...args) {
        super(...args);
        const {gettext} = this.props;
        this.resourceContextMenu = createUFBContextMenu();
        this.subscriptionContext = {
            smsSubscriptionsActive: this.props.sms_subscriptions_active,
            consumerSubscriptionActive: this.props.consumer_subscription_active,
        };
        this.googleAuthStore = new GoogleCalendarAuthStore(this.props.google_client_id);

        let hasStandardLists = !this.props.udData.Config.brand.has_organization;
        let hasWishlist = this.props.udData.Config.features.wishlist;
        let learningTabTitle = gettext('All courses');
        if (this.props.consumer_subscription_active) {
            hasStandardLists = false;
            hasWishlist = false;
            learningTabTitle = gettext('Purchased');
        }

        this.tabs = [
            this.props.consumer_subscription_active && {
                pageKey: 'my_learning_consumer_subscription',
                path: '/lists/',
                renderTitle: () => gettext('My Lists'),
                render: this.renderTabContent((props) => (
                    <ConsumerSubscriptionCoursesCollections
                        {...props}
                        careerTrackUnitData={this.props.careerTrackUnitData}
                    />
                )),
            },
            this.props.sms_subscriptions_active && {
                pageKey: 'my_learning_sms_programs',
                path: '/programs/',
                renderTitle: () => gettext('Programs'),
                render: this.renderTabContent((props) => <MyLearningPrograms {...props} />),
            },
            {
                pageKey: 'my_learning_all_courses',
                path: '/learning/',
                renderTitle: () => learningTabTitle,
                render: this.renderTabContent((props) => (
                    <MyCourses
                        {...props}
                        enrolledCourseCount={this.props.enrolled_course_count}
                        googleAuthStore={this.googleAuthStore}
                    />
                )),
            },
            hasStandardLists && {
                pageKey: 'my_learning_lists',
                path: '/lists/',
                renderTitle: () => gettext('My Lists'),
                render: this.renderTabContent((props) => <Collections {...props} />),
            },
            hasWishlist && {
                pageKey: 'my_learning_wishlist',
                path: '/wishlist/',
                renderTitle: () => gettext('Wishlist'),
                render: this.renderTabContent((props) => (
                    <FunnelLogContextProvider
                        context="user_library"
                        context2="my_learning_wishlist"
                    >
                        <WishlistedCourses {...props} />
                    </FunnelLogContextProvider>
                )),
            },
            this.props.udData.Config.features.organization.learning_path.enabled && {
                pageKey: 'my_learning_learning_paths',
                path: '/learning-paths/',
                renderTitle: () => gettext('Learning paths'),
                render: this.renderTabContent((props) => <MyLearningPaths {...props} />),
            },
            this.shouldShowCertificationPreparationTab() && {
                pageKey: 'my_certification_preparation',
                path: '/certification-preparation/',
                renderTitle: () => gettext('Certification preparation'),
                render: this.renderTabContent((props) => <MyCertificationPreparation {...props} />),
            },
            this.shouldShowCertificationsTab() && {
                pageKey: 'my_certifications',
                path: '/certifications/',
                renderTitle: () => gettext('Certifications'),
                render: this.renderTabContent((props) => <MyCertifications {...props} />),
            },
            this.shouldShowAssessmentsTab() && {
                pageKey: 'my_measure_competence',
                path: '/assessments/',
                renderTitle: () => (
                    <span styleName="title-with-badge">
                        {gettext('Assessments')}
                        {(this.props.consumer_subscription_active && <NewBadge />) || <ProBadge />}
                    </span>
                ),
                render: this.renderTabContent((props) => (
                    <MyMeasureCompetence
                        isConsumerSubsSubscriber={this.props.consumer_subscription_active}
                        {...props}
                        udData={this.props.udData}
                    />
                )),
            },
            this.shouldShowLabsTab() && {
                pageKey: 'my_labs',
                path: '/labs/',
                renderTitle: () => (
                    <span styleName="title-with-badge">
                        {gettext('Labs')}
                        {(this.props.enableLabsInPersonalPlan &&
                            this.props.consumer_subscription_active && <BetaBadge />) || (
                            <ProBadge />
                        )}
                    </span>
                ),
                render: this.renderTabContent((props) => <MyLabs {...props} />),
            },
            {
                pageKey: 'my_learning_archived',
                path: '/archived/',
                renderTitle: () => gettext('Archived'),
                render: this.renderTabContent((props) => <Archived {...props} />),
            },
            {
                pageKey: 'my_learning_tools',
                path: '/learning-tools/',
                renderTitle: () => gettext('Learning tools'),
                render: this.renderTabContent((props) => (
                    <LearningTools {...props} googleAuthStore={this.googleAuthStore} />
                )),
            },
        ].filter(Boolean);
    }

    componentDidMount() {
        this.unlistenRouteChange = this.props.history.listen(this.onRouteChange);

        const {pathname, search} = this.props.location;
        const activeTab = this.tabs.find(({path}) => !!matchPath(pathname, {path, exact: true}));
        if (activeTab) {
            this.setActiveTabId(activeTab.path);
        } else if (matchPath(pathname, {path: '/search/', exact: true})) {
            // `/search/` used to show learning and wishlisted search results together.
            // Now we inline the search results in the same tab.
            // In case users bookmarked the `/search/` url, redirect to learning tab.
            this.props.history.replace({pathname: '/learning/', search});
        } else {
            this.props.history.replace({pathname: this.tabs[0].path});
        }
    }

    componentWillUnmount() {
        this.unlistenRouteChange && this.unlistenRouteChange();
    }

    shouldShowAssessmentsTab() {
        return this.props.consumer_subscription_active || this.props.userHasUBProAccess;
    }

    shouldShowLabsTab() {
        return (
            (this.props.consumer_subscription_active && this.props.enableLabsInPersonalPlan) ||
            this.props.userHasUBProAccess
        );
    }

    shouldShowCertificationPreparationTab() {
        return isBadgingCertPrepEnabled() && !isBadgingAssertionsEnabled();
    }

    shouldShowCertificationsTab() {
        return isBadgingAssertionsEnabled();
    }

    @observable activeTabId;

    @action
    setActiveTabId(tabId) {
        this.activeTabId = tabId;
    }

    @autobind
    onRouteChange({pathname}) {
        const tab = this.tabs.find(({path}) => !!matchPath(pathname, {path, exact: true}));
        const tabId = tab ? tab.path : this.tabs[0].path;
        if (this.activeTabId !== tabId) {
            this.setActiveTabId(tabId);
        }
    }

    @autobind
    onSelectTab(tabId) {
        if (this.activeTabId !== tabId) {
            this.setActiveTabId(tabId);
        }
    }

    renderTabContent(render) {
        return (props) => (
            <div className="my-courses__main-content ud-container">{render(props)}</div>
        );
    }

    render() {
        const {gettext, hasPrimaryCoarsePointer} = this.props;
        return (
            <Provider
                resourceContextMenu={this.resourceContextMenu}
                enableLabsInPersonalPlan={this.props.enableLabsInPersonalPlan}
                userHasConsumerSubs={this.props.consumer_subscription_active}
                showWishlistedCourseQuickViewBox={this.props.showWishlistedCourseQuickViewBox}
                enableUBListExperiment={this.props.enableUBListExperiment}
            >
                <MyCoursesSubscriptionContext.Provider value={this.subscriptionContext}>
                    <div className="my-courses__app">
                        <div className="ud-container">
                            <h1 className="ud-heading-serif-xxxl" styleName="page-title">
                                {gettext('My learning')}
                            </h1>
                        </div>
                        <Tabs
                            onSelect={this.onSelectTab}
                            activeTabId={this.activeTabId}
                            defaultTabId={this.tabs[0].path}
                            prioritizeTouch={hasPrimaryCoarsePointer}
                        >
                            {this.tabs.map(({renderTitle, ...routeProps}) => (
                                <Tabs.Tab
                                    key={routeProps.path}
                                    id={routeProps.path}
                                    title={renderTitle()}
                                    renderTabButton={(button) => (
                                        <h2>
                                            {React.cloneElement(button, {
                                                componentClass: Link,
                                                to: routeProps.path,
                                            })}
                                        </h2>
                                    )}
                                >
                                    <Switch>
                                        <PageTrackingRoute exact={true} {...routeProps} />
                                    </Switch>
                                </Tabs.Tab>
                            ))}
                        </Tabs>
                    </div>
                </MyCoursesSubscriptionContext.Provider>
            </Provider>
        );
    }
}

export const AppWithProviders = withI18n(withUDData(App));
const WrappedApp = (props) => {
    return (
        <MemoizedBrowserRouter>
            <AppWithProviders {...props} />
        </MemoizedBrowserRouter>
    );
};
export const WrappedAppWithGlobalProviders = withGlobalProviders(WrappedApp);

export default function bootstrap(container, moduleArgs) {
    udRenderReactComponents(
        container,
        '.ud-component--my-courses-v3--app',
        WrappedAppWithGlobalProviders,
        moduleArgs,
    );
}
