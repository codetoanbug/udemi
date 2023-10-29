import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {EventTracker} from 'learning-path/event-tracker';
import {CONTENT_ITEM_TYPES} from 'learning-path/learning-path-page/constants';
import udLink from 'utils/ud-link';

import {TRACKING_CATEGORIES} from '../constants';
import requires from '../registry/requires';
import {
    COURSE_COMPLETION_MSG,
    COURSE_LAST_LESSON_COMPLETION_MSG,
    COURSE_PORTION_COMPLETION_MSG,
} from '../reviews/constants';

import './mobile-end-screen.less';

@requires('courseTakingStore')
@observer
export default class MobileEndScreen extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            completionRatio: PropTypes.number,
            coursePortion: PropTypes.object,
            learningPath: PropTypes.shape({
                id: PropTypes.number,
                isPublicLearningPath: PropTypes.bool,
                isUdemyPath: PropTypes.bool,
            }),
            learningPathUrl: PropTypes.string,
            track: PropTypes.func,
        }).isRequired,
    };

    componentDidMount() {
        this.props.courseTakingStore.track(TRACKING_CATEGORIES.END_SCREEN);
    }

    @autobind
    findMore() {
        this.props.courseTakingStore.track(TRACKING_CATEGORIES.FIND_MORE_COURSES);
    }

    handleReturnToPathClick(learningPathUrl, learningPath, contentItemType, contentItemId) {
        if (!learningPathUrl) {
            return;
        }

        EventTracker.returnToLearningPathClicked(learningPath, contentItemType, contentItemId);
    }

    renderCoursePortionEndScreen() {
        const {learningPathUrl, learningPath, coursePortion} = this.props.courseTakingStore;
        return (
            <div styleName="container">
                <h2 className="ud-heading-md" styleName="title">
                    {COURSE_PORTION_COMPLETION_MSG}
                </h2>
                <Button
                    udStyle="brand"
                    componentClass="a"
                    href={this.props.courseTakingStore.learningPathUrl}
                    data-purpose="end-screen-return-to-path"
                    onClick={() =>
                        this.handleReturnToPathClick(
                            learningPathUrl,
                            learningPath,
                            CONTENT_ITEM_TYPES.COURSE_SECTION,
                            coursePortion.id,
                        )
                    }
                >
                    {gettext('Return to learning path')}
                </Button>
            </div>
        );
    }

    renderCourseEndScreen() {
        const completionMsg =
            this.props.courseTakingStore.completionRatio >= 1
                ? COURSE_COMPLETION_MSG
                : COURSE_LAST_LESSON_COMPLETION_MSG;
        return (
            <div styleName="container">
                <h2 className="ud-heading-md" styleName="title">
                    {completionMsg}
                </h2>
                <Button
                    udStyle="brand"
                    componentClass="a"
                    href={udLink.toMyCourses()}
                    onClick={this.findMore}
                    data-purpose="end-screen-find-more-courses"
                >
                    {gettext('Find more courses')}
                </Button>
            </div>
        );
    }

    render() {
        return this.props.courseTakingStore.coursePortion
            ? this.renderCoursePortionEndScreen()
            : this.renderCourseEndScreen();
    }
}
