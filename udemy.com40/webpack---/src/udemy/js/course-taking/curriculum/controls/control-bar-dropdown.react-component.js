/**
 * Adapted from base-component dropdown.
 * Implements https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-links.html
 *
 * We're intentionally not adding this behavior to the base-component because it's not clear what's
 * a WAI-ARIA "menu", vs what visually matches "Dropdown" in design specs. E.g. in the header nav,
 * profile menu seems like a WAI-ARIA menu, but notifications menu doesn't (it contains tabs).
 * Since WAI-ARIA menu disables Tab key in favor of Up/Down keys, it can be confusing to
 * keyboard-navigate areas that render WAI-ARIA menus and Dropdowns next to each other.
 */
import {FocusCycle, getUniqueId, Keys} from '@udemy/design-system-utils';
import {BlockList, Button} from '@udemy/react-core-components';
import {
    BasicPopper,
    defaultRenderContent as popperRenderContent,
    Tooltip,
} from '@udemy/react-popup-components';
import {tokens, pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './control-bar-dropdown.less';

const htmlPropTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
};

export const ControlBarButton = ({darkMode, tooltipProps, ...props}) => {
    const button = (
        <Button
            udStyle="ghost"
            {...props}
            className={props.className}
            styleName={classNames('trigger', {
                'trigger-dark': darkMode,
                'trigger-small': props.size === 'small',
            })}
        />
    );
    if (!tooltipProps) {
        return button;
    }
    return (
        <Tooltip
            detachFromTarget={false}
            placement="top"
            shouldCloseOtherPoppers={false}
            trigger={button}
            {...tooltipProps}
        />
    );
};

ControlBarButton.propTypes = {
    darkMode: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'large']),
    tooltipProps: PropTypes.object,
    ...htmlPropTypes,
};

ControlBarButton.defaultProps = {
    darkMode: false,
    size: 'large',
    tooltipProps: null,
};

@inject(({$$udControlBarDropdown}) => ({$$udControlBarDropdown}))
@observer
class ControlBarDropdownButton extends React.Component {
    static propTypes = {
        /** Internally used to access the parent Dropdown; don't pass it yourself. */
        $$udControlBarDropdown: PropTypes.object.isRequired,
        ...htmlPropTypes,
    };

    @observable isTooltipOpen = false;

    @autobind @action onToggleTooltip(isOpen) {
        this.isTooltipOpen = !this.props.$$udControlBarDropdown.props.isOpen && isOpen;
    }

    @autobind onKeyDown(event) {
        const isUp = event.keyCode === Keys.UP;
        const isDown = event.keyCode === Keys.DOWN;
        if (isUp || isDown) {
            event.preventDefault();
            const {$$udControlBarDropdown} = this.props;
            !$$udControlBarDropdown.props.isOpen && $$udControlBarDropdown.props.onToggle(true);
            isUp && setTimeout($$udControlBarDropdown.focusOnLastMenuItem, 0);
            isDown && setTimeout($$udControlBarDropdown.focusOnFirstMenuItem, 0);
        }
        this.props.onKeyDown && this.props.onKeyDown(event);
    }

    render() {
        const {$$udControlBarDropdown, ...props} = this.props;
        if (props.tooltipProps) {
            props.tooltipProps = {
                ...props.tooltipProps,
                isOpen: this.isTooltipOpen,
                onToggle: this.onToggleTooltip,
            };
        }
        return <ControlBarButton aria-haspopup="menu" {...props} onKeyDown={this.onKeyDown} />;
    }
}

@inject(({$$udControlBarDropdown}) => ({$$udControlBarDropdown}))
class ControlBarDropdownMenu extends React.Component {
    static propTypes = {
        /** Internally used to access the parent Dropdown; don't pass it yourself. */
        $$udControlBarDropdown: PropTypes.object.isRequired,
    };

    renderListItem(child) {
        if (!child) {
            return null;
        }
        return child.type === 'li' ? child : <li role="none">{child}</li>;
    }

    render() {
        const {$$udControlBarDropdown, ...props} = this.props;
        return (
            <BlockList
                role="menu"
                aria-labelledby={$$udControlBarDropdown.triggerId}
                size="small"
                renderListItem={this.renderListItem}
                {...props}
            />
        );
    }
}

