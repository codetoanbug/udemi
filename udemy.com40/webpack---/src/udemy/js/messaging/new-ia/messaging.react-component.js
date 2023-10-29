import {Button, Link} from '@udemy/react-core-components';
import {Checkbox} from '@udemy/react-form-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';
import EmptyState from 'instructor/common/empty-state.react-component';
import DescriptionDropdown from 'instructor/layout/description-dropdown.react-component';
import IAResponsiveHeader, {
    SimpleIAResponsiveHeader,
} from 'instructor/layout/ia-responsive-header.react-component';
import TwoPaneStore from 'instructor/layout/two-pane.mobx-store';
import TwoPane from 'instructor/layout/two-pane.react-component';
import {DIRECT_MESSAGING_EVENTS} from 'messaging/events';
import DirectMessageEventTracker from 'messaging/trackers';
import udLink from 'utils/ud-link';

import {
    FILTER_AUTOMATED,
    FILTER_STARRED,
    FILTER_UNREAD,
    FILTER_UNRESPONDED,
    SORT_LABELS,
} from './constants';
import MessageThreadDetail from './message-thread-detail.react-component';
import MessageThreadList from './message-thread-list.react-component';
import MessagingStore from './messaging.mobx-store';
import NewThreadRoute from './new-thread/new-thread-route.react-component';
import UserRoute from './user/user-route.react-component';
import './messaging.less';

@inject('instructorStore')
@observer
export class IAMessagingApp extends Component {
    static propTypes = {
        baseUrl: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired,
        instructorStore: PropTypes.object.isRequired,
        store: PropTypes.object, // for testing
    };

    static defaultProps = {
        store: undefined,
    };

    constructor(props) {
        super(props);

        const {instructorStore} = props;
        this.store =
            props.store ||
            (instructorStore && instructorStore.MessagingStore) ||
            new MessagingStore(props.baseUrl, instructorStore, new TwoPaneStore());
        if (instructorStore) {
            instructorStore.MessagingStore = this.store;
        }
        this.store.refreshDirectMessagingSettings();
    }

    componentDidMount() {
        this.store.setThreadFromPathname(this.props.location.pathname);
        this.store.getInstructorInfo();
        if (
            !this.store.directMessagingDisabled ||
            this.store.isMessageDetailPath(this.props.location.pathname)
        ) {
            this.store.loadInitialThreads();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.store.setThreadFromPathname(nextProps.location.pathname);
        }
    }

    @autobind
    handleUnreadChanged(ev) {
        this.store.setFilter(FILTER_UNREAD, ev.target.checked);
    }

    @autobind
    handleImportantChanged(ev) {
        this.store.setFilter(FILTER_STARRED, ev.target.checked);
    }

    @autobind
    handleUnrespondedChanged(ev) {
        this.store.setFilter(FILTER_UNRESPONDED, ev.target.checked);
    }

    @autobind
    handleAutomatedChanged(ev) {
        this.store.setFilter(FILTER_AUTOMATED, ev.target.checked);
    }

    @autobind
    setOrdering(value) {
        this.store.setOrdering(value);
    }

    getFilterInputs() {
        return {
            unreadCheckbox: (
                <Checkbox
                    name="Unread"
                    checked={this.store.filters[FILTER_UNREAD]}
                    onChange={this.handleUnreadChanged}
                >
                    {gettext('Unread')}
                </Checkbox>
            ),
            importantCheckbox: (
                <Checkbox
                    name="Important"
                    checked={this.store.filters[FILTER_STARRED]}
                    onChange={this.handleImportantChanged}
                >
                    {gettext('Important')}
                </Checkbox>
            ),
            unrespondedCheckbox: (
                <Checkbox
                    name="Unanswered"
                    checked={this.store.filters[FILTER_UNRESPONDED]}
                    onChange={this.handleUnrespondedChanged}
                >
                    {gettext('Not answered')}
                </Checkbox>
            ),
            automatedCheckbox: (
                <Checkbox
                    name="Show automated messages"
                    checked={this.store.filters[FILTER_AUTOMATED]}
                    onChange={this.handleAutomatedChanged}
                >
                    {gettext('Show automated messages')}
                </Checkbox>
            ),
            sortDropdown: (
                <DescriptionDropdown
                    description={gettext('Sort by')}
                    labels={SORT_LABELS}
                    value={this.store.ordering}
                    setValue={this.setOrdering}
                />
            ),
        };
    }

    @autobind
    showOldMessages() {
        this.store.showOldMessages();
        DirectMessageEventTracker.track(
            DIRECT_MESSAGING_EVENTS.InstructorBannerActionEvent,
            'view_old_messages',
            {
                messageType: 'direct_message_opt_out_message',
                page: 'instructor_communication_messages',
            },
        );
    }

    clickViewMessageSetting() {
        DirectMessageEventTracker.track(
            DIRECT_MESSAGING_EVENTS.InstructorBannerActionEvent,
            'view_message_setting',
            {
                messageType: 'direct_message_opt_out_message',
                page: 'instructor_communication_messages',
            },
        );
    }

