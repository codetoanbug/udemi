import CollapseIcon from '@udemy/icons/dist/collapse.ud-icon';
import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import MenuIcon from '@udemy/icons/dist/menu.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';
import './item-icon-button.less';

const config = {
    collapse: {icon: CollapseIcon, label: gettext('Collapse'), size: 'medium'},
    expand: {icon: ExpandIcon, label: gettext('Expand'), size: 'medium'},
    edit: {icon: EditIcon, label: gettext('Edit')},
    delete: {icon: DeleteIcon, label: gettext('Delete')},
    move: {icon: MenuIcon, label: gettext('Move'), size: 'small'},
};

export default class ItemIconButton extends Component {
    static propTypes = {
        iconType: PropTypes.oneOf(Object.keys(config)).isRequired,
        iconProps: PropTypes.object,
        alwaysShow: PropTypes.bool,
        onClick: PropTypes.func,

        // Typically this is a CurriculumItemModel, but we also use this component
        // for e.g. supplementary assets and assessments. If this is given, we pass it instead
        // of `event` in the onClick callback.
        item: PropTypes.any,
    };

    static defaultProps = {
        iconProps: {},
        alwaysShow: false,
        onClick: null,
        item: null,
    };

    @autobind
    onClick(event) {
        if (this.props.onClick) {
            this.props.onClick(this.props.item || event);
        }
    }

    render() {
        const {iconType, iconProps, alwaysShow, item, ...buttonProps} = this.props;
        const {icon: Icon, ...defaultIconProps} = config[iconType];
        return (
            <IconButton
                componentClass={buttonProps.href ? 'a' : 'button'}
                size="xsmall"
                udStyle="ghost"
                {...buttonProps}
                onClick={this.onClick}
                className={classNames(buttonProps.className, 'ud-link-neutral')}
                styleName={classNames('icon-button', {
                    'icon-button-mobile': isMobileBrowser,
                    'icon-button-always-show': alwaysShow,
                })}
            >
                <Icon {...defaultIconProps} {...iconProps} />
            </IconButton>
        );
    }
}

export const ItemCollapseButton = ({isOpen, ...buttonProps}) => (
    <ItemIconButton {...buttonProps} iconType={isOpen ? 'collapse' : 'expand'} alwaysShow={true} />
);

ItemCollapseButton.propTypes = {
    isOpen: PropTypes.bool.isRequired,
};
