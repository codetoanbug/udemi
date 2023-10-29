import NextIcon from '@udemy/icons/dist/next.ud-icon';
import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {VideoControlBarDropdown} from '../../control-bar/video-control-bar-dropdown.react-component';
import {parsedUserAgent} from '../../utils';
import {MENU_PAGES} from '../constants';
import '../../control-bar/video-control-bar-dropdown.less';

interface CaptionsSettingsMenuProps {
    captionDisplayStore: any;
    onChangeMenu: any;
}
@inject('captionDisplayStore')
@observer
export class CaptionsSettingsMenu extends React.Component<CaptionsSettingsMenuProps> {
    static propTypes = {
        captionDisplayStore: PropTypes.object.isRequired,
        onChangeMenu: PropTypes.func.isRequired,
    };

    goToTracks = () => {
        this.props.captionDisplayStore.setSubmenu(MENU_PAGES.TRACKS);
        this.props.onChangeMenu();
    };

    goToFontSize = () => {
        this.props.captionDisplayStore.setSubmenu(MENU_PAGES.FONT_SIZE);
        this.props.onChangeMenu();
    };

    goToOpacity = () => {
        this.props.captionDisplayStore.setSubmenu(MENU_PAGES.OPACITY);
        this.props.onChangeMenu();
    };

    render() {
        const {captionDisplayStore} = this.props;
        const heading = gettext('Caption settings');
        return (
            <VideoControlBarDropdown.Menu data-purpose="captions-dropdown-menu">
                <VideoControlBarDropdown.MenuItem
                    onClick={this.goToTracks}
                    data-purpose="go-to-tracks"
                    aria-label={gettext('Back to captions menu')}
                >
                    <PreviousIcon label={false} color="inherit" styleName="prev-icon" />
                    {heading}
                </VideoControlBarDropdown.MenuItem>
                <li role="separator" />
                <ul className="ud-unstyled-list" role="group" aria-label={heading}>
                    <li>
                        <VideoControlBarDropdown.MenuItem
                            onClick={this.goToFontSize}
                            data-purpose="go-to-font-size"
                            aria-haspopup="menu"
                        >
                            {gettext('Font size')}
                            <span data-purpose="current-font-size" styleName="current-value">
                                {`${captionDisplayStore.activeFontSize}%`}
                            </span>
                            <NextIcon label={false} color="inherit" styleName="next-icon" />
                        </VideoControlBarDropdown.MenuItem>
                    </li>
                    <li>
                        <VideoControlBarDropdown.MenuItem
                            onClick={this.goToOpacity}
                            data-purpose="go-to-opacity"
                            aria-haspopup="menu"
                        >
                            {gettext('Background opacity')}
                            <span data-purpose="current-opacity" styleName="current-value">
                                {`${captionDisplayStore.activeOpacity}%`}
                            </span>
                            <NextIcon label={false} color="inherit" styleName="next-icon" />
                        </VideoControlBarDropdown.MenuItem>
                    </li>
                    {!parsedUserAgent.isMobile && (
                        <li>
                            <VideoControlBarDropdown.MenuItem
                                onClick={captionDisplayStore.toggleWellEnabled}
                                aria-checked={captionDisplayStore.isWellEnabled}
                                role="menuitemcheckbox"
                            >
                                {gettext('Display under video')}
                            </VideoControlBarDropdown.MenuItem>
                        </li>
                    )}
                    <li>
                        <VideoControlBarDropdown.MenuItem
                            onClick={captionDisplayStore.reset}
                            data-purpose="reset"
                        >
                            {gettext('Reset')}
                        </VideoControlBarDropdown.MenuItem>
                    </li>
                </ul>
            </VideoControlBarDropdown.Menu>
        );
    }
}
