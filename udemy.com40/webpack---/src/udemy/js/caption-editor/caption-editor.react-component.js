import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import HotkeyOverlay from 'course-taking/lecture-view/video-viewer/info-overlay/hotkey-overlay.react-component';
import hotkeyRegistry from 'utils/hotkeys';
import * as Controls from 'video-player/control-bar/controls';
import VideoPlayer from 'video-player/video-player.react-component';

import CaptionEditorAlert from './caption-editor-alert.react-component';
import CueList from './cue-list.react-component';
import OptionsBar from './options-bar.react-component';

import './caption-editor.less';

@inject('store')
@observer
export default class CaptionEditor extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    componentDidMount() {
        hotkeyRegistry.registerMap(this.props.store.keyMap);
    }

    componentWillUnmount() {
        hotkeyRegistry.unregisterMap(this.props.store.keyMap);
    }

    ref = React.createRef();

    renderEmptySidebar() {
        return (
            <div styleName="cues-empty">
                <div styleName="cues-empty-content">
                    <h3 className="ud-heading-md">{gettext('This caption file is empty.')}</h3>
                    <p styleName="cues-empty-subtitle">
                        {gettext(
                            'This might be because the lecture does not have any spoken audio, ' +
                                'or because you have uploaded an empty .vtt file.',
                        )}
                    </p>
                </div>
            </div>
        );
    }

    render() {
        const hasCues = !!this.props.store.localCues.length;
        let messages = this.props.store.messages || [];
        messages = messages.map((msg) => <CaptionEditorAlert key={msg.id} message={msg} />);
        const {isProcessing, isSaving} = this.props.store;

        return (
            <div styleName="editor" ref={this.ref}>
                <div styleName="flex player">
                    <VideoPlayer {...this.props.store.playerSettings}>
                        <Controls.PlayToggle />
                        <Controls.RewindSkipButton />
                        <Controls.PlaybackRateMenu />
                        <Controls.ForwardSkipButton />
                        <Controls.ProgressDisplay />
                        <Controls.Spacer />
                        <Controls.VolumeControl />
                        <Controls.SettingsMenu />
                    </VideoPlayer>
                </div>
                <div
                    data-purpose="sidebar"
                    styleName={`flex sidebar${isProcessing || isSaving ? ' disabled' : ''}`}
                >
                    {!hasCues && this.renderEmptySidebar()}
                    {hasCues && messages}
                    {hasCues && <CueList />}
                    {hasCues && <OptionsBar />}
                </div>
                <HotkeyOverlay
                    keyMap={this.props.store.keyMap}
                    isOpen={this.props.store.isHotkeyOverlayVisible}
                    onClose={this.props.store.toggleOverlayVisibility}
                    container={this.ref.current}
                />
            </div>
        );
    }
}
