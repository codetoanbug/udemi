import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {
    DatePicker,
    FormGroup,
    InputPillFormGroup,
    TextInput,
    TimePicker,
    Select,
    InputPill,
    Radio,
} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {runInAction} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import './learning-reminder-form.less';
import {
    DAYS,
    DURATION,
    DURATION_UNIT,
    durationValues,
    FREQUENCY,
    MONTH_OPTION,
    never,
    until,
} from '../constants';
import {LearningReminderFormStore} from './learning-reminder-form.mobx-store';
import {ReminderInfo} from './reminder-info.react-component';

interface ReminderDetailsProps {
    store: LearningReminderFormStore;
}

@observer
export class ReminderDetails extends Component<ReminderDetailsProps> {
    componentDidMount() {
        if (!this.props.store.formFields.startDatetime.value) {
            this.props.store.updateStartTime('12:00');
        }
    }

    @autobind
    handleFrequencyChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.store.updateFrequency(e.target.value);
    }

    @autobind
    handleMonthDayOrWeekChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.store.updateMonthDayOrWeekChange(e.target.value);
    }

    @autobind
    onChangeStartTime(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.store.updateStartTime(e.target.value);
    }

    @autobind
    onChangeUntilSelected(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.store.updateUntilSelected(e.target.value);
    }

    @autobind
    onChangeDuration(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.store.updateDuration(e.target.value);
    }

    @autobind
    onChangeFormField(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        this.props.store.setFormFieldValue(event.target.name, event.target.value);
    }

    render() {
        const {store} = this.props;
        const {formFields} = store;

        const onceOption = store.showOnceOption && (
            <FormGroup
                validationState={formFields.onceDate.validationState}
                note={formFields.onceDate.note}
                label={gettext('Choose date')}
                labelProps={{className: 'ud-sr-only'}}
                styleName="date-picker"
            >
                <DatePicker value={formFields.onceDate.value} onChange={store.updateOnceDate} />
            </FormGroup>
        );

        const weeklyOptions = store.showWeeklyOptions && (
            <InputPillFormGroup
                validationState={formFields.selectedDays.validationState}
                note={formFields.selectedDays.note}
                label={gettext('Select weekdays')}
                labelProps={{className: 'ud-sr-only'}}
            >
                {DAYS.map((day, ndx) => {
                    const onSelectDay = (ndx: number) => () => {
                        runInAction(() => {
                            this.props.store.formFields.selectedDays.value[ndx] = !this.props.store
                                .formFields.selectedDays.value[ndx];
                            this.props.store.updateStartDatetime();
                        });
                    };
                    return (
                        <InputPill
                            key={day}
                            name="days"
                            checked={formFields.selectedDays.value[ndx]}
                            onChange={onSelectDay(ndx)}
                            udStyle={formFields.selectedDays.value[ndx] ? 'primary' : 'secondary'}
                        >
                            {formFields.selectedDays.value[ndx] && <TickIcon label={false} />}
                            {day}
                        </InputPill>
                    );
                })}
            </InputPillFormGroup>
        );

        const monthDayOrWeekOptions = store.showMonthDayOrWeekOptions && (
            <InputPillFormGroup
                validationState={formFields.selectedMonthOption.validationState}
                note={formFields.selectedMonthOption.note}
                label={gettext('Choose month day or week')}
                labelProps={{className: 'ud-sr-only'}}
                styleName="month-option-pills"
            >
                <InputPill
                    type="radio"
                    name="monthDay"
                    value={MONTH_OPTION.monthDay}
                    checked={formFields.selectedMonthOption.value === MONTH_OPTION.monthDay}
                    onChange={this.handleMonthDayOrWeekChange}
                    udStyle={
                        formFields.selectedMonthOption.value === MONTH_OPTION.monthDay
                            ? 'primary'
                            : 'secondary'
                    }
                >
                    {store.getMonthDayOption()}
                </InputPill>
                <InputPill
                    type="radio"
                    name="weekNum"
                    value={MONTH_OPTION.weekNum}
                    checked={formFields.selectedMonthOption.value === MONTH_OPTION.weekNum}
                    onChange={this.handleMonthDayOrWeekChange}
                    udStyle={
                        formFields.selectedMonthOption.value === MONTH_OPTION.weekNum
                            ? 'primary'
                            : 'secondary'
                    }
                >
                    {store.getWeekOption()}
                </InputPill>
            </InputPillFormGroup>
        );

        const monthlyOptions = store.showMonthlyOptions && (
            <>
                <FormGroup
                    validationState={formFields.monthDate.validationState}
                    note={formFields.monthDate.note}
                    label={gettext('Choose monthly date')}
                    labelProps={{className: 'ud-sr-only'}}
                    styleName="date-picker"
                >
                    <DatePicker onChange={store.updateMonthDate} />
                </FormGroup>
                {monthDayOrWeekOptions}
            </>
        );

        const customDuration = store.showCustomDuration && (
            <div styleName="combined-form-groups">
                <FormGroup
                    validationState={formFields.customDuration.validationState}
                    note={formFields.customDuration.note}
                    label={gettext('Custom duration')}
                    styleName="first-hide-label-container"
                >
                    <TextInput
                        name="customDuration"
                        value={formFields.customDuration.value}
                        onChange={this.onChangeFormField}
                        type="number"
                    />
                </FormGroup>
                <FormGroup
                    label={gettext('Custom duration unit')}
                    labelProps={{className: 'ud-sr-only'}}
                    styleName="last-hide-label-container"
                >
                    <Select
                        name="customDurationUnit"
                        defaultValue={formFields.customDurationUnit.value}
                        onChange={this.onChangeFormField}
                        styleName="duration-unit"
                    >
                        <option value="minutes">{DURATION_UNIT.minutes}</option>
                        <option value="hours">{DURATION_UNIT.hours}</option>
                    </Select>
                </FormGroup>
            </div>
        );

        return (
            <>
                <div className="ud-text-sm" styleName="progress-text">
                    {gettext('Step 2 of 3')}
                </div>
                <ReminderInfo store={store} />

                <InputPillFormGroup
                    styleName="form-group-container"
                    label={gettext('Frequency')}
                    labelProps={{typography: 'ud-heading-sm'}}
                    validationState={formFields.frequency.validationState}
                    note={formFields.frequency.note}
                >
                    {Object.entries(FREQUENCY).map((freqEntry) => {
                        const frequency = freqEntry[0];
                        const localizedFreq = freqEntry[1];
                        return (
                            <InputPill
                                key={frequency}
                                type="radio"
                                name="frequency"
                                value={frequency}
                                checked={formFields.frequency.value === frequency}
                                onChange={this.handleFrequencyChange}
                                udStyle={
                                    formFields.frequency.value === frequency
                                        ? 'primary'
                                        : 'secondary'
                                }
                            >
                                {localizedFreq}
                            </InputPill>
                        );
                    })}
                </InputPillFormGroup>
                {onceOption}
                {weeklyOptions}
                {monthlyOptions}
                <InputPillFormGroup
                    validationState={formFields.duration.validationState}
                    note={formFields.duration.note}
                    styleName="form-group-container"
                    label={gettext('Duration')}
                    labelProps={{typography: 'ud-heading-sm'}}
                >
                    {DURATION.map((duration, ndx) => {
                        const durationValue = durationValues()[ndx].toString();
                        return (
                            <InputPill
                                key={durationValue}
                                type="radio"
                                name="duration"
                                value={durationValue}
                                checked={formFields.duration.value === durationValue}
                                onChange={this.onChangeDuration}
                                udStyle={
                                    formFields.duration.value === durationValue
                                        ? 'primary'
                                        : 'secondary'
                                }
                            >
                                {duration()}
                            </InputPill>
                        );
                    })}
                </InputPillFormGroup>
                {customDuration}
                <div styleName="combined-form-groups">
                    <FormGroup
                        validationState={formFields.startTime.validationState}
                        note={formFields.startTime.note}
                        label={gettext('Time')}
                        styleName="time-picker-container"
                    >
                        <TimePicker
                            defaultValue={formFields.startTime.value}
                            errorLabel="This time format is incorrect"
                            onChange={this.onChangeStartTime}
                        />
                    </FormGroup>
                </div>
                <div styleName="combined-form-groups">
                    <FormGroup label={gettext('Reminder')} styleName="first-hide-label-container">
                        <Select
                            name="reminderType"
                            defaultValue={formFields.reminderType.value}
                            onChange={this.onChangeFormField}
                            disabled={store.disableReminderFields}
                            styleName="reminder-time-fields"
                        >
                            <option value="popup">{gettext('Notification')}</option>
                            <option value="email">{gettext('Email')}</option>
                        </Select>
                    </FormGroup>
                    <FormGroup
                        label={gettext('Reminder time')}
                        labelProps={{className: 'ud-sr-only'}}
                        styleName="hide-label-container"
                        validationState={formFields.reminderTime.validationState}
                        note={formFields.reminderTime.note}
                    >
                        <TextInput
                            name="reminderTime"
                            defaultValue={formFields.reminderTime.value}
                            styleName="reminder-time-input"
                            onChange={this.onChangeFormField}
                            disabled={store.disableReminderFields}
                            type="number"
                        />
                    </FormGroup>
                    <FormGroup
                        label={gettext('Reminder time unit')}
                        labelProps={{className: 'ud-sr-only'}}
                        styleName="last-hide-label-container"
                    >
                        <Select
                            name="reminderTimeUnit"
                            defaultValue={formFields.reminderTimeUnit.value}
                            onChange={this.onChangeFormField}
                            disabled={store.disableReminderFields}
                            styleName="reminder-time-fields"
                        >
                            <option value="minutes">{gettext('Minutes before')}</option>
                            <option value="hours">{gettext('Hours before')}</option>
                            <option value="days">{gettext('Days before')}</option>
                        </Select>
                    </FormGroup>
                </div>
                <div styleName="reminder-note">{store.reminderNote}</div>
                {formFields.frequency.value !== 'ONCE' && (
                    <>
                        <FormGroup
                            validationState={formFields.untilSelected.validationState}
                            note={formFields.untilSelected.note}
                            label={gettext('End date')}
                            styleName="form-group-container"
                            udStyle="fieldset"
                        >
                            <Radio
                                value={never()}
                                onChange={this.onChangeUntilSelected}
                                checked={formFields.untilSelected.value === never()}
                            >
                                {never()}
                            </Radio>
                            <Radio
                                value={until()}
                                onChange={this.onChangeUntilSelected}
                                checked={formFields.untilSelected.value === until()}
                            >
                                <span className="ud-sr-only">{until()}</span>
                            </Radio>
                        </FormGroup>
                        <FormGroup
                            validationState={formFields.untilDate.validationState}
                            note={formFields.untilDate.note}
                            label={gettext('Choose end date')}
                            styleName="until-date-picker-container"
                        >
                            <DatePicker
                                value={formFields.untilDate.value}
                                onChange={store.updateUntil}
                                size="small"
                            />
                        </FormGroup>
                    </>
                )}
            </>
        );
    }
}
