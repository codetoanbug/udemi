import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import * as common from './common';

export default class EducationalAnnouncementTable extends Component {
    static propTypes = {
        announcements: PropTypes.array.isRequired,
        onRemove: PropTypes.func.isRequired,
        onSort: PropTypes.func.isRequired,
        sortBy: PropTypes.shape({
            fieldName: PropTypes.string, // can be null
            ascending: PropTypes.bool,
        }).isRequired,
    };

    renderOpenRateHeader() {
        return common.renderPopover(
            gettext('Open Rate'),
            interpolate(
                gettext(
                    'Unique Click to Open Rate: Number of emails opened / Number of emails delivered. The average open rate on ' +
                        'Udemy for Announcements is %(percentage)s%',
                ),
                {percentage: '26'},
                true,
            ),
        );
    }

    renderCTRHeader() {
        return common.renderPopover(
            gettext('CTR'),
            interpolate(
                gettext(
                    'Unique Click Through Rate: Unique number of users who clicked on any link within the email / Number of emails opened. ' +
                        'The average CTR on Udemy for Announcements is %(percentage)s%',
                ),
                {percentage: '5'},
                true,
            ),
        );
    }

    renderUnsubscribedHeader() {
        return common.renderPopover(
            gettext('Unsubscribe Rate'),
            interpolate(
                gettext(
                    'Number of people who unsubscribed from this type of email going forward / number of emails delivered. The ' +
                        'average unsubscribe rate on Udemy for Announcements is %(percentage)s%',
                ),
                {percentage: '0.13'},
                true,
            ),
        );
    }

    @autobind
    renderActionsCell(announcement) {
        return (
            <Dropdown
                detachFromTarget={true}
                placement="bottom-end"
                trigger={
                    <IconButton size="small" udStyle="ghost">
                        <MoreIcon label={gettext('Manage announcement')} />
                    </IconButton>
                }
            >
                <Dropdown.Menu>
                    <Dropdown.MenuItem href={announcement.url}>{gettext('View')}</Dropdown.MenuItem>
                    <Dropdown.MenuItem onClick={() => this.props.onRemove(announcement)}>
                        {gettext('Remove')}
                    </Dropdown.MenuItem>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    render() {
        return common.renderTable({
            caption: gettext('Educational announcements'),
            onSort: this.props.onSort,
            sortBy: this.props.sortBy,
            rows: this.props.announcements,
            columns: [
                common.getTitleColumn(),
                common.getCreatedColumn(),
                common.getOpenRateColumn(this.renderOpenRateHeader()),
                common.getClickRateColumn(this.renderCTRHeader()),
                common.getUnsubRateColumn(this.renderUnsubscribedHeader()),
                {
                    fieldName: 'actions',
                    headerName: gettext('Actions'),
                    isScreenReaderOnly: true,
                    width: 1,
                    renderMethod: this.renderActionsCell,
                },
            ],
        });
    }
}
