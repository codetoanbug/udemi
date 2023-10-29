import {Loader} from '@udemy/react-reveal-components';
import {Table, defaultRenderRow} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {PropTypes as mobxTypes, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getRequestData from 'utils/get-request-data';
import {noop} from 'utils/noop';

import AssetActions from './asset-actions.react-component';
import AssetStatus from './asset-status.react-component';
import {assetLabels} from './constants';
import './asset-table.less';

@observer
export default class AssetTable extends Component {
    static propTypes = {
        store: PropTypes.shape({
            isDisabled: PropTypes.bool.isRequired,
            isLoading: PropTypes.bool.isRequired,
            isInitialized: PropTypes.bool.isRequired,
            total: PropTypes.number.isRequired,
            sortableFields: PropTypes.array.isRequired,
            assets: PropTypes.oneOfType([mobxTypes.observableArray, PropTypes.array]).isRequired,
            setSortBy: PropTypes.func,
            sortBy: PropTypes.shape({
                fieldName: PropTypes.string,
                ascending: PropTypes.bool,
            }),
        }).isRequired,
        onDelete: PropTypes.func,
        onSelect: PropTypes.func,
        onToggleInfo: PropTypes.func,
        renderAction: PropTypes.func,
        hideTrashWhenDisabled: PropTypes.bool,
    };

    static defaultProps = {
        onDelete: noop,
        onSelect: noop,
        onToggleInfo: noop,
        renderAction: null,
        hideTrashWhenDisabled: false,
    };

    @autobind
    renderAction(asset) {
        if (this.props.renderAction) {
            return <div styleName="action-buttons">{this.props.renderAction(asset)}</div>;
        }

        return (
            <AssetActions
                asset={asset}
                styleName="action-buttons"
                onDelete={this.props.onDelete}
                onSelect={this.props.onSelect}
                onToggleInfo={this.props.onToggleInfo}
                disabled={this.props.store.isDisabled || this.props.store.isLoading}
                hideTrashWhenDisabled={this.props.hideTrashWhenDisabled}
            />
        );
    }

    get columns() {
        const {sortableFields} = this.props.store;
        return [
            {
                fieldName: 'title',
                initialSortOrder: sortableFields.includes('title') ? 'ascending' : null,
                headerName: gettext('Filename'),
            },
            {
                fieldName: 'asset_type',
                initialSortOrder: sortableFields.includes('asset_type') ? 'ascending' : null,
                headerName: gettext('Type'),
            },
            {
                fieldName: 'status',
                initialSortOrder: sortableFields.includes('status') ? 'ascending' : null,
                headerName: gettext('Status'),
            },
            {
                fieldName: 'created',
                initialSortOrder: sortableFields.includes('created') ? 'descending' : null,
                headerName: gettext('Date'),
            },
            {
                fieldName: 'action',
                headerName: gettext('Actions'),
                isScreenReaderOnly: true,
            },
        ];
    }

    @autobind
    renderErrors(asset) {
        return (
            <div className="line-length-md">
                <p className="ud-text-bold">
                    {interpolate(
                        ngettext(
                            'Your %(type)s upload failed for %(errorCount)s reason:',
                            'Your %(type)s upload failed for %(errorCount)s reasons:',
                            asset.processing_errors.length,
                        ),
                        {
                            type: assetLabels[asset.asset_type].toLowerCase(),
                            errorCount: asset.processing_errors.length,
                        },
                        true,
                    )}
                </p>
                <ul className="ud-text-sm ud-text-with-links">
                    {asset.processing_errors.map((error, id) => (
                        <li key={id}>
                            <span>{error.message}</span>
                            {error.help_link && ' '}
                            {error.help_link && (
                                <a href={error.help_link} target="_blank" rel="noopener noreferrer">
                                    {gettext('Get Help')}
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    render() {
        if (!this.props.store.isInitialized) {
            return <Loader block={true} size="large" />;
        }

        let rows = [];
        this.props.store.assets.forEach((asset) => {
            rows.push({
                title: asset.title,
                asset_type: asset.asset_type,
                status: <AssetStatus styleName="asset-status" asset={asset} />,
                created: new Date(asset.created).toLocaleDateString(
                    getRequestData().locale.replace('_', '-') || 'en-US',
                    {year: 'numeric', month: '2-digit', day: '2-digit'},
                ),
                action: this.renderAction(asset),
            });
            if (asset.processing_errors && asset.processing_errors.length) {
                rows.push({extra: this.renderErrors(asset), isOpen: asset.openExtraInfo});
            }
            return rows;
        });

        if (!rows.length) {
            const {isLoading, total} = this.props.store;
            rows = [{empty: true, isLoading, total}];
        }

        const renderRow = (columns, rows, row, rowIndex) => {
            if (!row.extra && !row.empty) {
                return defaultRenderRow(columns, rows, row, rowIndex);
            } else if (row.extra) {
                return (
                    <tr key={rowIndex} style={row.isOpen ? {} : {display: 'none'}}>
                        <td colSpan={columns.length} styleName="full-width">
                            {row.extra}
                        </td>
                    </tr>
                );
            }
            return (
                <tr key={rowIndex}>
                    <td colSpan={columns.length} styleName="full-width">
                        <div styleName="empty">
                            {!row.total && !row.isLoading && gettext('No results found.')}
                            {!row.total && row.isLoading && <Loader size="large" />}
                        </div>
                    </td>
                </tr>
            );
        };

        return (
            <div styleName="asset-table-container" data-purpose="asset-table">
                <Table
                    noBackgroundColor={true}
                    noBorder={true}
                    padding="xs"
                    caption={gettext('Library')}
                    columns={this.columns}
                    rows={rows}
                    renderRow={renderRow}
                    onSort={this.props.store.isDisabled ? noop : this.props.store.setSortBy}
                    sortBy={this.props.store.sortBy}
                />
            </div>
        );
    }
}
