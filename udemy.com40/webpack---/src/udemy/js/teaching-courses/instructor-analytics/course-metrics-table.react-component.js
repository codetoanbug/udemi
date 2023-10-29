import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {Button, Link} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import {Tooltip} from '@udemy/react-popup-components';
import {Table} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {PropTypes as mobxTypes, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import qs from 'utils/query-params';

import TableColumnHeader from './table-column-header.react-component';
import './instructor-analytics.less';

@withRouter
@observer
export default class CourseMetricsTable extends Component {
    static propTypes = {
        metrics: mobxTypes.arrayOrObservableArray.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        columns: PropTypes.array.isRequired,
        defaultPath: PropTypes.string.isRequired,
        sortBy: PropTypes.object,
        onSort: PropTypes.func,
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
    };

    static defaultProps = {
        sortBy: null,
        onSort: null,
        isUBOnlyDataPreviewEnabled: false,
    };

    @autobind
    mapColumnData({data, initialSortOrder, type, sortField, ...props}) {
        return {
            fieldName: data,
            headerName: <TableColumnHeader {...props} />,
            initialSortOrder,
            type,
            sortField,
        };
    }

    render() {
        const {
            metrics,
            columns,
            match,
            defaultPath,
            sortBy,
            onSort,
            isUBOnlyDataPreviewEnabled,
        } = this.props;
        return (
            <Table
                data-purpose="course-metrics-table"
                padding="xs"
                noBackgroundColor={true}
                noBorder={true}
                columns={[
                    this.mapColumnData({
                        data: 'course',
                        title: gettext('Course'),
                        initialSortOrder: 'ascending',
                        minWidth: 0,
                        sortField: 'course.title',
                    }),
                    ...columns.map(this.mapColumnData),
                    this.mapColumnData({
                        className: 'ud-sr-only',
                        data: 'seeDetails',
                        minWidth: 0,
                        title: gettext('See details'),
                    }),
                ]}
                rows={metrics.map((metric) => {
                    const row = {};
                    row.course =
                        isUBOnlyDataPreviewEnabled &&
                        metric.course.is_in_any_ufb_content_collection ? (
                            <>
                                {metric.course.title}
                                <br />
                                <Tooltip
                                    detachFromTarget={true}
                                    placement="right"
                                    trigger={
                                        <Badge
                                            data-purpose="dropdown-course-title-badge"
                                            styleName="ub-user"
                                        >
                                            {'Udemy Business'}
                                        </Badge>
                                    }
                                >
                                    {gettext(
                                        'Udemy Business label indicates that this course is currently in the Udemy Business Collection.',
                                    )}
                                </Tooltip>
                            </>
                        ) : (
                            metric.course.title
                        );
                    columns.forEach((column) => {
                        row[column.data] = metric[column.data];
                    });

                    const queryParams = qs.parse(this.props.location.search, {
                        ignoreQueryPrefix: true,
                    });
                    queryParams.course_id = metric.course.id;
                    row.seeDetails = (
                        <Button
                            componentClass={Link}
                            to={`${match.url}${defaultPath}?${qs.stringify(queryParams)}`}
                            udStyle="link"
                            typography="ud-text-md"
                            styleName="see-details-btn"
                        >
                            {gettext('See details')}
                            <NextIcon label={false} />
                        </Button>
                    );

                    return row;
                })}
                sortBy={sortBy}
                onSort={onSort}
            />
        );
    }
}
