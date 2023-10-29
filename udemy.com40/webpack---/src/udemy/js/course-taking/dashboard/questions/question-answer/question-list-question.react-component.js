import {TrackImpression} from '@udemy/event-tracking';
import QuestionAnswerIcon from '@udemy/icons/dist/question-answer.ud-icon';
import {Avatar, Button, Link} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import requires from '../../../registry/requires';
import {TABS} from '../../constants';
import {convertToPlainText} from './html';
import NumUpvotes from './num-upvotes.react-component';
import QuestionMetadata from './question-metadata.react-component';

import './question-list-question.less';

@requires('courseTakingStore')
@observer
export default class QuestionListQuestion extends React.Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        showResponses: PropTypes.bool.isRequired,
        trackAction: PropTypes.func.isRequired,
        courseTakingStore: PropTypes.shape({
            isMobileViewportSize: PropTypes.bool,
        }).isRequired,
        activeQuestion: PropTypes.object,
        innerRef: PropTypes.object,
    };

    static defaultProps = {
        innerRef: null,
        activeQuestion: null,
    };

    constructor(props) {
        super(props);
        this.questionRef = React.createRef();
    }

    componentDidMount() {
        const {question, activeQuestion} = this.props;

        if (activeQuestion && activeQuestion.id === question.id) {
            this.questionRef.current.focus();
        }
    }

    @autobind
    onToggleUpvoted() {
        const {isUpvoted, toggleUpvoted} = this.props.question;
        const {trackAction} = this.props;
        isUpvoted
            ? trackAction('questions-view.remove-upvote', this.question)
            : trackAction('questions-view.add-upvote', this.question);
        return toggleUpvoted();
    }

    get numUpvotes() {
        const {numUpvotes, isUpvoted} = this.props.question;
        return (
            <NumUpvotes
                numUpvotes={numUpvotes}
                onToggleUpvoted={this.onToggleUpvoted}
                isUpvoted={isUpvoted}
            />
        );
    }

    get responseCount() {
        if (!this.props.showResponses) {
            return null;
        }
        const {numAnswers} = this.props.question;
        return (
            <div data-purpose="response-count">
                <Button
                    componentClass={Link}
                    to={{hash: `#${TABS.QUESTIONS}/${this.props.question.id}`}}
                    data-purpose="question"
                    udStyle="link"
                    styleName="comments-button"
                >
                    <span styleName="num-answers" aria-hidden="true">
                        {numAnswers}
                    </span>
                    <QuestionAnswerIcon
                        label={
                            numAnswers > 0
                                ? ninterpolate('%s Answer', '%s Answers', numAnswers)
                                : gettext('No Answers')
                        }
                        size="medium"
                    />
                </Button>
            </div>
        );
    }

    get bodyText() {
        const {question, courseTakingStore} = this.props;
        if (courseTakingStore.isMobileViewportSize || !question.body) {
            return null;
        }
        const bodyToPlainText = convertToPlainText(question.body);
        // Only say first 20 words in screen reader
        const firstTwentyWords = bodyToPlainText.split(/\s+/g).slice(0, 20).join(' ');
        return (
            <>
                <div
                    tabIndex={0}
                    styleName="sr-body"
                    className="ud-sr-only"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'question-list-question:sr-question-body',
                        html: firstTwentyWords,
                        dataPurpose: 'sr-question-body',
                    })}
                />
                <div
                    className="ud-text-sm"
                    styleName="body"
                    aria-hidden={true}
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'question-list-question:question-body',
                        html: bodyToPlainText,
                        dataPurpose: 'question-body',
                    })}
                />
            </>
        );
    }

    @autobind
    trackEvent() {
        this.props.trackAction('questions-view.impression', this.props.question);
    }

    render() {
        const {question, innerRef} = this.props;
        return (
            <TrackImpression trackFunc={this.trackEvent}>
                <div styleName="question-wrapper">
                    <div>
                        <Avatar
                            alt="DISPLAY_NAME"
                            size="small"
                            srcKey="image_50x50"
                            user={{
                                id: question.user.id,
                                display_name: interpolate(
                                    gettext('Comment from %(userName)s'),
                                    {userName: question.user.displayName},
                                    true,
                                ),
                                image_50x50: question.user.image,
                                initials: question.user.initials,
                            }}
                        />
                    </div>
                    <div styleName="info-container">
                        <div styleName="question-link-row">
                            <div styleName="text-content">
                                <h4 ref={this.questionRef} tabIndex="-1">
                                    <Link
                                        innerRef={innerRef}
                                        to={{hash: `#${TABS.QUESTIONS}/${question.id}`}}
                                        onClick={() => {
                                            this.props.trackAction('open-detail', question);
                                        }}
                                        data-purpose="question"
                                        className="ud-heading-md ud-link-neutral"
                                        role="button"
                                        title={question.title}
                                        styleName="title-link"
                                    >
                                        <span styleName="title">{question.title}</span>
                                    </Link>
                                </h4>
                                {this.bodyText}
                            </div>
                            <div styleName="upvote-response-num-container">
                                {this.numUpvotes}
                                {this.responseCount}
                            </div>
                        </div>
                        <QuestionMetadata {...question} />
                    </div>
                </div>
            </TrackImpression>
        );
    }
}
