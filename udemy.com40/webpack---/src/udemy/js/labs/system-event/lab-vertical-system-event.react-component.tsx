import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import React from 'react';

import {NOTIFICATION_LEVELS} from './constants';
import {LabSystemEventMessage} from './lab-system-event-message.react-component';
import {LabVerticalSystemEventStore} from './lab-vertical-system-event.mobx-store';

import './lab-vertical-system-event.less';

interface LabVerticalSystemEventProps {
    store: LabVerticalSystemEventStore;
    layout: 'banner' | 'notification';
}

@observer
export class LabVerticalSystemEvent extends React.Component<LabVerticalSystemEventProps> {
    @autobind
    async handleDismiss() {
        const {activeMessage, markMessageAsSeen} = this.props.store;
        if (activeMessage && !activeMessage.is_permanent) {
            await markMessageAsSeen(activeMessage.uuid);
        }
    }

    render() {
        const {activeMessage} = this.props.store;
        if (!activeMessage || activeMessage.is_launch_disabled) {
            return null;
        }
        const {title, description, url, is_permanent: isPermanent} = activeMessage;
        const level = activeMessage.level as keyof typeof NOTIFICATION_LEVELS;
        const messageLevel = NOTIFICATION_LEVELS[level] || NOTIFICATION_LEVELS[0];
        return (
            <div styleName={`container--${this.props.layout}`}>
                <LabSystemEventMessage
                    level={messageLevel}
                    title={title}
                    description={description}
                    url={url}
                    isPermanent={isPermanent}
                    onDismiss={this.handleDismiss}
                />
            </div>
        );
    }
}
