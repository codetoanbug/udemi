import {LocalizedHtml} from '@udemy/i18n';
import Calendar30Icon from '@udemy/icons/dist/calendar-30.ud-icon';
import LifetimeIcon from '@udemy/icons/dist/lifetime.ud-icon';
import {Duration} from '@udemy/react-date-time-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getRequestData from 'utils/get-request-data';

import {custom, DURATION, durationValues, FULL_DAY_NAME} from '../constants';
import {lowercaseFirstChar, uppercaseFirstChar} from '../utils';
import './learning-reminder-form.less';
import {LearningReminderFormStore} from './learning-reminder-form.mobx-store';

interface ReminderInfoProps {
    store: LearningReminderFormStore;
}

@observer
export class ReminderInfo extends Component<ReminderInfoProps> {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    constructor(props: ReminderInfoProps) {
        super(props);
        const udRequest = getRequestData();
        this.userLocale = udRequest.locale ? udRequest.locale.replace('_', '-') : 'en-US';
    }

    private userLocale: string;

    get syncedWithCalendarText() {
        if (!this.props.store.calendarType) {
            return gettext('Not yet added to your calendar');
        }

        const text = gettext('Added to %(calendarType)s');
        const calendarType =
            this.props.store.calendarType === 'other'
                ? 'your calendar'
                : `${uppercaseFirstChar(this.props.store.calendarType)} Calendar`;
        return interpolate(
            text,
            {
                calendarType,
            },
            true,
        );
    }

    get frequency() {
        const {formFields} = this.props.store;
        let days;
        const frequency = formFields.frequency.value;
        if (frequency) {
            switch (frequency.toLowerCase()) {
                case 'once':
                    if (formFields.onceDate.value) {
                        return new Date(formFields.onceDate.value).toLocaleDateString(
                            this.userLocale,
                            {
                                month: 'long',
                                year: 'numeric',
                                day: 'numeric',
                            },
                        );
                    }
                    return null;
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
                    if (formFields.selectedMonthOptionText.value) {
                        return interpolate(
                            gettext('Monthly on %(monthOption)s'),
                            {
                                monthOption: lowercaseFirstChar(
                                    formFields.selectedMonthOptionText.value,
                                ),
                            },
                            true,
                        );
                    }
            }
        }
    }

    @autobind
    getWeekdays() {
        let days = '';
        this.props.store.formFields.selectedDays.value.forEach(
            (selectedDay: boolean, ndx: number) => {
                if (selectedDay) {
                    if (days === '') {
                        days += FULL_DAY_NAME[ndx]();
                    } else {
                        days += `, ${FULL_DAY_NAME[ndx]()}`;
                    }
                }
            },
        );
        return days;
    }

    get notification() {
        const {formFields} = this.props.store;
        if (formFields.reminderTime.value > 0) {
            let reminderTime = formFields.reminderTime.value * 60;
            if (formFields.reminderTimeUnit.value === 'hours') {
                reminderTime = formFields.reminderTime.value * 60 * 60;
            } else if (formFields.reminderTimeUnit.value === 'days') {
                reminderTime = formFields.reminderTime.value * 60 * 60 * 24;
            }

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
        const {formFields} = this.props.store;
        if (formFields.duration.value && formFields.startTime.value) {
            const startTime = formFields.startDatetime.value.toLocaleTimeString(this.userLocale, {
                hour: 'numeric',
                minute: '2-digit',
            });
            return (
                <LocalizedHtml
                    style={{display: 'block'}}
                    html={interpolate(
                        gettext('<span class="duration">%(duration)s</span> at %(startTime)s'),
                        {startTime},
                        true,
                    )}
                    interpolate={{
                        duration: this.getDuration(),
                        startTime,
                    }}
                />
            );
        }
    }

    @autobind
    getDuration() {
        const {duration, customDuration, customDurationUnit} = this.props.store.formFields;
        if (duration.value !== custom()) {
            return DURATION[durationValues().indexOf(Number(duration.value))]();
        }
        if (customDuration.value && customDuration.value !== '') {
            return `${customDuration.value} ${customDurationUnit.value}`;
        }
        return custom();
    }

    get until() {
        const {formFields} = this.props.store;
        const untilDate = formFields.untilDate.value;
        if (untilDate && untilDate instanceof Date) {
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
    }

    render() {
        const {formFields} = this.props.store;
        return (
            <div styleName="reminder-info">
                <Calendar30Icon styleName="icon" size="medium" label={false} />
                <div>
                    <h4 className="ud-heading-md">{formFields.title.value}</h4>
                    <div>{formFields.selectedContentObject.value.title}</div>
                    <div>{this.frequency}</div>
                    <div>{this.notification}</div>
                    <div>{this.time}</div>
                    <div>{this.until}</div>
                    <div>
                        <span styleName="icon-container">
                            <LifetimeIcon styleName="icon" size="small" label={false} />
                        </span>
                        {this.syncedWithCalendarText}
                    </div>
                </div>
            </div>
        );
    }
}
