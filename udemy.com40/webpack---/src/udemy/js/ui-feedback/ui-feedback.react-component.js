import {ToasterStore, Toaster} from '@udemy/react-messaging-components';
import {action, autorun} from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';

import feedbackQueue from './feedback-queue';
import {onToastImpressionEvent} from './toast-events';

export default class UIFeedback extends React.Component {
    static propTypes = {
        uiMessages: PropTypes.array,
    };

    static defaultProps = {
        uiMessages: [],
    };

    componentDidMount() {
        this.props.uiMessages.forEach((uiMessage) => {
            const {impressionUseCase, ...props} = uiMessage;
            ToasterStore.addAlertBannerToast(props, {
                autoDismiss: true,
                impressionUseCase,
                onToastImpression: onToastImpressionEvent,
            });
        });

        this.digestQueueDisposer = autorun(() => {
            while (feedbackQueue.feedbacks.length > 0) {
                this.feedToaster();
            }
        });
    }

    componentWillUnmount() {
        this.digestQueueDisposer && this.digestQueueDisposer();
    }

    @action feedToaster() {
        const {alertBannerProps, toastOptions} = feedbackQueue.feedbacks.shift();
        ToasterStore.addAlertBannerToast(alertBannerProps, {
            onToastImpression: onToastImpressionEvent,
            ...toastOptions,
        });
    }

    render() {
        return <Toaster />;
    }
}
