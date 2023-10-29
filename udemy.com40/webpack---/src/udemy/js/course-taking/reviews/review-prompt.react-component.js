import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import ReviewEditor from 'course-reviews/review-editor/review-editor.react-component';

import CourseCompletionConfetti from '../confetti/course-completion-confetti.react-component';
import {getCurriculumItemNavigationProps} from '../curriculum/item-link.react-component';
import requires from '../registry/requires';
import ReviewPromptStore from './review-prompt.mobx-store';

import './review-prompt.less';

@withRouter
@requires('courseTakingStore')
@observer
export default class ReviewPrompt extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            nextCurriculumItem: PropTypes.object,
            isMobileView: PropTypes.bool,
        }).isRequired,
        history: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.reviewPromptStore = new ReviewPromptStore(props.courseTakingStore);
    }

    @autobind
    onReviewExited(dismissUntilEndOfCourse) {
        const {courseTakingStore, history} = this.props;
        this.reviewPromptStore
            .cancelReview(dismissUntilEndOfCourse)
            .then((canRedirectToNextItem) => {
                if (canRedirectToNextItem) {
                    history.push(
                        getCurriculumItemNavigationProps(
                            courseTakingStore.nextCurriculumItem,
                            history,
                        ),
                    );
                }
            });
    }

    render() {
        return (
            <div className="ct-dashboard-separator" styleName="review-prompt">
                <div styleName="container">
                    <CourseCompletionConfetti />
                    <ReviewEditor
                        store={this.reviewPromptStore.reviewEditorStore}
                        onCancelReview={this.onReviewExited}
                    />
                </div>
            </div>
        );
    }
}
