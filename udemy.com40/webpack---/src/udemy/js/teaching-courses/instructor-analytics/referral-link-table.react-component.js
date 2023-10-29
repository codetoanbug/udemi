import OpenInNewIcon from '@udemy/icons/dist/open-in-new.ud-icon';
import {Dropdown} from '@udemy/react-menu-components';
import {Pagination} from '@udemy/react-navigation-components';
import {Table} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import WrapWithText from 'base-components/ungraduated/text/wrap-with-text.react-component';
import {formatNumber} from 'utils/numeral';
import qs from 'utils/query-params';

import {CHANNEL_LABELS, TRAFFIC_AND_CONVERSION_CHANNELS} from './constants';
import InfoTooltip from './info-tooltip.react-component';
/* eslint-disable no-unused-vars,import/order */
import TableColumnHeader from './table-column-header.react-component';
import baseStyles from './instructor-analytics.less';
import styles from './referral-link-table.less';
/* eslint-enable no-unused-vars,import/order */

@withRouter
@inject('store')
@observer
export default class ReferralLinkTable extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    referralTableIndex(index) {
        const {activePage, pageSize} = this.props.store.conversionMetricsStore.referralLinks;
        return pageSize * (activePage - 1) + index + 1;
    }

    @autobind
    toggleChannel(channel) {
        this.props.store.conversionMetricsStore.referralLinks.resetPagination();
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        queryParams.channel = channel;
        this.props.history.push({
            pathname: this.props.location.pathname,
            search: qs.stringify(queryParams),
        });
    }

    render() {
        const {
            activePageData,
            activePage,
            numPages,
            goToPage,
        } = this.props.store.conversionMetricsStore.referralLinks;
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const showChannelColumn = queryParams.channel === TRAFFIC_AND_CONVERSION_CHANNELS.ALL;
        function directHTML(isOutsideSources) {
            return (
                <WrapWithText
                    text={gettext('Direct')}
                    graphic={
                        <InfoTooltip>
                            <p>
                                {gettext(
                                    'Direct traffic is traffic that we don’t have specific information about.' +
                                        ' Here are some example scenarios:',
                                )}
                            </p>
                            <ul>
                                <li>
                                    {gettext(
                                        'Someone directly enters your course’s URL in a browser',
                                    )}
                                </li>
                                <li>
                                    {gettext('Someone clicks a link to your course from an email')}
                                </li>
                                <li>
                                    {gettext(
                                        'Someone clicks a link to your course in a new browser tab',
                                    )}
                                </li>
                                {isOutsideSources && (
                                    <li>
                                        {gettext(
                                            'The pathway someone takes to your landing' +
                                                ' page is otherwise uncategorized',
                                        )}
                                    </li>
                                )}
                            </ul>
                            {!isOutsideSources && (
                                <p>
                                    {gettext(
                                        'Some traffic comes from educational announcements.' +
                                            ' In those cases, you won’t see a coupon code.',
                                    )}
                                </p>
                            )}
                        </InfoTooltip>
                    }
                />
            );
        }
        const channelFilter = (
            <div styleName="styles.channel-filter">
                <div>{gettext('Filter:')}</div>
                <Dropdown
                    placement="bottom-start"
                    trigger={
                        <Dropdown.Button size="small">
                            {CHANNEL_LABELS[queryParams.channel]}
                        </Dropdown.Button>
                    }
                >
                    <Dropdown.Menu>
                        {Object.values(TRAFFIC_AND_CONVERSION_CHANNELS).map((channel) => {
                            if (channel === TRAFFIC_AND_CONVERSION_CHANNELS.UNKNOWN) {
                                return null;
                            }
                            return (
                                <Dropdown.MenuItem
                                    key={channel}
                                    onClick={() => this.toggleChannel(channel)}
                                >
                                    {CHANNEL_LABELS[channel]}
                                </Dropdown.MenuItem>
                            );
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
        return (
            <div>
                <div styleName="baseStyles.heading">
                    <h2 className="ud-heading-lg">
                        {gettext('Top webpages directing traffic to your course')}
                    </h2>
                </div>
                <p>
                    {gettext(
                        'Use this table to understand what webpages are giving you the most traffic',
                    )}
                </p>
                {channelFilter}
                <div
                    styleName="baseStyles.panel styles.ref-link-panel"
                    data-purpose="referral-link-table"
                >
                    <Table
                        padding="xs"
                        noBackgroundColor={true}
                        noBorder={true}
                        columns={[
                            {
                                fieldName: 'number',
                                headerName: (
                                    <TableColumnHeader
                                        className="ud-sr-only"
                                        minWidth={0}
                                        title={'#'}
                                    />
                                ),
                            },
                            {
                                fieldName: 'source',
                                headerName: (
                                    <TableColumnHeader minWidth={200} title={gettext('Source')} />
                                ),
                            },
                            {
                                fieldName: 'channel',
                                headerName: <TableColumnHeader title={gettext('Channel')} />,
                            },
                            {
                                fieldName: 'couponCode',
                                headerName: <TableColumnHeader title={gettext('Coupon code')} />,
                            },
                            {
                                fieldName: 'visitors',
                                headerName: <TableColumnHeader title={gettext('Visitors')} />,
                            },
                        ].filter((col) => col.fieldName !== 'channel' || showChannelColumn)}
                        rows={activePageData.map((referrer, index) => {
                            const referralLink = referrer.ref_link_clean;
                            const channel = referrer.channel;
                            let referralLinkDisplay, referralLinkDomain, referralLinkPath, link;
                            if (referralLink === '' || referralLink === null) {
                                if (
                                    channel === TRAFFIC_AND_CONVERSION_CHANNELS.OUTSIDE ||
                                    channel === TRAFFIC_AND_CONVERSION_CHANNELS.INSTRUCTOR
                                ) {
                                    referralLinkDisplay = directHTML(
                                        channel === TRAFFIC_AND_CONVERSION_CHANNELS.OUTSIDE,
                                    );
                                } else if (channel === TRAFFIC_AND_CONVERSION_CHANNELS.SEARCH) {
                                    return null;
                                } else {
                                    referralLinkDisplay = CHANNEL_LABELS[channel];
                                }
                                link = null;
                            } else {
                                referralLinkDomain = referralLink.split(/\/(.+)/)[0];
                                referralLinkPath = referralLink.split(/\/(.+)/)[1];
                                if (referralLinkPath) {
                                    referralLinkPath = `${referralLinkPath}`.replace(
                                        /\//g,
                                        '/\u200B',
                                    );
                                }
                                link = `http://${referralLink}`;
                            }
                            let couponCode = referrer.coupon_code;
                            if (couponCode) {
                                couponCode = couponCode.toUpperCase();
                            }
                            const couponLink = `${this.props.store.courseManageBaseUrl}course/${queryParams.course_id}/manage/price-and-promotions/?ordering=&page=1&search=${couponCode}&show_inactive=true`;
                            const externalLinkIcon = (
                                <OpenInNewIcon
                                    label={false}
                                    color="inherit"
                                    size="xsmall"
                                    styleName="styles.ext-icon"
                                />
                            );
                            return {
                                number: `${this.referralTableIndex(index)}.`,
                                source: !link ? (
                                    referralLinkDisplay
                                ) : (
                                    <a href={link} target="_blank" rel="noopener noreferrer">
                                        <strong>{referralLinkDomain}</strong>
                                        {!referralLinkPath ? (
                                            externalLinkIcon
                                        ) : (
                                            <>
                                                {'/'}
                                                {referralLinkPath}
                                                {externalLinkIcon}
                                            </>
                                        )}
                                    </a>
                                ),
                                channel: showChannelColumn && CHANNEL_LABELS[channel],
                                couponCode: !couponCode ? (
                                    '--'
                                ) : (
                                    <a href={couponLink} target="_blank" rel="noopener noreferrer">
                                        {couponCode}
                                    </a>
                                ),
                                visitors: formatNumber(referrer.visits),
                            };
                        })}
                    />
                    <Pagination
                        pageCount={numPages}
                        activePage={activePage}
                        onPageChange={goToPage}
                        styleName="baseStyles.pagination"
                    />
                    {activePageData.length === 0 && (
                        <div styleName="styles.no-ref-data">
                            {gettext('No data available for the selected time range')}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
