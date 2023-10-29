import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import ScheduleIcon from '@udemy/icons/dist/schedule.ud-icon';
import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {BlockList, Button} from '@udemy/react-core-components';

import {EventInfo, EventInfoStore} from '../lib/event-info.mobx-model';
import {EventStatus} from '../tracker/constants';
import {TrackerDebuggerStore} from './tracker-debugger.mobx-store';
import styles from './tracker-debugger.module.less';

const gettext = (t: string) => t;

export const statusIcons = {
    [EventStatus.WAITING]: {
        label: 'Waiting',
        statusIcon: <ScheduleIcon label={gettext('Waiting')} color="neutral" />,
        textStyle: 'subdued',
    },
    [EventStatus.FAILURE]: {
        label: 'Failure',
        statusIcon: <ErrorIcon label={gettext('Failure')} color="negative" />,
        textStyle: 'negative',
    },
    [EventStatus.SUCCESS]: {
        label: 'Success',
        statusIcon: <SuccessIcon label={gettext('Success')} color="positive" />,
        textStyle: 'positive',
    },
    [EventStatus.BEACON_SENT]: {
        label: 'Sent with Beacon API',
        statusIcon: <SuccessIcon label={gettext('Sent with Beacon API')} color="neutral" />,
        textStyle: 'subdued',
    },
};

const beaconInformative =
    'This event was sent with Beacon API on a tab change. ' +
    "Beacon API doesn't expose server responses. " +
    "If you want to see the response from Collector, don't switch tabs until this event is sent.";

interface ItemWrapperProps {
    eventInfo: EventInfo;
    store: TrackerDebuggerStore;
}

@observer
export class ItemWrapper extends Component<ItemWrapperProps> {
    @autobind
    toggleFocus() {
        // Focus is implemented on Javascript while hover is controlled with CSS
        // Preferred this way because focus on buttons does not work on Firefox:
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
        const {eventInfo, store} = this.props;
        const id = eventInfo.event.eventId;
        if (store.focusedItemId === id) {
            store.setFocusedItemId(null);
        } else {
            store.setFocusedItemId(id);
        }
    }

    @autobind
    resetFocus() {
        // We're removing the focus when another element is hovered
        const {eventInfo, store} = this.props;
        const id = eventInfo.event.eventId;
        if (store.focusedItemId && store.focusedItemId !== id) {
            store.setFocusedItemId(null);
        }
    }

    render() {
        const {eventInfo, store} = this.props;
        const {event, status, failureReason} = eventInfo;
        const {label, textStyle, statusIcon} = statusIcons[status as EventStatus];

        return (
            <BlockList.Item
                componentClass="button"
                data-testid="blocklist-item"
                className={classNames(
                    'blocklist-item',
                    styles['blocklist-item'],
                    event.eventId === store.focusedItemId ? `${styles.focused} focused` : '',
                )}
                style={{userSelect: 'text'}}
                icon={statusIcon}
                onClick={this.toggleFocus}
                onMouseEnter={this.resetFocus}
            >
                <span className={classNames('ud-heading-sm', styles.subdued, styles['item-text'])}>
                    {event.getType()}
                </span>
                <div className={classNames(styles.panel, styles['tooltip-panel'], 'tooltip-panel')}>
                    <div className={classNames('ud-heading-md', textStyle)}>
                        {`${label}: ${event.getType()}`}
                    </div>
                    {failureReason && <h4>{failureReason}</h4>}
                    {status === EventStatus.BEACON_SENT && (
                        <pre className={classNames('ud-text-xs', styles['tooltip-panel-body'])}>
                            {beaconInformative}
                        </pre>
                    )}
                    <pre className={classNames('ud-text-xs', styles['tooltip-panel-body'])}>
                        {JSON.stringify(event, null, 4)}
                    </pre>
                </div>
            </BlockList.Item>
        );
    }
}

interface TrackerDebuggerProps {
    eventInfoStore: EventInfoStore;
    isMobile?: boolean;
}

@observer
export class TrackerDebugger extends Component<TrackerDebuggerProps> {
    // Limit events in order not to fill the screen

    static MAX_EVENTS_TO_SHOW_DESKTOP = 15;
    static MAX_EVENTS_TO_SHOW_MOBILE = 5;
    MAX_EVENTS_TO_SHOW: number;

    constructor(props: TrackerDebuggerProps) {
        super(props);
        this.store = new TrackerDebuggerStore();
        this.MAX_EVENTS_TO_SHOW =
            this.props.isMobile === true
                ? TrackerDebugger.MAX_EVENTS_TO_SHOW_MOBILE
                : TrackerDebugger.MAX_EVENTS_TO_SHOW_DESKTOP;
    }

    readonly store: TrackerDebuggerStore;

    render() {
        if (!this.store.isEnabled) {
            return null;
        }

        const {eventInfoStore} = this.props;

        return (
            <div
                data-testid="tracker-debugger"
                className={classNames(
                    styles.panel,
                    styles['debugger-panel'],
                    this.store.isInvertedPosition
                        ? styles['left-debugger-panel']
                        : styles['right-debugger-panel'],
                )}
            >
                <div className={styles['debugger-panel-header']}>
                    <Button
                        onClick={this.store.invertPosition}
                        udStyle="secondary"
                        size="small"
                        className={styles.control}
                    >
                        {this.store.isInvertedPosition ? (
                            <NextIcon
                                color="inherit"
                                size="medium"
                                label={gettext('Invert position')}
                            />
                        ) : (
                            <PreviousIcon
                                color="inherit"
                                size="medium"
                                label={gettext('Invert position')}
                            />
                        )}
                    </Button>

                    <Button
                        onClick={eventInfoStore.clearEvents}
                        udStyle="secondary"
                        size="small"
                        className={styles.control}
                    >
                        <DeleteIcon color="inherit" size="medium" label={gettext('Clear events')} />
                    </Button>

                    <Button
                        onClick={this.store.disable}
                        udStyle="secondary"
                        size="small"
                        className={styles.control}
                    >
                        <CloseIcon
                            color="inherit"
                            size="medium"
                            label={gettext('Close debugger')}
                        />
                    </Button>
                </div>

                <BlockList
                    className={classNames(styles['debugger-panel-body'], 'debugger-panel-body')}
                    size="small"
                >
                    {eventInfoStore.eventInfos.slice(-this.MAX_EVENTS_TO_SHOW).map((eventInfo) => {
                        return (
                            <ItemWrapper
                                key={eventInfo.event.eventId}
                                eventInfo={eventInfo}
                                store={this.store}
                            />
                        );
                    })}
                </BlockList>
            </div>
        );
    }
}
