import {PAGE_TYPE_LEARNING_PATH} from '@udemy/discovery-api';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import BrowseService from 'browse/lib/browse-service';
import {COURSE_RETIREMENT_ALERT_TYPES} from 'learning-path/learning-path-page/constants';

import LearningPathSectionItem from '../../learning-path-section-item.mobx-model';
import CourseItem from '../course-recommendations/topic-page/course-item.react-component';
import RecommendedCourse from '../course-recommendations/topic-page/recommended-course.mobx-model';
import AddCourseAlternativeButton from './add-course-alternative-button.react-component';
import styles from './removed-course-alternatives.less';

@observer
export default class RemovedCourseAlternatives extends React.Component {
    static propTypes = {
        item: PropTypes.instanceOf(LearningPathSectionItem).isRequired,
        itemIndex: PropTypes.number.isRequired,
        browseService: PropTypes.instanceOf(BrowseService).isRequired,
    };

    constructor(props) {
        super(props);

        this.courseLabelId = props.item.content.courseLabel.id;
        this.courseId = props.item.content.courseId;
    }

    componentDidMount() {
        this.fetchData();
    }

    @observable courseAlternatives = [];
    @observable isLoading = true;

    @autobind
    async fetchData() {
        try {
            const data = await this.props.browseService.loadCourses(
                PAGE_TYPE_LEARNING_PATH,
                this.courseLabelId,
                {
                    label_id: this.courseLabelId,
                    page_size: 3,
                    item_count: 3,
                    excluded_course_ids: [this.courseId],
                    skip_price: true,
                },
            );
            runInAction(() => {
                this.courseAlternatives = data.items;
                this.isLoading = false;
            });
        } catch (e) {
            runInAction(() => {
                this.courseAlternatives = [];
                this.isLoading = false;
            });
        }
    }

    renderContent() {
        const {item, itemIndex} = this.props;

        return (
            <div styleName="content">
                {this.courseAlternatives.map((course) => {
                    const recommendedCourse = new RecommendedCourse(course);
                    recommendedCourse.imageMobile = course.image_100x100;
                    return (
                        <div
                            key={course.id}
                            styleName="course-alternative-card"
                            data-purpose="course-alternative-card"
                        >
                            <CourseItem
                                course={recommendedCourse}
                                isCheckboxShown={false}
                                containerClassName={styles['course-item-container']}
                            />
                            <div styleName="add-button-wrapper">
                                <AddCourseAlternativeButton
                                    courseUrl={course.url}
                                    courseId={course.id}
                                    courseRetirementId={item.content.courseId}
                                    alertType={COURSE_RETIREMENT_ALERT_TYPES.RETIRED}
                                    section={item.learningPathSection}
                                    itemIndex={itemIndex}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderLoader() {
        return (
            <div styleName="loading">
                <Loader size="small" />
            </div>
        );
    }

    render() {
        if (this.courseAlternatives.length === 0) {
            return null;
        }

        return (
            <div styleName="removed-course-alternatives">
                <div styleName="message" data-purpose="alternatives-message">
                    {gettext(
                        'We’re constantly updating our collection to ensure you have access to high quality,' +
                            ' up-to-date content. Find alternative courses on this topic below.',
                    )}
                </div>
                {this.isLoading ? this.renderLoader() : this.renderContent()}
            </div>
        );
    }
}
