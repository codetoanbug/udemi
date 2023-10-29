import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {I18nApi, LocalizedHtml} from '@udemy/i18n';
import {withI18n} from '@udemy/i18n';
import {Duration} from '@udemy/react-date-time-components';
import {safelySetInnerHTML} from '@udemy/shared-utils';

import styles from './smart-bar.module.less';

const SECONDS_PER_DAY = 60 * 60 * 24;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SmartBarHeadline = ({smartBarStore}: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onClick = (e: any) => {
        if (e.target?.tagName === 'A') {
            const url = e.target.href;
            const location = 'copy_url';
            smartBarStore.sendClickEvent(url, location);
        }
    };

    const copy = (
        <span onClick={onClick} role="presentation" data-testid="smart-bar-copy">
            <span
                className={classNames(
                    'ud-text-bold ud-text-with-links',
                    styles['smart-bar__title'],
                )}
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'basic:smart-bar-title',
                    html: smartBarStore.data.get('title'),
                    dataPurpose: 'smart-bar-title',
                    domPurifyConfig: {ADD_ATTR: ['target']},
                })}
            />
            <span
                className="ud-text-with-links"
                role="presentation"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'basic:smart-bar-subtitle',
                    html: smartBarStore.data.get('subtitle'),
                    dataPurpose: 'smart-bar-subtitle',
                    domPurifyConfig: {ADD_ATTR: ['target']},
                })}
            />
        </span>
    );

    const url = smartBarStore.data.get('action_url');
    if (url) {
        const onClick = () => {
            smartBarStore.sendClickEvent();
        };

        return (
            <a onClick={onClick} data-testid="smart-bar-action-url" href={url}>
                {copy}
            </a>
        );
    }

    return copy;
};

SmartBarHeadline.displayName = 'SmartBarHeadline';

export interface SmartBarTimerProps extends I18nApi {
    endTime: string;
    shouldShowSeconds: boolean;
    daysToShowTimer: number;
}

@observer
class InternalSmartBarTimer extends Component<SmartBarTimerProps> {
    static defaultProps = {
        shouldShowSeconds: true,
        daysToShowTimer: 3,
    };

    displayName = 'SmartBarTimer';

    tickHandler: NodeJS.Timer | null = null;

    @observable remainingSeconds;
    COUNTDOWN_PERIOD_THRESHOLD = 60 * 60 * 24;

    constructor(props: SmartBarTimerProps) {
        super(props);
        this.remainingSeconds = (Date.parse(this.props.endTime) - Date.now()) / 1000;
    }

    componentDidMount() {
        if (0 < this.remainingSeconds && this.remainingSeconds <= this.COUNTDOWN_PERIOD_THRESHOLD) {
            this.tickHandler = setInterval(() => {
                this.decrementRemainingTime();
            }, 1000);
        }
    }

    componentWillUnmount() {
        if (this.tickHandler !== null) {
            clearInterval(this.tickHandler);
        }
    }

    @action
    decrementRemainingTime() {
        if (this.remainingSeconds < 1 && this.tickHandler) {
            clearInterval(this.tickHandler);
        } else {
            this.remainingSeconds -= 1;
        }
    }

    render() {
        // if small, show countdown (with or without seconds)
        // if in the middle, show 'X days'
        // if greater than daysToShowTimer, show nothing
        const remainingDays = Math.floor(this.remainingSeconds / SECONDS_PER_DAY);
        let timeRemainingContent;

        if (0 < this.remainingSeconds && this.remainingSeconds <= this.COUNTDOWN_PERIOD_THRESHOLD) {
            const precision = this.props.shouldShowSeconds
                ? Duration.PRECISION.SECONDS
                : Duration.PRECISION.MINUTES;
            const durationComponent = (
                <Duration
                    data-testid="timer-countdown"
                    numSeconds={this.remainingSeconds}
                    precision={precision}
                    presentationStyle={Duration.STYLE.HUMAN_COMPACT}
                />
            );
            timeRemainingContent = (
                <LocalizedHtml
                    html={this.props.gettext('Ends in <span class="time">time</span>.')}
                    interpolate={{time: durationComponent}}
                />
            );
        } else if (
            this.COUNTDOWN_PERIOD_THRESHOLD < this.remainingSeconds &&
            remainingDays <= this.props.daysToShowTimer
        ) {
            timeRemainingContent = (
                <span data-testid="timer-x-days-left">
                    {this.props.ninterpolate(
                        '%(remainingDays)s day left!',
                        '%(remainingDays)s days left!',
                        remainingDays,
                        {remainingDays},
                    )}
                </span>
            );
        } else {
            return null;
        }
        return (
            <span
                className={classNames('ud-heading-sm', styles['smart-bar-timer'])}
                data-testid="smart-bar-timer"
            >
                {timeRemainingContent}
            </span>
        );
    }
}

const SmartBarTimer = withI18n(InternalSmartBarTimer);

export interface BasicBarContentProps {
    /**
     * This className must be used on the top-level node of extension component.
     * It allows the component to take up the entire available width of the bar.
     */
    className: string;
    /** SmartBarStore api */
    // smartBarStore: PropTypes.object.isRequired,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    smartBarStore: any;
    /** the object available at smartBarStore.membership */
    // membership: MobxTypes.observableMap.isRequired,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    membership: any;
}

/*
 * This is the basic "bar content component". New bar types with extended behavior or stores
 * should copy & modify this basic component.
 */
const BasicBarContentComponent = ({className, smartBarStore, membership}: BasicBarContentProps) => {
    return (
        <div className={className}>
            <div
                className={classNames('ud-text-sm', styles['basic-bar-content'])}
                data-testid="basic-with-timer"
            >
                <SmartBarHeadline smartBarStore={smartBarStore} />
                {smartBarStore.data.get('enable_timer') && membership.get('end_time') && (
                    <>
                        {' '}
                        {/* This space separates the main text from the countdown */}
                        <SmartBarTimer
                            endTime={membership.get('end_time')}
                            shouldShowSeconds={smartBarStore.data.get('enable_seconds_in_timer')}
                            daysToShowTimer={smartBarStore.data.get('days_to_show_timer')}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

BasicBarContentComponent.displayName = 'BasicBarContent';

export const BasicBarContent = observer(BasicBarContentComponent);
