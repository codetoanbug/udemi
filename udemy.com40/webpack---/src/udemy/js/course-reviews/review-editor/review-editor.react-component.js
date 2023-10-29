import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {NON_COURSE_TAKING_LOCATIONS} from '../common/locations';
import {COURSE_COMPLETION_MSG, COURSE_LAST_LESSON_COMPLETION_MSG} from './constants';
import LeaveRating from './leave-rating.react-component';
import {REVIEW_STATES} from './review-editor.mobx-store';
import ReviewPreview from './review-preview.react-component';
import ReviewSurvey from './review-survey.react-component';
import WriteComment from './write-comment.react-component';
import './review-editor.less';

const PAGES = {
    [REVIEW_STATES.starRating]: LeaveRating,
    [REVIEW_STATES.comment]: WriteComment,
    [REVIEW_STATES.survey]: ReviewSurvey,
    [REVIEW_STATES.confirmation]: ReviewPreview,
};

const PRIMARY_HEADER_MESSAGES_FOR_COMMENT = {
    course_taking__middle: gettext(' 🎉 Great job on making it halfway!'),
    course_taking__initial: gettext('Why did you leave this rating?'),
    course_taking__callout: gettext('Why did you leave this rating?'),
    course_taking__interstitial: gettext('Why did you leave this rating?'),
    my_courses: gettext('Why did you leave this rating?'),
    dashboard: gettext('Why did you leave this rating?'),
    'course_taking__initial--end': gettext('Why did you leave this rating?'),
};

export const HeaderMessages = ({location, reviewState, completionRatio, id}) => {
    let primaryMessage, secondaryMessage;
    switch (reviewState) {
        case REVIEW_STATES.starRating:
            if (location === 'course_taking__initial--end') {
                const completionMsg =
                    completionRatio >= 1
                        ? COURSE_COMPLETION_MSG
                        : COURSE_LAST_LESSON_COMPLETION_MSG;

                primaryMessage = `🙌 ${completionMsg}`;
                secondaryMessage = gettext('Would you like to leave a review?');
            } else if (NON_COURSE_TAKING_LOCATIONS.includes(location)) {
                primaryMessage = gettext('How would you rate this course?');
            } else {
                primaryMessage = gettext(
                    'How would you rate your experience with the course so far?',
                );
            }
            break;
        case REVIEW_STATES.comment:
            primaryMessage =
                location === 'course_taking__final'
                    ? completionRatio >= 1
                        ? COURSE_COMPLETION_MSG
                        : COURSE_LAST_LESSON_COMPLETION_MSG
                    : PRIMARY_HEADER_MESSAGES_FOR_COMMENT[location];
            secondaryMessage = {
                course_taking__middle: gettext('Would you like to update your review?'),
                course_taking__final: gettext('Would you like to update your review?'),
            }[location];
            break;
        case REVIEW_STATES.survey:
            primaryMessage = gettext('Please tell us more (optional).');
            break;
        case REVIEW_STATES.confirmation:
            primaryMessage = gettext('Thanks for helping our community!');
            break;
    }
    return (
        <div styleName="main-header">
            {primaryMessage && (
                <h2 className="ud-heading-xl" id={id} data-purpose="primary-message">
                    {primaryMessage}
                </h2>
            )}
            {secondaryMessage && (
                <h2 className="ud-heading-xl" data-purpose="secondary-message">
                    {secondaryMessage}
                </h2>
            )}
        </div>
    );
};

HeaderMessages.propTypes = {
    location: PropTypes.string.isRequired,
    reviewState: PropTypes.string.isRequired,
    completionRatio: PropTypes.number,
    id: PropTypes.string,
};

HeaderMessages.defaultProps = {
    completionRatio: 0,
    id: null,
};

@observer
export default class ReviewEditor extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        onCancelReview: PropTypes.func.isRequired,
        titleId: PropTypes.string,
    };

    static defaultProps = {
        titleId: null,
    };

    componentDidMount() {
        this.props.store.publishViewEvent();
    }

    render() {
        const PageComponent = PAGES[this.props.store.currentState];
        const {store, onCancelReview} = this.props;

        return (
            <div data-purpose="review-editor">
                <div styleName="top-buttons-container">
                    {this.props.store.canGoBack() && (
                        <Button
                            udStyle="ghost"
                            size="medium"
                            data-purpose="back-button"
                            onClick={this.props.store.gotoPreviousState}
                        >
                            {gettext('Back')}
                        </Button>
                    )}
                </div>
                <HeaderMessages
                    location={store.location}
                    reviewState={store.currentState}
                    completionRatio={store.completionRatio}
                    id={this.props.titleId}
                />
                <PageComponent store={store} onCancelReview={onCancelReview} />
            </div>
        );
    }
}
