import {getUniqueId} from '@udemy/design-system-utils';
import {withMatchMedia} from '@udemy/hooks';
import {
    omitI18nProps,
    withI18n,
    WithI18nProps,
    parseDateString,
    toLocalDateStamp,
} from '@udemy/i18n';
import Calendar30Icon from '@udemy/icons/dist/calendar-30.ud-icon';
import {Button} from '@udemy/react-core-components';
import {BasicPopover, Popover} from '@udemy/react-popup-components';
import classNames from 'classnames';
import {action, computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React, {ReactNode} from 'react';

import {CompactFormGroup} from '../form-group-variants/compact-form-group.react-component';
import {checkFormGroup} from '../form-group/check-form-group';
import {BaseFormGroup} from '../form-group/form-group.react-component';
import {TextInput, TextInputProps} from '../text-input/text-input.react-component';
import {DatePickerCalendar} from './date-picker-calendar.react-component';
import styles from './date-picker.module.less';
import {isSameDate, roundDate} from './helpers';

/**
 * Props for DatePicker component.
 *
 * @remarks
 * Properties not specific to `DatePicker` are passed through to `TextInput`.
 */
export interface DatePickerProps
    extends Omit<TextInputProps, 'defaultValue' | 'onChange' | 'max' | 'min' | 'value'> {
    /**
     * The date specified by the date picker when it is first rendered
     *
     * @remarks
     * Updates to this prop after the initial render are ignored.
     */
    defaultValue?: Date;
    /**
     * The date specified by the date picker.
     *
     * @defaultValue null
     * @remarks
     * Setting this prop allows consumers to use this component as a controlled component.
     */
    value?: Date | null;
    /**
     * The earliest valid date that can be selected or specified by the date picker. `'TODAY'` will use the date when the constructor is called.
     */
    min?: Date | 'TODAY' | null;
    /**
     * The latest valid date that can be selected or specified by the date picker
     */
    max?: Date | null;
    /**
     * Set the month that is displayed when the calendar dialog opens
     */
    selectedMonth?: Date | null;
    /**
     * Event fired when the value of the input field changes, either directly by the user or through the calendar dialog
     */
    onChange?: (date: Date | null) => void;
    /**
     * Event fired when the month to display on the calendar dialog is set through props or updated in the calendar dialog
     */
    onChangeSelectedMonth?: (date: Date | null | undefined) => void;
    /**
     * Event fired if calendar dialog toggles open or closed
     */
    onCloseCalendar?: () => void;
    /**
     * Popover component used to render non-native calendar dialog
     *
     * @defaultValue `BasicPopover` in `DatePicker`
     */
    popoverComponentClass?: typeof BasicPopover | typeof Popover;
    /**
     * Position of the calendar dialog relative to the input field
     *
     * @defaultValue 'bottom-start' in `DatePicker`
     */
    popoverPlacement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
    /**
     * Internally used to access the parent FormGroup; don't pass it yourself.
     */
    $$udFormGroup?: BaseFormGroup;
    /**
     * Internally used to access the parent CompactFormGroup; don't pass it yourself.
     */
    $$udCompactFormGroup?: CompactFormGroup;
}

/**
 * Props supplied by `withMatchMedia`
 * @internal
 */
interface WithMatchMediaProps {
    /** {@see isFinePointerQuery} */
    isFinePointer: boolean | null;
}

/**
 * Component for selecting a date within a range of valid dates.
 *
 * @remarks
 * This component will use a native date picker if the client is running on a "mobile" device
 * Otherwise it will render a custom calendar dialog from which the user may choose a date.
 */
@inject(({$$udFormGroup, $$udCompactFormGroup}) => ({$$udFormGroup, $$udCompactFormGroup}))
@observer
class DatePickerBase extends React.Component<
    DatePickerProps & WithI18nProps & WithMatchMediaProps
> {
    static displayName = 'DatePicker';
    static defaultProps = {
        value: null,
        min: 'TODAY' as const,
        popoverComponentClass: BasicPopover,
        popoverPlacement: 'bottom-start' as const,
    };

    constructor(props: DatePickerProps & WithI18nProps & WithMatchMediaProps) {
        super(props);
        this.gettext = props.gettext;
        this.pgettext = props.pgettext;
        this.locale = props.locale.replace('_', '-') || 'en-US';
        this.today = new Date();

        const initialValue = this.props.value ?? this.props.defaultValue;
        this._selectedDate = this._selectedMonth = initialValue;
        this.props.selectedMonth && this.onSelectMonth(this.props.selectedMonth);
        this.isValidDate(this._selectedDate, 'DAY', true);
        this.ariaDialogId = getUniqueId('date-picker-dialog');
        this.dialogStatusId = getUniqueId('date-picker-dialog-status');
    }

    componentDidUpdate(prevProps: DatePickerProps & WithI18nProps & WithMatchMediaProps) {
        if (prevProps.selectedMonth !== this.props.selectedMonth) {
            this.onSelectMonth(this.props.selectedMonth);
        }
        if (
            prevProps.value !== this.props.value &&
            // Note: defaultProp for value is null
            this.props.value === null &&
            this._inputValue === ''
        ) {
            this.onClearCalendar();
        }
    }

    private readonly gettext: WithI18nProps['gettext'];
    private readonly pgettext: WithI18nProps['pgettext'];
    private readonly locale: Parameters<Date['toLocaleDateString']>[0];
    readonly today: Date;
    ariaDialogId: string;
    dialogStatusId: string;
    @observable _inputValue = '';
    @observable.ref _selectedDate: Date | null | undefined;
    @observable.ref _selectedMonth: Date | null | undefined;
    @observable isCalendarOpen = false;
    @observable dialogStatus = '';

    @computed get inputValue() {
        if (this._inputValue) {
            return this._inputValue;
        }
        if (this.selectedDate) {
            return this.selectedDate.toLocaleDateString(this.locale);
        }
        return '';
    }

    @computed get minDate() {
        const value = this.props.min === 'TODAY' ? this.today : this.props.min;
        return value ? roundDate(value, 'DAY') : null;
    }

    @computed get minMonth() {
        return this.minDate ? roundDate(this.minDate, 'MONTH') : null;
    }

    @computed get maxDate() {
        return this.props.max ? roundDate(this.props.max, 'DAY') : null;
    }

    @computed get maxMonth() {
        return this.maxDate ? roundDate(this.maxDate, 'MONTH') : null;
    }

    @computed get selectedDate() {
        return this.props.value ?? this._selectedDate;
    }

    @computed get selectedMonth() {
        return (
            this._selectedMonth ??
            this.selectedDate ??
            // With no date or month selected, by default selectedMonth will be today's month
            (this.isValidDate(this.today, 'DAY') ? this.today : null) ??
            (this.minDate && this.today < this.minDate ? this.minDate : null) ??
            this.maxDate
            // At this point, it is possible that if minDate is set to a date after today,
            // and maxDate is not set, then this will evaluate to null
        );
    }

    @action isValidDate = (
        date: Date | null | undefined,
        precision: 'DAY' | 'MONTH',
        shouldShowError = false,
    ) => {
        if (!date) {
            return true;
        }

        if (isNaN(date.getTime())) {
            if (shouldShowError) {
                this.props.$$udFormGroup?.setPropOverrides({
                    validationState: 'error',
                    note: this.gettext('Invalid date'),
                });
            }
            return false;
        }

        const minDate = precision === 'MONTH' ? this.minMonth : this.minDate;
        // Assert: if minDate is defined, this implies this.minDate is also defined
        // Include this.minDate to this guard to assure TS that it is accessible
        // within the if{} block.
        if (this.minDate && minDate && date < minDate) {
            if (shouldShowError) {
                this.props.$$udFormGroup?.setPropOverrides({
                    validationState: 'error',
                    note: this.props.interpolate(
                        this.gettext('The earliest date you can select is %(date)s'),
                        {date: this.minDate.toLocaleDateString(this.locale)},
                        true,
                    ),
                });
            }
            return false;
        }

        const maxDate = precision === 'MONTH' ? this.maxMonth : this.maxDate;
        // Assert: if maxDate is defined, this implies that this.maxDate is defined
        // (see note above about minDate)
        if (this.maxDate && maxDate && roundDate(date, precision) > maxDate) {
            if (shouldShowError) {
                this.props.$$udFormGroup?.setPropOverrides({
                    validationState: 'error',
                    note: this.props.interpolate(
                        this.gettext('The latest date you can select is %(date)s'),
                        {date: this.maxDate.toLocaleDateString(this.locale)},
                        true,
                    ),
                });
            }
            return false;
        }

        return true;
    };

    clearDialogStatus() {
        this.dialogStatus = '';
    }

    @action onSelectDate = (date: Date | null) => {
        const {onChange, $$udFormGroup, $$udCompactFormGroup} = this.props;
        $$udFormGroup?.setPropOverrides({});
        const oldSelectedDate = this.selectedDate;
        this._selectedDate = this.isValidDate(date, 'DAY', true) ? date : null;
        this._selectedMonth = this._selectedDate;
        this._inputValue = this._selectedDate ? '' : this._inputValue;
        if (!isSameDate(oldSelectedDate, this._selectedDate)) {
            onChange?.(this._selectedDate);
            $$udCompactFormGroup?.setHasValue(!!this._selectedDate);
        }

        if (date !== null) {
            this.clearDialogStatus();
        } else {
            this.dialogStatus = this.gettext('The selected date has been cleared.');
        }
    };

    @action onSelectMonth = (date: Date | null | undefined) => {
        if (this.isValidDate(date, 'MONTH')) {
            this._selectedMonth = date;
            this.props.onChangeSelectedMonth &&
                !isSameDate(this._selectedMonth, this.props.selectedMonth) &&
                this.props.onChangeSelectedMonth(this._selectedMonth);
        }
    };

    @action onChangeInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.isCalendarOpen = true;
        this._inputValue = event.target.value;
        const parserKey = event.target.type === 'date' ? 'ISO' : this.locale;
        if (!this._inputValue) {
            this.onSelectDate(null);
        }
        let date;
        try {
            date = parseDateString(this._inputValue, parserKey as string);
        } catch {
            date = new Date('INVALID_DATE');
        }
        this.onSelectDate(date);
    };

    @action onOpenCalendar = () => {
        this.isCalendarOpen = true;
        this.clearDialogStatus();
    };

    @action onToggleCalendar = (isOpen: boolean) => {
        this.isCalendarOpen = isOpen;
        !isOpen && this.props.onCloseCalendar && this.props.onCloseCalendar();
    };

    @action onClearCalendar = () => {
        this._inputValue = '';
        this.onSelectDate(null);
    };

    @action onCloseCalendar = () => {
        if (this.props.$$udFormGroup?.id) {
            document.getElementById(this.props.$$udFormGroup?.id)?.focus();
        }
        this.isCalendarOpen = false;
        this.props.onCloseCalendar?.();
    };

    render() {
        const {
            defaultValue,
            min,
            max,
            onChangeSelectedMonth,
            onCloseCalendar,
            selectedMonth,
            popoverComponentClass: PopoverComponent,
            popoverPlacement,
            $$udFormGroup,
            $$udCompactFormGroup,
            isFinePointer,
            ...inputProps
        } = omitI18nProps(this.props);
        checkFormGroup('DatePicker', this.props, null, true);

        const icon = (
            <div className={classNames('ud-date-picker-icon', styles.icon)}>
                <Calendar30Icon label={this.gettext('Date input')} />
            </div>
        );

        if (!isFinePointer) {
            return (
                <div className={styles['date-picker']}>
                    <TextInput
                        {...inputProps}
                        // Disable Chrome autocomplete by making it think it's a one-time-code input
                        autoComplete="one-time-code"
                        type="date"
                        value={this.selectedDate ? toLocalDateStamp(this.selectedDate) : ''}
                        min={this.minDate ? toLocalDateStamp(this.minDate) : undefined}
                        max={this.maxDate ? toLocalDateStamp(this.maxDate) : undefined}
                        onChange={this.onChangeInputValue}
                    />
                    {icon}
                </div>
            );
        }

        return (
            <>
                {PopoverComponent && (
                    <PopoverComponent
                        a11yRole="none"
                        placement={popoverPlacement}
                        isOpen={this.isCalendarOpen}
                        onToggle={this.onToggleCalendar}
                        trigger={
                            <DesktopDatePickerInput
                                role="combobox"
                                aria-controls={this.ariaDialogId}
                                aria-expanded={this.isCalendarOpen}
                                placeholder={this.pgettext(
                                    'Date format placeholder, e.g. 01/02/2020 for January 2 2020',
                                    'MM/DD/YYYY',
                                )}
                                {...inputProps}
                                // Disable Chrome autocomplete by making it think it's a one-time-code input
                                autoComplete="one-time-code"
                                id={$$udFormGroup?.id}
                                value={this.inputValue}
                                onChange={this.onChangeInputValue}
                                icon={icon}
                                onOpenCalendar={this.onOpenCalendar}
                            />
                        }
                        withArrow={false}
                        withPadding={false}
                    >
                        <div
                            id={this.ariaDialogId}
                            role="dialog"
                            aria-label={this.gettext('Date Picker')}
                        >
                            <DatePickerCalendar
                                // See `selectedMonth` definition for why its value may be null. In that
                                // case the calendar needs to default to _somewhere_, so default to now.
                                selectedMonth={this.selectedMonth ?? new Date()}
                                onSelectMonth={this.onSelectMonth}
                                selectedDate={this.selectedDate}
                                onSelectDate={this.onSelectDate}
                                isValidDate={this.isValidDate}
                                minDate={this.minDate}
                                maxDate={this.maxDate}
                                today={this.today}
                                calendarLocale={this.locale}
                            />
                            <div className={styles['popover-footer']}>
                                <Button
                                    udStyle="ghost"
                                    size="small"
                                    onClick={this.onClearCalendar}
                                    aria-controls={this.dialogStatusId}
                                >
                                    {this.gettext('Clear')}
                                </Button>
                                <Button udStyle="ghost" size="small" onClick={this.onCloseCalendar}>
                                    {this.selectedDate
                                        ? this.gettext('Done')
                                        : this.gettext('Close')}
                                </Button>
                                <div
                                    id={this.dialogStatusId}
                                    className="ud-sr-only"
                                    data-purpose="dialog-status"
                                    role="status"
                                >
                                    {this.dialogStatus}
                                </div>
                            </div>
                        </div>
                    </PopoverComponent>
                )}
            </>
        );
    }
}

