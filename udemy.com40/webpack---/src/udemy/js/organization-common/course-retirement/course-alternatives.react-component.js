import {Tracker} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import {Accordion} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CourseCard from 'base-components/course-card/course-card.react-component';
import AddCourseAlternativeButton from 'learning-path/learning-path-page/curriculum/add-course-alternative-button.react-component';
import ensureInView from 'utils/ensure-in-view';
import serverOrClient from 'utils/server-or-client';

import {BUTTON_ADD_TO_PATH, BUTTON_ENROLL, SHOW_ALTERNATIVES_URL_PARAM} from './constants';
import {
    CourseRetirementBannerClickAlternativeEvent,
    CourseRetirementBannerExpandEvent,
} from './events';

import './course-alternatives.less';

@observer
export default class CourseAlternatives extends React.Component {
    static propTypes = {
        courses: PropTypes.array.isRequired,
        courseToBeRetiredId: PropTypes.number,
        displayShowMore: PropTypes.bool,
        className: PropTypes.string,
        buttonProps: PropTypes.object,
    };

    static defaultProps = {
        courseToBeRetiredId: null,
        displayShowMore: false,
        buttonProps: {},
        className: null,
    };

    constructor() {
        super();
        this.ref = React.createRef();
    }

    componentDidMount() {
        const urlParams = new URLSearchParams(this.window.location.search);
        if (urlParams.has(SHOW_ALTERNATIVES_URL_PARAM)) {
            ensureInView(this.ref.current, null, {forceToTop: true, offsetTop: 200});
            this.onToggle(true);
        }
    }

    get window() {
        return serverOrClient.global;
    }

    @observable isExpanded = false;

    trackRetirementBannerClickAlternative(alternativeCourseId) {
        Tracker.publishEvent(
            new CourseRetirementBannerClickAlternativeEvent({
                courseId: this.props.courseToBeRetiredId,
                alternativeCourseId,
            }),
        );
    }

    trackRetirementBannerExpand() {
        Tracker.publishEvent(
            new CourseRetirementBannerExpandEvent({
                courseId: this.props.courseToBeRetiredId,
            }),
        );
    }

    get alternativeLabel() {
        return this.props.courses.length > 1 ? 'alternatives' : 'alternative';
    }

    get accordionTitle() {
        if (this.isExpanded) {
            return this.moreButtonLabel('Hide');
        }
        return this.moreButtonLabel('Show');
    }

    moreButtonLabel(action) {
        return interpolate(
            gettext('%(action)s %(alternativeLabel)s'),
            {action, alternativeLabel: this.alternativeLabel},
            true,
        );
    }

    @autobind
    @action
    onToggle(isExpanded) {
        this.isExpanded = isExpanded;
        this.isExpanded && this.props.courseToBeRetiredId && this.trackRetirementBannerExpand();
    }

    @autobind
    renderCourseTitle(Component, props) {
        return <a {...props} target="_blank" rel="noopener noreferrer" />;
    }

    renderEnrollButton(url) {
        return (
            <Button
                size="xsmall"
                componentClass="a"
                href={url}
                styleName="enroll-button"
                data-purpose="enroll-button"
            >
                {this.props.buttonProps.text}
            </Button>
        );
    }

    renderAddToPathButton(course) {
        const {index, section} = this.props.buttonProps;

        return (
            <AddCourseAlternativeButton
                courseUrl={course.url}
                courseId={course.id}
                courseRetirementId={this.props.courseToBeRetiredId}
                itemIndex={index}
                section={section}
                buttonProps={{udStyle: 'primary', size: 'small'}}
            />
        );
    }

    renderActionButton(course) {
        const {buttonProps} = this.props;

        switch (buttonProps.type) {
            case BUTTON_ENROLL.TYPE:
                return this.renderEnrollButton(course.free_course_subscribe_url);
            case BUTTON_ADD_TO_PATH.TYPE:
                return this.renderAddToPathButton(course);
        }
    }

    renderAlternatives() {
        const {courses} = this.props;

        return courses.map((course) => {
            return (
                <div
                    key={course.id}
                    styleName="course-alternative-container"
                    data-purpose="course-alternative-card"
                >
                    <CourseCard
                        size="small"
                        styleName="course-link-button"
                        course={course}
                        showDetails={false}
                        renderCourseTitle={this.renderCourseTitle}
                        url={course.is_in_user_subscription ? course.learn_url : course.url}
                        onClick={() =>
                            this.props.courseToBeRetiredId &&
                            this.trackRetirementBannerClickAlternative(course.id)
                        }
                    />
                    {this.renderActionButton(course)}
                </div>
            );
        });
    }

    render() {
        const {courses, displayShowMore, className} = this.props;

        if (courses.length === 0) {
            return <div styleName="empty-container" />;
        }

        return (
            <div styleName="alternatives-container" className={className} ref={this.ref}>
                {displayShowMore ? (
                    <Accordion>
                        <Accordion.Panel
                            styleName={classNames('custom-title-accordion-panel', {
                                'custom-title-accordion-panel-expanded': this.isExpanded,
                            })}
                            title={this.accordionTitle}
                            expanded={this.isExpanded}
                            onToggle={this.onToggle}
                            size="medium"
                            data-purpose="accordion-panel"
                        >
                            {this.renderAlternatives()}
                        </Accordion.Panel>
                    </Accordion>
                ) : (
                    this.renderAlternatives()
                )}
            </div>
        );
    }
}
