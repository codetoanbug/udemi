import {NotificationBadge} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import SystemMessagePopover from 'base-components/ungraduated/popover/system-message-popover.react-component';
import getConfigData from 'utils/get-config-data';
import SystemMessage from 'utils/ud-system-message';

import SecondaryMenuItem from './secondary-menu-item.react-component';
import './side-nav.less';

const udConfig = getConfigData();

@withRouter
@observer
export default class SecondaryMenuCommunication extends Component {
    static propTypes = {
        store: PropTypes.shape({
            unreadMessages: PropTypes.number.isRequired,
            unreadQA: PropTypes.number.isRequired,
            unreadFeaturedQuestions: PropTypes.number.isRequired,
            unreadAssignments: PropTypes.number.isRequired,
        }).isRequired,
        useHttpLinks: PropTypes.bool,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
        }).isRequired,
        hasQAPermission: PropTypes.bool,
    };

    static defaultProps = {
        useHttpLinks: false,
        hasQAPermission: false,
    };

    getActiveClass(url) {
        const location = this.props.location.pathname;
        return classNames('subnav-button', {active: location.startsWith(url)});
    }

    renderFeaturedQuestionsPopover(menuItem) {
        return (
            <SystemMessagePopover
                placement="right"
                systemMessageId={SystemMessage.ids.hasSeenInstructorFeaturedQuestionsPrompt}
                trigger={menuItem}
            >
                <div>
                    {gettext('Manage and write questions to feature at the top of your course Q&A')}
                </div>
            </SystemMessagePopover>
        );
    }

    render() {
        const {store, useHttpLinks, hasQAPermission} = this.props;
        const isMessagingEnabled = udConfig.brand.is_messaging_enabled;
        const isDiscussionsEnabled = udConfig.brand.is_discussions_enabled;
        const primaryResource = 'communication';
        return (
            <ul className="ud-unstyled-list" styleName="menu secondary-menu">
                {isDiscussionsEnabled && (
                    <SecondaryMenuItem
                        useHttpLinks={useHttpLinks}
                        to="/communication/qa/"
                        resource="q&a"
                        primaryResource={primaryResource}
                        text={gettext('Q&A')}
                        styleName={this.getActiveClass('/communication/qa')}
                    >
                        <NotificationBadge
                            label={ninterpolate(
                                '%(count)s unread Q&A',
                                '%(count)s unread Q&A',
                                store.unreadQA,
                                {count: store.unreadQA},
                            )}
                            styleName="secondary-menu-badge"
                        >
                            {store.unreadQA}
                        </NotificationBadge>
                    </SecondaryMenuItem>
                )}
                {hasQAPermission && (
                    <SecondaryMenuItem
                        useHttpLinks={useHttpLinks}
                        to="/communication/featured_questions/"
                        resource="featured_questions"
                        primaryResource={primaryResource}
                        text={gettext('Featured Questions')}
                        styleName={this.getActiveClass('/communication/featured_questions')}
                        renderMenuItem={this.renderFeaturedQuestionsPopover}
                    >
                        <NotificationBadge
                            label={ninterpolate(
                                '%(count)s unread Featured Question',
                                '%(count)s unread Featured Questions',
                                store.unreadFeaturedQuestions,
                                {count: store.unreadFeaturedQuestions},
                            )}
                            styleName="secondary-menu-badge"
                        >
                            {store.unreadFeaturedQuestions}
                        </NotificationBadge>
                    </SecondaryMenuItem>
                )}
                {isMessagingEnabled && (
                    <SecondaryMenuItem
                        useHttpLinks={useHttpLinks}
                        to="/communication/messages/"
                        resource="messages"
                        primaryResource={primaryResource}
                        text={gettext('Messages')}
                        styleName={this.getActiveClass('/communication/messages')}
                    >
                        <NotificationBadge
                            label={ninterpolate(
                                '%(count)s unread messages',
                                '%(count)s unread messages',
                                store.unreadMessages,
                                {count: store.unreadMessages},
                            )}
                            styleName="secondary-menu-badge"
                        >
                            {store.unreadMessages}
                        </NotificationBadge>
                    </SecondaryMenuItem>
                )}
                <SecondaryMenuItem
                    useHttpLinks={useHttpLinks}
                    to="/communication/assignments/"
                    resource="assignments"
                    primaryResource={primaryResource}
                    text={gettext('Assignments')}
                    styleName={this.getActiveClass('/communication/assignments')}
                >
                    <NotificationBadge
                        label={ninterpolate(
                            '%(count)s unread assignment',
                            '%(count)s unread assignments',
                            store.unreadAssignments,
                            {count: store.unreadAssignments},
                        )}
                        styleName="secondary-menu-badge"
                    >
                        {store.unreadAssignments}
                    </NotificationBadge>
                </SecondaryMenuItem>
                <SecondaryMenuItem
                    useHttpLinks={useHttpLinks}
                    to="/communication/announcements/"
                    resource="announcements"
                    primaryResource={primaryResource}
                    text={gettext('Announcements')}
                    styleName={this.getActiveClass('/communication/announcements')}
                />
            </ul>
        );
    }
}
