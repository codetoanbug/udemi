import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {VideoControlBarDropdown} from '../../control-bar/video-control-bar-dropdown.react-component';
import {FONT_SIZES, MENU_PAGES} from '../constants';
import '../../control-bar/video-control-bar-dropdown.less';

interface FontSizeMenuProps {
    captionDisplayStore: any;
    onChangeMenu: any;
}
@inject('captionDisplayStore')
@observer
export class FontSizeMenu extends React.Component<FontSizeMenuProps> {
    static propTypes = {
        captionDisplayStore: PropTypes.object.isRequired,
        onChangeMenu: PropTypes.func.isRequired,
    };

    goToSettings = () => {
        this.props.captionDisplayStore.setSubmenu(MENU_PAGES.SETTINGS);
        this.props.onChangeMenu();
    };

    render() {
        const {captionDisplayStore} = this.props;
        const heading = gettext('Font size');
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
                    {FONT_SIZES.map((fontSize) => (
                        <li key={fontSize}>
                            <VideoControlBarDropdown.MenuItem
                                onClick={() => captionDisplayStore.selectFontSize(fontSize)}
                                aria-checked={captionDisplayStore.activeFontSize === fontSize}
                                role="menuitemradio"
                            >
                                {`${fontSize}%`}
                            </VideoControlBarDropdown.MenuItem>
                        </li>
                    ))}
                </ul>
            </VideoControlBarDropdown.Menu>
        );
    }
}
