import {LocalizedHtml} from '@udemy/i18n';
import CancelIcon from '@udemy/icons/dist/cancel.ud-icon';
import QuizIcon from '@udemy/icons/dist/quiz.ud-icon';
import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {Avatar, Button} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import {FormGroup, TextArea} from '@udemy/react-form-components';
import {StarRating} from '@udemy/react-merchandising-components';
import {Badge} from '@udemy/react-messaging-components';
import {ShowMore} from '@udemy/react-reveal-components';
import {observer, PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ReportAbuseModalTrigger from 'report-abuse/report-abuse-modal-trigger.react-component';
import ReportAbuseTooltip from 'report-abuse/report-abuse-tooltip.react-component';
import udMe from 'utils/ud-me';

import './review.less';

function renderCreatedOrModified(created, modified) {
    const date = <RelativeDuration datetime={modified} />;
    return (
        <LocalizedHtml
            html={
                created === modified
                    ? gettext('Posted <span class="postedDate"></span>')
                    : gettext('Updated <span class="updatedDate"></span>')
            }
            interpolate={{postedDate: date, updatedDate: date}}
        />
    );
}

const Header = ({review, isUBOnlyDataPreviewEnabled}) => (
    <div styleName="user" data-purpose="user-of-review">
        <Avatar user={review.user} alt="NONE" size="medium" srcKey="image_50x50" />
        <div styleName="user-details">
            <a href={review.user.url}>{`${review.user.display_name} `}</a>
            {isUBOnlyDataPreviewEnabled && review.user.is_ub_user && (
                <Badge styleName="ub-user" data-purpose="tag-ub-user">
                    {'Udemy Business'}
                </Badge>
            )}
            <div styleName="review-leave-time">
                {renderCreatedOrModified(review.created, review.user_modified)}
            </div>
        </div>
        <div styleName="report-abuse-container">
            <ReportAbuseModalTrigger
                objectId={review.id}
                objectType="coursereview"
                trigger={
                    <ReportAbuseTooltip className="ud-link-neutral" styleName="report-abuse" />
                }
            />
        </div>
    </div>
);

Header.propTypes = {
    review: PropTypes.object.isRequired,
    isUBOnlyDataPreviewEnabled: PropTypes.bool,
};

Header.defaultProps = {
    isUBOnlyDataPreviewEnabled: false,
};

const SurveyAnswer = ({surveyAnswer}) => {
    const optionCode = surveyAnswer.answer_option_text_code;

    let icon, iconLabel;
    if (optionCode === 'yes') {
        iconLabel = gettext('Positive feedback');
        icon = <SuccessIcon label={iconLabel} color="positive" styleName="survey-answer-icon" />;
    } else if (optionCode === 'no') {
        iconLabel = gettext('Negative feedback');
        icon = <CancelIcon label={iconLabel} color="negative" styleName="survey-answer-icon" />;
    } else {
        iconLabel = gettext('Neutral feedback');
        icon = <QuizIcon label={iconLabel} color="neutral" styleName="survey-answer-icon" />;
    }

    return (
        <div styleName="survey-answer-container">
            {icon}
            {/* See SurveyQuestion.text_short in LOCALIZED_MODELS. */}
            {/* eslint-disable-next-line gettext/no-variable-string */}
            <span>{gettext(surveyAnswer.question_text_short)}</span>
        </div>
    );
};

SurveyAnswer.propTypes = {
    surveyAnswer: PropTypes.object.isRequired,
};

const SurveyAnswersContainer = ({surveyAnswers}) => {
    return (
        <div styleName="survey-answers-container">
            {surveyAnswers.map((surveyAnswer) => {
                return <SurveyAnswer surveyAnswer={surveyAnswer} key={surveyAnswer.id} />;
            })}
        </div>
    );
};

SurveyAnswersContainer.propTypes = {
    surveyAnswers: mobxTypes.arrayOrObservableArray.isRequired,
};

const ReviewResponseDisplay = ({store}) => {
    const {response} = store.review;
    return (
        <div styleName="response" data-purpose="review-response-display">
            <div styleName="user">
                <Avatar user={response.user} alt="NONE" size="medium" srcKey="image_50x50" />
                <div>
                    <div className="ud-heading-md">{gettext('Instructor')}</div>
                    <div styleName="response-user-text">
                        <a href={response.user.url}>{response.user.display_name}</a>
                        <span styleName="review-leave-time">
                            {renderCreatedOrModified(response.created, response.modified)}
                        </span>
                    </div>
                </div>
            </div>
            {response.content && (
                <ShowMore collapsedHeight={75} withGradient={true}>
                    {response.content}
                </ShowMore>
            )}
            <div>
                <Button udStyle="secondary" size="xsmall" onClick={store.onToggleResponseForm}>
                    {gettext('Edit Response')}
                </Button>
            </div>
        </div>
    );
};

ReviewResponseDisplay.propTypes = {
    store: PropTypes.object.isRequired,
};

const ReviewResponseForm = observer(({store}) => (
    <div data-purpose="review-response-form">
        {store.showResponseForm ? (
            <form styleName="response-form" data-purpose="review-response-form-text">
                <FormGroup
                    label={gettext('Respond to user review')}
                    labelProps={{className: 'ud-sr-only'}}
                >
                    <TextArea
                        autoFocus={true}
                        placeholder={gettext('Respond to this review')}
                        value={store.response}
                        onChange={store.onResponseChange}
                    />
                </FormGroup>
                {store.review.response && (
                    <Button
                        className="ud-link-neutral"
                        udStyle="ghost"
                        onClick={store.onDeleteResponse}
                        size="xsmall"
                    >
                        {gettext('Delete Response')}
                    </Button>
                )}
                <div styleName="response-form-buttons">
                    {store.review.response ? (
                        <Button size="xsmall" onClick={store.onResponseSubmit}>
                            {gettext('Update Response')}
                        </Button>
                    ) : (
                        <Button
                            size="xsmall"
                            onClick={store.onResponseSubmit}
                            data-purpose="post-response-button"
                        >
                            {gettext('Post Response')}
                        </Button>
                    )}
                    <Button
                        className="ud-link-neutral"
                        size="xsmall"
                        udStyle="ghost"
                        onClick={store.onToggleResponseForm}
                        data-purpose="cancel-button"
                    >
                        {gettext('Cancel')}
                    </Button>
                </div>
            </form>
        ) : (
            <Button
                udStyle="secondary"
                size="xsmall"
                onClick={store.onToggleResponseForm}
                data-purpose="respond-button"
            >
                {gettext('Respond')}
            </Button>
        )}
    </div>
));

ReviewResponseForm.propTypes = {
    store: PropTypes.object.isRequired,
};

const ResponseContainer = observer(({store}) => {
    const visibleInstructorIds = store.review.course.visible_instructors.map((ins) => ins.id);
    if (!visibleInstructorIds.includes(udMe.id)) {
        return null;
    }
    return (
        <div data-purpose="response-container">
            {store.review.response && !store.showResponseForm ? (
                <ReviewResponseDisplay store={store} />
            ) : (
                <ReviewResponseForm store={store} />
            )}
        </div>
    );
});

ResponseContainer.propTypes = {
    store: PropTypes.object.isRequired,
};

@observer
export default class Review extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
    };

    static defaultProps = {
        isUBOnlyDataPreviewEnabled: false,
    };

    render() {
        const {review} = this.props.store;
        const {isUBOnlyDataPreviewEnabled} = this.props;
        return (
            <div styleName="review-container">
                <Header review={review} isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled} />
                <StarRating rating={review.rating} size="large" />
                {review.content && (
                    <ShowMore collapsedHeight={75} withGradient={true}>
                        {review.content}
                    </ShowMore>
                )}
                <SurveyAnswersContainer surveyAnswers={review.survey_answers} />
                <ResponseContainer store={this.props.store} />
            </div>
        );
    }
}
