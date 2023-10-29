import {Avatar, Button} from '@udemy/react-core-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {THEMES} from 'base-components/ungraduated/form/rich-text-editor/constants';
import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';

import './question-details.less';
import requires from '../../../registry/requires';
import AnswerEditor from './answer-editor.react-component';
import AnswerModel from './answer.mobx-model';
import Answer from './answer.react-component';
import NumUpvotes from './num-upvotes.react-component';
import QuestionActionMenu from './question-action-menu.react-component';
import QuestionEditor from './question-editor.react-component';
import QuestionMetadata from './question-metadata.react-component';

const udConfig = getConfigData();

@requires('courseTakingStore', 'questionAnswerStore')
@observer
export default class QuestionDetails extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        questionAnswerStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.newAnswer = new AnswerModel();
    }

    @observable isEditingQuestion = false;
    @observable isAddAnswerFormVisible = false;

    get question() {
        return this.props.questionAnswerStore.activeQuestion;
    }

    @autobind
    @action
    showQuestionEditForm() {
        this.isEditingQuestion = true;
    }

    @autobind
    @action
    hideQuestionEditForm() {
        this.isEditingQuestion = false;
    }

    @autobind
    toggleQuestionFollowing() {
        this.props.questionAnswerStore.followQuestion(this.question, !this.question.isFollowing);
    }

    @autobind
    @action
    onAnswerInputFocus() {
        this.isAddAnswerFormVisible = true;
    }

    @autobind
    @action
    onNewAnswer() {
        this.props.questionAnswerStore.trackAction('detail-view.reply-question', this.question);
        if (!this.question.isFollowing) {
            this.props.questionAnswerStore.followQuestion(this.question, true);
        }
        this.isAddAnswerFormVisible = false;
        this.newAnswer = new AnswerModel();
    }

    get questionActionMenu() {
        if (!this.question.isMine && !udConfig.features.report_abuse) {
            return null;
        }
        return <QuestionActionMenu onEdit={this.showQuestionEditForm} />;
    }

    get title() {
        return (
            <h3
                id={`question-${this.question.id}`}
                className="ud-heading-md"
                styleName="title"
                data-purpose="title"
            >
                {this.question.title}
            </h3>
        );
    }

    get editor() {
        return (
            <QuestionEditor
                data-purpose="editor"
                question={this.question}
                showFormLabels={false}
                extraTitleEditorProps={{
                    placeholder: gettext('Edit your question title here'),
                }}
                extraBodyEditorProps={{
                    placeholder: gettext('Edit your question here.'),
                    theme: THEMES.Q_AND_A_EDIT,
                }}
                submitBtnLabel={gettext('Save')}
                onSave={this.hideQuestionEditForm}
                onCancel={this.hideQuestionEditForm}
            />
        );
    }

    get body() {
        return (
            <RichTextViewer
                className="ud-text-sm"
                data-purpose="body"
                unsafeHTML={this.question.body}
            />
        );
    }

    get answers() {
        return this.question.answers.map((answer) => (
            <Answer key={answer.id} question={this.question} answer={answer} />
        ));
    }

    get loadMoreAnswers() {
        if (
            !this.question.numAnswers ||
            this.question.isLoading ||
            this.question.hasFullyLoadedAnswers
        ) {
            return null;
        }
        return (
            <div styleName="load-more-answers">
                <Button
                    udStyle="secondary"
                    styleName="load-more-button"
                    onClick={this.question.loadMore}
                >
                    {gettext('Load more answers')}
                </Button>
            </div>
        );
    }

    @autobind
    renderNewAnswerPlaceholder() {
        return (
            <div styleName="dummy-answer-input-container">
                <Avatar size="medium" srcKey="image_50x50" alt="NONE" user={udMe} />
                <FormGroup label={gettext('Add reply')} labelProps={{className: 'ud-sr-only'}}>
                    <TextInput
                        placeholder={gettext('Add reply')}
                        onFocus={this.onAnswerInputFocus}
                    />
                </FormGroup>
            </div>
        );
    }

    @autobind
    onToggleUpvoted() {
        const {isUpvoted, toggleUpvoted} = this.question;
        const {trackAction} = this.props.questionAnswerStore;
        isUpvoted
            ? trackAction('question-detail.remove-upvote', this.question)
            : trackAction('question-detail.add-upvote', this.question);
        return toggleUpvoted();
    }

    get upvote() {
        return (
            <NumUpvotes
                numUpvotes={this.question.numUpvotes}
                onToggleUpvoted={this.onToggleUpvoted}
                isUpvoted={this.question.isUpvoted}
            />
        );
    }

    get addAnswer() {
        if (this.props.courseTakingStore.areOrgQuestionsDisabled) {
            const text = gettext('Question replying is currently disabled for your organization.');
            return <AlertBanner styleName="add-answer" title={text} showCta={false} />;
        }
        if (
            this.props.courseTakingStore.isUserInstructor &&
            this.props.questionAnswerStore.areNewAnswersDisabled
        ) {
            const text = gettext(
                'Your access to the Q&A replying feature is temporarily suspended. ' +
                    'Please contact <a href="%(supportLink)s">support</a> for more information.',
            );
            return (
                <AlertBanner
                    styleName="add-answer"
                    udStyle="warning"
                    title={gettext('Trust & Safety Alert')}
                    body={
                        <p
                            className="ud-text-with-links"
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'course-taking:qa',
                                html: interpolate(
                                    text,
                                    {supportLink: udLink.toSupportContact()},
                                    true,
                                ),
                            })}
                        />
                    }
                    showCta={false}
                />
            );
        }
        return (
            <div styleName="add-answer">
                <AnswerEditor
                    isEditing={this.isAddAnswerFormVisible}
                    question={this.question}
                    answer={this.newAnswer}
                    renderPlaceholder={this.renderNewAnswerPlaceholder}
                    extraEditorProps={{
                        placeholder: gettext('Write your response'),
                        theme: THEMES.Q_AND_A,
                    }}
                    data-purpose="add-new-question-answer"
                    submitBtnLabel={gettext('Add an answer')}
                    onSave={this.onNewAnswer}
                />
            </div>
        );
    }

    get questionAnswerSeparator() {
        const numAnswers = ninterpolate(
            '%(numReplies)s reply',
            '%(numReplies)s replies',
            this.answers.length,
            {numReplies: this.answers.length},
        );

        return (
            <>
                <div styleName="separator-container">
                    <h4 className="ud-heading-md">{numAnswers}</h4>
                    <Button
                        className="ud-link-neutral"
                        udStyle="link"
                        onClick={this.toggleQuestionFollowing}
                        data-purpose="follow-button"
                    >
                        {this.question.isFollowing
                            ? gettext('Following replies')
                            : gettext('Follow replies')}
                    </Button>
                </div>
            </>
        );
    }

    render() {
        return (
            <div>
                <div styleName="question">
                    <div styleName="avatar-container">
                        <Avatar
                            size="medium"
                            srcKey="image_50x50"
                            alt="NONE"
                            user={{
                                id: this.question.user.id,
                                display_name: this.question.user.displayName,
                                image_50x50: this.question.user.image,
                                initials: this.question.user.initials,
                            }}
                        />
                    </div>
                    <div styleName="info">
                        {!this.isEditingQuestion && (
                            <div styleName="question-header-container">
                                {this.title}
                                <div styleName="question-header-btns">
                                    {this.upvote}
                                    {this.questionActionMenu}
                                </div>
                            </div>
                        )}
                        <QuestionMetadata {...this.question} />
                        <div styleName="body">
                            {this.isEditingQuestion ? this.editor : this.body}
                        </div>
                    </div>
                </div>
                {this.questionAnswerSeparator}
                <div>
                    <div>{this.answers}</div>
                    {this.loadMoreAnswers}
                    {this.addAnswer}
                </div>
            </div>
        );
    }
}