// isFinePointerQuery is true when the primary pointer is fine (mouse or trackpad, for example),
// and there are not any coarse pointers (touch display, for example). If there are coarse pointers,
// we assume that the browser has a better built-in date picker to support touch interactions.
const isFinePointerQuery = '(pointer: fine), not (any-pointer: coarse)';
export const DatePicker = withI18n(
    withMatchMedia({isFinePointer: isFinePointerQuery})(DatePickerBase) as React.ComponentType<
        DatePickerProps & WithI18nProps & WithMatchMediaProps
    >,
);

/**
 * @internal
 */
export interface DesktopDatePickerInputProps extends TextInputProps {
    icon: ReactNode;
    onOpenCalendar: () => void;
}

/**
 * Internal text input component to trigger the desktop version of the calendar dialog.
 *
 * @remarks
 * This must be a separate component. We are intentionally overriding the
 * `onClick: this.onTriggerClick` that comes from BasicPopover with
 * `onClick: onOpenCalendar`. "Open on focus" and "toggle on click" behaviors
 * do not work well together.
 *
 * @internal
 */
function DesktopDatePickerInput({icon, onOpenCalendar, ...props}: DesktopDatePickerInputProps) {
    return (
        <div className={styles['date-picker']}>
            <TextInput {...props} onClick={onOpenCalendar} onFocus={onOpenCalendar} />
            {icon}
        </div>
    );
}
