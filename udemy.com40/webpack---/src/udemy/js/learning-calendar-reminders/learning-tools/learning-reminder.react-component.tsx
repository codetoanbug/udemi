import {LocalizedHtml} from '@udemy/i18n';
import Calendar30Icon from '@udemy/icons/dist/calendar-30.ud-icon';
import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import LifetimeIcon from '@udemy/icons/dist/lifetime.ud-icon';
import {Duration} from '@udemy/react-date-time-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import getRequestData from 'utils/get-request-data';

import './learning-tools.less';
import {GoogleCalendarAuthStore} from '../calendar-button/google-calendar-auth.mobx-store';
import {BY_DAY_NAMES} from '../constants';
import {LearningReminderFormStore} from '../learning-reminder-form/learning-reminder-form.mobx-store';
import {UserLearningCalendarReminderType} from '../types';
import {uppercaseFirstChar} from '../utils';
import {GoogleReminderActionMenu} from './google-reminder-action-menu.react-component';
import {IcsReminderActionMenu} from './ics-reminder-action-menu.react-component';
import {LearningToolsStore} from './learning-tools.mobx-store';

interface LearningReminderProps {
    learningReminder: UserLearningCalendarReminderType;
    learningToolsStore: LearningToolsStore;
    googleAuthStore: GoogleCalendarAuthStore;
}

@observer
export class LearningReminder extends Component<LearningReminderProps> {
    constructor(props: LearningReminderProps) {
        super(props);
        this.formStore = new LearningReminderFormStore(
            this.props.googleAuthStore,
            false,
            true,
            this.props.learningReminder.id,
        );
        this.formStore.setFormFields(this.props.learningReminder);
        this.formStore.setDownloaded(true);

        const udRequest = getRequestData();
        this.userLocale = udRequest.locale ? udRequest.locale.replace('_', '-') : 'en-US';
    }

    formStore: LearningReminderFormStore;
    userLocale: string;

    get syncedWithCalendarText() {
        const {learningReminder} = this.props;
        if (learningReminder.is_deleted) {
            return gettext('Not added to your calendar');
        }

        const text = gettext('Added to %(calendarType)s');
        const calendarType =
            learningReminder.calendar_type === 'other'
                ? 'your calendar'
                : `${uppercaseFirstChar(learningReminder.calendar_type)} Calendar`;
        return interpolate(
            text,
            {
                calendarType,
            },
            true,
        );
    }

    get frequency() {
        const {learningReminder} = this.props;
        let days;
        const frequency = learningReminder.frequency;
        if (frequency) {
            switch (frequency.toLowerCase()) {
                case 'once':
                    return new Date(learningReminder.start_time).toLocaleDateString(
                        this.userLocale,
                        {
                            month: 'long',
                            year: 'numeric',
                            day: 'numeric',
                        },
                    );
                case 'daily':
                    return gettext('Daily');
                case 'weekly':
                    days = this.getWeekdays();
                    if (days !== '') {
                        return interpolate(
                            gettext('Weekly on %(days)s'),
                            {
                                days,
                            },
                            true,
                        );
                    }
                    return null;
                case 'monthly':
                    return this.getMonthOption();
            }
        }
    }

    @autobind
    getWeekdays() {
        let days = '';
        const weekDays = this.props.learningReminder.by_day?.split(',');

        weekDays?.forEach((day: string) => {
            if (days === '') {
                days += BY_DAY_NAMES[day];
            } else {
                days += `, ${BY_DAY_NAMES[day]}`;
            }
        });
        return days;
    }

    getMonthOption() {
        const {learningReminder} = this.props;
        if (learningReminder.by_month_day) {
            return interpolate(
                gettext('Monthly on day %(monthDay)s'),
                {
                    monthDay: learningReminder.by_month_day,
                },
                true,
            );
        }

        if (learningReminder.by_week_num && learningReminder.by_day) {
            const weekDay = BY_DAY_NAMES[learningReminder.by_day];
            return interpolate(
                gettext('Monthly on week %(weekNum)s on %(weekDay)s'),
                {
                    weekNum: learningReminder.by_week_num,
                    weekDay,
                },
                true,
            );
        }
    }

    get notification() {
        const notificationTimebefore = this.props.learningReminder.notification_time_before;
        if (notificationTimebefore > 0) {
            const reminderTime = notificationTimebefore * 60;

            return (
                <LocalizedHtml
                    style={{display: 'block'}}
                    html={gettext(
                        'Reminder notification <span class="duration">%(duration)s</span> before',
                    )}
                    interpolate={{
                        duration: (
                            <Duration
                                numSeconds={reminderTime}
                                precision={Duration.PRECISION.HOURS}
                            />
                        ),
                    }}
                />
            );
        }
    }

    get time() {
        return (
            <LocalizedHtml
                style={{display: 'block'}}
                html={interpolate(
                    gettext('<span class="duration">%(duration)s</span> at %(startTime)s'),
                    {startTime: this.getStartTime()},
                    true,
                )}
                interpolate={{
                    duration: this.getDuration(),
                    startTime: this.getStartTime(),
                }}
            />
        );
    }

    @autobind
    getStartTime() {
        return new Date(this.props.learningReminder.start_time).toLocaleTimeString(
            this.userLocale,
            {
                hour: 'numeric',
                minute: '2-digit',
            },
        );
    }

    @autobind
    getDuration() {
        const {learningReminder} = this.props;
        const startDatetime = new Date(learningReminder.start_time);
        const endDatetime = new Date(learningReminder.end_time);
        const seconds = (endDatetime.getTime() - startDatetime.getTime()) / 1000;
        return <Duration numSeconds={seconds} precision={Duration.PRECISION.MINUTES} />;
    }

    get until() {
        if (!this.props.learningReminder.until) {
            return null;
        }
        const untilDate = new Date(this.props.learningReminder.until);
        const untilDateString = new Date(untilDate).toLocaleDateString(this.userLocale, {
            month: 'long',
            year: 'numeric',
            day: 'numeric',
        });

        return interpolate(
            gettext('Until %(date)s'),
            {
                date: untilDateString,
            },
            true,
        );
    }

    render() {
        const {learningReminder} = this.props;

        const actionMenu =
            learningReminder.calendar_type.toLowerCase() === 'google' ? (
                <GoogleReminderActionMenu
                    learningToolsStore={this.props.learningToolsStore}
                    formStore={this.formStore}
                />
            ) : (
                <IcsReminderActionMenu
                    learningToolsStore={this.props.learningToolsStore}
                    formStore={this.formStore}
                />
            );

        return (
            <div styleName="learning-reminder-container">
                <Calendar30Icon styleName="icon" size="medium" label={false} />
                <div>
                    <h4 className="ud-heading-md" styleName="title">
                        {learningReminder.title}
                    </h4>
                    <div>{learningReminder.object_title}</div>
                    <div>{this.frequency}</div>
                    <div>{this.notification}</div>
                    <div>{this.time}</div>
                    <div>{this.until}</div>
                    <div>
                        {!learningReminder.is_deleted ? (
                            <span styleName="icon-container">
                                <LifetimeIcon styleName="icon" size="small" label={false} />
                            </span>
                        ) : (
                            <span styleName="icon-container">
                                <ErrorIcon styleName="icon" size="small" label={false} />
                            </span>
                        )}
                        {this.syncedWithCalendarText}
                    </div>
                </div>
                {!learningReminder.is_deleted && actionMenu}
            </div>
        );
    }
}
