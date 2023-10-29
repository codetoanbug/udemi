import {Button} from '@udemy/react-core-components';
import {Accordion} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CommentThread from 'base-components/ungraduated/comments/comment-thread.react-component';

import criteriaCommentTextToHTML from './criteria-comment-text-to-html';
import './qrp-feedback-panel-group.less';

@observer
export default class QRPFeedbackPanel extends React.Component {
    static propTypes = {
        qualityFeedbackStore: PropTypes.object.isRequired,
        feedback: PropTypes.object.isRequired,
    };

    @autobind onTogglePanel(expanded) {
        this.props.qualityFeedbackStore.setIsFeedbackOpen(this.props.feedback, expanded);
    }

    @autobind onToggleIsMarkedAsFixed(event) {
        event.stopPropagation();
        this.props.qualityFeedbackStore.toggleIsFeedbackMarkedAsFixed(this.props.feedback);
    }

    @autobind onCreateComment() {
        const {feedback, qualityFeedbackStore} = this.props;
        if (
            !feedback.is_marked_as_fixed &&
            (feedback.rating === 'needs_fix' || feedback.rating === 'acceptable')
        ) {
            qualityFeedbackStore.toggleIsFeedbackMarkedAsFixed(feedback);
        }
    }

    @autobind renderTitle({children, ...props}) {
        const {feedback, qualityFeedbackStore} = this.props;
        const {review} = qualityFeedbackStore;
        return (
            <div styleName="panel-header">
                <div>
                    <h3 {...props}>{children}</h3>
                </div>
                {feedback.rating !== 'exceptional' &&
                    (review.status === 'approved' || review.status === 'needs_fixes') && (
                        <div styleName="toggle-fixed-btn-container">
                            <Button
                                udStyle="ghost"
                                size="medium"
                                typography="ud-text-sm"
                                onClick={this.onToggleIsMarkedAsFixed}
                                disabled={feedback.isMarkingAsFixed}
                            >
                                {feedback.is_marked_as_fixed
                                    ? gettext('Unmark as fixed')
                                    : gettext('Mark as fixed')}
                            </Button>
                        </div>
                    )}
            </div>
        );
    }

    render() {
        const {feedback, qualityFeedbackStore} = this.props;
        const {review} = qualityFeedbackStore;
        const {solution_text: solutionText, solution_url: solutionUrl} = feedback.quality_criteria;
        const isAddressed = feedback.rating !== 'exceptional' && feedback.is_marked_as_fixed;
        return (
            <Accordion.Panel
                expanded={feedback.isOpen}
                onToggle={this.onTogglePanel}
                title={
                    <span className="ud-text-sm" styleName="panel-title">
                        {/* See QualityCriteria.title in LOCALIZED_MODELS. */}
                        {/* eslint-disable-next-line gettext/no-variable-string */}
                        <span>{gettext(feedback.quality_criteria.title)}</span>
                        {isAddressed && <span>{gettext('Addressed')}</span>}
                    </span>
                }
                renderTitle={this.renderTitle}
                styleName={classNames('panel', {'marked-as-fixed': isAddressed})}
            >
                <div>
                    <CommentThread
                        resourceUrl={`/quality-review-processes/${review.id}/quality-criteria-feedbacks/${feedback.id}/comments/`}
                        commentThread={feedback.comment_thread}
                        canReply={
                            review.status === 'needs_fixes' && feedback.rating !== 'exceptional'
                        }
                        createCommentCallback={this.onCreateComment}
                        textToHTML={criteriaCommentTextToHTML}
                    />
                    {(solutionText || solutionUrl) && (
                        <p className="ud-text-with-links" styleName="solution-text">
                            {solutionText}
                            {solutionUrl && ' '}
                            {solutionUrl && <a href={solutionUrl}>{solutionUrl}</a>}
                        </p>
                    )}
                </div>
            </Accordion.Panel>
        );
    }
}
