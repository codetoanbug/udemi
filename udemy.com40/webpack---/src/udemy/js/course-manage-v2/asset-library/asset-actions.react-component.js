import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import CollapseIcon from '@udemy/icons/dist/collapse.ud-icon';
import DeleteIcon from '@udemy/icons/dist/delete.ud-icon';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import {assetStatuses} from './constants';

@observer
export default class AssetActions extends Component {
    static propTypes = {
        asset: PropTypes.object.isRequired,
        onDelete: PropTypes.func.isRequired,
        onSelect: PropTypes.func.isRequired,
        onToggleInfo: PropTypes.func,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        hideTrashWhenDisabled: PropTypes.bool,
    };

    static defaultProps = {
        onToggleInfo: noop,
        className: '',
        disabled: false,
        hideTrashWhenDisabled: false,
    };

    @autobind
    deleteHandler() {
        return this.props.onDelete(this.props.asset.id);
    }

    @autobind
    selectHandler() {
        return this.props.onSelect(this.props.asset.id);
    }

    @autobind
    toggleInfoHandler() {
        return this.props.onToggleInfo(this.props.asset.id);
    }

    renderDeleteButton(Icon) {
        return (
            <IconButton
                udStyle="ghost"
                size="xsmall"
                disabled={this.props.disabled}
                key={`asset-${this.props.asset.id}-delete`}
                onClick={this.deleteHandler}
                data-purpose="delete-asset-button"
            >
                <Icon label={gettext('Delete')} />
            </IconButton>
        );
    }

    render() {
        const asset = this.props.asset;
        const canDelete = !this.props.hideTrashWhenDisabled || !this.props.disabled;

        const buttons = [];
        if (asset.status === assetStatuses.uploading) {
            canDelete && buttons.push(this.renderDeleteButton(CloseIcon));
        } else if (asset.status === assetStatuses.processing) {
            canDelete && buttons.push(this.renderDeleteButton(DeleteIcon));
        } else if (asset.status === assetStatuses.failed) {
            canDelete && buttons.push(this.renderDeleteButton(DeleteIcon));

            const ToggleIcon = asset.openExtraInfo ? CollapseIcon : ExpandIcon;
            const toggleText = asset.openExtraInfo ? gettext('Collapse') : gettext('Expand');
            buttons.push(
                <IconButton
                    udStyle="ghost"
                    size="xsmall"
                    key={`asset-${asset.id}-show-extra`}
                    onClick={this.toggleInfoHandler}
                    data-purpose="extra-toggle"
                >
                    <ToggleIcon label={toggleText} />
                </IconButton>,
            );
        } else {
            buttons.push(
                <Button
                    udStyle="ghost"
                    size="xsmall"
                    disabled={this.props.disabled}
                    key={`asset-${asset.id}-select`}
                    onClick={this.selectHandler}
                    data-purpose="select-asset-button"
                >
                    {gettext('Select')}
                </Button>,
            );
            canDelete && buttons.push(this.renderDeleteButton(DeleteIcon));
        }

        return <div className={this.props.className}>{buttons}</div>;
    }
}
