import ArrowLeftIcon from '@udemy/icons/dist/arrow-left.ud-icon';
import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import PropTypes from 'prop-types';
import React from 'react';

import InfoOverlay from './info-overlay.react-component';
import './hotkey-overlay.less';

export default class HotkeyOverlay extends React.Component {
    static propTypes = {
        keyMap: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                key: PropTypes.string.isRequired,
                isShowShortcuts: PropTypes.bool,
            }),
        ).isRequired,
    };

    keyToStringMap = {
        shift: pgettext('Keyboard shift key', 'Shift'),
        space: pgettext('Keyboard spacebar', 'Space'),
        escape: pgettext('Keyboard escape key', 'ESC'),
        left: <ArrowLeftIcon label={false} color="inherit" />,
        up: <ArrowLeftIcon label={false} color="inherit" styleName="arrow-up" />,
        right: <ArrowLeftIcon label={false} color="inherit" styleName="arrow-right" />,
        down: <ArrowLeftIcon label={false} color="inherit" styleName="arrow-down" />,
        slash: '/',
    };

    renderHotkey(hotkey) {
        const keys = hotkey.split('+');
        return (
            <div className="ud-text-md" styleName="hotkey" aria-label={hotkey}>
                {keys.map((key, i) => (
                    <React.Fragment key={key}>
                        <span styleName="key">{this.keyToStringMap[key] || key.toUpperCase()}</span>
                        {i < keys.length - 1 && <ExpandPlusIcon label={false} color="inherit" />}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    renderColumn(col) {
        return (
            <div styleName="col">
                {col.map((shortcut) => (
                    <div key={shortcut.name} className="ud-text-lg" styleName="shortcut">
                        {shortcut.name}
                        {shortcut.key && this.renderHotkey(shortcut.key)}
                    </div>
                ))}
            </div>
        );
    }

    render() {
        const {keyMap, ...props} = this.props;

        const titleShortcut = keyMap.find((shortcut) => shortcut.isShowShortcuts);
        const title = (
            <span styleName="title">
                {titleShortcut ? titleShortcut.name : gettext('Keyboard shortcuts')}
                {titleShortcut && titleShortcut.key && this.renderHotkey(titleShortcut.key)}
            </span>
        );

        const shortcuts = keyMap.filter((shortcut) => !shortcut.isShowShortcuts);
        const split = Math.max(6, Math.ceil(shortcuts.length / 2));
        const col1 = shortcuts.slice(0, split);
        const col2 = shortcuts.slice(split);
        return (
            <InfoOverlay title={title} {...props}>
                <div styleName="shortcuts">
                    {col1.length > 0 && this.renderColumn(col1)}
                    {col2.length > 0 && this.renderColumn(col2)}
                </div>
            </InfoOverlay>
        );
    }
}
