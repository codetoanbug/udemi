import {withI18n} from '@udemy/i18n';
import {TextInput} from '@udemy/react-form-components';
import {action} from 'mobx';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './assign-resource-modal.less';
import AutoAssignTooltip from './auto-assign-tooltip.react-component';

@inject(({$$udFormGroup}) => ({$$udFormGroup}))
@observer
class InternalDaysPicker extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        isAutoAssignEnabled: PropTypes.bool,
        /** Internally used to access the parent FormGroup; don't pass it yourself. */
        $$udFormGroup: PropTypes.object,
        gettext: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isAutoAssignEnabled: false,
        $$udFormGroup: null,
    };

    isValidNumber = (number) => {
        if (number < 0 || number > 9999 || !Number.isInteger(number)) {
            return false;
        }
        return true;
    };

    @action
    onChange = (event) => {
        const {gettext} = this.props;
        if (event.target.value === '') {
            return this.props.onChange(undefined);
        }

        const value = Number(event.target.value);
        if (!this.isValidNumber(value)) {
            this.props.$$udFormGroup.setPropOverrides({
                validationState: 'error',
                note: gettext('Invalid number'),
            });
            this.props.onChange(undefined);
            return;
        }

        this.props.$$udFormGroup.setPropOverrides({
            validationState: 'success',
            note: undefined,
        });
        this.props.onChange(value);
    };

    render() {
        const {gettext} = this.props;
        return (
            <div className={styles['days-input']}>
                <TextInput size="large" onChange={this.onChange} />
                <span>{gettext('days')}</span>
                {this.props.isAutoAssignEnabled && (
                    <AutoAssignTooltip
                        text={gettext(
                            'When auto-assigning, the given time frame will start from when the users are added to the selected group.',
                        )}
                    />
                )}
            </div>
        );
    }
}

const DaysPicker = withI18n(InternalDaysPicker);
export default DaysPicker;
