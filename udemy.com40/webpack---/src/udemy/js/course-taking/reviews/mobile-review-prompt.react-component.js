import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {getCurriculumItemNavigationProps} from '../curriculum/item-link.react-component';
import requires from '../registry/requires';
import {COURSE_COMPLETION_MSG, COURSE_LAST_LESSON_COMPLETION_MSG} from './constants';
import ReviewPromptStore from './review-prompt.mobx-store';

import './mobile-review-prompt.less';

@withRouter
@requires('courseTakingStore')
@observer
export default class MobileReviewPrompt extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            completionRatio: PropTypes.number,
            mainContentType: PropTypes.string,
            nextCurriculumItem: PropTypes.object,
            isFinalReviewStageActive: PropTypes.bool,
            courseReview: PropTypes.object,
        }).isRequired,
        history: PropTypes.object.isRequired,
        onConfirm: PropTypes.func.isRequired, // to proceed to review screens
    };

    constructor(props) {
        super(props);
        this.reviewPromptStore = new ReviewPromptStore(props.courseTakingStore);
    }

    componentDidMount() {
        this.reviewPromptStore.trackReviewPromptSeen();
    }

    @autobind
    onCancelClick() {
        const {courseTakingStore, history} = this.props;
        this.reviewPromptStore.cancelReview().then((canRedirectToNextItem) => {
            if (canRedirectToNextItem) {
                history.push(
                    getCurriculumItemNavigationProps(courseTakingStore.nextCurriculumItem, history),
                );
            }
        });
    }

    render() {
        const {
            isFinalReviewStageActive,
            courseReview,
            completionRatio,
        } = this.props.courseTakingStore;
        const completionMsg =
            completionRatio >= 1 ? COURSE_COMPLETION_MSG : COURSE_LAST_LESSON_COMPLETION_MSG;
        return (
            <div styleName="container">
                {isFinalReviewStageActive && (
                    <h2 className="ud-heading-md" styleName="title">
                        {completionMsg}
                    </h2>
                )}
                <div styleName="btns">
                    <Button
                        udStyle="brand"
                        size="small"
                        onClick={this.props.onConfirm}
                        data-purpose="mobile-proceed-to-review"
                    >
                        {courseReview ? gettext('Update your review') : gettext('Leave a review')}
                    </Button>
                    <Button
                        udStyle="white-outline"
                        size="small"
                        onClick={this.onCancelClick}
                        data-purpose="mobile-exit-review"
                    >
                        {isFinalReviewStageActive ? gettext('Skip') : gettext('Ask me later')}
                    </Button>
                </div>
            </div>
        );
    }
}
