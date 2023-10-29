import SubtitlesIcon from '@udemy/icons/dist/subtitles.ud-icon';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import VideoControlBarDropdown from '../../control-bar/video-control-bar-dropdown.react-component';
import {MENU_PAGES} from '../constants';
import CaptionsSettingsMenu from './captions-settings-menu.react-component';
import FontSizeMenu from './font-size-menu.react-component';
import OpacityMenu from './opacity-menu.react-component';
import TracksMenu from './tracks-menu.react-component';

@inject('$$udControlBarDropdown')
class CaptionsMenuActivePage extends React.Component {
    static propTypes = {
        menuPage: PropTypes.oneOf(Object.values(MENU_PAGES)).isRequired,
        $$udControlBarDropdown: PropTypes.object.isRequired,
    };

    @autobind
    onChangeMenu() {
        setTimeout(() => {
            const menu = document.getElementById(this.props.$$udControlBarDropdown.menuId);
            const items = menu ? menu.querySelectorAll('button,a[href],[tabindex]') : [];
            items[0] && items[0].focus();
        }, 0);
    }

    render() {
        switch (this.props.menuPage) {
            case MENU_PAGES.TRACKS:
                return <TracksMenu onChangeMenu={this.onChangeMenu} />;
            case MENU_PAGES.SETTINGS:
                return <CaptionsSettingsMenu onChangeMenu={this.onChangeMenu} />;
            case MENU_PAGES.FONT_SIZE:
                return <FontSizeMenu onChangeMenu={this.onChangeMenu} />;
            case MENU_PAGES.OPACITY:
                return <OpacityMenu onChangeMenu={this.onChangeMenu} />;
        }
    }
}

@inject('captionDisplayStore', 'captionsStore')
@observer
export default class CaptionsMenu extends React.Component {
    static propTypes = {
        captionDisplayStore: PropTypes.object.isRequired,
        captionsStore: PropTypes.object.isRequired,
    };

    render() {
        if (!this.props.captionsStore.captions.length) {
            return null;
        }
        const button = (
            <VideoControlBarDropdown.Button
                data-purpose="captions-dropdown-button"
                tooltipProps={{a11yRole: 'none', children: gettext('Captions')}}
            >
                <SubtitlesIcon label={gettext('Subtitles')} size="medium" />
            </VideoControlBarDropdown.Button>
        );
        return (
            <VideoControlBarDropdown
                placement="top-end"
                isOpen={this.props.captionDisplayStore.isMenuOpen}
                onToggle={this.props.captionDisplayStore.toggleMenu}
                trigger={button}
            >
                <CaptionsMenuActivePage menuPage={this.props.captionDisplayStore.menuPage} />
            </VideoControlBarDropdown>
        );
    }
}