@inject(({$$udControlBarDropdown}) => ({$$udControlBarDropdown}))
class ControlBarDropdownMenuItem extends React.Component {
    static propTypes = {
        /** Internally used to access the parent Dropdown; don't pass it yourself. */
        $$udControlBarDropdown: PropTypes.object.isRequired,
        ...htmlPropTypes,
    };

    @autobind onClick(event) {
        const result = this.props.onClick && this.props.onClick(event);
        if (result === true) {
            this.props.$$udControlBarDropdown.props.onToggle(false);
            setTimeout(() => {
                const trigger = this.props.$$udControlBarDropdown.findTriggerNode();
                trigger && trigger.focus();
            }, 0);
        }
    }

    render() {
        const {$$udControlBarDropdown, children, ...props} = this.props;
        return (
            <BlockList.Item
                componentClass="button"
                role="menuitem"
                tabIndex="-1"
                {...props}
                onClick={this.onClick}
            >
                {children}
                {props.role === 'menuitemcheckbox' && <span styleName="checkbox-slider" />}
            </BlockList.Item>
        );
    }
}

export default class ControlBarDropdown extends React.Component {
    static propTypes = {
        trigger: PropTypes.node.isRequired,
        isOpen: PropTypes.bool.isRequired,
        onToggle: PropTypes.func.isRequired,
        placement: PropTypes.oneOf(['top-start', 'top-end']).isRequired,
        darkMode: PropTypes.bool,
        menuMaxHeight: PropTypes.string,
        menuOffset: PropTypes.string,
    };

    static defaultProps = {
        darkMode: false,
        menuMaxHeight: `${pxToRem(280)}rem`,
        menuOffset: tokens['space-xs'],
    };

    constructor(props, context) {
        super(props, context);
        this.triggerId = this.props.trigger.props.id || getUniqueId('control-bar-dropdown-trigger');
        this.menuId = getUniqueId('control-bar-dropdown-menu');
        this.focusTrappingDialogProps = {findTriggerNode: this.findTriggerNode};
    }

    @autobind findTriggerNode() {
        return document.getElementById(this.triggerId);
    }

    @autobind findMenuItemNodes() {
        const menu = document.getElementById(this.menuId);
        const items = menu ? menu.querySelectorAll('button,a[href],[tabindex]') : [];
        return Array.from(items).filter((item) => {
            return !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true';
        });
    }

    @autobind focusOnFirstMenuItem() {
        const items = this.findMenuItemNodes();
        items[0] && items[0].focus();
    }

    @autobind focusOnLastMenuItem() {
        const items = this.findMenuItemNodes();
        items[items.length - 1] && items[items.length - 1].focus();
    }

    @autobind onToggle(isOpen) {
        this.props.onToggle(isOpen);
        isOpen && setTimeout(this.focusOnFirstMenuItem, 0);
    }

    @autobind renderContent({style, ...props}, ...args) {
        props.style = {...style, marginBottom: this.props.menuOffset};
        return popperRenderContent(props, ...args);
    }

    render() {
        const {children, darkMode, menuMaxHeight, menuOffset, ...props} = this.props;
        return (
            <Provider
                $$udControlBarDropdown={this}
                focusTrappingDialogProps={this.focusTrappingDialogProps}
            >
                <BasicPopper
                    {...props}
                    trigger={React.cloneElement(props.trigger, {id: this.triggerId})}
                    renderContent={this.renderContent}
                    onToggle={this.onToggle}
                >
                    <FocusCycle getCycle={this.findMenuItemNodes}>
                        <div
                            id={this.menuId}
                            styleName={classNames('menu', {'menu-dark': darkMode})}
                            style={{maxHeight: menuMaxHeight}}
                        >
                            {children}
                        </div>
                    </FocusCycle>
                </BasicPopper>
            </Provider>
        );
    }
}

ControlBarDropdown.Button = ControlBarDropdownButton;
ControlBarDropdown.Menu = ControlBarDropdownMenu;
ControlBarDropdown.MenuItem = ControlBarDropdownMenuItem;
