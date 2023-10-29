import {Tracker} from '@udemy/event-tracking';
import ThumbDownFilledIcon from '@udemy/icons/dist/thumb-down-filled.ud-icon';
import ThumbDownIcon from '@udemy/icons/dist/thumb-down.ud-icon';
import ThumbUpFilledIcon from '@udemy/icons/dist/thumb-up-filled.ud-icon';
import ThumbUpIcon from '@udemy/icons/dist/thumb-up.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {MouseEvent} from 'react';

import {ReviewFeedbackSubmitEvent, ReviewFeedbackClearEvent} from 'course-landing-page/events';
import HelpfulnessStore from 'course-reviews/display/helpfulness.mobx-store';

import styles from './review-feedback.less';

interface ReviewFeedbackProps {
    helpfulnessStore: HelpfulnessStore;
    frontendTrackingId?: string;
    reviewableObjectId: number;
    reviewableObjectType: string;
    isFeaturedReview?: boolean;
    reviewAuthorName: string;
}

export const ReviewFeedback = observer(
    ({
        helpfulnessStore,
        frontendTrackingId,
        reviewableObjectId,
        reviewableObjectType,
        isFeaturedReview = false,
        reviewAuthorName,
    }: ReviewFeedbackProps) => {
        const handleFeedbackClick = (e: MouseEvent<HTMLButtonElement>) => {
            const {value} = e.currentTarget as HTMLButtonElement;
            const feedbackHelpfulness = value === 'yes';
            if (frontendTrackingId) {
                if (value === helpfulnessStore.value) {
                    Tracker.publishEvent(
                        new ReviewFeedbackClearEvent(
                            frontendTrackingId,
                            helpfulnessStore.reviewId,
                            isFeaturedReview,
                            feedbackHelpfulness,
                            reviewableObjectId,
                            reviewableObjectType,
                        ),
                    );
                } else {
                    Tracker.publishEvent(
                        new ReviewFeedbackSubmitEvent(
                            frontendTrackingId,
                            helpfulnessStore.reviewId,
                            isFeaturedReview,
                            feedbackHelpfulness,
                            reviewableObjectId,
                            reviewableObjectType,
                        ),
                    );
                }
            }
            helpfulnessStore.onToggle(value);
        };

        const ThumbsUpIcon = helpfulnessStore.value === 'yes' ? ThumbUpFilledIcon : ThumbUpIcon;
        const ThumbsDownIcon =
            helpfulnessStore.value === 'no' ? ThumbDownFilledIcon : ThumbDownIcon;
        return (
            <div className={styles['feedback-container']}>
                <span className={classNames('ud-text-xs', styles['feedback-label'])}>
                    {gettext('Helpful?')}
                </span>
                <div className={styles['feedback-actions']}>
                    <IconButton
                        size="small"
                        udStyle="ghost"
                        onClick={handleFeedbackClick}
                        value="yes"
                    >
                        <ThumbsUpIcon
                            label={
                                helpfulnessStore.value === 'yes'
                                    ? interpolate(
                                          gettext('Undo mark review by %(name)s as helpful'),
                                          {name: reviewAuthorName},
                                          true,
                                      )
                                    : interpolate(
                                          gettext('Mark review by %(name)s as helpful'),
                                          {name: reviewAuthorName},
                                          true,
                                      )
                            }
                            color="neutral"
                            size="small"
                        />
                    </IconButton>
                    <IconButton
                        size="small"
                        udStyle="ghost"
                        onClick={handleFeedbackClick}
                        value="no"
                    >
                        <ThumbsDownIcon
                            label={
                                helpfulnessStore.value === 'no'
                                    ? interpolate(
                                          gettext('Undo mark review by %(name)s as unhelpful'),
                                          {name: reviewAuthorName},
                                          true,
                                      )
                                    : interpolate(
                                          gettext('Mark review by %(name)s as unhelpful'),
                                          {name: reviewAuthorName},
                                          true,
                                      )
                            }
                            color="neutral"
                            size="small"
                        />
                    </IconButton>
                </div>
            </div>
        );
    },
);
