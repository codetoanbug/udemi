import {Popover} from '@udemy/react-popup-components';
import {Table} from '@udemy/react-structure-components';
import React from 'react';

import getRequestData from 'utils/get-request-data';
import {formatNumber} from 'utils/numeral';

import AnnouncementTitleCell from './announcement-title-cell.react-component';
import {dateDisplayFormat, initialStatsDate} from './constants';
import './announcement-table.less';

export function getTitleColumn() {
    return {
        fieldName: 'announcement_group__title',
        headerName: gettext('Announcement'),
        initialSortOrder: 'ascending',
        width: '38%',
        wrap: true,
        renderMethod: (announcement) => <AnnouncementTitleCell announcement={announcement} />,
    };
}

export function getCreatedColumn() {
    return {
        fieldName: 'announcement_group__created',
        headerName: gettext('Created'),
        initialSortOrder: 'descending',
        wrap: true,
        renderMethod: (announcement) => (
            <time dateTime={announcement.announcement_group.created}>
                {new Date(announcement.announcement_group.created).toLocaleDateString(
                    getRequestData().locale.replace('_', '-') || 'en-US',
                    dateDisplayFormat,
                )}
            </time>
        ),
    };
}

export function getOpenRateColumn(headerName) {
    return {
        fieldName: 'open_rate',
        headerName,
        initialSortOrder: 'descending',
        type: 'number',
        wrap: true,
        renderMethod: (announcement) => renderPercentage(announcement, 'open_rate'),
    };
}

export function getClickRateColumn(headerName) {
    return {
        fieldName: 'click_rate',
        headerName,
        initialSortOrder: 'descending',
        type: 'number',
        wrap: true,
        renderMethod: (announcement) => renderPercentage(announcement, 'click_rate'),
    };
}

export function getUnsubRateColumn(headerName) {
    return {
        fieldName: 'unsub_rate',
        headerName,
        initialSortOrder: 'descending',
        type: 'number',
        wrap: true,
        renderMethod: (announcement) => renderPercentage(announcement, 'unsub_rate'),
    };
}

export function renderPercentage(announcement, attr) {
    const value = parseFloat(announcement[attr]);
    if (Number.isNaN(value)) {
        return renderNumber(announcement, attr);
    }

    const percent = formatNumber((value * 100).toFixed(2));
    return interpolate(gettext('%(percent)s%'), {percent}, true);
}

export function renderNumber(announcement, attr) {
    const value = parseFloat(announcement[attr]);
    if (!Number.isNaN(value)) {
        return value;
    }
    if (initialStatsDate > new Date(announcement.announcement_group.created)) {
        return '-';
    }
    return '';
}

export function renderTable(props) {
    return (
        <div styleName="table-container">
            <Table padding="xs" noBackgroundColor={true} noBorder={true} {...props} />
        </div>
    );
}

export function renderPopover(title, content) {
    return (
        <Popover
            canToggleOnHover={true}
            withArrow={false}
            placement="bottom"
            styleName="table-heading-popover"
            trigger={<span>{title}</span>}
            detachFromTarget={true}
        >
            {content}
        </Popover>
    );
}
