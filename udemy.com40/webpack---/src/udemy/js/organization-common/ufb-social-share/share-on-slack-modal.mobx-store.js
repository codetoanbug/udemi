import {ToasterStore} from '@udemy/react-messaging-components';
import {udLink} from '@udemy/ud-data';
import {action, observable, computed} from 'mobx';

import udApi from 'utils/ud-api';

import {CONVERSATION_TYPES} from './constants';

export default class ShareOnSlackModalStore {
    @observable responseErrorMessage = '';
    @observable isLoading = false;
    @observable upperMessage = '';
    @observable destination = '';
    @observable notification = {displayed: false, message: '', type: 'success'};
    conversationType = '';

    constructor(globalOverrides = {gettext, interpolate}) {
        this.globalOverrides = globalOverrides;
    }

    @computed
    get isSubmitDisabled() {
        return this.isLoading;
    }

    clean() {
        this.clearDestination();
        this._setLoading(false);
        this.clearResponseErrorMessage();
        this.setUpperMessage('');
    }

    clearDestination() {
        this.setDestination('');
    }

    clearResponseErrorMessage() {
        this.setResponseErrorMessage('');
    }

    @action
    setUpperMessage(v) {
        this.upperMessage = v;
    }

    @action
    setDestination(v) {
        this.destination = v;
    }

    setConversationType(suggestion) {
        if (suggestion.is_user) {
            this.conversationType = CONVERSATION_TYPES.DIRECT_MESSAGE;
        } else if (suggestion.is_channel) {
            if (suggestion.is_private) {
                this.conversationType = CONVERSATION_TYPES.PRIVATE_CHANNEL;
            } else {
                this.conversationType = CONVERSATION_TYPES.PUBLIC_CHANNEL;
            }
        }
    }

    @action
    setResponseErrorMessage(v) {
        this.responseErrorMessage = v;
    }

    share(params) {
        this._setLoading(true);

        const url = '/share/slack/share/';

        const qParams = {
            resource_id: params.resourceId,
            resource_type: params.resourceType,
            upper_message: this.upperMessage,
            destination: this.destination,
            context: params.context,
            conversation_type: this.conversationType,
        };

        return udApi
            .post(url, qParams)
            .then(
                action(() => {
                    this._setLoading(false);
                }),
            )
            .catch(
                action((res) => {
                    const {gettext, interpolate} = this.globalOverrides;
                    let error = '';

                    if (res.response.status === 403) {
                        error = gettext('Reauthorize your Slack, please');
                    } else if (res.response.status === 404) {
                        if (res.response.data.error === 'is_archived') {
                            error = gettext("Sorry, you can't post to archived channels");
                        } else {
                            error = gettext('Channel or member not found');
                        }
                    } else {
                        error = interpolate(
                            gettext(
                                'Sorry, an unexpected error occurred. Our engineering team has been notified so we can investigate. ' +
                                    'Please try again, or <a %(anchorAttrs)s>contact our support team</a> ' +
                                    'if you want to be notified when the problem has been resolved.',
                            ),
                            {
                                anchorAttrs: `href="${udLink.toSupportContact()}" target="_blank"`,
                            },
                            true,
                        );
                    }

                    this.setResponseErrorMessage(error);
                    this._setLoading(false);
                    throw new Error(error);
                }),
            );
    }

    showNotification = (message, type = 'success') => {
        this.toastId = ToasterStore.addAlertBannerToast(
            {
                udStyle: type,
                title: message,
                showCta: false,
            },
            {
                autoDismiss: true,
            },
        );
    };

    hideNotification = () => {
        ToasterStore.dismissToast(this.toastId);
    };

    @action
    _setLoading(loading) {
        this.isLoading = loading;
    }
}
