import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import {Link} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, {Component} from 'react';

import {formatNumber} from 'utils/numeral';

import AreaChart from './area-chart.react-component';
import {trackClick} from './tracking';
import './course-label-metrics-link.less';

export const LINK_ORIGIN = {
    TRENDING: 'trending-topic',
    RELATED: 'related-topic',
    SUGGESTED: 'suggested-topic',
    STUDENT_INTEREST: 'student-interest-topic',
};

export const LINK_SIZE = {
    SMALL: 'small-size',
    LARGE: 'large-size',
};

export default class CourseLabelMetricsLink extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        referer: PropTypes.string,
        className: PropTypes.string,
        lang: PropTypes.string,
        size: PropTypes.string,
        openInNewTab: PropTypes.bool,
        extras: PropTypes.arrayOf(PropTypes.object),
        category: PropTypes.string,
        dataScope: PropTypes.string,
    };

    static defaultProps = {
        referer: undefined,
        className: '',
        lang: 'en',
        size: undefined,
        openInNewTab: false,
        extras: undefined,
        category: undefined,
        dataScope: undefined,
    };

    @autobind
    clickTracker(category, title) {
        trackClick({
            action: 'select',
            category,
            objectType: 'course_label',
            objectId: title,
            actionType: 'select_topic',
        })();
    }

    courseLabelUrl(title, ref, lang) {
        const search = qs.stringify({
            q: title,
            lang,
            ref,
        });
        return `/marketplace-insights/?${search}`;
    }

    render() {
        const {
            title,
            referer,
            size,
            className,
            lang,
            openInNewTab,
            extras,
            category,
            dataScope,
        } = this.props;

        const newTabProps = openInNewTab ? {rel: 'noopener noreferrer', target: '_blank'} : {};

        let styleName = 'block-left-blue';

        if (dataScope === 'all') {
            styleName = 'block-left-all';
        } else if (dataScope === 'ub') {
            styleName = 'block-left-ub';
        }
        return (
            <Link
                to={this.courseLabelUrl(title, referer, lang, category)}
                styleName={classNames('course-label-metrics-link', {
                    'course-label-metrics-link-small': size === LINK_SIZE.SMALL,
                })}
                className={classNames(
                    className,
                    size === LINK_SIZE.SMALL ? 'ud-text-md' : 'ud-text-lg',
                )}
                {...newTabProps}
                onClick={() => this.clickTracker(category, title)}
            >
                <div styleName={styleName} data-purpose="link-left-block" />
                <div styleName="link-title" data-purpose="name">
                    {title}
                </div>
                {extras}
            </Link>
        );
    }
}

export function courseLabelStar(shouldShow) {
    return !shouldShow ? null : (
        <RatingStarIcon
            key="star"
            label={gettext('Recommended for you')}
            color="inherit"
            styleName="star"
            data-purpose="star"
        />
    );
}

export function courseLabelChart(props) {
    const {monthlySearchVolume} = props;
    const series = [
        {
            data: monthlySearchVolume.map((obj) => obj.num_visitor_normalized),
            pointStart: (monthlySearchVolume.length > 0
                ? new Date(monthlySearchVolume[0].month)
                : new Date()
            ).getTime(),
            pointIntervalUnit: 'month',
        },
    ];
    return (
        <div key="chart" styleName="search-trend" data-purpose="search-chart">
            <AreaChart series={series} showXLabels={false} />
        </div>
    );
}

export function courseLabelPopularity(props) {
    const {percent, absolute} = props;
    const absoluteFormatted = formatNumber(absolute);
    const percentFormatted = interpolate(
        gettext('%(percent)s%'),
        {percent: formatNumber((100 * percent).toFixed(2))},
        true,
    );
    return (
        <div key="metrics" styleName="label">
            {percentFormatted}
            <span
                className="ud-text-sm ud-text-bold"
                styleName="secondary-label"
            >{`(${absoluteFormatted})`}</span>
        </div>
    );
}

courseLabelPopularity.propTypes = {
    percent: PropTypes.string.isRequired,
    absolute: PropTypes.string.isRequired,
};

courseLabelChart.propTypes = {
    monthlySearchVolume: PropTypes.arrayOf(PropTypes.number).isRequired,
};
