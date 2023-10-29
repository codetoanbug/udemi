import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Loader from 'course-manage-v2/loader.react-component';
import MainContent from 'course-manage-v2/main-content.react-component';
import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getRequestData from 'utils/get-request-data';

import QRPFeedbackPanelGroup from './qrp-feedback-panel-group.react-component';
import QualityFeedbackStore from './quality-feedback.mobx-store';
import './quality-feedback.less';

const dateFormat = {year: 'numeric', month: 'long', day: 'numeric'};
const datetimeFormat = {...dateFormat, hour: '2-digit', minute: '2-digit', second: '2-digit'};
const qualityChecklistUrl = '/support/229604988/';

@observer
export default class QualityFeedback extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new QualityFeedbackStore(props.courseId);
    }

    componentDidMount() {
        this.store.loadQRPFeedbacks();
    }

    renderSubmittedDate(text, dateString, format) {
        const userLocale = getRequestData().locale.replace('_', '-') || 'en-US';
        const date = new Date(dateString).toLocaleDateString(userLocale, format);
        return <p>{interpolate(text, {date}, true)}</p>;
    }

    renderSubmitRow(review) {
        if (review.status === 'approved' && this.store.unresolvedAcceptableFeedbacksCount > 0) {
            return (
                <div
                    className="ud-text-with-links"
                    styleName="resubmit-row"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'qrp-feedback:approved-cta',
                        html: interpolate(
                            gettext(
                                'Your course is live so it will not be re-reviewed ' +
                                    'but feel free to <a %(attributes)s> email Instructor Support</a> ' +
                                    'with any questions.',
                            ),
                            {attributes: 'href="mailto:instructorsupport@udemy.com"'},
                            true,
                        ),
                    })}
                />
            );
        }
        if (review.status === 'needs_fixes') {
            let note = null;
            if (this.store.unresolvedNeedsFixFeedbacksCount > 0) {
                note = gettext(
                    'Please address all required fixes by replying or marking them ' +
                        'as fixed before resubmitting your course.',
                );
            } else if (this.store.unresolvedAcceptableFeedbacksCount > 0) {
                note = gettext(
                    'Please address all recommended improvements you would like reviewed ' +
                        'prior to resubmitting your course.',
                );
            }
            return (
                <div styleName="resubmit-row">
                    {note}
                    <div styleName="resubmit-btn-row">
                        <Button
                            udStyle="brand"
                            onClick={this.store.resubmitForReview}
                            disabled={!this.store.canResubmitForReview}
                        >
                            {gettext('Resubmit for review')}
                        </Button>
                    </div>
                </div>
            );
        }
        return null;
    }

    renderFeedbacks() {
        const {review, areFeedbacksLoaded} = this.store;
        if (!areFeedbacksLoaded) {
            return <Loader />;
        }
        return (
            <div>
                {review.status === 'approved' && (
                    <p>{gettext('Congratulations, your course is now live in the marketplace!')}</p>
                )}
                {review.status === 'needs_fixes' && (
                    <p>
                        {gettext(
                            'Almost there, there are a few required fixes we need you to ' +
                                'address before your course is published in the marketplace.',
                        )}
                    </p>
                )}
                {(review.status === 'in_review' ||
                    review.status === 'submitted_for_final_review') && (
                    <>
                        <p
                            className="ud-text-with-links"
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'qrp-feedback:in-review-status',
                                html: interpolate(
                                    gettext(
                                        'Your course is currently being reviewed against our ' +
                                            '<a %(attributes)s>quality standards</a>; we will notify ' +
                                            'you once it has been completed. We will also provide ' +
                                            'feedback to increase student engagement and conversion rates.',
                                    ),
                                    {attributes: `href="${qualityChecklistUrl}"`},
                                    true,
                                ),
                            })}
                        />
                        {review.lastSubmittedDate &&
                            this.renderSubmittedDate(
                                gettext('Your course was last submitted for review at: %(date)s.'),
                                review.lastSubmittedDate,
                                datetimeFormat,
                            )}
                    </>
                )}
                {(review.status === 'submitted_for_review' || review.status === 'resubmitted') && (
                    <>
                        <p>{gettext('Congratulations on finishing your course!')}</p>
                        <p styleName="mt-lg">
                            {gettext(
                                'You are just one step away from having your course published on ' +
                                    'Udemy. You have successfully submitted your course for review. ' +
                                    'Our team will review your course in the next 2 business days, ' +
                                    'and get back to you.',
                            )}
                        </p>
                        {review.lastSubmittedDate &&
                            this.renderSubmittedDate(
                                gettext('You submitted your course for review on %(date)s.'),
                                review.lastSubmittedDate,
                                dateFormat,
                            )}
                    </>
                )}
                {review.status === 'draft' && (
                    <p
                        className="ud-text-with-links"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'qrp-feedback:draft-status',
                            html: interpolate(
                                gettext(
                                    'After submitting your course our team will review it against ' +
                                        'our <a %(attributes)s>quality standards</a> and provide ' +
                                        'feedback to increase student engagement and conversion rates.',
                                ),
                                {attributes: `href="${qualityChecklistUrl}"`},
                                true,
                            ),
                        })}
                    />
                )}
                {review.status !== 'in_review' && review.status !== 'submitted_for_final_review' && (
                    <>
                        <QRPFeedbackPanelGroup
                            rating="needs_fix"
                            feedbacks={this.store.needsFixFeedbacks}
                            qualityFeedbackStore={this.store}
                        />
                        <QRPFeedbackPanelGroup
                            rating="acceptable"
                            feedbacks={this.store.acceptableFeedbacks}
                            qualityFeedbackStore={this.store}
                        />
                        <QRPFeedbackPanelGroup
                            rating="exceptional"
                            feedbacks={this.store.exceptionalFeedbacks}
                            qualityFeedbackStore={this.store}
                        />
                        {this.renderSubmitRow(review)}
                    </>
                )}
            </div>
        );
    }

    render() {
        const loading = !this.store.isReviewLoaded;
        return (
            <div>
                <SubHeader title={gettext('Udemy feedback')} />
                <MainContent>{loading ? <Loader /> : this.renderFeedbacks()}</MainContent>
            </div>
        );
    }
}
