import {getUniqueId, Keys} from '@udemy/design-system-utils';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {ReactNode} from 'react';

import {FormGroup} from '../form-group/form-group.react-component';
import {Select} from '../select/select.react-component';
import styles from './date-picker-calendar.module.less';
import {isSameDate, roundDate} from './helpers';

interface WithTimeStamp {
    dataset: {timestamp: string};
}

/**
 * Props for `DatePickerCalendar` component
 *
 * @internal
 */
interface DatePickerCalendarProps {
    /**
     * Month to display in the calendar dialog
     */
    selectedMonth: Date;
    /**
     * Event fired when the user chooses a different month
     */
    onSelectMonth: (date: Date) => void;
    /**
     * Date to pre-select when the dialog opens
     */
    selectedDate?: Date | null;
    /**
     * Event fired when the use selects a date
     */
    onSelectDate: (date: Date) => void;
    /**
     * Callback function to test date validity
     */
    isValidDate: (date: Date, precision: 'MONTH' | 'DAY') => boolean;
    /**
     * Minimum valid date used by `isValidDate`.
     *
     * @remarks
     * This prop is not used directly here. It is required because if the minimum valid
     * date for the `DatePicker` changed, then the dates in this component would need to
     * be re-validated.
     */
    minDate?: Date | null;
    /**
     * Maximum valid date used by `isValidDate`.
     *
     * @remarks
     * This prop is not used directly here. It is required because if the maximum valid
     * date for the `DatePicker` changed, then the dates in this component would need to
     * be re-validated.
     */
    maxDate?: Date | null;
    /**
     * Today
     */
    today: Date;
    /**
     * Locale for rendering months
     *
     * @privateRemarks
     * This is named `calendarLocale` instead of `locale` to avoid colliding with the
     * prop supplied by `withI18n`.
     */
    calendarLocale: Parameters<Date['toLocaleDateString']>[0];
}

/**
 * Custom calendar dialog for selecting a date.
 *
 * @remarks
 * This component is rendered by `DatePicker` when it does not render a native browser
 * date picker.
 *
 * @internal
 */
@observer
class DatePickerCalendarBase extends React.Component<DatePickerCalendarProps & WithI18nProps> {
    static displayName = 'DatePickerCalendar';
    static defaultProps = {
        selectedDate: null,
        minDate: null,
        maxDate: null,
    };

    constructor(props: DatePickerCalendarProps & WithI18nProps) {
        super(props);
        this.gettext = props.gettext;
        this.pgettext = props.pgettext;
        this.daysOfMonthRef = React.createRef();
        this.monthSelectorId = getUniqueId('date-picker-calendar-month-selector');
        this.monthSelectorStatusId = getUniqueId('date-picker-calendar-month-selector-status');
    }

    componentDidUpdate() {
        if (this.shouldFocusOnSelectedDay) {
            // Focus on the selected day after selecting it via keyboard.
            const button = this.daysOfMonthRef.current?.querySelector(
                '[data-selected="true"]',
            ) as HTMLButtonElement;
            button?.focus();
            this.shouldFocusOnSelectedDay = false;
        }
    }

    private readonly gettext: WithI18nProps['gettext'];
    private readonly pgettext: WithI18nProps['pgettext'];
    daysOfMonthRef: React.RefObject<HTMLDivElement>;
    readonly monthSelectorId: string;
    readonly monthSelectorStatusId: string;
    shouldFocusOnSelectedDay = false;

    @observable selectedMonthStatus = '';

    @action announceSelectedMonthStatus(month: Date) {
        this.selectedMonthStatus = month.toLocaleDateString(this.props.calendarLocale, {
            year: 'numeric',
            month: 'long',
        });
    }

    @action clearSelectedMonthStatus() {
        this.selectedMonthStatus = '';
    }

    onChangeMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.clearSelectedMonthStatus();
        this.props.onSelectMonth(new Date(parseInt(event.target.value, 10)));
    };

    onClickMonthPager = (event: React.MouseEvent<HTMLButtonElement & WithTimeStamp>) => {
        const date = new Date(parseInt(event.currentTarget.dataset.timestamp, 10));
        this.announceSelectedMonthStatus(date);
        this.props.onSelectMonth(date);
    };

    onClickDate = (event: React.MouseEvent<HTMLButtonElement & WithTimeStamp>) => {
        this.clearSelectedMonthStatus();
        this.props.onSelectDate(new Date(parseInt(event.currentTarget.dataset.timestamp, 10)));
    };

    onKeyDown = (event: React.KeyboardEvent) => {
        const timestamp = (event.target as HTMLElement).dataset.timestamp;

        // Assert: timestamp always exists on event target
        if (timestamp) {
            const date = new Date(parseInt(timestamp, 10));

            if (event.keyCode === Keys.UP) {
                this.selectDayWithKeyboard(event, date, -7);
            } else if (event.keyCode === Keys.DOWN) {
                this.selectDayWithKeyboard(event, date, 7);
            } else if (event.keyCode === Keys.LEFT) {
                this.selectDayWithKeyboard(event, date, -1);
            } else if (event.keyCode === Keys.RIGHT) {
                this.selectDayWithKeyboard(event, date, 1);
            }
        }
    };

    private selectDayWithKeyboard = (event: React.KeyboardEvent, date: Date, delta: number) => {
        event.preventDefault();

        date.setDate(date.getDate() + delta);
        if (this.props.isValidDate(date, 'DAY')) {
            this.props.onSelectDate(date);
            this.shouldFocusOnSelectedDay = true;
        }
    };

    get monthSelector() {
        const selectedYear = this.props.selectedMonth.getFullYear();
        const selectedMonthIndex = this.props.selectedMonth.getMonth();
        const monthOptions: ReactNode[] = [];
        [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((monthIndex) => {
            const month = new Date(selectedYear, selectedMonthIndex + monthIndex, 1);
            if (this.props.isValidDate(month, 'MONTH')) {
                monthOptions.push(
                    <option key={month.getTime()} value={month.getTime()}>
                        {month.toLocaleDateString(this.props.calendarLocale, {
                            year: 'numeric',
                            month: 'long',
                        })}
                    </option>,
                );
            }
        });
        return (
            <FormGroup
                label={this.gettext('Select month')}
                labelProps={{className: 'ud-sr-only'}}
                formControlId={this.monthSelectorId}
                className={styles['month-select-group']}
            >
                <Select
                    size="medium"
                    className={styles['month-select']}
                    value={roundDate(this.props.selectedMonth, 'MONTH').getTime()}
                    onChange={this.onChangeMonth}
                >
                    {monthOptions}
                </Select>

                <div
                    id={this.monthSelectorStatusId}
                    className="ud-sr-only"
                    data-purpose="month-selector-status"
                    role="status"
                >
                    {this.selectedMonthStatus}
                </div>
            </FormGroup>
        );
    }

    get monthPager() {
        const selectedYear = this.props.selectedMonth.getFullYear();
        const selectedMonthIndex = this.props.selectedMonth.getMonth();
        const prevMonth = new Date(selectedYear, selectedMonthIndex - 1, 1);
        const nextMonth = new Date(selectedYear, selectedMonthIndex + 1, 1);
        const controlledIds = [this.monthSelectorId, this.monthSelectorStatusId].join(' ');
        return (
            <>
                <IconButton
                    size="medium"
                    udStyle="ghost"
                    data-timestamp={prevMonth.getTime()}
                    disabled={!this.props.isValidDate(prevMonth, 'MONTH')}
                    onClick={this.onClickMonthPager}
                    aria-controls={controlledIds}
                >
                    <PreviousIcon label={this.gettext('Previous month')} />
                </IconButton>
                <IconButton
                    size="medium"
                    udStyle="ghost"
                    data-timestamp={nextMonth.getTime()}
                    disabled={!this.props.isValidDate(nextMonth, 'MONTH')}
                    onClick={this.onClickMonthPager}
                    aria-controls={controlledIds}
                >
                    <NextIcon label={this.gettext('Next month')} />
                </IconButton>
            </>
        );
    }

    get daysOfWeek() {
        const days = [
            this.pgettext('Abbreviation for Sunday, two letters max', 'Su'),
            this.pgettext('Abbreviation for Monday, two letters max', 'Mo'),
            this.pgettext('Abbreviation for Tuesday, two letters max', 'Tu'),
            this.pgettext('Abbreviation for Wednesday, two letters max', 'We'),
            this.pgettext('Abbreviation for Thursday, two letters max', 'Th'),
            this.pgettext('Abbreviation for Friday, two letters max', 'Fr'),
            this.pgettext('Abbreviation for Saturday, two letters max', 'Sa'),
        ];
        return (
            <div className={styles['days-container']} aria-hidden="true">
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={classNames('ud-heading-xs', styles.day, styles['day-of-week'])}
                    >
                        {day}
                    </div>
                ))}
            </div>
        );
    }

    get daysOfMonth() {
        const selectedMonthIndex = this.props.selectedMonth.getMonth();

        // No matter the month, we always render 42 days: 7 days per week * 6 rows.
        // We pad with days from the previous and next month.
        const dates = [];

        let currentDate = this.props.selectedMonth;
        while (currentDate.getMonth() === selectedMonthIndex || dates[0].getDay() > 0) {
            dates.unshift(currentDate);
            currentDate = new Date(currentDate.getTime());
            currentDate.setDate(currentDate.getDate() - 1);
        }

        currentDate = new Date(this.props.selectedMonth.getTime());
        currentDate.setDate(currentDate.getDate() + 1);
        while (dates.length < 42) {
            dates.push(currentDate);
            currentDate = new Date(currentDate.getTime());
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return (
            <div
                ref={this.daysOfMonthRef}
                className={styles['days-container']}
                onKeyDown={this.onKeyDown}
                data-purpose="days-of-month"
            >
                {dates.map((date) => (
                    <Button
                        key={date.getTime()}
                        size="medium"
                        udStyle="link"
                        typography="ud-text-sm"
                        className={classNames(styles.day, styles['day-of-month'], {
                            today: isSameDate(date, this.props.today),
                            [styles['inactive-day']]: date.getMonth() !== selectedMonthIndex,
                        })}
                        data-selected={isSameDate(date, this.props.selectedDate) ? 'true' : null}
                        data-timestamp={date.getTime()}
                        disabled={!this.props.isValidDate(date, 'DAY')}
                        onClick={this.onClickDate}
                        aria-label={date.toLocaleDateString(this.props.calendarLocale, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                        aria-pressed={isSameDate(date, this.props.selectedDate)}
                    >
                        {date.getDate()}
                    </Button>
                ))}
            </div>
        );
    }

    render() {
        return (
            <>
                <div className={styles['calendar-month']}>
                    {this.monthSelector}
                    {this.monthPager}
                </div>
                <div className={styles['calendar-days']}>
                    {this.daysOfWeek}
                    {this.daysOfMonth}
                </div>
            </>
        );
    }
}

export const DatePickerCalendar = withI18n(DatePickerCalendarBase);
