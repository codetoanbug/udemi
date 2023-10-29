import {Button} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import {instanceOfComponent} from '@udemy/shared-utils';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import RetiredCoursePopoverWrapper from '../retired-course-popover-wrapper.react-component';

@inject('resourceContextMenuProps', 'resourceContextMenuItemProps')
export default class ContextMenuItem extends React.Component {
    static propTypes = {
        icon: instanceOfComponent('Icon'),
        href: PropTypes.string,
        onClick: PropTypes.func,
        title: PropTypes.string.isRequired,
        resourceContextMenuProps: PropTypes.object.isRequired,
        resourceContextMenuItemProps: PropTypes.object.isRequired,
    };

    static defaultProps = {
        href: null,
        onClick: null,
        icon: null,
    };

    render() {
        const {href, icon, onClick, title, resourceContextMenuItemProps} = this.props;
        const {size, udStyle} = this.props.resourceContextMenuProps;
        const {disabled, showCourseRetiredPopover} = resourceContextMenuItemProps;
        const menuItemProps = {
            componentClass: href ? 'a' : 'button',
            href,
            onClick,
            ...(size && {size}),
            ...(udStyle && {udStyle}),
            ...(disabled && {disabled}),
        };

        const menuItem =
            resourceContextMenuItemProps.udStyle === 'button' ? (
                <Button {...menuItemProps}>
                    {title}
                    {icon}
                </Button>
            ) : (
                <Dropdown.MenuItem
                    color="neutral"
                    icon={icon && React.cloneElement(icon, {color: 'neutral'})}
                    {...menuItemProps}
                >
                    {title}
                </Dropdown.MenuItem>
            );

        const shouldRenderDisabledAndPopover = disabled && showCourseRetiredPopover;

        return shouldRenderDisabledAndPopover ? (
            <RetiredCoursePopoverWrapper trigger={menuItem} />
        ) : (
            menuItem
        );
    }
}

ContextMenuItem.shouldRender = () => true;
