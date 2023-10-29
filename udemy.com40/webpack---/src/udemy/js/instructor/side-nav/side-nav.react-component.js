import {Tracker} from '@udemy/event-tracking';
import BarChartIcon from '@udemy/icons/dist/bar-chart.ud-icon';
import DataInsightIcon from '@udemy/icons/dist/data-insight.ud-icon';
import ExperimentIcon from '@udemy/icons/dist/labs.ud-icon';
import MessageIcon from '@udemy/icons/dist/message.ud-icon';
import QuizIcon from '@udemy/icons/dist/quiz.ud-icon';
import ToolIcon from '@udemy/icons/dist/tool.ud-icon';
import VideoIcon from '@udemy/icons/dist/video.ud-icon';
import {Image, Button, Link} from '@udemy/react-core-components';
import {Badge, NotificationBadge} from '@udemy/react-messaging-components';
import {Popover} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';

import {InstructorMenuActionEvent} from 'instructor/events';
import LabsStore from 'instructor/labs/labs.mobx-store';
import getConfigData from 'utils/get-config-data';
import {udemyLogoInvertedUrl, ubLogoInvertedUrl, ugLogoInvertedUrl} from 'utils/udemy-logo-urls';

import {BASE_INSTRUCTOR_APP_URL} from './constants';
import SecondaryMenuCommunication from './secondary-menu-communication.react-component';
import SecondaryMenuLabs from './secondary-menu-labs.react-component';
import SecondaryMenuPerformance from './secondary-menu-performance.react-component';
import SideNavStore from './side-nav-store.mobx-store';
import './side-nav.less';
import {SideNavigation} from './side-navigation.react-component';

const udConfig = getConfigData();

const PrimaryLogoMenuItem = () => {
    return (
        <li>
            <a href={BASE_INSTRUCTOR_APP_URL} styleName="nav-button logo-nav-button">
                <Image
                    src={udemyLogoInvertedUrl}
                    alt="Udemy"
                    width={91}
                    height={34}
                    data-purpose="udemy-brand-logo"
                />
            </a>
        </li>
    );
};

const PrimaryUFBLogoMenuItem = () => {
    return (
        <li>
            <a href={udConfig.url.to_app} styleName="nav-button logo-nav-button">
                <Image
                    src={udConfig.brand.is_government ? ugLogoInvertedUrl : ubLogoInvertedUrl}
                    alt={udConfig.brand.is_government ? 'Udemy Government' : 'Udemy Business'}
                    width={udConfig.brand.is_government ? 237 : 200}
                    height={34}
                    data-purpose="udemy-brand-logo"
                />
            </a>
        </li>
    );
};

class PrimaryMenuItem extends Component {
    static propTypes = {
        useHttpLinks: PropTypes.bool,
        text: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        resource: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired,
        Icon: PropTypes.elementType.isRequired,
        store: PropTypes.object.isRequired,
        dataPurpose: PropTypes.string,
    };

    static defaultProps = {
        useHttpLinks: false,
        dataPurpose: 'side-nav-item',
    };

    @autobind
    onMouseLeave() {
        this.props.store.setMenuInUse(false);
    }

    @autobind
    onClick() {
        this.props.store.setMenuInUse(true);
        this.props.store.setMenuInFocus(false);
        Tracker.publishEvent(
            new InstructorMenuActionEvent({
                selection: `primary.${this.props.resource}`,
                action: 'click',
            }),
        );
    }

    render() {
        const {useHttpLinks, to, className, Icon, text, children, dataPurpose} = this.props;
        return (
            <li data-purpose={dataPurpose}>
                <Button
                    udStyle="link"
                    componentClass={useHttpLinks ? 'a' : Link}
                    href={useHttpLinks ? `${BASE_INSTRUCTOR_APP_URL}${to}` : null}
                    to={useHttpLinks ? null : to}
                    onClick={this.onClick}
                    onMouseLeave={this.onMouseLeave}
                    className={className}
                >
                    <Icon label={false} size="medium" />
                    {children}
                    <span styleName="title">{text}</span>
                </Button>
            </li>
        );
    }
}

