import {Button} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {convertToPlainText} from 'course-taking/dashboard/questions/question-answer/html';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import ReviewStar from '../../simple-quiz/question/review-star.react-component';
import './question-navigation-item.less';

@observer
export default class QuestionNavigationItem extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        highlight: PropTypes.bool.isRequired,
        skipped: PropTypes.bool.isRequired,
        onSelect: PropTypes.func.isRequired,
        onToggleMarkForReview: PropTypes.func.isRequired,
    };

    @autobind
    onClickReviewStar(event) {
        event && event.stopPropagation();
        this.props.onToggleMarkForReview(this.props.question);
    }

    @autobind
    onClick() {
        this.props.onSelect(this.props.question);
    }

    renderReviewStar(question, disabled) {
        if (disabled) {
            return (
                <div styleName="review-star">
                    <ReviewStar label={false} udStyle="transparent" />
                </div>
            );
        }
        return (
            <Button udStyle="link" styleName="review-star" onClick={this.onClickReviewStar}>
                <ReviewStar
                    udStyle={question.isMarkedForReview ? 'accented' : 'subdued'}
                    label={
                        question.isMarkedForReview
                            ? gettext('Unmark for review')
                            : gettext('Mark for review')
                    }
                />
            </Button>
        );
    }

    render() {
        const {question, highlight, skipped} = this.props;
        const clickable = !!question.seen;
        const disabled = !highlight && !question.seen;
        const title = interpolate(
            gettext('Question %(index)s'),
            {index: question.questionIndex},
            true,
        );
        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        return (
            <li
                onClick={clickable ? this.onClick : null}
                data-purpose="question-navigation-item"
                className="ud-text-sm"
                styleName={classNames('item', {highlight, disabled})}
            >
                {/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                {this.renderReviewStar(question, disabled)}
                <div styleName="item-content">
                    <div styleName="title-row">
                        {clickable ? (
                            <Button udStyle="link" styleName="title" typography="ud-heading-sm">
                                {title}
                            </Button>
                        ) : (
                            <div className="ud-heading-sm">{title}</div>
                        )}
                        {skipped && <Badge styleName="skip-label">{gettext('Skipped')}</Badge>}
                    </div>
                    <div
                        styleName="question-row"
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'question-navigation-item:question',
                            html: convertToPlainText(question.promptRichText),
                        })}
                    />
                </div>
            </li>
        );
    }
}
