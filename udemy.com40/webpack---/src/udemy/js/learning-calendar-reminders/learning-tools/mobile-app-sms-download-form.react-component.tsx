import {Button} from '@udemy/react-core-components';
import {FormGroup, TextInput, Select} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import React, {Component, FormEvent} from 'react';

import MobileAppBranchSmsStore from 'learning-calendar-reminders/learning-tools/mobile-app-branch-sms.mobx-store';

import {COUNTRY_CODES, DEFAULT_COUNTRY_CODE} from './constants';

import './mobile-app-sms-download-form.less';

export interface MobileAppSMSDownloadFormProps {
    store?: MobileAppBranchSmsStore;
    showCountryCodeDropdown?: boolean;
    size?: 'large' | 'medium';
    onFormSubmit?: () => void;
    deeplinkPath?: string;
}
@observer
export class MobileAppSMSDownloadForm extends Component<MobileAppSMSDownloadFormProps> {
    static defaultProps = {
        store: null,
        showCountryCodeDropdown: true,
        size: 'large',
        deeplinkPath: null,
    };

    constructor(props: MobileAppSMSDownloadFormProps) {
        super(props);
        this.store =
            props.store ?? new MobileAppBranchSmsStore(props.deeplinkPath, props.onFormSubmit);
    }

    private store: MobileAppBranchSmsStore;

    @autobind
    onCountryDropdownSelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedTarget = event.target.options[event.target.selectedIndex];
        this.store.updateSelectedCountry(selectedTarget.value);
    }

    @autobind
    onPhoneNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.store.updatePhoneNumber(e.target.value);
    }

    @autobind
    onSubmit(event: FormEvent) {
        event.preventDefault();
        if (!this.props.showCountryCodeDropdown) {
            this.store.updateSelectedCountry(DEFAULT_COUNTRY_CODE.name);
        }
        this.store.textApp();
    }

    render() {
        return (
            <form onSubmit={this.onSubmit} data-purpose="send-download-sms">
                {this.props.showCountryCodeDropdown && (
                    <FormGroup
                        label={gettext('Phone country code')}
                        labelProps={{className: 'ud-sr-only'}}
                        styleName="phone-country-code"
                    >
                        <Select
                            defaultValue={this.store.selectedCountry.name}
                            onChange={this.onCountryDropdownSelect}
                            name="country"
                            size={this.props.size}
                        >
                            {COUNTRY_CODES.map((countryData) => (
                                <option key={countryData.countryCode} value={countryData.name}>
                                    {`${countryData.Iso} (${countryData.name})`}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                )}
                <div styleName="phone-number">
                    <FormGroup
                        label={gettext('Phone number')}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        <TextInput
                            name="phone-number"
                            styleName="phone-input"
                            placeholder={pgettext('Phone number', '123 456 7890')}
                            value={this.store.phoneNumber}
                            size={this.props.size}
                            onChange={this.onPhoneNumberChange}
                        />
                    </FormGroup>
                    <Button
                        udStyle="primary"
                        disabled={this.store.isSendingText}
                        type="submit"
                        size={this.props.size}
                        id="send-app-download-message"
                    >
                        {this.store.isSendingText ? (
                            <Loader color="inherit" size="small" />
                        ) : this.store.isSendingTextSuccessful ? (
                            gettext('Sent')
                        ) : (
                            gettext('Send')
                        )}
                    </Button>
                </div>
            </form>
        );
    }
}
