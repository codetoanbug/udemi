import CollapseIcon from '@udemy/icons/dist/collapse.ud-icon';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import AssetTable from '../asset-library/asset-table.react-component';
import {assetStatuses} from '../asset-library/constants';
import './single-asset-table.less';

/**
 * Renders an <AssetTable /> containing a single asset which can be replaced.
 * The <AssetTable /> used in <AssetLibrary /> contains multiple assets which can only be deleted,
 * not replaced.
 */
@observer
export default class SingleAssetTable extends Component {
    static propTypes = {
        ...AssetTable.propTypes,
        onReplace: PropTypes.func,
    };

    static defaultProps = {
        ...AssetTable.defaultProps,
        onReplace: noop,
    };

    @autobind
    renderAction() {
        const {store, onReplace} = this.props;
        const buttons = [
            <Button
                udStyle="ghost"
                size="xsmall"
                data-purpose="replace-btn"
                key={`single-asset-${store.asset.id}-replace-button`}
                onClick={onReplace}
            >
                {gettext('Replace')}
            </Button>,
        ];

        if (store.asset.status === assetStatuses.failed) {
            const ToggleIcon = store.asset.openExtraInfo ? CollapseIcon : ExpandIcon;
            const toggleText = store.asset.openExtraInfo ? gettext('Collapse') : gettext('Expand');
            buttons.push(
                <IconButton
                    udStyle="ghost"
                    size="xsmall"
                    key={`single-asset-${store.asset.id}-show-extra`}
                    onClick={store.toggleAssetInfo}
                    data-purpose="extra-toggle"
                >
                    <ToggleIcon label={toggleText} />
                </IconButton>,
            );
        }

        return buttons;
    }

    render() {
        const notes = this.props.store.notes;
        return (
            <div data-purpose="single-asset-table">
                <AssetTable store={this.props.store} renderAction={this.renderAction} />
                {notes && <div styleName="notes">{notes}</div>}
            </div>
        );
    }
}
