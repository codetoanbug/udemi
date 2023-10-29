import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import VideoControlBarDropdown from '../../control-bar/video-control-bar-dropdown.react-component';
import {TRACK_OPACITY, MENU_PAGES} from '../constants';
import '../../control-bar/video-control-bar-dropdown.less';

@inject('captionDisplayStore')
@observer
export default class OpacityMenu extends React.Component {
    static propTypes = {
        captionDisplayStore: PropTypes.object.isRequired,
        onChangeMenu: PropTypes.func.isRequired,
    };

    @autobind
    goToSettings() {
        this.props.captionDisplayStore.setSubmenu(MENU_PAGES.SETTINGS);
        this.props.onChangeMenu();
    }

    render() {
        const {captionDisplayStore} = this.props;
        const heading = gettext('Background opacity');
        return (
            <VideoControlBarDropdown.Menu data-purpose="captions-dropdown-menu">
                <VideoControlBarDropdown.MenuItem
                    onClick={this.goToSettings}
                    data-purpose="go-to-settings"
                    aria-label={gettext('Back to caption settings menu')}
                >
                    <PreviousIcon label={false} color="inherit" styleName="prev-icon" />
                    {heading}
                </VideoControlBarDropdown.MenuItem>
                <li role="separator" />
                <ul className="ud-unstyled-list" role="group" aria-label={heading}>
                    {TRACK_OPACITY.map((opacity) => (
                        <li key={opacity}>
                            <VideoControlBarDropdown.MenuItem
                                onClick={() => captionDisplayStore.selectTrackOpacity(opacity)}
                                aria-checked={captionDisplayStore.activeOpacity === opacity}
                                role="menuitemradio"
                            >
                                {`${opacity}%`}
                            </VideoControlBarDropdown.MenuItem>
                        </li>
                    ))}
                </ul>
            </VideoControlBarDropdown.Menu>
        );
    }
}
