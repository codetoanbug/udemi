import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {Image} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import VideoControlBarDropdown from '../../control-bar/video-control-bar-dropdown.react-component';
import {MENU_PAGES, TRACK_MODES} from '../constants';
import '../../control-bar/video-control-bar-dropdown.less';

@inject('captionDisplayStore', 'captionsStore')
@observer
export default class TracksMenu extends React.Component {
    static propTypes = {
        captionDisplayStore: PropTypes.object.isRequired,
        captionsStore: PropTypes.object.isRequired,
        onChangeMenu: PropTypes.func.isRequired,
    };

    @autobind
    goToSettings() {
        this.props.captionDisplayStore.setSubmenu(MENU_PAGES.SETTINGS);
        this.props.onChangeMenu();
    }

    render() {
        const {captionDisplayStore, captionsStore} = this.props;
        return (
            <VideoControlBarDropdown.Menu data-purpose="captions-dropdown-menu">
                <ul className="ud-unstyled-list" role="group" aria-label={gettext('Captions')}>
                    <li>
                        <VideoControlBarDropdown.MenuItem
                            onClick={() => captionsStore.setActiveCaption(null)}
                            aria-checked={!captionDisplayStore.activeTrack}
                            role="menuitemradio"
                        >
                            {gettext('Off')}
                        </VideoControlBarDropdown.MenuItem>
                    </li>
                    {captionsStore.sortedCaptions.map((track) => (
                        <li key={track.id}>
                            <VideoControlBarDropdown.MenuItem
                                onClick={() => captionsStore.setActiveCaption(track)}
                                aria-checked={track.mode === TRACK_MODES.ACTIVE}
                                role="menuitemradio"
                            >
                                {track.label}
                            </VideoControlBarDropdown.MenuItem>
                        </li>
                    ))}
                </ul>
                {captionsStore.hasMachineTranslatedCaptions && (
                    <VideoControlBarDropdown.MenuItem
                        componentClass="a"
                        href="http://translate.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-purpose="attribution-link"
                    >
                        <Image
                            alt={gettext('Translated by Google')}
                            width={244}
                            height={32}
                            src="/staticx/udemy/images/content-l10n/translated-by-google.png"
                        />
                    </VideoControlBarDropdown.MenuItem>
                )}
                <li role="separator" />
                <VideoControlBarDropdown.MenuItem
                    onClick={this.goToSettings}
                    data-purpose="go-to-settings"
                    aria-haspopup="menu"
                >
                    {gettext('Caption settings')}
                    <NextIcon label={false} color="inherit" styleName="next-icon" />
                </VideoControlBarDropdown.MenuItem>
            </VideoControlBarDropdown.Menu>
        );
    }
}
