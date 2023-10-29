import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {noop} from 'utils/noop';
import qs from 'utils/query-params';

import {
    DATE_RANGE,
    DATE_LABELS,
    DEFAULT_DATA_SCOPE_FILTER,
    DATA_SCOPE_FILTERS,
    UB_DATE_LABELS,
    UB_DATE_LABELS_12_PLUS_MONTHS,
    DATE_LABELS_COURSE_ENGAGEMENT,
} from './constants';

@withRouter
@observer
export default class DateFilter extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        dateRangeOptions: PropTypes.array,
        dateRangeOptionsUB: PropTypes.array,
        dateRangeOptionsUB12plus: PropTypes.array,
        placement: PropTypes.string.isRequired,
        size: PropTypes.string,
        filterUpdated: PropTypes.func,
        dataScope: PropTypes.string,
    };

    static defaultProps = {
        dateRangeOptions: [DATE_RANGE.WEEK, DATE_RANGE.MONTH, DATE_RANGE.YEAR, DATE_RANGE.ALL_TIME],
        dateRangeOptionsUB: [DATE_RANGE.MONTH, DATE_RANGE.YEAR, DATE_RANGE.ALL_TIME],
        dateRangeOptionsUB12plus: [DATE_RANGE.MONTH, DATE_RANGE.YEAR, DATE_RANGE.ALL_TIME],
        size: 'medium',
        filterUpdated: noop,
        dataScope: DEFAULT_DATA_SCOPE_FILTER,
    };

    @autobind
    toggleFilter(filter) {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        queryParams.date_filter = filter;
        this.props.history.push({
            pathname: this.props.location.pathname,
            search: qs.stringify(queryParams),
        });
        this.props.filterUpdated(filter);
    }

    render() {
        const {placement, size, dataScope} = this.props;
        const {search, pathname} = this.props.location;

        const isUBScope = dataScope === DATA_SCOPE_FILTERS.UB;
        const isRatingPath = pathname && pathname.includes('overview/rating');
        const isCourseEngagementPath = pathname && pathname.includes('engagement');
        const isUbRatingRequested = isUBScope && isRatingPath;

        const queryParams = qs.parse(search, {ignoreQueryPrefix: true});
        let dateLabels = isUBScope ? UB_DATE_LABELS : DATE_LABELS;

        let dateRangeOptions = isUBScope
            ? this.props.dateRangeOptionsUB
            : this.props.dateRangeOptions;

        if (isUbRatingRequested) {
            dateLabels = UB_DATE_LABELS_12_PLUS_MONTHS;
            dateRangeOptions = [...this.props.dateRangeOptionsUB12plus];
        }

        if (isCourseEngagementPath) {
            dateLabels = DATE_LABELS_COURSE_ENGAGEMENT;
            dateRangeOptions = [...this.props.dateRangeOptions];
        }

        return (
            <Dropdown
                placement={placement}
                trigger={
                    <Dropdown.Button size={size}>
                        {!dateLabels[queryParams.date_filter]
                            ? dateLabels[DATE_RANGE.YEAR]
                            : dateLabels[queryParams.date_filter]}
                    </Dropdown.Button>
                }
            >
                <Dropdown.Menu>
                    {dateRangeOptions.map((opt) => (
                        <Dropdown.MenuItem key={opt} onClick={() => this.toggleFilter(opt)}>
                            {dateLabels[opt]}
                        </Dropdown.MenuItem>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
