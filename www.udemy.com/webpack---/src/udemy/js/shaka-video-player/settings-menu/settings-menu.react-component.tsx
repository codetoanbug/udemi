import SettingsIcon from '@udemy/icons/dist/settings.ud-icon';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {AUTO_RESOLUTION_LABEL} from '../constants';
import {VideoControlBarDropdown} from '../control-bar/video-control-bar-dropdown.react-component';
import {SettingsMenuStore} from './settings-menu.mobx-store';

interface SettingsMenuProps {
    controlBarStore: any;
    videoPlayerStore: any;
}

@inject('videoPlayerStore', 'controlBarStore')
@observer
export class SettingsMenu extends React.Component<SettingsMenuProps> {
    static propTypes = {
        controlBarStore: PropTypes.object.isRequired,
        videoPlayerStore: PropTypes.object.isRequired,
    };

    constructor(props: any) {
        super(props);

        this.store = new SettingsMenuStore(this.props.controlBarStore);
    }

    store: any;

    renderResolutionLabel(label: any, displayLabel: any, isActive: any, hlsResolution: any) {
        return label === AUTO_RESOLUTION_LABEL && isActive && hlsResolution
            ? interpolate(gettext('Auto (%(resolution)sp)'), {resolution: hlsResolution}, true)
            : displayLabel;
    }

    render() {
        const {videoPlayerStore} = this.props;
        const {activeResolution, sortedResolutions, hlsResolution} = videoPlayerStore;
        const button = (
            <VideoControlBarDropdown.Button
                data-purpose="settings-button"
                tooltipProps={{a11yRole: 'none', children: gettext('Settings')}}
            >
                <SettingsIcon label={gettext('Settings')} size="medium" />
            </VideoControlBarDropdown.Button>
        );
        return (
            <VideoControlBarDropdown
                // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                placement="top-end"
                isOpen={this.store.isMenuOpen}
                onToggle={this.store.toggleMenu}
                trigger={button}
            >
                <VideoControlBarDropdown.Menu data-purpose="settings-menu">
                    <ul
                        className="ud-unstyled-list"
                        role="group"
                        aria-label={gettext('Resolution')}
                        data-purpose="resolution-menu"
                    >
                        {sortedResolutions.map(({label, displayLabel}: any) => (
                            <li key={label}>
                                <VideoControlBarDropdown.MenuItem
                                    onClick={() => videoPlayerStore.setResolutionLabel(label)}
                                    aria-checked={label === activeResolution.label}
                                    role="menuitemradio"
                                >
                                    {this.renderResolutionLabel(
                                        label,
                                        displayLabel,
                                        label === activeResolution.label,
                                        hlsResolution,
                                    )}
                                </VideoControlBarDropdown.MenuItem>
                            </li>
                        ))}
                    </ul>
                    {this.props.children}
                </VideoControlBarDropdown.Menu>
            </VideoControlBarDropdown>
        );
    }
}
