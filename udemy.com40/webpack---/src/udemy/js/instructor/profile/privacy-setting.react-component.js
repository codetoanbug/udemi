import {Button} from '@udemy/react-core-components';
import {Checkbox, FormGroup} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import OneColumn from '../layout/one-column.react-component';
import ProfileStore from './profile.mobx-store';
import './privacy-setting.less';

@observer
export default class PrivacySetting extends Component {
    static propTypes = {
        store: PropTypes.object,
    };

    static defaultProps = {
        store: null,
    };

    constructor(props) {
        super(props);
        this.store = props.store || new ProfileStore();
    }

    componentDidMount() {
        this.store.getUserPrivacySettings();
        this.store.getUserProfile();
    }

    @autobind
    onChange(event) {
        this.store.setData(event.target.name, event.target.checked);
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.store.updateUserPrivacySetting();
    }

    render() {
        const store = this.store;
        const disablePrivacySettings = !this.store.allowChangePrivacySettings;

        if (!this.store.hasLoadedPrivacySettings || !this.store.isUserProfileLoaded) {
            return <MainContentLoader />;
        }
        let searchEngineVisible = store.data.profileVisible;
        if (disablePrivacySettings === true) {
            searchEngineVisible = false;
        }
        return (
            <OneColumn>
                <form onSubmit={this.onSubmit} data-purpose="privacy-settings-form">
                    {disablePrivacySettings && (
                        <AlertBanner
                            styleName="alert-banner"
                            showCta={false}
                            title={gettext(
                                "You're in an organization that doesn't allow changes to these settings",
                            )}
                        />
                    )}
                    <FormGroup
                        udStyle="fieldset"
                        label={gettext('Profile page settings')}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        <Checkbox
                            checked={searchEngineVisible}
                            onChange={this.onChange}
                            name="profileVisible"
                            disabled={disablePrivacySettings}
                        >
                            {store.isPublishedInstructor
                                ? gettext('Show your profile on search engines')
                                : gettext('Show your profile to logged-in users')}
                        </Checkbox>
                        <Checkbox
                            checked={store.data.courseListVisible}
                            onChange={this.onChange}
                            name="courseListVisible"
                            disabled={disablePrivacySettings}
                        >
                            {gettext("Show courses you're taking on your profile page")}
                        </Checkbox>
                    </FormGroup>
                    <FooterButtons alignment="left">
                        <Button
                            data-purpose="profile-privacy-settings-submit-button"
                            disabled={!store.canSubmit || store.isSubmitting}
                            type="submit"
                        >
                            {gettext('Save')}
                        </Button>
                    </FooterButtons>
                </form>
            </OneColumn>
        );
    }
}
