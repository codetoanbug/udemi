import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LeaveRatingStore from 'course-reviews/common/alt-leave-rating.mobx-store';
import AltLeaveRating from 'course-reviews/common/alt-leave-rating.react-component';
import reviewBackend from 'course-reviews/common/review-backend';
import {noop} from 'utils/noop';

import registers from '../registry/registers';
import requires from '../registry/requires';
import './header.less';

/**
 * We need to render this component no matter what, even if it renders nothing inside.
 * This component create LeaveRatingStore that is used in another place.
 */
@requires('courseTakingStore')
@registers('leaveRatingStore')
@observer
export default class LeaveRating extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        const searchParams = new URLSearchParams(window.location.search);
        const autoOpenReviewModal = !!searchParams.get('show_review_popup');

        const {
            course,
            courseReview,
            isUserInstructor,
            setCourseReview,
            onFinishReviewing,
            completedVideoContentLength,
        } = this.props.courseTakingStore;

        this.leaveRatingStore = new LeaveRatingStore(
            course,
            courseReview,
            'dashboard',
            gettext('Leave a rating'),
            gettext('Edit your rating'),
            null,
            false,
            autoOpenReviewModal && !isUserInstructor,
            reviewBackend(),
            setCourseReview,
            noop,
            onFinishReviewing,
            () => this.props.courseTakingStore.hasLeaveReviewHeaderButton,
            completedVideoContentLength,
        );
    }

    render() {
        if (!this.props.courseTakingStore.hasReviewsFeatureForStudent) {
            return null;
        }

        return (
            <AltLeaveRating
                store={this.leaveRatingStore}
                numStars={1}
                styleName="header-link ratings"
                typography="ud-text-sm"
            />
        );
    }
}
