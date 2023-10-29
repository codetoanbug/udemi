import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {EventTracker} from 'learning-path/event-tracker';
import {CONTENT_ITEM_TYPES} from 'learning-path/learning-path-page/constants';
import udLink from 'utils/ud-link';

import {TRACKING_CATEGORIES} from '../constants';
import EndScreenOverlay from '../end-screen-overlay.react-component';
import requires from '../registry/requires';
import {
    COURSE_COMPLETION_MSG,
    COURSE_LAST_LESSON_COMPLETION_MSG,
    COURSE_PORTION_COMPLETION_MSG,
} from '../reviews/constants';

@requires('courseTakingStore')
@observer
export default class EndScreen extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            track: PropTypes.func,
            completionRatio: PropTypes.number,
            coursePortion: PropTypes.object,
            learningPath: PropTypes.shape({
                id: PropTypes.number,
                isPublicLearningPath: PropTypes.bool,
                isUdemyPath: PropTypes.bool,
            }),
            learningPathUrl: PropTypes.string,
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
            <EndScreenOverlay>
                <h2 className="ud-heading-xl">{`🙌 ${COURSE_PORTION_COMPLETION_MSG}`}</h2>
                {learningPathUrl && (
                    <Button
                        udStyle="secondary"
                        componentClass="a"
                        href={learningPathUrl}
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
                )}
            </EndScreenOverlay>
        );
    }

    renderCourseEndScreen() {
        const completionMsg =
            this.props.courseTakingStore.completionRatio >= 1
                ? COURSE_COMPLETION_MSG
                : COURSE_LAST_LESSON_COMPLETION_MSG;
        return (
            <EndScreenOverlay>
                <h2 className="ud-heading-xl">{`🙌 ${completionMsg}`}</h2>
                <Button
                    udStyle="secondary"
                    componentClass="a"
                    href={udLink.toMyCourses()}
                    onClick={this.findMore}
                    data-purpose="end-screen-find-more-courses"
                >
                    {gettext('Find more courses')}
                </Button>
            </EndScreenOverlay>
        );
    }

    render() {
        return this.props.courseTakingStore.coursePortion
            ? this.renderCoursePortionEndScreen()
            : this.renderCourseEndScreen();
    }
}
