import {Dropdown} from '@udemy/react-menu-components';
import {inject, Provider, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

class MenuPopupItem extends React.Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        resourceContextMenuItemProps: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        const {item, resourceContextMenuItemProps} = props;
        const shouldDisable = item.type && item.type.shouldDisable;
        this.resourceContextMenuItemProps = {
            ...resourceContextMenuItemProps,
            disabled: !!shouldDisable && shouldDisable(item.props),
            showCourseRetiredPopover: !!shouldDisable && shouldDisable(item.props),
        };
    }

    render() {
        return (
            <Provider resourceContextMenuItemProps={this.resourceContextMenuItemProps}>
                {this.props.item}
            </Provider>
        );
    }
}

@inject('resourceContext', 'resourceContextMenuProps')
@observer
export default class MenuPopup extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
        resourceContextMenuProps: PropTypes.object.isRequired,
        trackingLabel: PropTypes.string.isRequired,
        trigger: PropTypes.object.isRequired,
        menuItems: PropTypes.array.isRequired,
        hasMenuForOneItem: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.resourceContextMenuItemProps = {
            udStyle: props.menuItems.length > 1 || props.hasMenuForOneItem ? 'list-item' : 'button',
        };
    }

    render() {
        const {menuItems, trigger: givenTrigger} = this.props;

        if (this.resourceContextMenuItemProps.udStyle === 'button') {
            return (
                <MenuPopupItem
                    item={menuItems[0]}
                    resourceContextMenuItemProps={this.resourceContextMenuItemProps}
                />
            );
        }
        const trigger = React.cloneElement(givenTrigger, {
            size: this.props.resourceContextMenuProps.size,
            udStyle: this.props.resourceContextMenuProps.udStyle,
            onClick: this.onClickTrigger,
        });

        return (
            <Dropdown
                detachFromTarget={true}
                placement={this.props.resourceContextMenuProps.placement}
                menuMaxHeight="none"
                menuWidth="large"
                trigger={trigger}
                shouldCloseOtherPoppers={false}
            >
                <Dropdown.Menu data-purpose="context-menu-options">
                    {menuItems.map((item, index) => {
                        return (
                            <MenuPopupItem
                                key={index}
                                item={item}
                                resourceContextMenuItemProps={this.resourceContextMenuItemProps}
                            />
                        );
                    })}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
