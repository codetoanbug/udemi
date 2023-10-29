import {Tracker} from '@udemy/event-tracking';
import ThumbDownIcon from '@udemy/icons/dist/thumb-down.ud-icon';
import ThumbUpIcon from '@udemy/icons/dist/thumb-up.ud-icon';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ReportAbuseDesktop, ReportAbuseMobile} from 'course-landing-page/components/report-abuse/';
import {
    ReviewFeedbackSubmitEvent,
    ReviewFeedbackClearEvent,
    ReviewReportEvent,
} from 'course-landing-page/events';
import HelpfulnessStore from 'course-reviews/display/helpfulness.mobx-store';
import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';

import {REVIEW_FEEDBACK_MESSAGES} from './constants';
import HelpfulButton from './helpful-button.react-component';
import styles from './review-feedback.less';

const options = {
    YES: {
        value: 'yes',
        icon: ThumbUpIcon,
        labels: {
            get selected() {
                return gettext('Undo mark as helpful');
            },
            get notSelected() {
                return gettext('Mark as helpful');
            },
        },
        className: 'thumb_up',
    },
    NO: {
        value: 'no',
        icon: ThumbDownIcon,
        labels: {
            get selected() {
                return gettext('Undo mark as unhelpful');
            },
            get notSelected() {
                return gettext('Mark as unhelpful');
            },
        },
        className: 'thumb_down',
    },
};

@observer
export default class ReviewFeedback extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(HelpfulnessStore).isRequired,
        className: PropTypes.string,
        courseTrackingId: PropTypes.string,
        reviewableObjectId: PropTypes.number,
        reviewableObjectType: PropTypes.string,
        isFeaturedReview: PropTypes.bool,
    };

    static defaultProps = {
        className: undefined,
        courseTrackingId: undefined,
        reviewableObjectId: undefined,
        reviewableObjectType: undefined,
        isFeaturedReview: false,
    };

    @autobind
    handleFeedbackClick(value) {
        const feedbackHelpfulness = options.YES.value === value;
        const {
            courseTrackingId,
            isFeaturedReview,
            reviewableObjectId,
            reviewableObjectType,
        } = this.props;
        const {reviewId} = this.props.store;
        if (courseTrackingId) {
            if (value === this.props.store.value) {
                Tracker.publishEvent(
                    new ReviewFeedbackClearEvent(
                        courseTrackingId,
                        reviewId,
                        isFeaturedReview,
                        feedbackHelpfulness,
                        reviewableObjectId,
                        reviewableObjectType,
                    ),
                );
            } else {
                Tracker.publishEvent(
                    new ReviewFeedbackSubmitEvent(
                        courseTrackingId,
                        reviewId,
                        isFeaturedReview,
                        feedbackHelpfulness,
                        reviewableObjectId,
                        reviewableObjectType,
                    ),
                );
            }
        }
        this.props.store.onToggle(value);
    }

    @autobind
    handleReportClick() {
        const {
            courseTrackingId,
            isFeaturedReview,
            reviewableObjectId,
            reviewableObjectType,
        } = this.props;
        const {reviewId} = this.props.store;
        if (courseTrackingId) {
            Tracker.publishEvent(
                new ReviewReportEvent(
                    courseTrackingId,
                    reviewId,
                    isFeaturedReview,
                    reviewableObjectId,
                    reviewableObjectType,
                ),
            );
        }
    }

    render() {
        if (!getConfigData().features.course_review.leave_feedback) {
            return null;
        }
        const {value, reviewId} = this.props.store;
        const ReportAbuseComponent = getRequestData().isMobile
            ? ReportAbuseMobile
            : ReportAbuseDesktop;
        return (
            <div className={this.props.className}>
                <p styleName="review-feedback__title" data-purpose="helpfulness-prompt">
                    {value ? REVIEW_FEEDBACK_MESSAGES.SUCCESS : REVIEW_FEEDBACK_MESSAGES.TITLE}
                </p>
                <div styleName="review-feedback__actions">
                    {Object.keys(options).map((key) => {
                        const option = options[key];
                        return (
                            <HelpfulButton
                                key={`button_${option.value}`}
                                data-purpose={`helpful-button-${option.value}`}
                                className={styles[`review-feedback__actions-${option.className}`]}
                                icon={option.icon}
                                labels={option.labels}
                                value={option.value}
                                isSelected={value === option.value}
                                onClick={this.handleFeedbackClick}
                            />
                        );
                    })}
                    <ReportAbuseComponent
                        className="ud-text-sm"
                        styleName="review-report-abuse"
                        objectId={reviewId}
                        objectType="coursereview"
                        onClick={this.handleReportClick}
                        size="medium"
                        text={gettext('Report')}
                    />
                </div>
            </div>
        );
    }
}
