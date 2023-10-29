import CollapseDiagonalIcon from '@udemy/icons/dist/collapse-diagonal.ud-icon';
import CollapseMinusIcon from '@udemy/icons/dist/collapse-minus.ud-icon';
import ExpandDiagonalIcon from '@udemy/icons/dist/expand-diagonal.ud-icon';
import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import NoteAddIcon from '@udemy/icons/dist/note-add.ud-icon';
import ReloadIcon from '@udemy/icons/dist/reload.ud-icon';
import RewindIcon from '@udemy/icons/dist/rewind.ud-icon';
import VolumeOnIcon from '@udemy/icons/dist/volume-on.ud-icon';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import hotkeyRegistry from 'utils/hotkeys';
import VideoFeedback, {
    VIDEO_FEEDBACK_DURATION,
} from 'video-player/feedback/video-feedback.react-component';

import {HOTKEYS} from './constants';

@inject('fullscreenStore')
@observer
export default class HotkeyFeedback extends React.Component {
    static propTypes = {
        keyMap: PropTypes.array.isRequired,
        fullscreenStore: PropTypes.shape({
            isFullscreen: PropTypes.bool,
        }).isRequired,
    };

    static ICON_MAP = Object.freeze({
        [HOTKEYS.ADD_BOOKMARK]: NoteAddIcon,
        [HOTKEYS.BACK]: RewindIcon,
        [HOTKEYS.FORWARD]: ReloadIcon,
        [HOTKEYS.SLOWER]: CollapseMinusIcon,
        [HOTKEYS.FASTER]: ExpandPlusIcon,
        [HOTKEYS.VOLUME_DOWN]: VolumeOnIcon,
        [HOTKEYS.VOLUME_UP]: VolumeOnIcon,
        [HOTKEYS.MUTE]: VolumeOnIcon,
    });

    componentDidMount() {
        const {keyMap} = this.props;
        this.hotkeyListeners = {};
        keyMap.forEach((shortcut) => {
            this.hotkeyListeners[shortcut.key] = this.onHotkeyPressed.bind(this, shortcut.key);
            hotkeyRegistry.register(shortcut.key, this.hotkeyListeners[shortcut.key]);
        });
    }

    componentWillUnmount() {
        this.props.keyMap.forEach((shortcut) => {
            hotkeyRegistry.unregister(shortcut.key, this.hotkeyListeners[shortcut.key]);
        });
    }

    @observable.ref Icon = null;

    @autobind
    onHotkeyPressed(keyString) {
        let Icon;
        if (keyString === HOTKEYS.TOGGLE_FULLSCREEN) {
            // Again, this relies on this handler being called before the fullscreen toggling handler.
            Icon = this.props.fullscreenStore.isFullscreen
                ? CollapseDiagonalIcon
                : ExpandDiagonalIcon;
        } else {
            Icon = HotkeyFeedback.ICON_MAP[keyString];
        }
        this.showFeedback(Icon);
    }

    @action
    showFeedback(Icon) {
        if (!Icon) {
            return;
        }
        clearTimeout(this.iconTimeout);
        this.Icon = Icon;
        this.iconTimeout = setTimeout(
            action(() => {
                this.Icon = null;
            }),
            VIDEO_FEEDBACK_DURATION,
        );
    }

    render() {
        return this.Icon ? <VideoFeedback icon={this.Icon} /> : null;
    }
}
