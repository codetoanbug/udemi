import SubtitlesIcon from '@udemy/icons/dist/subtitles.ud-icon';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {CaptionDisplayStore} from '../../captions/caption-display.mobx-store';
import {VideoControlBarDropdown} from '../../control-bar/video-control-bar-dropdown.react-component';
import {CaptionsStore} from '../captions.mobx-store';
import {MENU_PAGES} from '../constants';
import {CaptionsSettingsMenu} from './captions-settings-menu.react-component';
import {FontSizeMenu} from './font-size-menu.react-component';
import {OpacityMenu} from './opacity-menu.react-component';
import {TracksMenu} from './tracks-menu.react-component';

interface CaptionsMenuActivePageProps {
    menuPage: any;
    $$udControlBarDropdown: any;
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
@inject('$$udControlBarDropdown')
class CaptionsMenuActivePage extends React.Component<CaptionsMenuActivePageProps> {
    static propTypes = {
        menuPage: PropTypes.oneOf(Object.values(MENU_PAGES)).isRequired,
        $$udControlBarDropdown: PropTypes.object.isRequired,
    };

    onChangeMenu = () => {
        setTimeout(() => {
            const menu = document.getElementById(this.props.$$udControlBarDropdown.menuId);
            const ittems: NodeListOf<Element> | undefined = menu?.querySelectorAll(
                'button,a[href],[tabindex]',
            );
            if (ittems !== undefined) {
                const element: HTMLElement = ittems[0] as HTMLElement;
                element.focus();
            }
        }, 0);
    };

    render() {
        switch (this.props.menuPage) {
            case MENU_PAGES.TRACKS:
                // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                return <TracksMenu onChangeMenu={this.onChangeMenu} />;
            case MENU_PAGES.SETTINGS:
                // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                return <CaptionsSettingsMenu onChangeMenu={this.onChangeMenu} />;
            case MENU_PAGES.FONT_SIZE:
                // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                return <FontSizeMenu onChangeMenu={this.onChangeMenu} />;
            case MENU_PAGES.OPACITY:
                // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                return <OpacityMenu onChangeMenu={this.onChangeMenu} />;
        }
    }
}

interface CaptionsMenuActivePageProps {
    captionDisplayStore: CaptionDisplayStore;
    captionsStore: CaptionsStore;
}
@inject('captionDisplayStore', 'captionsStore')
@observer
export class CaptionsMenu extends React.Component<CaptionsMenuActivePageProps> {
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
                // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                placement="top-end"
                isOpen={this.props.captionDisplayStore.isMenuOpen}
                onToggle={this.props.captionDisplayStore.toggleMenu}
                trigger={button}
            >
                {/* @ts-expect-error */}
                <CaptionsMenuActivePage menuPage={this.props.captionDisplayStore.menuPage} />
            </VideoControlBarDropdown>
        );
    }
}
