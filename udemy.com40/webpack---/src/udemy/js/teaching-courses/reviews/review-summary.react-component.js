import {Tooltip, defaultRenderContent} from '@udemy/react-popup-components';
import {Loader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import WrapWithText from 'base-components/ungraduated/text/wrap-with-text.react-component';
import InfoTooltip from 'teaching-courses/instructor-analytics/info-tooltip.react-component';

import styles from './review-summary.less';

const roundRating = (rating) => {
    return rating.toFixed(2);
};

const RatingHeader = ({course}) => {
    const popoverContent = gettext(
        'Course Ratings are calculated from individual ' +
            'students’ ratings and a variety of other signals, ' +
            'like age of rating and reliability, to ensure that ' +
            'they reflect course quality fairly and accurately.',
    );
    return (
        <div styleName="course-info">
            <div styleName="ratings">
                <WrapWithText
                    componentClass="h3"
                    text={gettext('Your Course Rating')}
                    graphic={<InfoTooltip>{popoverContent}</InfoTooltip>}
                />
                <div data-purpose="course-rating">{roundRating(course.rating)}</div>
            </div>
            <div styleName="course-info-divider" />
            <div styleName="ratings">
                <h3>
                    {course.primary_subcategory &&
                        course.primary_subcategory.avg_rating_recent &&
                        gettext('Subcategory Rating')}
                </h3>
                <div data-purpose="subcat-rating">
                    {course.primary_subcategory && course.primary_subcategory.avg_rating_recent
                        ? roundRating(course.primary_subcategory.avg_rating_recent)
                        : gettext('--')}
                </div>
            </div>
        </div>
    );
};

RatingHeader.propTypes = {
    course: PropTypes.object.isRequired,
};

const SurveyAggQuestion = ({surveyAggQuestion}) => {
    const {text, yes, yesPercentage, no, noPercentage, totalCount} = surveyAggQuestion;
    return (
        <Tooltip
            placement="bottom"
            renderContent={({className, ...props}, ...args) => {
                props.className = classNames(className, styles['survey-agg-question-tooltip']);
                return defaultRenderContent(props, ...args);
            }}
            trigger={
                <div styleName="survey-agg-question">
                    {/* See SurveyQuestion.text in LOCALIZED_MODELS. */}
                    {/* eslint-disable-next-line gettext/no-variable-string */}
                    <span styleName="survey-agg-question-text">{gettext(text)}</span>
                    <span styleName="survey-agg-question-graph">
                        <span styleName="graph-bars">
                            {yesPercentage > 0 && (
                                <span
                                    styleName="graph-bars-positive"
                                    style={{flex: yesPercentage}}
                                    data-purpose="positive-bar"
                                >
                                    {yesPercentage >= noPercentage && (
                                        <span data-purpose="yes-percentage">
                                            {interpolate(
                                                gettext('%(percentage)s%'),
                                                {percentage: Math.floor(yesPercentage)},
                                                true,
                                            )}
                                        </span>
                                    )}
                                </span>
                            )}
                            {noPercentage > 0 && (
                                <span
                                    styleName="graph-bars-negative"
                                    style={{flex: noPercentage}}
                                    data-purpose="negative-bar"
                                >
                                    {noPercentage >= yesPercentage && (
                                        <span data-purpose="no-percentage">
                                            {interpolate(
                                                gettext('%(percentage)s%'),
                                                {percentage: Math.floor(noPercentage)},
                                                true,
                                            )}
                                        </span>
                                    )}
                                </span>
                            )}
                        </span>
                        <span data-purpose="total-count">{totalCount}</span>
                    </span>
                </div>
            }
        >
            {interpolate(
                gettext('Total responses: %(totalCount)s (Yes: %(yesCount)s, No: %(noCount)s)'),
                {totalCount, yesCount: yes, noCount: no},
                true,
            )}
        </Tooltip>
    );
};

SurveyAggQuestion.propTypes = {
    surveyAggQuestion: PropTypes.object.isRequired,
};

const SurveyAggContainer = observer(({store}) => {
    if (store.isLoading) {
        return (
            <div styleName="survey-agg-container">
                <Loader block={true} size="large" />
            </div>
        );
    }
    return (
        <div styleName="survey-agg-container" data-purpose="survey-agg-container">
            <div styleName="survey-agg-header">
                <h3>{gettext('Performance by course attribute')}</h3>
                <span>{gettext('Hover for more information')}</span>
            </div>
            <div styleName="survey-agg-questions">
                {store.surveyAggs.map((surveyAgg) => (
                    <SurveyAggQuestion key={surveyAgg.id} surveyAggQuestion={surveyAgg} />
                ))}
            </div>
        </div>
    );
});

SurveyAggContainer.propTypes = {
    store: PropTypes.object.isRequired,
};

@observer
export default class ReviewSummary extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        isRatingEnabled: PropTypes.bool,
    };

    static defaultProps = {
        isRatingEnabled: true,
    };

    render() {
        const {store, isRatingEnabled} = this.props;
        return (
            <div styleName="review-summary-container">
                {isRatingEnabled && <RatingHeader course={store.course} />}
                <SurveyAggContainer store={store} />
            </div>
        );
    }
}
