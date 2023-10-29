import {Button} from '@udemy/react-core-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {COURSE_COMPLETION_REVIEW_PROMPT_STAGES} from 'course-taking/reviews/constants';
import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

import {NON_COURSE_TAKING_LOCATIONS} from '../common/locations';
import ReviewStarsInput from './review-stars-input/review-stars-input.react-component';
import './review-editor.less';

export default class LeaveRating extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        onCancelReview: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        // Add this as an object property to make it testable.
        this.isMobileBrowser = isMobileBrowser;
    }

    @autobind
    onRatingChange(rating) {
        this.props.store.rate(rating);
        if (!this.isMobileBrowser) {
            this.props.store.goForward();
        }
    }

    @autobind
    onClickAskMeLater() {
        this.props.store.deleteReview();
        this.props.onCancelReview();
    }

    @autobind
    onClickAskMeEndOfTheCourse() {
        this.props.store.deleteReview();
        this.props.onCancelReview(true);
    }

    render() {
        const {store} = this.props;
        return (
            <div data-purpose="leave-rating">
                <ReviewStarsInput
                    size="xxlarge"
                    rating={store.rating}
                    data-purpose="review-stars"
                    onChoose={this.onRatingChange}
                />
                {this.isMobileBrowser && (
                    <div styleName="flex-justify-center">
                        <Button onClick={store.goForward} data-purpose="next-button">
                            {gettext('Next')}
                        </Button>
                    </div>
                )}
                {!COURSE_COMPLETION_REVIEW_PROMPT_STAGES.concat(
                    NON_COURSE_TAKING_LOCATIONS,
                ).includes(store.location) ? (
                    <FooterButtons>
                        <div styleName="flex-justify-center">
                            <Button
                                udStyle="secondary"
                                data-purpose="ask-me-later-button"
                                onClick={this.onClickAskMeLater}
                            >
                                {gettext('Ask me later')}
                            </Button>
                        </div>
                        <div styleName="flex-justify-center">
                            <Button
                                udStyle="ghost"
                                data-purpose="dont-ask-button"
                                onClick={this.onClickAskMeEndOfTheCourse}
                            >
                                {gettext('Ask me at the end of the course')}
                            </Button>
                        </div>
                    </FooterButtons>
                ) : null}
            </div>
        );
    }
}