    renderMessagesOptOutScreen() {
        return (
            <div>
                <h1 className="instructor-main-heading ud-heading-serif-xxl">
                    {gettext('Messages')}
                </h1>
                <div className="ud-heading-lg" styleName="messages-opt-out-screen-subtitle">
                    {gettext('You have turned off direct messaging for your account')}
                </div>
                <div className="ud-text-sm">
                    {gettext('View message settings to enable receiving messages as an instructor')}
                </div>
                <Button
                    size="medium"
                    componentClass="a"
                    href="/instructor/account/messages/"
                    onClick={this.clickViewMessageSetting}
                    udStyle="secondary"
                    data-purpose="message-settings-link"
                    styleName="messages-opt-out-screen-button"
                >
                    {gettext('View message settings')}
                </Button>
                <Button
                    size="medium"
                    udStyle="ghost"
                    data-purpose="show-old-messages"
                    onClick={this.showOldMessages}
                >
                    {gettext('View old messages')}
                </Button>
            </div>
        );
    }

    renderMessageThreadScreen() {
        const composeButton = (
            <Button
                size="medium"
                componentClass={Link}
                to={`${this.store.baseUrl}/compose/`}
                udStyle="secondary"
            >
                {gettext('Compose')}
            </Button>
        );

        const backButton = (
            <Button
                size="medium"
                componentClass="a"
                href="/instructor/communication/messages"
                udStyle="secondary"
            >
                {gettext('Back')}
            </Button>
        );

        const filterInputs = this.getFilterInputs();
        return (
            <div>
                <IAResponsiveHeader
                    rightCTA={this.store.directMessagingDisabled ? backButton : composeButton}
                    title={
                        this.store.directMessagingDisabled
                            ? gettext('Old Messages')
                            : gettext('Messages')
                    }
                    loaded={this.store.ready && !this.store.noThreads}
                    leftItems={[
                        filterInputs.unreadCheckbox,
                        filterInputs.importantCheckbox,
                        filterInputs.unrespondedCheckbox,
                        filterInputs.automatedCheckbox,
                        filterInputs.sortDropdown,
                    ]}
                />
                {!this.store.ready && <MainContentLoader />}
                {this.store.ready && this.store.noThreads && (
                    <EmptyState
                        src={udLink.toStorageStaticAsset('communication/empty-mailbox-v2.jpg')}
                        src2x={udLink.toStorageStaticAsset('communication/empty-mailbox-2x-v2.jpg')}
                        headerText={gettext('No new messages')}
                        subText={
                            this.store.isPublishedInstructor
                                ? gettext('You’re caught up with your messages!')
                                : gettext(
                                      'Direct messages are for you to communicate with your students or other instructors privately. Here’s where you’ll see them.',
                                  )
                        }
                    />
                )}
                {this.store.ready && !this.store.noThreads && (
                    <div styleName="two-pane">
                        <TwoPane twoPaneStore={this.store.twoPaneStore}>
                            <Route component={MessageThreadList} />
                            <MessageThreadDetail thread={this.store.selectedThread} />
                        </TwoPane>
                    </div>
                )}
            </div>
        );
    }

    render() {
        if (
            this.store.showMessagesOptOutScreen &&
            !this.store.isMessageDetailPath(this.props.location.pathname)
        ) {
            DirectMessageEventTracker.track(
                DIRECT_MESSAGING_EVENTS.InstructorBannerViewEvent,
                'view',
                {
                    messageType: 'direct_message_opt_out_message',
                    page: 'instructor_communication_messages',
                },
            );
            return this.renderMessagesOptOutScreen();
        }

        return (
            <Provider store={this.store}>
                <MemoizedBrowserRouter>
                    <Switch>
                        {!this.store.directMessagingDisabled && (
                            <PageTrackingRoute
                                pageKey="messaging_compose"
                                exact={true}
                                path={`${this.store.baseUrl}/compose/user/:id/`}
                                component={UserRoute}
                            />
                        )}
                        {!this.store.directMessagingDisabled && (
                            <PageTrackingRoute
                                pageKey="messaging_compose"
                                path={`${this.store.baseUrl}/compose/`}
                            >
                                <div>
                                    <SimpleIAResponsiveHeader
                                        title={gettext('New Message')}
                                        rightCTA={
                                            <Button
                                                size="medium"
                                                udStyle="secondary"
                                                componentClass={Link}
                                                to={`${this.store.baseUrl}/`}
                                            >
                                                {gettext('Cancel')}
                                            </Button>
                                        }
                                    />
                                    <NewThreadRoute />
                                </div>
                            </PageTrackingRoute>
                        )}
                        <PageTrackingRoute
                            pageKey="messaging_detail"
                            path={`${this.store.baseUrl}/:thread_id/detail/`}
                        >
                            {this.renderMessageThreadScreen()}
                        </PageTrackingRoute>
                        <Route>{this.renderMessageThreadScreen()}</Route>
                    </Switch>
                </MemoizedBrowserRouter>
            </Provider>
        );
    }
}

export default withRouter(IAMessagingApp);
