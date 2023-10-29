import {withI18n} from '@udemy/i18n';
import {DatePicker, FormGroup, Select} from '@udemy/react-form-components';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    DATE_TYPE,
    DAYS_TYPE,
    getDueDateInfoText,
    getDueDateSelectTypes,
} from 'organization-common/assign-resource/constants';

import styles from './assign-resource-modal.less';
import AssignResourceStore from './assign-resource.mobx-store';
import DaysPicker from './days-picker.react-component';

@observer
class InternalDue extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(AssignResourceStore).isRequired,
        gettext: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.selectedType = getDueDateSelectTypes(props.gettext)[0];
    }

    @observable selectedType;

    @action
    onTypeChange = (event) => {
        this.selectedType = getDueDateSelectTypes(this.props.gettext).find(
            (selectedType) => selectedType.type === event.target.value,
        );
        this.props.store.resetDueInputs();
    };

    onChangeDate = (selectedDate) => {
        this.props.store.updateDueDate(selectedDate);
    };

    onChangeDays = (numberDays) => {
        this.props.store.updateDueDays(numberDays);
    };

    render() {
        const {gettext} = this.props;
        const {isAutoAssignEnabled, resourceType} = this.props.store;
        return (
            <>
                <div className={styles['due-date-info']}>
                    <div className="ud-heading-sm">{gettext('Do you want to set a due date?')}</div>
                    <div className={classNames('ud-text-xs', styles['due-date-info-text'])}>
                        {getDueDateInfoText(gettext)[resourceType]}
                    </div>
                </div>
                <FormGroup
                    label={gettext('Due date selection')}
                    labelProps={{className: 'ud-sr-only'}}
                    className={styles['due-date-select-container']}
                >
                    <Select
                        data-purpose="due-date-select"
                        className={styles['due-date-select-field']}
                        onChange={this.onTypeChange}
                        value={this.selectedType.type}
                    >
                        {getDueDateSelectTypes(gettext).map((selectType) => (
                            <option key={selectType.type} value={selectType.type}>
                                {selectType.text}
                            </option>
                        ))}
                    </Select>
                </FormGroup>
                {this.selectedType.type === DATE_TYPE && (
                    <FormGroup
                        label={gettext('Select a due date')}
                        labelProps={{className: 'ud-sr-only'}}
                        className={styles['due-date-picker-container']}
                    >
                        <DatePicker
                            data-purpose="due-date-picker"
                            className={styles['due-date-picker-field']}
                            onChange={this.onChangeDate}
                            popoverPlacement="top-start"
                        />
                    </FormGroup>
                )}
                {this.selectedType.type === DAYS_TYPE && (
                    <FormGroup
                        label={gettext('Select a time frame')}
                        labelProps={{className: 'ud-sr-only'}}
                        data-purpose="due-days-form"
                    >
                        <DaysPicker
                            data-purpose="due-days-picker"
                            onChange={this.onChangeDays}
                            isAutoAssignEnabled={isAutoAssignEnabled}
                        />
                    </FormGroup>
                )}
            </>
        );
    }
}

const Due = withI18n(InternalDue);
export default Due;
