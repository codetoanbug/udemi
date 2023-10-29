import {tokens} from '@udemy/styles';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';

import udExternalLoaders from 'utils/ud-external-loaders';
import udMe from 'utils/ud-me';

// ensure zendesk zopim chat is loaded, then customize for new instructor use case
export const INSTRUCTOR_CODE = 1500000232621;
export const LIVECHAT_COOKIE = 'livechat.display.expand';
// widgetkey is needed in the embedded script url to specify the widget brand.
// ref: https://docs.google.com/document/d/1B_2GdU-qXpZUgVvw0ORqwexvm8y9bxrd95ahhX9U8rE/edit
export const WIDGET_KEY = '22e8b16c-80bd-4ef9-b45b-40fc67fbd3f0';

// A list of regular expressions to match a certain pathname, if it matches the livechat window will be hidden
export const LIVECHAT_URL_BLACKLIST = [
    /\/captions\/\w{2}_\w{2}\/edit/, // Caption Editor (/captions/en_US/edit)
];

@withRouter
export default class LiveChat extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.replacePushState();

        this.applyWidgetSettings();
        udExternalLoaders.loadZendeskWebWidget(WIDGET_KEY, () => {
            const widgetLoaderJob = setInterval(() => {
                this.applyWidgetSettings();
                if (window.zE) {
                    clearInterval(widgetLoaderJob);
                    // We hide the widget if it matches a certain pathname. However, we still want to initialise the
                    // widget so we can quickly enable it when the user navigates to a different page.
                    this.toggleWidgetForUrl(window.location.url);
                    const departmentsJob = setInterval(() => {
                        this.initializeWidget();
                        if (window.zE('webWidget:get', 'chat:department', INSTRUCTOR_CODE)) {
                            clearInterval(departmentsJob);
                            this.enableChatIfAgentsAvailable();
                        }
                    }, 1000);
                }
            }, 100);
        });
    }

    componentWillUnmount() {
        this.resetPushState();
    }

    originalPushState;
    // We overwrite the native history.pushState to check if the "new" URL matches any of our
    // blacklisted items so that we can hide / show the livechat for different URLs.
    // This is mainly for React apps with different routes.
    replacePushState() {
        this.originalPushState = window.history.pushState;
        const self = this;
        window.history.pushState = function (state, title, url) {
            self.toggleWidgetForUrl(url);
            self.originalPushState.call(this, state, title, url);
        };
    }

    resetPushState() {
        window.history.pushState = this.originalPushState;
    }

    isHidden = false;
    toggleWidgetForUrl(url) {
        if (window.zE) {
            if (LIVECHAT_URL_BLACKLIST.some((re) => re.test(url))) {
                this.isHidden = true;
                window.zE('webWidget', 'hide');
            } else if (this.isHidden) {
                this.isHidden = false;
                window.zE('webWidget', 'show');
            }
        }
    }

    applyWidgetSettings() {
        window.zESettings = {
            webWidget: {
                zIndex: 999,
                contactForm: {suppress: false},
                helpCenter: {suppress: false},
                talk: {suppress: true},
                answerBot: {suppress: false},
            },
        };
    }

    initializeWidget() {
        window.zE('webWidget', 'updateSettings', {
            webWidget: {
                answerBot: {
                    contactOnlyAfterQuery: true,
                    search: {
                        labels: ['instructor'],
                    },
                },
                chat: {
                    hideWhenOffline: false,
                    title: gettext('Ask us anything'),
                    prechatForm: {
                        greeting: {
                            '*': gettext(
                                'Need help choosing a microphone? ' +
                                    'Have questions about the review process? ' +
                                    "Ask us anything. We're here to help!",
                            ),
                        },
                    },
                    departments: {
                        select: INSTRUCTOR_CODE,
                    },
                    offlineForm: {
                        greeting: {
                            '*': gettext('Leave a message'),
                        },
                    },
                },
                color: {
                    theme: tokens['color-purple-300'],
                    launcher: tokens['color-purple-300'],
                    button: tokens['color-gray-500'],
                },
            },
        });
        window.zE('webWidget', 'prefill', {
            name: {
                value: udMe.title,
            },
            email: {
                value: udMe.email,
            },
        });
        window.zE('webWidget', 'setLocale', udMe.language);
    }

    enableChatIfAgentsAvailable() {
        // Save and restore last visibility state.
        const saveState = (val) => {
            Cookies.set(LIVECHAT_COOKIE, val, {path: '/'});
        };
        window.zE('webWidget:on', 'close', () => {
            saveState(0);
        });
        window.zE('webWidget:on', 'open', () => {
            saveState(1);
        });

        const agentAvailable =
            window.zE('webWidget:get', 'chat:department', INSTRUCTOR_CODE).status === 'online';
        if (agentAvailable) {
            window.zE('webWidget', 'updateSettings', {
                webWidget: {
                    launcher: {
                        chatLabel: {
                            '*': gettext('Have a question?'),
                        },
                    },
                    chat: {
                        suppress: false,
                    },
                },
            });
        } else {
            window.zE('webWidget', 'updateSettings', {
                webWidget: {
                    launcher: {
                        chatLabel: {
                            '*': gettext('Leave a message'),
                        },
                    },
                    chat: {
                        suppress: true,
                    },
                },
            });
        }
    }

    render() {
        return false;
    }
}
