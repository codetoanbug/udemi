import {Tracker} from '@udemy/event-tracking';

import udMe from 'utils/ud-me';

import {
    LearningPathActionEvent,
    LearningPathSectionItemClickEvent,
    LearningPathRemovedCourseAlertActionEvent,
    LearningPathEditorsChangedEvent,
    LearningPathDiscoverabilityOptionSelectEvent,
    LearningPathContentItemAddEvent,
    LearningPathCourseRetirementAlertViewEvent,
} from '../tracking-events';
import {LearningPathContentItemSelected} from '../tracking-events-v2';
import {
    COURSE_RETIREMENT_ALERT_EVENT_TRACKING_ACTIONS,
    COURSE_RETIREMENT_ALERT_TYPES,
} from './constants';

class PageEventTracker {
    setPathId(id) {
        this.pathId = id;
    }

    setPath(path) {
        this.path = {
            id: path.id,
            isPublicLearningPath: path.isPublic,
            isUdemyPath: path.isProPath,
        };
    }

    tipsIconClicked() {
        Tracker.publishEvent(
            new LearningPathActionEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                action: 'click_tips_icon',
            }),
        );
    }

    discoverabilityOptionSelected(option) {
        Tracker.publishEvent(
            new LearningPathDiscoverabilityOptionSelectEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                option,
            }),
        );
    }

    reorderedSection() {
        Tracker.publishEvent(
            new LearningPathActionEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                action: 'reorder_section',
            }),
        );
    }

    reorderedItem() {
        Tracker.publishEvent(
            new LearningPathActionEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                action: 'reorder_item',
            }),
        );
    }

    sectionItemClicked(type, item, path) {
        Tracker.publishEvent(
            new LearningPathSectionItemClickEvent({
                userRole: udMe.organization.role,
                isUserEnrolled: path.isUserEnrolled,
                isUserEditor: path.isUserEditor,
                pathId: this.pathId,
                isPublicPath: path.isPublic,
                itemType: type,
                itemId: item.id,
            }),
        );
    }

    contentItemClicked(type, itemId) {
        Tracker.publishEvent(
            new LearningPathContentItemSelected(this.path.id, this.path, type, itemId),
        );
    }

    clickedAddContent(context) {
        Tracker.publishEvent(
            new LearningPathActionEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                action: 'add_content',
                pageName: context,
            }),
        );
    }

    clickedContentItem(contentItemType, itemTypeString, context) {
        Tracker.publishEvent(
            new LearningPathContentItemAddEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                contentItemType,
                pageName: context,
            }),
        );
    }

    /**
     * Track event for when the editors for a learning path has been changed
     *
     * @param {Boolean} isEditMode used to set the tracking label
     * @param {Number} added number of editors added
     * @param {Number} removed number of editors removed
     * @param {Number | undefined} featuredEditor id of the new featured editor or undefined if not changed
     * @param {Number} id of the path
     */
    changedEditors(isEditMode, added, removed, featuredEditor, pathId) {
        Tracker.publishEvent(
            new LearningPathEditorsChangedEvent({
                userRole: udMe.organization.role,
                pathId,
                addedEditorCount: added,
                removedEditorCount: removed,
                featuredEditorId: featuredEditor,
            }),
        );
    }

    // used for both retired course alert & to-be-retired course alert so we need alertType
    clickedEditPath(courseId, alertType) {
        Tracker.publishEvent(
            new LearningPathRemovedCourseAlertActionEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                courseId,
                action: COURSE_RETIREMENT_ALERT_EVENT_TRACKING_ACTIONS.EDIT_PATH,
                alertType,
            }),
        );
    }

    // used for both retired course alert & to-be-retired course alert so we need alertType
    clickedLearnMore(courseId, alertType) {
        Tracker.publishEvent(
            new LearningPathRemovedCourseAlertActionEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                courseId,
                action: COURSE_RETIREMENT_ALERT_EVENT_TRACKING_ACTIONS.LEARN_MORE,
                alertType,
            }),
        );
    }

    // used only for retired course alert so we can set alertType as a constant
    dismissedAlert(courseId) {
        Tracker.publishEvent(
            new LearningPathRemovedCourseAlertActionEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                courseId,
                action: COURSE_RETIREMENT_ALERT_EVENT_TRACKING_ACTIONS.DISMISS_ALERT,
                alertType: COURSE_RETIREMENT_ALERT_TYPES.RETIRED,
            }),
        );
    }

    // used only for to-be-retired course alert so we can set alertType as a constant
    deletedCourseToBeRetired(courseId) {
        Tracker.publishEvent(
            new LearningPathRemovedCourseAlertActionEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                courseId,
                action: COURSE_RETIREMENT_ALERT_EVENT_TRACKING_ACTIONS.DELETED_TO_BE_RETIRED_COURSE,
                alertType: COURSE_RETIREMENT_ALERT_TYPES.TO_BE_RETIRED,
            }),
        );
    }

    // used only for retired course alert so we can set alertType as a constant
    clickedShowCourseDetails(courseId) {
        Tracker.publishEvent(
            new LearningPathRemovedCourseAlertActionEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                courseId,
                action: COURSE_RETIREMENT_ALERT_EVENT_TRACKING_ACTIONS.SHOW_COURSE_DETAILS,
                alertType: COURSE_RETIREMENT_ALERT_TYPES.RETIRED,
            }),
        );
    }

    addedCourseAlternative(courseId, alertType, alternativeCourseId) {
        Tracker.publishEvent(
            new LearningPathRemovedCourseAlertActionEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                courseId,
                action: COURSE_RETIREMENT_ALERT_EVENT_TRACKING_ACTIONS.ADDED_COURSE_ALTERNATIVE,
                alertType,
                alternativeCourseId,
            }),
        );
    }

    viewedCourseRetirementAlertTrackedItemIds = new Set();

    viewedCourseRetirementAlert(item, alertType) {
        if (this.viewedCourseRetirementAlertTrackedItemIds.has(item.id)) {
            return;
        }
        Tracker.publishEvent(
            new LearningPathCourseRetirementAlertViewEvent({
                userRole: udMe.organization.role,
                pathId: this.pathId,
                courseId: item.content.courseId,
                alertType,
            }),
        );
        this.viewedCourseRetirementAlertTrackedItemIds.add(item.id);
    }
}

export default new PageEventTracker();
