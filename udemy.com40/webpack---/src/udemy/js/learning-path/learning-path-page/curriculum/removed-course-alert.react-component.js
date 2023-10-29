import Observer from '@researchgate/react-intersection-observer';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {Button, IconButton, Link} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import BrowseService from 'browse/lib/browse-service';
import {COURSE_RETIREMENT_ALERT_TYPES} from 'learning-path/learning-path-page/constants';
import udLink from 'utils/ud-link';

import LearningPathSectionItem from '../../learning-path-section-item.mobx-model';
import LearningPathStore from '../../learning-path.mobx-store';
import AddContentButton from '../add-content/add-content-button.react-component';
import pageEventTracker from '../page-event-tracker';
import RemovedCourseAlternatives from './removed-course-alternatives.react-component';
import RemovedCourseDetails from './removed-course-details.react-component';

import './removed-course-alert.less';

@inject('learningPathStore', 'browseService')
@observer
export default class RemovedCourseAlert extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        sectionIndex: PropTypes.number.isRequired,
        item: PropTypes.instanceOf(LearningPathSectionItem).isRequired,
        itemIndex: PropTypes.number.isRequired,
        handleDeleteCallback: PropTypes.func.isRequired,
        handleAlertClickEditCallback: PropTypes.func.isRequired,
        browseService: PropTypes.instanceOf(BrowseService).isRequired,
    };

    @autobind
    onLearnMoreClick() {
        pageEventTracker.clickedLearnMore(
            this.props.item.content.courseId,
            COURSE_RETIREMENT_ALERT_TYPES.RETIRED,
        );
    }

    @autobind
    onEditPathClick() {
        this.props.handleAlertClickEditCallback();
        pageEventTracker.clickedEditPath(
            this.props.item.content.courseId,
            COURSE_RETIREMENT_ALERT_TYPES.RETIRED,
        );
    }

    @autobind
    handleOnDismiss() {
        pageEventTracker.dismissedAlert(this.props.item.content.courseId);
        this.props.handleDeleteCallback();
    }

    renderLearnMoreButton() {
        if (!this.props.learningPathStore.isMobileViewportSize) {
            return (
                <Button
                    componentClass="a"
                    href={udLink.toSupportLink('course_removal', true)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-drag ud-link-neutral ud-link-underline"
                    udStyle="ghost"
                    size="medium"
                    data-purpose="learn-more-link"
                    onClick={this.onLearnMoreClick}
                >
                    {gettext('Learn more')}
                </Button>
            );
        }
    }

    renderViewMode() {
        const {learningPath} = this.props.learningPathStore;

        return (
            <div styleName="cta-container">
                <Button
                    componentClass={Link}
                    to={learningPath.editUrl}
                    data-purpose="edit-path-btn"
                    onClick={this.onEditPathClick}
                    size="medium"
                >
                    {gettext('Edit path')}
                </Button>
                {this.renderLearnMoreButton()}
            </div>
        );
    }

    renderEditMode() {
        const {sectionIndex, item, itemIndex} = this.props;

        return (
            <AddContentButton
                section={item.learningPathSection}
                sectionIndex={sectionIndex}
                size="medium"
                isIconVisible={false}
                isInCourseRemovalAlert={true}
                itemIndex={itemIndex}
                className="no-drag"
                styleName="cta-container"
                context="removed-course-alert"
            >
                {this.renderLearnMoreButton()}
            </AddContentButton>
        );
    }

    @autobind
    onIntersect(event, unobserve) {
        if (event.isIntersecting) {
            pageEventTracker.viewedCourseRetirementAlert(
                this.props.item,
                COURSE_RETIREMENT_ALERT_TYPES.RETIRED,
            );
            unobserve();
        }
    }

    render() {
        const {learningPathStore, item, itemIndex} = this.props;
        const title = (
            <span styleName="title">
                {interpolate(
                    gettext('%(courseTitle)s has been removed from this path'),
                    {courseTitle: item.title},
                    true,
                )}
            </span>
        );
        const body = (
            <div>
                {learningPathStore.isEditModeEnabled && (
                    <IconButton
                        onClick={this.handleOnDismiss}
                        udStyle="ghost"
                        size="small"
                        className="ud-link-neutral"
                        styleName="delete-button"
                    >
                        <CloseIcon label={gettext('Delete')} size="medium" />
                    </IconButton>
                )}
                <div>
                    {gettext(
                        'Courses are automatically retired from paths when they are no longer available in the Udemy Business collection.',
                    )}
                </div>
                {learningPathStore.shouldDisplayCourseDetails && (
                    <RemovedCourseDetails item={item} />
                )}
                {learningPathStore.isEditModeEnabled && !learningPathStore.isMobileViewportSize && (
                    <RemovedCourseAlternatives
                        item={item}
                        itemIndex={itemIndex}
                        browseService={this.props.browseService}
                    />
                )}
                {learningPathStore.isEditModeEnabled
                    ? this.renderEditMode()
                    : this.renderViewMode()}
            </div>
        );
        return (
            <Observer onChange={this.onIntersect}>
                <div
                    styleName={classNames('course-removed-alert', {
                        editing: learningPathStore.isEditModeEnabled,
                    })}
                >
                    <AlertBanner
                        udStyle="warning"
                        title={title}
                        body={body}
                        showIcon={!learningPathStore.isMobileViewportSize}
                        showCta={false}
                    />
                </div>
            </Observer>
        );
    }
}
