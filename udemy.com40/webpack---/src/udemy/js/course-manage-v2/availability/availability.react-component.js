import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {DatePicker, Checkbox, FormGroup, Select, Radio} from '@udemy/react-form-components';
import {Popover} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Loader from 'course-manage-v2/loader.react-component';
import MainContent from 'course-manage-v2/main-content.react-component';
import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';
import getRequestData from 'utils/get-request-data';

import AvailabilityStore from './availability.mobx-store';
import './availability.less';
import {
    AVAILABLE,
    NOT_AVAILABLE,
    UNSPECIFIED,
    AVAILABILITY_OPTIONS,
    RESPOND_OPTIONS,
} from './constants';

const HeaderActions = ({isSaveEnabled, onSaveForm}) => {
    return (
        <Button udStyle="white-solid" size="small" disabled={!isSaveEnabled} onClick={onSaveForm}>
            {gettext('Save')}
        </Button>
    );
};

HeaderActions.propTypes = {
    isSaveEnabled: PropTypes.bool.isRequired,
    onSaveForm: PropTypes.func.isRequired,
};

const AvailableOptions = observer(({availabilityStore}) => {
    return (
        <div styleName="inline">
            <FormGroup
                label={gettext('Choose availability')}
                labelProps={{className: 'ud-sr-only'}}
            >
                <Select
                    size="small"
                    value={availabilityStore.respondTimeFrame || ''}
                    onChange={(event) => availabilityStore.onDropdownSelect(event.target.value)}
                >
                    <Select.Placeholder>{gettext('Choose')}</Select.Placeholder>
                    {RESPOND_OPTIONS.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            </FormGroup>
        </div>
    );
});

AvailableOptions.propTypes = {
    availabilityStore: PropTypes.object.isRequired,
};

const NotAvailableDatePicker = ({children, ...props}) => (
    <div styleName="inline">
        <FormGroup
            label={gettext('Choose date')}
            labelProps={{className: 'ud-sr-only'}}
            validationState={!props.value ? 'error' : 'neutral'}
            note={!props.value ? gettext('Invalid date') : null}
        >
            <DatePicker {...props} />
        </FormGroup>
    </div>
);

NotAvailableDatePicker.propTypes = {
    value: PropTypes.instanceOf(Date),
};

NotAvailableDatePicker.defaultProps = {
    value: null,
};

@observer
export default class Availability extends Component {
    static propTypes = {
        pageStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.availabilityStore = new AvailabilityStore(props.pageStore.courseId);
        props.pageStore.setHeaderActions(this.renderHeaderButtons);
    }

    componentDidMount() {
        this.availabilityStore.fetchCourseStatus();
    }

    @autobind
    onApplyToAllChange({target}) {
        this.availabilityStore.onApplyToAllChange(target.checked);
    }

    @autobind
    saveForm() {
        return this.availabilityStore.submitStatusForm().then(() => {
            this.props.pageStore.updateMenuCheckbox();
        });
    }

    @autobind
    renderHeaderButtons() {
        return (
            <HeaderActions
                isSaveEnabled={this.availabilityStore.saveEnabled}
                onSaveForm={this.saveForm}
            />
        );
    }

    @autobind
    renderAvailableLabel(forScreenReader) {
        const text = this.renderRadioLabelText(undefined, forScreenReader);
        let options;
        if (forScreenReader) {
            options = this.availabilityStore.respondTimeFrame || gettext('Choose availability');
        } else {
            options = <AvailableOptions availabilityStore={this.availabilityStore} />;
        }
        return (
            <LocalizedHtml
                className={forScreenReader ? 'ud-sr-only' : null}
                html={gettext(
                    '<span class="text">Questions are usually answered within </span>' +
                        '<span class="options">%(respondTime)s</span>',
                )}
                interpolate={{options, text}}
            />
        );
    }

    @autobind
    renderNotAvailableLabel(forScreenReader) {
        const text = this.renderRadioLabelText(undefined, forScreenReader);
        let datetime;
        const {availableDatePickerValue} = this.availabilityStore;
        if (forScreenReader) {
            const locale = getRequestData().locale.replace('_', '-') || 'en-US';
            datetime = availableDatePickerValue
                ? availableDatePickerValue.toLocaleDateString(locale)
                : gettext('Invalid date');
        } else {
            datetime = (
                <NotAvailableDatePicker
                    value={availableDatePickerValue}
                    onChange={this.availabilityStore.onDateChange}
                    min="TODAY"
                    popoverComponentClass={Popover}
                    size="small"
                />
            );
        }
        return (
            <LocalizedHtml
                className={forScreenReader ? 'ud-sr-only' : null}
                html={gettext(
                    '<span class="text">My team is out of office, returning </span>' +
                        '<span class="datetime">%(date)s</span>' +
                        '<span class="text"> and will be able to respond to Q&A when we return.</span>',
                )}
                interpolate={{datetime, text}}
            />
        );
    }

    @autobind
    renderUnspecifiedLabel(forScreenReader) {
        return this.renderRadioLabelText(gettext('No status'), forScreenReader);
    }

    renderRadioLabelText(text, forScreenReader) {
        return (
            <span
                className={forScreenReader ? 'ud-sr-only' : null}
                styleName="radio-label-text"
                aria-hidden={forScreenReader ? null : true}
            >
                {text}
            </span>
        );
    }

    renderRadio(value, renderLabel) {
        const checked = AVAILABILITY_OPTIONS[value] === this.availabilityStore.optionSelected;
        const onChange = () => this.availabilityStore.onRespondSelect(value);
        return (
            <div>
                {/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div styleName="inline radio" onClick={onChange}>
                    {/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                    <Radio
                        size="large"
                        name="availability"
                        value={value}
                        onChange={onChange}
                        onClick={(event) => event.stopPropagation()}
                        checked={checked}
                    >
                        {renderLabel(true)}
                    </Radio>
                    {renderLabel(false)}
                </div>
            </div>
        );
    }

    renderAvailability() {
        return (
            <>
                <p data-purpose="section-description">
                    {gettext(
                        'Communicate your Q&A availability to your students. This will be ' +
                            'displayed to students when they ask a question.',
                    )}
                </p>
                <form styleName="form">
                    <FormGroup
                        udStyle="fieldset"
                        label={gettext('Availability')}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        {this.renderRadio(AVAILABLE, this.renderAvailableLabel)}
                        {this.renderRadio(NOT_AVAILABLE, this.renderNotAvailableLabel)}
                        {this.renderRadio(UNSPECIFIED, this.renderUnspecifiedLabel)}
                    </FormGroup>
                    <div styleName="inline checkbox-row">
                        <Checkbox size="large" onChange={this.onApplyToAllChange}>
                            {gettext('Apply this status to all courses that I own')}
                        </Checkbox>
                    </div>
                </form>
            </>
        );
    }

    render() {
        const loading = !this.props.pageStore.courseLoaded || !this.availabilityStore.statusLoaded;
        return (
            <div>
                <SubHeader title={gettext('Availability')} />
                <MainContent>{loading ? <Loader /> : this.renderAvailability()}</MainContent>
            </div>
        );
    }
}