@inject('instructorStore')
@withRouter
@observer
export default class SideNav extends Component {
    static propTypes = {
        useHttpLinks: PropTypes.bool,
        instructorStore: PropTypes.shape({
            hasUnreadCommunications: PropTypes.bool.isRequired,
            getUnread: PropTypes.func.isRequired,
        }).isRequired,
        store: PropTypes.shape({
            blockExpandedMenu: PropTypes.func.isRequired,
            setMenuInUse: PropTypes.func.isRequired,
            ...SecondaryMenuCommunication.propTypes,
        }), // Mainly for tests.
        history: PropTypes.object.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
        }).isRequired,
        performanceEnabled: PropTypes.bool.isRequired,
        labsEnabled: PropTypes.bool,
        hasQAPermission: PropTypes.bool,
        isDisplayPracticeInsightsNewPageWithFunnelViewEnabled: PropTypes.bool,
        labsStore: PropTypes.instanceOf(LabsStore),
        isInSupplyGapsTargetGroup: PropTypes.bool,
    };

    static defaultProps = {
        labsEnabled: false,
        useHttpLinks: false,
        store: null,
        hasQAPermission: false,
        isDisplayPracticeInsightsNewPageWithFunnelViewEnabled: false,
        ...SecondaryMenuCommunication.defaultProps,
        labsStore: null,
        isInSupplyGapsTargetGroup: false,
    };

    UNSAFE_componentWillMount() {
        this.store = this.props.store || new SideNavStore();
    }

    componentDidMount() {
        this.props.instructorStore.getUnread();
        this.props.labsStore?.getUnreadReportedIssues();
    }

    getSecondaryMenu() {
        const pathname = this.props.location && this.props.location.pathname;
        if (!pathname) {
            return null;
        }
        return (
            <Switch>
                <Route path="/communication/">
                    <SecondaryMenuCommunication
                        store={this.props.instructorStore}
                        hasQAPermission={this.props.hasQAPermission}
                    />
                </Route>
                {!this.props.isDisplayPracticeInsightsNewPageWithFunnelViewEnabled ? (
                    <Route path="/performance/">
                        <SecondaryMenuPerformance
                            performanceEnabled={this.props.performanceEnabled}
                            isDisplayPracticeInsightsNewPageWithFunnelViewEnabled={
                                this.props.isDisplayPracticeInsightsNewPageWithFunnelViewEnabled
                            }
                        />
                    </Route>
                ) : (
                    <Route path="/performance/">
                        <SideNavigation />
                    </Route>
                )}

                <Route path="/reviews/">
                    <SecondaryMenuPerformance
                        performanceEnabled={this.props.performanceEnabled}
                        useHttpLinks={this.props.useHttpLinks}
                    />
                </Route>
                <Route path="/qa/">
                    <SecondaryMenuCommunication
                        store={this.props.instructorStore}
                        useHttpLinks={this.props.useHttpLinks}
                    />
                </Route>
                <Route path="/assignments/">
                    <SecondaryMenuCommunication
                        store={this.props.instructorStore}
                        useHttpLinks={this.props.useHttpLinks}
                    />
                </Route>
                <Route path="/labs/">
                    <SecondaryMenuLabs
                        labsStore={this.props.labsStore}
                        useHttpLinks={this.props.useHttpLinks}
                    />
                </Route>
            </Switch>
        );
    }

    getActiveClass(url, additionalActiveUrls) {
        const location = this.props.location.pathname;
        let isActive = location.startsWith(url);
        if (!isActive) {
            for (const i in additionalActiveUrls) {
                if (location.startsWith(additionalActiveUrls[i])) {
                    isActive = true;
                    break;
                }
            }
        }
        return classNames('nav-button', {active: isActive});
    }

    @autobind
    onFocusNavHandler() {
        this.store.setMenuInUse(false);
        this.store.setMenuInFocus(true);
    }

    @autobind
    onBlurNavHandler() {
        this.store.setMenuInFocus(false);
    }

    @autobind
    onClickNavHandler() {
        this.store.blockExpandedMenu();
    }

    @autobind
    gotoInsightsPage() {
        window.location.href = 'insights';
        this.store.hideSupplyGapsInproductMessage();
    }

    @autobind
    dismissSupplyGapsInProductGuidance() {
        this.store.hideSupplyGapsInproductMessage();
    }

    getInsightsSideNavItemRectForPopover(currentRect) {
        const element = document.querySelector('[data-purpose="insights-side-nav-item"]');
        return element ? element.getBoundingClientRect() : currentRect.getBoundingClientRect();
    }

    render() {
        const {useHttpLinks} = this.props;
        const {menuInUse, noExpandMenu, menuInFocus} = this.store;
        const {hasUnreadCommunications} = this.props.instructorStore;
        const classNamesPrimaryMenu = classNames({
            'primary-menu': true,
            'in-use': menuInUse,
            'no-expand': noExpandMenu,
            'on-focus': menuInFocus,
        });
        const isUfb = udConfig.brand.organization;
        const isMessagingEnabled = udConfig.brand.is_messaging_enabled;
        const isDiscussionsEnabled = udConfig.brand.is_discussions_enabled;
        let initialCommunicationsPage = '/assignments/';
        let httpLinksCommunicationsPage = true;
        if (isDiscussionsEnabled) {
            initialCommunicationsPage = '/communication/qa/';
            httpLinksCommunicationsPage = useHttpLinks;
        } else if (isMessagingEnabled) {
            initialCommunicationsPage = '/communication/messages/';
            httpLinksCommunicationsPage = useHttpLinks;
        }
        const secondaryMenu = this.getSecondaryMenu();
        const secondaryMenuRoutePaths = secondaryMenu.props.children.map((r) => r.props.path);
        const secondaryMenuShown = secondaryMenuRoutePaths.some((value) => {
            return this.props.location.pathname.startsWith(value);
        });
        return (
            <div
                styleName={`side-nav ${secondaryMenuShown ? 'side-nav-open' : ''}`}
                data-purpose="side-nav"
            >
                <div styleName="side-nav-inner">
                    <div
                        styleName={classNamesPrimaryMenu}
                        onFocus={this.onFocusNavHandler}
                        onBlur={this.onBlurNavHandler}
                    >
                        {/* eslint-disable jsx-a11y/click-events-have-key-events */}
                        <ul
                            className="ud-unstyled-list"
                            styleName="menu"
                            onClick={this.onClickNavHandler}
                        >
                            {/* eslint-enable jsx-a11y/click-events-have-key-events */}
                            {isUfb ? <PrimaryUFBLogoMenuItem /> : <PrimaryLogoMenuItem />}
                            <PrimaryMenuItem
                                useHttpLinks={useHttpLinks}
                                text={gettext('Courses')}
                                to="/courses"
                                Icon={VideoIcon}
                                resource="courses"
                                styleName={this.getActiveClass('/courses')}
                                store={this.store}
                            />
                            {this.props.labsEnabled && (
                                <PrimaryMenuItem
                                    useHttpLinks={useHttpLinks}
                                    text={gettext('Labs')}
                                    to="/labs"
                                    Icon={ExperimentIcon}
                                    resource="labs"
                                    styleName={this.getActiveClass('/labs')}
                                    store={this.store}
                                >
                                    {this.props.labsStore?.hasUnreadLabCommunications && (
                                        <NotificationBadge styleName="notification-dot" />
                                    )}
                                </PrimaryMenuItem>
                            )}
                            <PrimaryMenuItem
                                useHttpLinks={httpLinksCommunicationsPage}
                                text={gettext('Communication')}
                                to={initialCommunicationsPage}
                                Icon={MessageIcon}
                                resource="communication"
                                styleName={this.getActiveClass('/communication', ['/assignments/'])}
                                store={this.store}
                            >
                                {hasUnreadCommunications && (
                                    <NotificationBadge styleName="notification-dot" />
                                )}
                            </PrimaryMenuItem>
                            <PrimaryMenuItem
                                useHttpLinks={useHttpLinks}
                                text={gettext('Performance')}
                                to="/performance/overview"
                                Icon={BarChartIcon}
                                resource="performance"
                                styleName={this.getActiveClass('/performance', ['/reviews/'])}
                                store={this.store}
                            />
                            {this.props.isInSupplyGapsTargetGroup && (
                                <PrimaryMenuItem
                                    dataPurpose="insights-side-nav-item"
                                    useHttpLinks={useHttpLinks}
                                    text={gettext('Insights')}
                                    to="/insights"
                                    Icon={DataInsightIcon}
                                    resource="insights"
                                    styleName={this.getActiveClass('/insights', [
                                        '/opportunities/',
                                    ])}
                                    store={this.store}
                                />
                            )}
                            {!isUfb && (
                                <PrimaryMenuItem
                                    useHttpLinks={useHttpLinks}
                                    text={gettext('Tools')}
                                    to="/tools"
                                    Icon={ToolIcon}
                                    resource="tools"
                                    styleName={this.getActiveClass('/tools')}
                                    store={this.store}
                                />
                            )}
                            <PrimaryMenuItem
                                useHttpLinks={useHttpLinks}
                                text={gettext('Resources')}
                                to="/help"
                                Icon={QuizIcon}
                                resource="help"
                                styleName={this.getActiveClass('/help')}
                                store={this.store}
                            />
                        </ul>
                    </div>
                    {secondaryMenu}
                </div>
                {this.props.isInSupplyGapsTargetGroup && (
                    <Popover
                        placement={'right'}
                        isOpen={this.store.showSupplyGapsInProductGuidance}
                        withArrow={true}
                        withPadding={true}
                        detachFromTarget={true}
                        trigger={<div></div>}
                        getTriggerRect={(currentRect) =>
                            this.getInsightsSideNavItemRectForPopover(currentRect)
                        }
                    >
                        <div styleName={'popover-heading'}>
                            <Badge styleName="green-badge">{gettext('New')}</Badge>
                            <b>{gettext('Insights have moved!')}</b>
                        </div>
                        <p>
                            {gettext(
                                'Click here to discover topic trends with Marketplace Insights and Udemy Business content opportunities.',
                            )}
                        </p>
                        <div styleName={'popover-buttons'}>
                            <Button
                                udStyle="secondary"
                                onClick={this.dismissSupplyGapsInProductGuidance}
                            >
                                {gettext('Dismiss')}
                            </Button>
                            <Button udStyle="primary" onClick={this.gotoInsightsPage}>
                                {gettext('Go to page')}
                            </Button>
                        </div>
                    </Popover>
                )}
            </div>
        );
    }
}
