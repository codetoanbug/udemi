import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import escapeHtml from 'utils/escape/escape-html';
import udLink from 'utils/ud-link';

import CourseLabelMetricsDemand from './course-label-metrics-demand.react-component';
import CourseLabelMetricsLink, {
    LINK_ORIGIN,
    courseLabelChart,
} from './course-label-metrics-link.react-component';
import CourseLabelMetricsOpportunity from './course-label-metrics-opportunity.react-component';
import CourseLabelMetricsSupply from './course-label-metrics-supply.react-component';
import InsightsInputPanel from './insights-input-panel.react-component';
import InsightsStore, {STATE, RESPONSE_TYPE} from './insights.mobx-store';
import OnboardingModal from './onboarding-modal.react-component';
import {trackClick} from './tracking';
import './insights.less';

@withRouter
@observer
export default class Insights extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new InsightsStore(this.props.history);
    }

    componentDidMount() {
        this.store.initializeOnboardingModal();
        this.store.search();
        this.store.setUpRouteListener();
        this.store.getSystemMessagesVisibility();
    }

    componentWillUnmount() {
        this.store.disposeRouteListener();
    }

    @autobind
    search(event) {
        event.preventDefault();
        // The request failed, so the user is retrying.
        this.store.search();
    }

    @autobind
    clickTracker() {
        trackClick({
            action: 'click',
            category: 'topic_feedback',
            actionType: 'create_course',
        })();
    }

    createCourseLink() {
        let query;
        if (this.store.responseType === RESPONSE_TYPE.QUERY) {
            query = this.store.insights.query_metrics.query;
        } else {
            query = this.store.urlQuery.q;
        }
        return udLink.to('course', 'create', {
            ref: 'mkinsights',
            query,
            searchState: this.store.searchState,
            responseType: this.store.responseType,
        });
    }

    renderInput() {
        return <InsightsInputPanel store={this.store} />;
    }

    renderTrending() {
        return (
            <div data-purpose="initial" styleName="rmt-xxl no-topic">
                <div className="ud-text-xl" styleName="text-xl text-center">
                    {gettext('Promising topics')}
                </div>
                <div styleName="mt-md">
                    {this.store.trendingCourseLabelMetricsList.map(
                        (courseLabelMetrics) =>
                            courseLabelMetrics.course_label && (
                                <CourseLabelMetricsLink
                                    title={courseLabelMetrics.course_label.display_name}
                                    referer={LINK_ORIGIN.TRENDING}
                                    extras={[
                                        courseLabelChart({
                                            monthlySearchVolume:
                                                courseLabelMetrics.monthly_search_volume,
                                        }),
                                    ]}
                                    category="promising_topics"
                                    lang={courseLabelMetrics.course_lang}
                                    styleName="trending-topic"
                                    key={courseLabelMetrics.course_label.id}
                                />
                            ),
                    )}
                </div>
            </div>
        );
    }

    renderSearching() {
        return <MainContentLoader styleName="rmt-xxl" />;
    }

    renderError() {
        return (
            <div
                data-purpose="error"
                className="ud-text-xl"
                styleName="text-xl text-center rmt-xxl"
            >
                <LocalizedHtml
                    html={gettext('Oops, something went wrong. <a class="link">Try again</a>.')}
                    interpolate={{
                        link: (
                            <Button
                                udStyle="link"
                                onClick={this.search}
                                typography="ud-text-xl"
                                className="ud-link-underline"
                                styleName="text-xl"
                            />
                        ),
                    }}
                />
            </div>
        );
    }

    renderNoResults() {
        return (
            <div data-purpose="no-topic" styleName="rmt-xxl no-topic">
                <div className="ud-text-xl" styleName="text-xl text-center">
                    {gettext('Please try a different variation of your search')}
                </div>
                <div styleName="mt-lg">
                    {gettext('Your search may be too narrow or too broad. Please try again.')}
                </div>
                <div styleName="mt-lg">
                    <LocalizedHtml
                        html={interpolate(
                            gettext(
                                'If you are still unable to get results then this could be an opportunity ' +
                                    'for you to <a class="link">create Udemy’s first course</a> on %(topic)s.',
                            ),
                            {topic: escapeHtml(this.store.urlQuery.q)},
                            true,
                        )}
                        interpolate={{
                            link: (
                                <a
                                    className="ud-link-underline"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={this.createCourseLink()}
                                />
                            ),
                        }}
                    />
                </div>
            </div>
        );
    }

    renderCourseLabelMetrics() {
        const courseLabelMetrics = this.store.insights.course_label_metrics;
        const showMkInsightsDataChangeAlert = this.store.showMkInsightsDataChangeAlert;
        return (
            <div data-purpose="course-label-metrics">
                <CourseLabelMetricsOpportunity
                    courseLabelMetrics={courseLabelMetrics}
                    showMkInsightsDataChangeAlert={showMkInsightsDataChangeAlert}
                />
                <CourseLabelMetricsDemand courseLabelMetrics={courseLabelMetrics} />
                <CourseLabelMetricsSupply courseLabelMetrics={courseLabelMetrics} />
            </div>
        );
    }

    renderCourseLabelSuggestions() {
        return (
            <div styleName="rmt-xxl no-topic">
                <div className="ud-text-xl" styleName="text-xl text-center">
                    {gettext('Check out related Udemy Topics below:')}
                </div>
                <div styleName="mt-md">
                    {this.store.insights.course_label_suggestions.map((courseLabelMetrics) => (
                        <CourseLabelMetricsLink
                            title={courseLabelMetrics.course_label.display_name}
                            referer={LINK_ORIGIN.SUGGESTED}
                            extras={[
                                courseLabelChart({
                                    monthlySearchVolume: courseLabelMetrics.monthly_search_volume,
                                }),
                            ]}
                            category="related_topics"
                            lang={courseLabelMetrics.course_lang}
                            styleName="trending-topic"
                            key={courseLabelMetrics.course_label.id}
                        />
                    ))}
                </div>
                <div className="ud-text-xl" styleName="text-xl text-center rmt-xxl">
                    {gettext("Don't see a match?")}
                </div>
                <div styleName="mt-md">
                    <LocalizedHtml
                        html={interpolate(
                            gettext(
                                'This could be a great opportunity for you to <a class="link">create Udemy’s first course</a> on %(topic)s.',
                            ),
                            {topic: escapeHtml(this.store.urlQuery.q)},
                            true,
                        )}
                        interpolate={{
                            link: (
                                <a
                                    className="ud-link-underline"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={this.createCourseLink()}
                                />
                            ),
                        }}
                    />
                </div>
            </div>
        );
    }

    renderQueryMetrics() {
        return (
            <div data-purpose="query-metrics" styleName="rmt-xxl no-topic">
                <div className="ud-text-xl" styleName="text-xl text-center">
                    {gettext('This looks like a great opportunity!')}
                </div>
                <div styleName="mt-lg">
                    {gettext(
                        'Over 100 distinct people search for this query on Udemy every month! ' +
                            "We don't have a course on Udemy focused on this topic. " +
                            'Be the first person to create a course on this topic.',
                    )}
                </div>
                <div styleName="text-center mt-lg">
                    <Button
                        udStyle="brand"
                        rel="noopener noreferrer"
                        target="_blank"
                        onClick={this.clickTracker}
                        componentClass="a"
                        href={this.createCourseLink()}
                    >
                        {gettext('Create Your Course')}
                    </Button>
                </div>
            </div>
        );
    }

    renderCourseLabelNoDemand() {
        const courseLabelMetrics = this.store.insights.course_label_metrics;
        const subHeading = ninterpolate(
            'However, there is currently 1 course on Udemy with this primary Topic. ' +
                "This could be a brand new Topic for Udemy or a Topic with courses that haven't been promoted in recent months.",
            'However, there are currently %s courses on Udemy with this primary Topic. ' +
                "This could be a brand new Topic for Udemy or a Topic with courses that haven't been promoted in recent months.",
            courseLabelMetrics.num_course,
        );
        return (
            <div data-purpose="course-label-metrics-no-demand" styleName="rmt-xxl no-topic">
                <div className="ud-text-xl" styleName="text-xl text-center">
                    {gettext('There is no data available for the last 3 months')}
                </div>
                <div styleName="mt-lg">{subHeading}</div>
            </div>
        );
    }

    render() {
        const store = this.store;
        const input = this.renderInput();
        const onboardingModal = <OnboardingModal store={store} />;

        let content = '';
        if (store.searchState === STATE.INITIAL) {
            if (store.trendingCourseLabelMetricsState === STATE.SEARCHING) {
                content = this.renderSearching();
            } else if (store.trendingCourseLabelMetricsList.length > 0) {
                content = this.renderTrending();
            }
        } else if (store.searchState === STATE.SEARCHING) {
            content = this.renderSearching();
        } else if (store.searchState === STATE.ERROR) {
            content = this.renderError();
        } else if (store.searchState === STATE.NO_RESULTS) {
            content = this.renderNoResults();
        } else if (
            store.searchState === STATE.DONE &&
            store.responseType === RESPONSE_TYPE.COURSE_LABEL
        ) {
            if (store.insights.course_label_metrics.hasNoDemand) {
                content = this.renderCourseLabelNoDemand();
            } else {
                content = this.renderCourseLabelMetrics();
            }
        } else if (
            store.searchState === STATE.DONE &&
            store.responseType === RESPONSE_TYPE.SUGGESTIONS
        ) {
            content = this.renderCourseLabelSuggestions();
        } else if (store.searchState === STATE.DONE && store.responseType === RESPONSE_TYPE.QUERY) {
            content = this.renderQueryMetrics();
        } else {
            throw new Error('Unknown state.');
        }

        return (
            <div styleName="insights">
                {input}
                {content}
                {onboardingModal}
            </div>
        );
    }
}
