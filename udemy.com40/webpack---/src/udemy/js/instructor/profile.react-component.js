import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import Tabs from 'base-components/tabs/tabs.react-component';
import getConfigData from 'utils/get-config-data';

import BasicInfo from './profile/basic-info.react-component';
import Photo from './profile/photo.react-component';
import PrivacySetting from './profile/privacy-setting.react-component';

const udConfig = getConfigData();

@withRouter
@observer
export default class Profile extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
    };

    @autobind onSelectTab(id) {
        this.props.history.push(id);
    }

    render() {
        return (
            <>
                <h1 className="instructor-main-heading ud-heading-serif-xxl">
                    {gettext('Profile & settings')}
                </h1>
                <Tabs
                    activeTabId={
                        this.props.history.location.pathname || '/profile/basic-information/'
                    }
                    onSelect={this.onSelectTab}
                >
                    <Tabs.Tab id="/profile/basic-information/" title={gettext('Udemy profile')}>
                        <BasicInfo />
                    </Tabs.Tab>
                    <Tabs.Tab id="/profile/photo/" title={gettext('Profile picture')}>
                        <Photo />
                    </Tabs.Tab>
                    {udConfig.brand.is_profile_functions_enabled && (
                        <Tabs.Tab id="/profile/privacy/" title={gettext('Privacy settings')}>
                            <PrivacySetting />
                        </Tabs.Tab>
                    )}
                </Tabs>
            </>
        );
    }
}
