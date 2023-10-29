import {Avatar, Button} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import {Badge} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {htmlToText} from 'base-components/ungraduated/form/rich-text-editor/helpers';
import udMe from 'utils/ud-me';

import {ITEM_TYPES} from '../curriculum/constants';
import CurriculumItemLoader from '../curriculum/curriculum-item-loader.react-component';
import ItemLink from '../curriculum/item-link.react-component';
import NextItemLink from '../curriculum/next-item-link.react-component';
import requires from '../registry/requires';
import BasePage from './base-page.react-component';
import {PEER_QUESTION_TYPE, PAGES} from './constants';
import FooterButton from './footer-button.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './practice.less';
import styles from './summary-page.less';
/* eslint-enable no-unused-vars,import/order */

const EmptySummaryMessage = () => {
    return (
        <div data-purpose="no-feedback-message" styleName="baseStyles.empty-message">
            <h4 className="ud-heading-md" styleName="baseStyles.empty-message-title">
                {gettext("You don't have any feedback yet")}
            </h4>
            <p>
                {gettext("Don't worry, we'll notify you when you receive feedback on your work.")}
            </p>
        </div>
    );
};

const FeedbackSummaryPanel = ({practice, feedbackSummary}) => {
    const linkUrl = `/summary/${feedbackSummary.userAttemptedPracticeId}/feedback/${feedbackSummary.id}`;

    return (
        <ItemLink
            itemType={ITEM_TYPES.PRACTICE}
            itemId={practice.id}
            subPath={linkUrl}
            styleName="baseStyles.panel styles.summary-panel"
            data-purpose="summary-panel"
        >
            <Avatar
                size="medium"
                user={feedbackSummary.answer.user}
                alt="NONE"
                srcKey="image_50x50"
            />
            <div styleName="styles.summary-panel-info">
                <div className="ud-heading-sm">
                    {interpolate(
                        gettext('%(otherCommenter)s and me'),
                        {otherCommenter: feedbackSummary.otherCommenter.title},
                        true,
                    )}
                    <Badge styleName="baseStyles.green-badge styles.submission-type">
                        {feedbackSummary.submissionOwner.id === udMe.id
                            ? gettext('Self')
                            : gettext('Peer')}
                    </Badge>
                </div>
                <div
                    className="ud-text-sm"
                    styleName="styles.latest-comment"
                    data-purpose="latest-comment-text"
                >
                    {feedbackSummary.latestComment.user.name}
                    {': '}
                    {htmlToText(feedbackSummary.latestComment.body)}
                </div>
            </div>
            <div className="ud-text-sm">
                <RelativeDuration datetime={feedbackSummary.latestComment.created} />
            </div>
        </ItemLink>
    );
};

FeedbackSummaryPanel.propTypes = {
    practice: PropTypes.object.isRequired,
    feedbackSummary: PropTypes.object.isRequired,
};

@requires('courseTakingStore', 'practiceViewStore')
@observer
export default class SummaryPage extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        practiceViewStore: PropTypes.object.isRequired,
    };

    // This observable holds a reordering of values from the practiceViewStore needed for correct presentation.
    @observable feedbackSummaryList = [];
    @observable isSummaryListSet = false;

    @autobind
    onPracticeInitialized() {
        if (!this.props.practiceViewStore.summaryListLoaded) {
            this.props.practiceViewStore.getSummaryPageData().then(() => {
                this.setSummaryList();
            });
        } else {
            // When returning to the summary page after making a comment on a summary detail page,
            // most of the data will already be loaded in the store, but the latest comment will be
            // out of date. We fetch the latest comments here before rendering.
            this.props.practiceViewStore.getLatestComments().then(() => {
                this.setSummaryList();
            });
        }
    }

    _setLatestComment(feedback) {
        if (feedback?.answer?.commentThread?.latest_comment) {
            const {content: body, user, created} = feedback.answer.commentThread.latest_comment;
            return {body, user, created};
        }
        return feedback.answer;
    }

    @action
    setSummaryList() {
        const {userSubmission, assignedSubmissions} = this.props.practiceViewStore;
        const summaryList = [];

        assignedSubmissions
            .filter((submission) => submission.feedbacks.length)
            .forEach((submission) => {
                submission.feedbacks.forEach((feedback) => {
                    if (feedback.answer.commentThread) {
                        const feedbackSummary = Object.assign({}, feedback, {
                            latestComment: this._setLatestComment(feedback),
                            otherCommenter: submission.user,
                            submissionOwner: submission.user,
                            id: feedback.answer.id,
                        });
                        summaryList.push(feedbackSummary);
                    }
                });
            });
        userSubmission.feedbacks.forEach((feedback) => {
            if (feedback.question.type === PEER_QUESTION_TYPE) {
                const feedbackSummary = Object.assign({}, feedback, {
                    latestComment: this._setLatestComment(feedback),
                    otherCommenter: feedback.answer.user,
                    submissionOwner: userSubmission.user,
                    id: feedback.answer.id,
                });
                summaryList.push(feedbackSummary);
            }
        });
        this.feedbackSummaryList = summaryList.sort((firstComment, secondComment) =>
            firstComment.latestComment.created < secondComment.latestComment.created ? 1 : -1,
        );
        this.isSummaryListSet = true;
    }

    @autobind
    renderRightButtons() {
        const {isMediumScreenViewportSize} = this.props.courseTakingStore;
        return (
            <>
                <FooterButton url="/give-feedback/" className="ud-link-neutral" udStyle="ghost">
                    {isMediumScreenViewportSize ? gettext('Back') : gettext('Back to assignment')}
                </FooterButton>
                <Button componentClass={NextItemLink} size="small">
                    {isMediumScreenViewportSize ? gettext('Next') : gettext('Next lecture')}
                </Button>
            </>
        );
    }

    render() {
        const {practice, submissionsLoaded} = this.props.practiceViewStore;
        const isLoaded = submissionsLoaded && this.isSummaryListSet;
        return (
            <BasePage
                onPracticeInitialized={this.onPracticeInitialized}
                renderRightButtons={this.renderRightButtons}
                pageType={PAGES.SUMMARY_PAGE}
            >
                {!isLoaded && <CurriculumItemLoader />}
                {isLoaded && !this.feedbackSummaryList.length && <EmptySummaryMessage />}
                {isLoaded && !!this.feedbackSummaryList.length && (
                    <div data-purpose="feedback-summary-list">
                        <h4 className="ud-heading-md" styleName="styles.title">
                            {gettext('Comments on this assignment')}
                        </h4>
                        {this.feedbackSummaryList.map((feedbackSummary) => (
                            <FeedbackSummaryPanel
                                key={feedbackSummary.id}
                                practice={practice}
                                feedbackSummary={feedbackSummary}
                            />
                        ))}
                    </div>
                )}
            </BasePage>
        );
    }
}
