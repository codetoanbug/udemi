import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import {Avatar} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {THEMES} from 'base-components/ungraduated/form/rich-text-editor/constants';
import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';
import getConfigData from 'utils/get-config-data';

import requires from '../../../registry/requires';
import AnswerActionMenu from './answer-action-menu.react-component';
import AnswerEditor from './answer-editor.react-component';
import NumUpvotes from './num-upvotes.react-component';

import './answer.less';

const udConfig = getConfigData();

@requires('questionAnswerStore')
@observer
export default class Answer extends React.Component {
    static propTypes = {
        questionAnswerStore: PropTypes.object.isRequired,
        question: PropTypes.object.isRequired,
        answer: PropTypes.object.isRequired,
    };

    @observable isEditAnswerFormVisible = false;

    @autobind
    @action
    showEditForm() {
        this.isEditAnswerFormVisible = true;
    }

    @autobind
    @action
    hideEditForm() {
        this.isEditAnswerFormVisible = false;
    }

    @autobind
    onAnswerEdit() {
        this.hideEditForm();
    }

    @autobind
    toggleUpvote() {
        return this.props.questionAnswerStore.upvoteAnswer(
            this.props.question,
            this.props.answer,
            !this.props.answer.isUpvoted,
        );
    }

    get answerActionMenu() {
        if (!this.props.answer.isMine && !udConfig.features.report_abuse) {
            return null;
        }
        return (
            <AnswerActionMenu
                question={this.props.question}
                answer={this.props.answer}
                onEdit={this.showEditForm}
            />
        );
    }

    get user() {
        const {user} = this.props.answer;
        if (user.isBanned) {
            return <span data-purpose="user-tag">{gettext('Udemy User')}</span>;
        }

        let instructorTag;
        if (this.props.answer.userIsVisibleInstructor) {
            instructorTag = <span styleName="instructor-tag">{gettext(' \u2014 Instructor')}</span>;
        } else if (this.props.answer.isUserInstructor) {
            instructorTag = (
                <span styleName="instructor-tag">{gettext(' \u2014 Teaching Assistant')}</span>
            );
        }
        return (
            <span className="ud-text-with-links" data-purpose="user-tag">
                <a href={user.url} target="_blank" rel="noopener noreferrer">
                    {user.name}
                </a>
                {instructorTag}
            </span>
        );
    }

    get topAnswerBadge() {
        if (!this.props.answer.isTopAnswer) {
            return null;
        }
        return (
            <span styleName="top-answer-badge" data-purpose="top-answer-badge">
                <RatingStarIcon label={gettext('Top answer')} color="inherit" />
                <span aria-hidden={true} styleName="top-answer-badge-text">
                    {gettext('Answer')}
                </span>
            </span>
        );
    }

    @autobind
    renderBody() {
        return <RichTextViewer className="ud-text-sm" unsafeHTML={this.props.answer.body} />;
    }

    get upvote() {
        const {answer} = this.props;
        return (
            <NumUpvotes
                numUpvotes={answer.numUpvotes}
                onToggleUpvoted={this.toggleUpvote}
                isUpvoted={answer.isUpvoted}
            />
        );
    }

    render() {
        const {answer} = this.props;

        return (
            <div styleName={classNames('answer', {'top-answer': answer.isTopAnswer})}>
                <div>
                    <Avatar
                        size="medium"
                        srcKey="image_50x50"
                        alt="NONE"
                        user={{
                            id: answer.user.id,
                            display_name: answer.user.displayName,
                            image_50x50: answer.user.image,
                            initials: answer.user.initials,
                        }}
                    />
                </div>
                <div styleName="info">
                    <div styleName="reply-header-container">
                        <div styleName="user-row">
                            {this.user}
                            {this.topAnswerBadge}
                        </div>
                        <div styleName="reply-header-btns">
                            {this.upvote}
                            {this.answerActionMenu}
                        </div>
                    </div>
                    <div className="ud-text-xs">
                        <RelativeDuration datetime={answer.created} />
                    </div>
                    <div styleName="body">
                        <AnswerEditor
                            isEditing={this.isEditAnswerFormVisible}
                            question={this.props.question}
                            answer={this.props.answer}
                            renderPlaceholder={this.renderBody}
                            extraEditorProps={{
                                placeholder: gettext('Edit your answer here.'),
                                theme: THEMES.Q_AND_A_EDIT,
                            }}
                            submitBtnLabel={gettext('Save')}
                            onSave={this.onAnswerEdit}
                            onCancel={this.hideEditForm}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
