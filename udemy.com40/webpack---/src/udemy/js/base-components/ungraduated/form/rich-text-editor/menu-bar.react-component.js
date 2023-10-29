import {withI18n} from '@udemy/i18n';
import CodeIcon from '@udemy/icons/dist/code.ud-icon';
import FormatBoldIcon from '@udemy/icons/dist/format-bold.ud-icon';
import FormatItalicIcon from '@udemy/icons/dist/format-italic.ud-icon';
import FormatListBulletIcon from '@udemy/icons/dist/format-list-bullet.ud-icon';
import FormatListNumberIcon from '@udemy/icons/dist/format-list-number.ud-icon';
import ImageIcon from '@udemy/icons/dist/image.ud-icon';
import LinkIcon from '@udemy/icons/dist/link.ud-icon';
import MathIcon from '@udemy/icons/dist/math.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {HEADING_LEVEL, SKIP_FOCUS_FEATURES} from './constants';
import RichTextEditorModel from './rich-text-editor.mobx-model';

@observer
class MenuBar extends Component {
    static propTypes = {
        contentEditable: PropTypes.bool.isRequired,
        doCommand: PropTypes.func.isRequired,
        menuBarPosition: PropTypes.oneOf(['top', 'bottom']),
        model: PropTypes.instanceOf(RichTextEditorModel).isRequired,
        counter: PropTypes.node,
        // gettext and interpolate are supplied by withI18n; do not pass them directly
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
        // eslint-disable-next-line react/require-default-props
        interpolate: PropTypes.func,
    };

    static defaultProps = {
        counter: null,
        menuBarPosition: 'top',
    };

    @autobind
    onClickItem(feature) {
        const focusOnEditor = !SKIP_FOCUS_FEATURES.has(feature);
        this.props.doCommand(feature, {focusOnEditor});
    }

    getItemProps(feature, className) {
        const {model} = this.props;
        const isActive = !!model.activeFormats[feature];
        let isDisabled = false;
        if (!model.isEditorRendered || !this.props.contentEditable) {
            isDisabled = true;
        } else if (model.htmlMode.show) {
            isDisabled = feature !== 'TOGGLE_HTML_MODE';
        } else if (feature === 'UNDO_ANCHOR') {
            isDisabled = !model.anchorForm.isEditing;
        }
        return {
            className: classNames(className, {active: isActive}),
            disabled: isDisabled,
            onClick: () => this.onClickItem(feature),
            'data-purpose': feature,
        };
    }

    getButtonProps() {
        return {size: 'medium', typography: 'ud-text-sm', udStyle: 'ghost'};
    }

    renderButton(feature, children) {
        return !this.props.model.features.has(feature) ? null : (
            <Button
                {...this.getButtonProps()}
                {...this.getItemProps(feature, 'rt-menu-btn ud-link-neutral')}
            >
                {children}
            </Button>
        );
    }

    renderIconButton(feature, Icon, label) {
        return !this.props.model.features.has(feature) ? null : (
            <IconButton
                {...this.getButtonProps()}
                {...this.getItemProps(feature, 'rt-menu-icon-btn ud-link-neutral')}
                title={label}
            >
                <Icon label={label} />
            </IconButton>
        );
    }

    renderDropdown(dropdownProps, triggerText, items) {
        const menuItems = items
            .filter((item) => this.props.model.features.has(item.feature))
            .map(({feature, className, ...props}) => (
                <Dropdown.MenuItem
                    key={feature}
                    {...this.getItemProps(feature, className)}
                    {...props}
                />
            ));
        return !menuItems.length ? null : (
            <Dropdown
                useDrawer={false}
                {...dropdownProps}
                trigger={
                    <Dropdown.Button
                        {...this.getButtonProps()}
                        className="rt-menu-btn ud-link-neutral"
                        disabled={menuItems.every((item) => item.props.disabled)}
                    >
                        {triggerText}
                    </Dropdown.Button>
                }
            >
                <Dropdown.Menu>{menuItems}</Dropdown.Menu>
            </Dropdown>
        );
    }

    render() {
        const {counter, model, menuBarPosition, gettext, interpolate} = this.props;

        return (
            <div className="rt-menu-bar" data-purpose="menu-bar">
                {this.renderDropdown(
                    {placement: menuBarPosition === 'bottom' ? 'top-start' : 'bottom-start'},
                    gettext('Styles'),
                    [
                        {feature: 'SET_PARAGRAPH', children: gettext('Normal text')},
                        {
                            feature: 'TOGGLE_BLOCKQUOTE',
                            className: 'rt-menu-item-blockquote',
                            children: gettext('Quote'),
                        },
                        {
                            feature: 'TOGGLE_HEADING',
                            className: 'rt-menu-item-heading',
                            children: interpolate(
                                gettext('Heading %(number)s'),
                                {number: HEADING_LEVEL},
                                true,
                            ),
                        },
                    ],
                )}
                {this.renderIconButton('TOGGLE_STRONG', FormatBoldIcon, gettext('Bold'))}
                {this.renderIconButton('TOGGLE_EM', FormatItalicIcon, gettext('Italic'))}
                {this.renderIconButton(
                    'TOGGLE_ORDERED_LIST',
                    FormatListNumberIcon,
                    gettext('Numbers'),
                )}
                {this.renderIconButton(
                    'TOGGLE_BULLET_LIST',
                    FormatListBulletIcon,
                    gettext('Bullets'),
                )}
                {this.renderIconButton(
                    'PROMPT_ANCHOR',
                    LinkIcon,
                    model.anchorForm.isEditing ? gettext('Edit link') : gettext('Insert link'),
                )}
                {this.renderIconButton('PROMPT_IMAGE_UPLOAD', ImageIcon, gettext('Image'))}
                {this.renderIconButton('TOGGLE_CODE', CodeIcon, gettext('Code'))}
                {this.renderIconButton('PROMPT_MATH_INSERT', MathIcon, gettext('Math'))}
                <div className="rt-menu-bar-right">
                    {this.renderButton(
                        'TOGGLE_HTML_MODE',
                        model.htmlMode.show ? gettext('Live Preview') : gettext('Edit HTML'),
                    )}
                    {counter}
                </div>
            </div>
        );
    }
}

export default withI18n(MenuBar);
