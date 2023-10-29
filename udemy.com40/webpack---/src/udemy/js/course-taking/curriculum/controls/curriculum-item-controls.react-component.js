import CollapseDiagonalIcon from '@udemy/icons/dist/collapse-diagonal.ud-icon';
import ExpandDiagonalIcon from '@udemy/icons/dist/expand-diagonal.ud-icon';
import SettingsIcon from '@udemy/icons/dist/settings.ud-icon';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import ReportAbuseModalTrigger from 'report-abuse/report-abuse-modal-trigger.react-component';
import getConfigData from 'utils/get-config-data';
import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';
import getIsMobileBrowser from 'utils/user-agent/get-is-mobile-browser';

import requires from '../../registry/requires';
import ControlBarDropdown, {ControlBarButton} from './control-bar-dropdown.react-component';
import TheatreModeToggle from './theatre-mode-toggle.react-component';
import './curriculum-item-controls.less';

const udConfig = getConfigData();

@inject('fullscreenStore')
@inject(({codingExerciseStore}) => ({codingExerciseStore}))
@requires('courseTakingStore')
@observer
export default class CurriculumItemControls extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        fullscreenStore: PropTypes.object.isRequired,
        downloadUrl: PropTypes.string,
        shortcutsMenuItemProps: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([false])]),
        reportType: PropTypes.string,
        reportId: PropTypes.number,
        codingExerciseStore: PropTypes.object,
    };

    static defaultProps = {
        downloadUrl: undefined,
        shortcutsMenuItemProps: false,
        reportType: undefined,
        reportId: undefined,
        codingExerciseStore: null,
    };

    constructor(props) {
        super(props);
        this.isLimitedConsumptionTrial =
            udConfig.brand.has_organization &&
            udConfig.brand.organization.is_limited_consumption_trial;
        this.isMobile = getIsMobileBrowser() || getIsMobileApp();
    }

    @observable isSettingsMenuOpen = false;

    @autobind @action onToggleSettingsMenu(isOpen) {
        this.isSettingsMenuOpen = isOpen;
    }

    @autobind getOverlayContainer() {
        return this.props.fullscreenStore.ref || document.body;
    }

    get downloadMenuItem() {
        if (!this.props.downloadUrl || this.isLimitedConsumptionTrial) {
            return null;
        }
        return (
            <ControlBarDropdown.MenuItem
                key="download"
                componentClass="a"
                href={this.props.downloadUrl}
            >
                {gettext('Download lecture')}
            </ControlBarDropdown.MenuItem>
        );
    }

    get shortcutsMenuItem() {
        if (this.isMobile || !this.props.shortcutsMenuItemProps) {
            return null;
        }
        const {renderHotkeyOverlay, ...props} = this.props.shortcutsMenuItemProps;
        return (
            <React.Fragment key="hotkeys">
                <ControlBarDropdown.MenuItem data-purpose="show-hotkeys" {...props}>
                    {gettext('Keyboard shortcuts')}
                </ControlBarDropdown.MenuItem>
                {renderHotkeyOverlay()}
            </React.Fragment>
        );
    }

    get reportAbuseMenuItem() {
        // Note the distinction between mobile app and mobile browser here.
        // The mobile app renders quizzes and practice tests, which render this component,
        // via WebView. isMobileBrowser returns true for WebView, so in this case it's actually
        // covering mobile browser *and* mobile app. We are hiding report abuse specifically for
        // the mobile app because it isn't implemented anywhere else in the app.
        if (
            !this.props.reportType ||
            !this.props.reportId ||
            !udConfig.features.report_abuse ||
            getIsMobileApp()
        ) {
            return null;
        }

        return (
            <ReportAbuseModalTrigger
                key="report-abuse"
                objectType={this.props.reportType}
                objectId={this.props.reportId}
                modalProps={{getContainer: this.getOverlayContainer}}
                trigger={
                    <ControlBarDropdown.MenuItem>
                        {gettext('Report abuse')}
                    </ControlBarDropdown.MenuItem>
                }
            />
        );
    }

    renderMenuItems() {
        const menuItems = [
            this.downloadMenuItem,
            this.shortcutsMenuItem,
            this.reportAbuseMenuItem,
        ].filter((item) => item);

        // all menu items were null due to display conditions => don't show menu at all
        if (!menuItems.length) {
            return null;
        }

        const label = gettext('Settings');
        const button = (
            <ControlBarDropdown.Button
                styleName="control-bar-btn"
                tooltipProps={{a11yRole: 'none', children: label}}
            >
                <SettingsIcon label={label} size="medium" />
            </ControlBarDropdown.Button>
        );
        return (
            <ControlBarDropdown
                placement="top-end"
                isOpen={this.isSettingsMenuOpen}
                onToggle={this.onToggleSettingsMenu}
                trigger={button}
            >
                <ControlBarDropdown.Menu>{menuItems}</ControlBarDropdown.Menu>
            </ControlBarDropdown>
        );
    }

    renderFullscreenToggle() {
        if (this.isMobile) {
            return null;
        }
        const {isFullscreen, toggleFullscreen} = this.props.fullscreenStore;
        const label = isFullscreen ? gettext('Exit fullscreen') : gettext('Fullscreen');
        const Icon = isFullscreen ? CollapseDiagonalIcon : ExpandDiagonalIcon;
        const store = this.props.codingExerciseStore;
        return (
            <ControlBarButton
                data-purpose="toggle-fullscreen"
                onClick={() => {
                    toggleFullscreen();
                    if (store) {
                        store.trackEvent('resize');
                    }
                }}
                styleName="control-bar-btn"
                tooltipProps={{a11yRole: 'none', children: label}}
            >
                <Icon label={label} size="medium" />
            </ControlBarButton>
        );
    }

    render() {
        return (
            <>
                {this.renderMenuItems()}
                {this.renderFullscreenToggle()}
                <TheatreModeToggle />
            </>
        );
    }
}
