import PropTypes from 'prop-types';
import {Component} from 'react';

import * as common from './common';

export default class PromotionalAnnouncementTable extends Component {
    static propTypes = {
        announcements: PropTypes.array.isRequired,
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
                        'Udemy for promotional emails is %(percentage)s%',
                ),
                {percentage: '25'},
                true,
            ),
        );
    }

    renderCTRHeader() {
        return common.renderPopover(
            gettext('CTR'),
            interpolate(
                gettext(
                    'Unique Click Through Rate: Unique number of users who clicked on any link within the announcement / Number ' +
                        'of emails opened. The average CTR on Udemy for promotional emails is %(percentage)s%',
                ),
                {percentage: '9'},
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
                        'average unsubscribe rate on Udemy for promotional emails is %(percentage)s%',
                ),
                {percentage: '0.08'},
                true,
            ),
        );
    }

    render() {
        return common.renderTable({
            caption: gettext('Promotional announcements'),
            onSort: this.props.onSort,
            sortBy: this.props.sortBy,
            rows: this.props.announcements,
            columns: [
                common.getTitleColumn(),
                common.getCreatedColumn(),
                common.getOpenRateColumn(this.renderOpenRateHeader()),
                common.getClickRateColumn(this.renderCTRHeader()),
                common.getUnsubRateColumn(this.renderUnsubscribedHeader()),
            ],
        });
    }
}
