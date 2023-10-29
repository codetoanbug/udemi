import {PAGE_TYPE_ORG_LOGGED_IN_HOMEPAGE} from '@udemy/discovery-api';
import React from 'react';

import Course from 'course-taking/course.mobx-model';
import Lab from 'labs/lab.mobx-model';
import LearningPathAssessment from 'learning-path/learning-path-assessment.mobx-model';
import LearningPath from 'learning-path/learning-path.mobx-model';
import {RESOURCE_TYPES, USER_ROLES} from 'organization-common/constants';
import {hasAllowedRole} from 'organization-common/helpers';
import {CONTEXT_TYPES} from 'organization-common/resource-context-menu/constants';
import {isContextMenuAvailable} from 'organization-common/resource-context-menu/helpers';
import AddCourseToCustomCategoryMenuItem from 'organization-common/resource-context-menu/menu-items/add-course-to-custom-category-menu-item.react-component';
import AddCourseToLearningPathMenuItem from 'organization-common/resource-context-menu/menu-items/add-course-to-learning-path-menu-item.react-component';
import {AssignAssessmentMenuItem} from 'organization-common/resource-context-menu/menu-items/assessment/assign-assessment-menu-item.react-component';
import ViewAssessmentActivityMenuItem from 'organization-common/resource-context-menu/menu-items/assessment/view-assessment-activity-menu-item.react-component';
import AssignCourseMenuItem from 'organization-common/resource-context-menu/menu-items/assign-course-menu-item.react-component';
import DeactivateRuleMenuItem from 'organization-common/resource-context-menu/menu-items/auto-assign/deactivate-rule-menu-item.react-component';
import DeleteRuleMenuItem from 'organization-common/resource-context-menu/menu-items/auto-assign/delete-rule-menu-item.react-component';
import BuyLicensesMenuItem from 'organization-common/resource-context-menu/menu-items/buy-license-menu-item.react-component';
import CourseAvailabilityMessageMenuItem from 'organization-common/resource-context-menu/menu-items/course-availability-message-menu-item.react-component';
import ArchiveCourseMenuItem from 'organization-common/resource-context-menu/menu-items/course-taking/archive-course-menu-item.react-component';
import EditRatingMenuItem from 'organization-common/resource-context-menu/menu-items/course-taking/edit-rating-menu-item.react-component';
import EmailSettingsMenuItem from 'organization-common/resource-context-menu/menu-items/course-taking/email-settings-menu-item.react-component';
import FavoriteCourseMenuItem from 'organization-common/resource-context-menu/menu-items/course-taking/favorite-course-menu-item.react-component';
import GiftCourseMenuItem from 'organization-common/resource-context-menu/menu-items/course-taking/gift-course-menu-item.react-component';
import MarketplaceShareMenuItem from 'organization-common/resource-context-menu/menu-items/course-taking/marketplace-share-menu-item.react-component';
import RefundMenuItem from 'organization-common/resource-context-menu/menu-items/course-taking/refund-menu-item.react-component';
import {SaveCourseMenuItem} from 'organization-common/resource-context-menu/menu-items/course-taking/save-course-menu-item.react-component';
import UnenrollMenuItem from 'organization-common/resource-context-menu/menu-items/course-taking/unenroll-menu-item.react-component';
import {EmailAssigneeMenuItem} from 'organization-common/resource-context-menu/menu-items/email-assignee-menu-item.react-component';
import FreeCourseMenuItem from 'organization-common/resource-context-menu/menu-items/free-course-menu-item.react-component';
import AssignLabMenuItem from 'organization-common/resource-context-menu/menu-items/lab/assign-lab-menu-item.react-component';
import ViewLabActivityMenuItem from 'organization-common/resource-context-menu/menu-items/lab/view-lab-activity-menu-item.react-component';
import AddEditorsLearningPathMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/add-editors-learning-path-menu-item.react-component';
import AddLearningPathToFolderMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/add-learning-path-to-folder-menu-item.react-component';
import AssignLearningPathMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/assign-learning-path-menu-item.react-component';
import DeleteLearningPath from 'organization-common/resource-context-menu/menu-items/learning-path/delete-learning-path.react-component';
import DuplicateLearningPathMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/duplicate-learning-path-menu-item.react-component';
import EditLearningPathMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/edit-learning-path-menu-item.react-component';
import {EditPathTitleDescriptionLearningPathMenuItem} from 'organization-common/resource-context-menu/menu-items/learning-path/edit-path-title-description-learning-path-menu-item.react-component';
import EditRequestLearningPathMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/edit-request-learning-path-menu-item.react-component';
import EnrollLearningPathMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/enroll-learning-path-menu-item.react-component';
import HistoryLogLearningPathMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/history-log-learning-path-menu-item.react-component';
import RecommendLearningPathMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/recommend-learning-path-menu-item.react-component';
import RemoveLearningPathFromFolderMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/remove-learning-path-from-folder-menu-item.react-component';
import {ShareLearningPathToMSTeamsMenuItem} from 'organization-common/resource-context-menu/menu-items/learning-path/share-learning-path-to-ms-teams-menu-item.react-component';
import ShareLearningPathToSlackMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/share-learning-path-to-slack-menu-item.react-component';
import ShareLearningPathToWorkplaceMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/share-learning-path-to-workplace-menu-item.react-component';
import UnenrollLearningPathMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/unenroll-learning-path-menu-item.react-component';
import ViewActivityLearningPathMenuItem from 'organization-common/resource-context-menu/menu-items/learning-path/view-activity-learning-path-menu-item.react-component';
import RecommendCourseMenuItem from 'organization-common/resource-context-menu/menu-items/recommend-course-menu-item.react-component';
import RecommendResourceMenuItem from 'organization-common/resource-context-menu/menu-items/recommend-resource-menu-item.react-component';
import {ShareCourseToMSTeamsMenuItem} from 'organization-common/resource-context-menu/menu-items/share-course-to-ms-teams-menu-item.react-component';
import ShareCourseToSlackMenuItem from 'organization-common/resource-context-menu/menu-items/share-course-to-slack-menu-item.react-component';
import ShareCourseToWorkplaceMenuItem from 'organization-common/resource-context-menu/menu-items/share-course-to-workplace-menu-item.react-component';
import {ShareToMSTeamsMenuItem} from 'organization-common/resource-context-menu/menu-items/share-to-ms-teams-menu-item.react-component';
import ShareToSlackMenuItem from 'organization-common/resource-context-menu/menu-items/share-to-slack-menu-item.react-component';
import ShareToWorkplaceMenuItem from 'organization-common/resource-context-menu/menu-items/share-to-workplace-menu-item.react-component';
import UnassignResourceMenuItem from 'organization-common/resource-context-menu/menu-items/unassign-resource-menu-item.react-component';
import ViewCourseActivityMenuItem from 'organization-common/resource-context-menu/menu-items/view-course-activity-menu-item.react-component';
import ResourceContextMenu from 'organization-common/resource-context-menu/resource-context-menu.react-component';
import {idFromGlobalId} from 'utils/ud-graphql';
import udMe from 'utils/ud-me';

export default function createUFBContextMenu() {
    function getCourseContextMenu(course, menuProps) {
        if (!isContextMenuAvailable()) {
            return null;
        }
        return (
            <ResourceContextMenu {...menuProps} udStyle="secondary">
                <ResourceContextMenu.Actions>
                    <AssignCourseMenuItem course={course} />
                    <RecommendCourseMenuItem course={course} />
                    <ShareCourseToMSTeamsMenuItem course={course} />
                    <ShareCourseToSlackMenuItem course={course} />
                    <ShareCourseToWorkplaceMenuItem course={course} />
                </ResourceContextMenu.Actions>
                <ResourceContextMenu.Menu>
                    <AddCourseToCustomCategoryMenuItem course={course} />
                    <AddCourseToLearningPathMenuItem course={course} />
                    <ViewCourseActivityMenuItem course={course} />
                </ResourceContextMenu.Menu>
            </ResourceContextMenu>
        );
    }

    function getCourseShareContextMenu(course, menuProps) {
        if (!isContextMenuAvailable()) {
            return null;
        }
        return (
            <ResourceContextMenu {...menuProps}>
                <ResourceContextMenu.Actions>
                    <AssignCourseMenuItem course={course} />
                    <RecommendCourseMenuItem course={course} />
                    <ShareCourseToMSTeamsMenuItem course={course} />
                    <ShareCourseToSlackMenuItem course={course} />
                    <ShareCourseToWorkplaceMenuItem course={course} />
                </ResourceContextMenu.Actions>
            </ResourceContextMenu>
        );
    }

    function getCourseTableRowContextMenu(
        course,
        menuProps,
        shouldDisplayUnassign = false,
        userLicenseStatus = undefined,
        isAbsolutePath = true,
    ) {
        if (!isContextMenuAvailable()) {
            return null;
        }

        const renderUnassignMenuItem = () => {
            return [
                <UnassignResourceMenuItem
                    key="UNASSIGN_RESOURCE"
                    assignment={course.assignment}
                    userLicenseStatus={userLicenseStatus}
                    addDivider={true}
                />,
            ];
        };

        return (
            <ResourceContextMenu {...menuProps}>
                <ResourceContextMenu.Menu>
                    <CourseAvailabilityMessageMenuItem course={course} />
                    {shouldDisplayUnassign && renderUnassignMenuItem()}
                    <AssignCourseMenuItem course={course} />
                    <RecommendCourseMenuItem course={course} />
                    <ShareCourseToMSTeamsMenuItem course={course} />
                    <ShareCourseToSlackMenuItem course={course} />
                    <ShareCourseToWorkplaceMenuItem course={course} />
                    <ResourceContextMenu.Divider />
                    <AddCourseToCustomCategoryMenuItem course={course} />
                    <AddCourseToLearningPathMenuItem course={course} />
                    <ViewCourseActivityMenuItem course={course} isAbsolutePath={isAbsolutePath} />
                </ResourceContextMenu.Menu>
            </ResourceContextMenu>
        );
    }

    function getLearningPathCardContextMenu(learningPath, menuProps) {
        if (!isContextMenuAvailable()) {
            return null;
        }
        const learningPathModel = new LearningPath(learningPath);
        return (
            <ResourceContextMenu context={PAGE_TYPE_ORG_LOGGED_IN_HOMEPAGE} {...menuProps}>
                <ResourceContextMenu.Menu>
                    <AssignLearningPathMenuItem learningPath={learningPathModel} />
                    <RecommendLearningPathMenuItem learningPath={learningPathModel} />
                    <ShareLearningPathToMSTeamsMenuItem learningPath={learningPathModel} />
                    <ShareLearningPathToSlackMenuItem learningPath={learningPathModel} />
                    <ShareLearningPathToWorkplaceMenuItem learningPath={learningPathModel} />
                    {learningPathModel.isPublic &&
                        !learningPathModel.isStudent &&
                        learningPathModel.isOrgLearningPath && <ResourceContextMenu.Divider />}
                    <EditLearningPathMenuItem learningPath={learningPathModel} />
                    <EditRequestLearningPathMenuItem learningPath={learningPathModel} />
                    <ViewActivityLearningPathMenuItem learningPath={learningPathModel} />
                    <DuplicateLearningPathMenuItem learningPath={learningPathModel} />
                </ResourceContextMenu.Menu>
            </ResourceContextMenu>
        );
    }

    return {
        getCLPContextMenu(course) {
            const props = {context: CONTEXT_TYPES.CLP, size: 'medium', placement: 'bottom-start'};
            return getCourseContextMenu(course, props);
        },
        getMyCoursesContextMenu(course, enrollment, menuProps, actionCallbacks) {
            if (!isContextMenuAvailable()) {
                return (
                    <ResourceContextMenu
                        {...menuProps}
                        context={CONTEXT_TYPES.MY_COURSES}
                        udStyle="white-solid"
                    >
                        <ResourceContextMenu.Menu>
                            <SaveCourseMenuItem
                                courseId={course.id}
                                enrollment={enrollment}
                                enableUBListExperiment={menuProps.enableUBListExperiment}
                            />
                            <FavoriteCourseMenuItem
                                enrollment={enrollment}
                                enableUBListExperiment={menuProps.enableUBListExperiment}
                            />
                            <ArchiveCourseMenuItem
                                enrollment={enrollment}
                                actionCallbacks={actionCallbacks}
                            />
                        </ResourceContextMenu.Menu>
                    </ResourceContextMenu>
                );
            }
            return (
                <ResourceContextMenu
                    {...menuProps}
                    context={CONTEXT_TYPES.MY_COURSES}
                    udStyle="white-solid"
                >
                    <ResourceContextMenu.Menu>
                        <AssignCourseMenuItem course={course} />
                        <RecommendCourseMenuItem course={course} />
                        <ShareCourseToMSTeamsMenuItem course={course} />
                        <ShareCourseToSlackMenuItem course={course} />
                        <ShareCourseToWorkplaceMenuItem course={course} />
                        <ResourceContextMenu.Divider />
                        <AddCourseToCustomCategoryMenuItem course={course} />
                        <AddCourseToLearningPathMenuItem course={course} />
                        <ViewCourseActivityMenuItem course={course} />

                        <SaveCourseMenuItem
                            courseId={course.id}
                            enrollment={enrollment}
                            enableUBListExperiment={menuProps.enableUBListExperiment}
                        />
                        <FavoriteCourseMenuItem
                            enrollment={enrollment}
                            enableUBListExperiment={menuProps.enableUBListExperiment}
                        />
                        <ArchiveCourseMenuItem
                            enrollment={enrollment}
                            actionCallbacks={actionCallbacks}
                        />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getCourseTakingHeaderContextMenu(
            context,
            courseTakingStore,
            unenrollStore,
            enableUBListExperiment,
        ) {
            if (udMe.isLoading || !udMe.id) {
                return null;
            }

            const props = {
                context,
                size: 'medium',
                placement: 'bottom-start',
            };

            const {enrollment, course} = courseTakingStore;

            const renderShareMenuItems = () => {
                return [
                    <AssignCourseMenuItem key="ASSIGN_COURSE" course={course} />,
                    <RecommendCourseMenuItem key="RECOMMEND_COURSE" course={course} />,
                    <ShareCourseToMSTeamsMenuItem key="SHARE_TO_MS_TEAMS" course={course} />,
                    <ShareCourseToSlackMenuItem key="SHARE_TO_SLACK" course={course} />,
                    <ShareCourseToWorkplaceMenuItem key="SHARE_TO_WORKPLACE" course={course} />,
                    <MarketplaceShareMenuItem
                        key="MARKETPLACE_SHARE"
                        courseTakingStore={courseTakingStore}
                    />,
                ];
            };

            return (
                <ResourceContextMenu {...props} udStyle="white-outline">
                    {!enableUBListExperiment && (
                        <ResourceContextMenu.Actions>
                            {renderShareMenuItems()}
                        </ResourceContextMenu.Actions>
                    )}
                    <ResourceContextMenu.Menu>
                        {enableUBListExperiment && renderShareMenuItems()}
                        <AddCourseToCustomCategoryMenuItem course={course} />
                        <AddCourseToLearningPathMenuItem course={course} />
                        <ViewCourseActivityMenuItem course={course} />

                        <FavoriteCourseMenuItem
                            enrollment={enrollment}
                            courseTakingStore={courseTakingStore}
                            enableUBListExperiment={enableUBListExperiment}
                        />
                        <ArchiveCourseMenuItem
                            enrollment={enrollment}
                            courseTakingStore={courseTakingStore}
                        />
                        <GiftCourseMenuItem course={course} enrollment={enrollment} />
                        <EditRatingMenuItem courseTakingStore={courseTakingStore} />
                        <EmailSettingsMenuItem enrollment={enrollment} />
                        <RefundMenuItem enrollment={enrollment} />
                        <UnenrollMenuItem unenrollStore={unenrollStore} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getCourseTakingOverviewContextMenu(course) {
            if (!isContextMenuAvailable()) {
                return null;
            }
            const props = {
                context: CONTEXT_TYPES.UFB_COURSE_TAKING,
                size: 'medium',
                placement: 'bottom-start',
            };
            return (
                <ResourceContextMenu {...props} udStyle="secondary">
                    <ResourceContextMenu.Menu>
                        <AddCourseToCustomCategoryMenuItem course={course} />
                        <AddCourseToLearningPathMenuItem course={course} />
                        <ViewCourseActivityMenuItem course={course} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getQuickViewBoxContextMenu(course) {
            return getCourseContextMenu(course, {context: CONTEXT_TYPES.COURSE_QUICK_VIEW_BOX});
        },
        getQuickviewBoxLearnerContextMenu(course) {
            if (
                !isContextMenuAvailable() ||
                hasAllowedRole(USER_ROLES.OWNER, USER_ROLES.ADMIN, USER_ROLES.GROUP_ADMIN)
            ) {
                return null;
            }
            return (
                <ResourceContextMenu
                    context={CONTEXT_TYPES.COURSE_QUICK_VIEW_BOX}
                    udStyle="secondary"
                    size="large"
                >
                    <ResourceContextMenu.Menu>
                        <RecommendCourseMenuItem course={course} />
                        <ShareCourseToMSTeamsMenuItem course={course} />
                        <ShareCourseToSlackMenuItem course={course} />
                        <ShareCourseToWorkplaceMenuItem course={course} />
                        <AddCourseToCustomCategoryMenuItem course={course} />
                        <AddCourseToLearningPathMenuItem course={course} />
                        <ViewCourseActivityMenuItem course={course} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getCourseCardContextMenu(course, menuProps) {
            if (!isContextMenuAvailable()) {
                return null;
            }
            return (
                <ResourceContextMenu {...menuProps} udStyle="secondary">
                    <ResourceContextMenu.Menu>
                        <AssignCourseMenuItem course={course} />
                        <RecommendCourseMenuItem course={course} />
                        <ShareCourseToMSTeamsMenuItem course={course} />
                        <ShareCourseToSlackMenuItem course={course} />
                        <ShareCourseToWorkplaceMenuItem course={course} />
                        {!udMe.organization.isStudent && <ResourceContextMenu.Divider />}
                        <AddCourseToCustomCategoryMenuItem course={course} />
                        <AddCourseToLearningPathMenuItem course={course} />
                        <ViewCourseActivityMenuItem course={course} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getLearningPathCardHomeContextMenu(learningPath) {
            return getLearningPathCardContextMenu(learningPath);
        },

        getCourseProgressCardContextMenu(course) {
            if (!isContextMenuAvailable()) {
                return null;
            }
            return (
                <ResourceContextMenu context={CONTEXT_TYPES.MY_LEARNING_UNIT}>
                    <ResourceContextMenu.Menu>
                        <AssignCourseMenuItem course={course} />
                        <RecommendCourseMenuItem course={course} />
                        <ShareCourseToMSTeamsMenuItem course={course} />
                        <ShareCourseToSlackMenuItem course={course} />
                        <ShareCourseToWorkplaceMenuItem course={course} />
                        <AddCourseToCustomCategoryMenuItem course={course} />
                        <AddCourseToLearningPathMenuItem course={course} />
                        <ViewCourseActivityMenuItem course={course} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getAssignedLearningPathContextMenu(learningPath) {
            return getLearningPathCardContextMenu(learningPath, {
                context: CONTEXT_TYPES.ANALYTICS_ASSIGNED_LEARNING_PAGE,
                udStyle: 'secondary',
            });
        },
        getAssignedCourseContextMenu(course) {
            return getCourseTableRowContextMenu(course, {
                context: CONTEXT_TYPES.ANALYTICS_ASSIGNED_LEARNING_PAGE,
                udStyle: 'secondary',
            });
        },
        getAssignedAssessmentContextMenu(assessment) {
            return (
                <ResourceContextMenu context={CONTEXT_TYPES.ANALYTICS_ASSIGNED_LEARNING_PAGE}>
                    {this._getAssessmentContextMenu(assessment)}
                </ResourceContextMenu>
            );
        },
        getPathInsightsContextMenu(learningPath) {
            return (
                <ResourceContextMenu
                    context={CONTEXT_TYPES.LEARNING_PATH_INSIGHTS}
                    udStyle="secondary"
                    placement="bottom-start"
                    size="medium"
                >
                    <ResourceContextMenu.Actions>
                        <AssignLearningPathMenuItem learningPath={learningPath} />
                        <RecommendLearningPathMenuItem learningPath={learningPath} />
                        <ShareLearningPathToMSTeamsMenuItem learningPath={learningPath} />
                        <ShareLearningPathToSlackMenuItem learningPath={learningPath} />
                        <ShareLearningPathToWorkplaceMenuItem learningPath={learningPath} />
                    </ResourceContextMenu.Actions>
                    <ResourceContextMenu.Menu>
                        <EditLearningPathMenuItem learningPath={learningPath} />
                        <EditRequestLearningPathMenuItem learningPath={learningPath} />
                        <DuplicateLearningPathMenuItem learningPath={learningPath} />
                        <DeleteLearningPath learningPath={learningPath} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getPathInsightsUsersTable(context, assignment, userLicenseStatus) {
            return (
                <ResourceContextMenu context={context} udStyle="secondary">
                    <ResourceContextMenu.Menu>
                        <UnassignResourceMenuItem
                            assignment={assignment}
                            userLicenseStatus={userLicenseStatus}
                        />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getCourseInsightsUsersTable(context, user, courseId, isAssignSummaryEnabled) {
            return (
                <ResourceContextMenu context={context} udStyle="secondary">
                    <ResourceContextMenu.Menu>
                        <UnassignResourceMenuItem
                            assignment={user.assignment}
                            userLicenseStatus={user.userLicenseStatus}
                        />
                        <EmailAssigneeMenuItem
                            resourceId={courseId}
                            resourceType={RESOURCE_TYPES.COURSE}
                            assignee={user._apiData}
                            userLicenseStatus={user.licenseStatus}
                            nudgeGroup={user.nudgeGroup}
                            isAssignSummaryEnabled={isAssignSummaryEnabled}
                        />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getCourseInsightsContextMenu(course) {
            return getCourseTableRowContextMenu(
                course,
                {
                    context: CONTEXT_TYPES.COURSE_INSIGHTS,
                    udStyle: 'secondary',
                },
                false,
                undefined,
                false,
            );
        },
        getCourseInfoContextMenu(course) {
            if (!isContextMenuAvailable()) {
                return null;
            }

            return (
                <ResourceContextMenu context={CONTEXT_TYPES.COURSE_INSIGHTS} udStyle="secondary">
                    <ResourceContextMenu.Actions>
                        <AssignCourseMenuItem course={course} />
                        <RecommendCourseMenuItem course={course} />
                        <ShareCourseToMSTeamsMenuItem course={course} />
                        <ShareCourseToSlackMenuItem course={course} />
                        <ShareCourseToWorkplaceMenuItem course={course} />
                    </ResourceContextMenu.Actions>
                    <ResourceContextMenu.Menu>
                        <AddCourseToCustomCategoryMenuItem course={course} />
                        <AddCourseToLearningPathMenuItem course={course} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getCourseShareContextMenu(course, context) {
            return getCourseShareContextMenu(course, {context});
        },
        getCourseUpdatesContextMenu(course) {
            return getCourseTableRowContextMenu(course, {
                context: CONTEXT_TYPES.COURSE_UPDATES,
                udStyle: 'secondary',
            });
        },
        getCustomCoursesContextMenu(course) {
            return getCourseTableRowContextMenu(course, {
                context: CONTEXT_TYPES.MANAGE_COURSES,
                udStyle: 'secondary',
            });
        },
        getCustomCategoryCourseContextMenu(course) {
            if (!isContextMenuAvailable()) {
                return null;
            }

            const addCourseToCustomCategoryTitle = gettext('Edit category');

            return (
                <ResourceContextMenu context={CONTEXT_TYPES.MANAGE_COURSES} udStyle="secondary">
                    <ResourceContextMenu.Actions>
                        <AddCourseToCustomCategoryMenuItem
                            course={course}
                            title={addCourseToCustomCategoryTitle}
                            showIcon={false}
                        />
                    </ResourceContextMenu.Actions>
                    <ResourceContextMenu.Menu>
                        <CourseAvailabilityMessageMenuItem course={course} />
                        <AssignCourseMenuItem course={course} />
                        <RecommendCourseMenuItem course={course} />
                        <ShareCourseToMSTeamsMenuItem course={course} />
                        <ShareCourseToSlackMenuItem course={course} />
                        <ShareCourseToWorkplaceMenuItem course={course} />
                        <ResourceContextMenu.Divider />
                        <AddCourseToLearningPathMenuItem course={course} />
                        <ViewCourseActivityMenuItem course={course} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getImportedCourseContextMenu(course) {
            if (!isContextMenuAvailable()) {
                return null;
            }

            return (
                <ResourceContextMenu context={CONTEXT_TYPES.MANAGE_COURSES} udStyle="secondary">
                    <ResourceContextMenu.Actions>
                        <BuyLicensesMenuItem course={course} />
                        <FreeCourseMenuItem course={course} />
                    </ResourceContextMenu.Actions>
                    <ResourceContextMenu.Menu>
                        <CourseAvailabilityMessageMenuItem course={course} />
                        <AssignCourseMenuItem course={course} />
                        <RecommendCourseMenuItem course={course} />
                        <ShareCourseToMSTeamsMenuItem course={course} />
                        <ShareCourseToSlackMenuItem course={course} />
                        <ShareCourseToWorkplaceMenuItem course={course} />
                        <ResourceContextMenu.Divider />
                        <AddCourseToLearningPathMenuItem course={course} />
                        <ViewCourseActivityMenuItem course={course} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
        getBrowseCustomCategoryCourseContextMenu(course) {
            return getCourseTableRowContextMenu(course, {
                context: CONTEXT_TYPES.ALL_COURSES,
                udStyle: 'secondary',
            });
        },

        _getCourseAutoAssignRulesContextMenu(course, assignmentRule, contextMenuProps) {
            return (
                <ResourceContextMenu {...contextMenuProps}>
                    <ResourceContextMenu.Menu>
                        <DeactivateRuleMenuItem assignmentRule={assignmentRule} />
                        <DeleteRuleMenuItem assignmentRule={assignmentRule} />
                        <ResourceContextMenu.Divider />
                        <AssignCourseMenuItem course={course} />
                        <RecommendCourseMenuItem course={course} />
                        <ShareCourseToMSTeamsMenuItem course={course} />
                        <ShareCourseToSlackMenuItem course={course} />
                        <ShareCourseToWorkplaceMenuItem course={course} />
                        <ResourceContextMenu.Divider />
                        <AddCourseToCustomCategoryMenuItem course={course} />
                        <AddCourseToLearningPathMenuItem course={course} />
                        <ViewCourseActivityMenuItem course={course} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },

        _getLearningPathAutoAssignRulesContextMenu(
            learningPathModel,
            assignmentRule,
            contextMenuProps,
        ) {
            return (
                <ResourceContextMenu {...contextMenuProps}>
                    <ResourceContextMenu.Menu>
                        <DeactivateRuleMenuItem assignmentRule={assignmentRule} />
                        <DeleteRuleMenuItem assignmentRule={assignmentRule} />
                        <ResourceContextMenu.Divider />
                        <AssignLearningPathMenuItem learningPath={learningPathModel} />
                        <RecommendLearningPathMenuItem learningPath={learningPathModel} />
                        <ShareLearningPathToMSTeamsMenuItem learningPath={learningPathModel} />
                        <ShareLearningPathToSlackMenuItem learningPath={learningPathModel} />
                        <ShareLearningPathToWorkplaceMenuItem learningPath={learningPathModel} />
                        <ViewActivityLearningPathMenuItem
                            learningPath={learningPathModel}
                            addDivider={true}
                        />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },

        _getLabAutoAssignRulesContextMenu(lab, assignmentRule, contextMenuProps) {
            return (
                <ResourceContextMenu {...contextMenuProps}>
                    <ResourceContextMenu.Menu>
                        <DeactivateRuleMenuItem assignmentRule={assignmentRule} />
                        <DeleteRuleMenuItem assignmentRule={assignmentRule} />
                        <ResourceContextMenu.Divider />
                        <AssignLabMenuItem lab={lab} />
                        <RecommendResourceMenuItem
                            resource={lab}
                            resourceType={RESOURCE_TYPES.LAB}
                        />
                        <ShareToMSTeamsMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                        <ShareToSlackMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                        <ShareToWorkplaceMenuItem
                            resource={lab}
                            resourceType={RESOURCE_TYPES.LAB}
                        />
                        <ResourceContextMenu.Divider />
                        <ViewLabActivityMenuItem />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },

        getAutoAssignRulesContextMenu(assignmentRule) {
            if (!isContextMenuAvailable()) {
                return null;
            }

            const contextMenuProps = {
                context: CONTEXT_TYPES.AUTO_ASSIGN_RULES_PAGE,
                udStyle: 'secondary',
            };

            if (assignmentRule.resource) {
                if (assignmentRule.resourceType === RESOURCE_TYPES.COURSE) {
                    const course = new Course(assignmentRule.resource);
                    return this._getCourseAutoAssignRulesContextMenu(
                        course,
                        assignmentRule,
                        contextMenuProps,
                    );
                } else if (assignmentRule.resourceType === RESOURCE_TYPES.LEARNING_PATH) {
                    const learningPathModel = new LearningPath(assignmentRule.resource);
                    return this._getLearningPathAutoAssignRulesContextMenu(
                        learningPathModel,
                        assignmentRule,
                        contextMenuProps,
                    );
                } else if (assignmentRule.resourceType === RESOURCE_TYPES.LAB) {
                    const lab = new Lab(assignmentRule.resource);
                    return this._getLabAutoAssignRulesContextMenu(
                        lab,
                        assignmentRule,
                        contextMenuProps,
                    );
                }
            }

            // handle case where the resource is not available (e.g. due to permissions, privacy)
            return (
                <ResourceContextMenu {...contextMenuProps}>
                    <ResourceContextMenu.Menu>
                        <DeactivateRuleMenuItem assignmentRule={assignmentRule} />
                        <DeleteRuleMenuItem assignmentRule={assignmentRule} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },

        getListPageLearningPathCardContextMenu(
            learningPath,
            isAddToFoldersVisible,
            isActiveFolder,
        ) {
            return (
                <ResourceContextMenu context={CONTEXT_TYPES.LEARNING_PATH_LIST_PAGE}>
                    <ResourceContextMenu.Menu>
                        <EnrollLearningPathMenuItem learningPath={learningPath} />
                        <UnenrollLearningPathMenuItem learningPath={learningPath} />
                        <AssignLearningPathMenuItem learningPath={learningPath} />
                        <RecommendLearningPathMenuItem learningPath={learningPath} />
                        <ShareLearningPathToMSTeamsMenuItem learningPath={learningPath} />
                        <ShareLearningPathToSlackMenuItem learningPath={learningPath} />
                        <ShareLearningPathToWorkplaceMenuItem learningPath={learningPath} />
                        {!learningPath.isStudent && learningPath.isOrgLearningPath && (
                            <ResourceContextMenu.Divider />
                        )}
                        <EditRequestLearningPathMenuItem learningPath={learningPath} />
                        <EditLearningPathMenuItem learningPath={learningPath} />
                        <AddEditorsLearningPathMenuItem learningPath={learningPath} />
                        <ViewActivityLearningPathMenuItem learningPath={learningPath} />
                        {learningPath.isUserEditor && !learningPath.isStudent && (
                            <ResourceContextMenu.Divider />
                        )}
                        <DuplicateLearningPathMenuItem learningPath={learningPath} />
                        <AddLearningPathToFolderMenuItem
                            learningPath={learningPath}
                            isAddToFoldersVisible={isAddToFoldersVisible}
                        />
                        <RemoveLearningPathFromFolderMenuItem isActiveFolder={isActiveFolder} />
                        <DeleteLearningPath learningPath={learningPath} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },

        getLearningPathContextMenu(learningPath, menuProps) {
            return (
                <ResourceContextMenu
                    context={CONTEXT_TYPES.LEARNING_PATH}
                    {...menuProps}
                    udStyle="secondary"
                    size="medium"
                >
                    <ResourceContextMenu.Menu>
                        <EnrollLearningPathMenuItem
                            learningPath={learningPath}
                            resourceContext={CONTEXT_TYPES.LEARNING_PATH}
                        />
                        <EditPathTitleDescriptionLearningPathMenuItem learningPath={learningPath} />
                        <UnenrollLearningPathMenuItem learningPath={learningPath} />
                        <AssignLearningPathMenuItem learningPath={learningPath} />
                        <RecommendLearningPathMenuItem learningPath={learningPath} />
                        <ShareLearningPathToMSTeamsMenuItem learningPath={learningPath} />
                        <ShareLearningPathToSlackMenuItem learningPath={learningPath} />
                        <ShareLearningPathToWorkplaceMenuItem learningPath={learningPath} />
                        {!learningPath.isStudent && <ResourceContextMenu.Divider />}
                        <EditRequestLearningPathMenuItem learningPath={learningPath} />
                        <AddEditorsLearningPathMenuItem learningPath={learningPath} />
                        <ViewActivityLearningPathMenuItem learningPath={learningPath} />
                        <HistoryLogLearningPathMenuItem learningPath={learningPath} />
                        {learningPath.isUserEditor && !learningPath.isStudent && (
                            <ResourceContextMenu.Divider />
                        )}
                        <DuplicateLearningPathMenuItem learningPath={learningPath} />
                        <DeleteLearningPath learningPath={learningPath} />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },

        _getLabContextMenu(lab) {
            return (
                <ResourceContextMenu.Menu>
                    <AssignLabMenuItem lab={lab} />
                    <RecommendResourceMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                    <ShareToMSTeamsMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                    <ShareToSlackMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                    <ShareToWorkplaceMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                </ResourceContextMenu.Menu>
            );
        },

        getLabOverviewPageContextMenu(lab) {
            if (!isContextMenuAvailable()) {
                return null;
            }
            return (
                <ResourceContextMenu
                    context={CONTEXT_TYPES.LAB_OVERVIEW_PAGE}
                    udStyle="secondary"
                    placement="bottom-start"
                    size="large"
                >
                    <ResourceContextMenu.Actions>
                        <AssignLabMenuItem lab={lab} />
                        <RecommendResourceMenuItem
                            resource={lab}
                            resourceType={RESOURCE_TYPES.LAB}
                        />
                        <ShareToMSTeamsMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                        <ShareToSlackMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                        <ShareToWorkplaceMenuItem
                            resource={lab}
                            resourceType={RESOURCE_TYPES.LAB}
                        />
                    </ResourceContextMenu.Actions>
                </ResourceContextMenu>
            );
        },

        getListPageLabCardContextMenu(lab) {
            if (!isContextMenuAvailable()) {
                return null;
            }
            return (
                <ResourceContextMenu context={CONTEXT_TYPES.LAB_LIST_PAGE}>
                    {this._getLabContextMenu(lab)}
                </ResourceContextMenu>
            );
        },

        getOverviewPageLabCardContextMenu(lab) {
            if (!isContextMenuAvailable()) {
                return null;
            }
            return (
                <ResourceContextMenu context={CONTEXT_TYPES.LAB_OVERVIEW_PAGE} udStyle="secondary">
                    {this._getLabContextMenu(lab)}
                </ResourceContextMenu>
            );
        },

        getHomePageLabCardContextMenu(lab) {
            if (!isContextMenuAvailable()) {
                return null;
            }
            return (
                <ResourceContextMenu context={CONTEXT_TYPES.LOGGED_IN_HOMEPAGE}>
                    {this._getLabContextMenu(lab)}
                </ResourceContextMenu>
            );
        },

        getAssignedLabContextMenu(assignmentLabModel) {
            if (!isContextMenuAvailable()) {
                return null;
            }
            const lab = new Lab(assignmentLabModel);
            return (
                <ResourceContextMenu
                    context={CONTEXT_TYPES.LAB_ASSIGNED_LEARNING_PAGE}
                    udStyle="secondary"
                >
                    <ResourceContextMenu.Menu>
                        <AssignLabMenuItem lab={lab} />
                        <RecommendResourceMenuItem
                            resource={lab}
                            resourceType={RESOURCE_TYPES.LAB}
                        />
                        <ShareToMSTeamsMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                        <ShareToSlackMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                        <ShareToWorkplaceMenuItem
                            resource={lab}
                            resourceType={RESOURCE_TYPES.LAB}
                        />
                        <ResourceContextMenu.Divider />
                        <ViewLabActivityMenuItem />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },

        getUserDetailLabContextMenu(assignmentLabModel, userLicenseStatus) {
            if (!isContextMenuAvailable()) {
                return null;
            }
            const lab = new Lab(assignmentLabModel);
            return (
                <ResourceContextMenu
                    context={CONTEXT_TYPES.LAB_USER_DETAIL_PAGE}
                    udStyle="secondary"
                >
                    <ResourceContextMenu.Menu>
                        <UnassignResourceMenuItem
                            assignment={lab.assignment}
                            userLicenseStatus={userLicenseStatus}
                            addDivider={true}
                        />
                        <AssignLabMenuItem lab={lab} />
                        <RecommendResourceMenuItem
                            resource={lab}
                            resourceType={RESOURCE_TYPES.LAB}
                        />
                        <ShareToMSTeamsMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                        <ShareToSlackMenuItem resource={lab} resourceType={RESOURCE_TYPES.LAB} />
                        <ShareToWorkplaceMenuItem
                            resource={lab}
                            resourceType={RESOURCE_TYPES.LAB}
                        />
                        <ResourceContextMenu.Divider />
                        <ViewLabActivityMenuItem />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },

        getUserDetailAssessmentContextMenu(assessment) {
            if (!isContextMenuAvailable()) {
                return null;
            }

            return (
                <ResourceContextMenu
                    context={CONTEXT_TYPES.ASSESSMENT_USER_DETAILS_PAGE}
                    udStyle="secondary"
                >
                    <ResourceContextMenu.Menu>
                        <RecommendResourceMenuItem
                            resource={assessment}
                            resourceType={RESOURCE_TYPES.ASSESSMENT}
                        />
                        <ShareToMSTeamsMenuItem
                            resource={assessment}
                            resourceType={RESOURCE_TYPES.ASSESSMENT}
                        />
                        <ShareToSlackMenuItem
                            resource={assessment}
                            resourceType={RESOURCE_TYPES.ASSESSMENT}
                        />
                        <ShareToWorkplaceMenuItem
                            resource={assessment}
                            resourceType={RESOURCE_TYPES.ASSESSMENT}
                        />
                        <ResourceContextMenu.Divider />
                        <ViewAssessmentActivityMenuItem />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },

        _getAssessmentContextMenu(assessment) {
            const assessmentId = isNaN(assessment.id)
                ? idFromGlobalId(assessment.id)
                : assessment.id;
            const _assessment = new LearningPathAssessment({
                ...assessment,
                id: assessmentId,
            });

            return (
                <ResourceContextMenu.Menu>
                    <AssignAssessmentMenuItem assessment={_assessment} />
                    <RecommendResourceMenuItem
                        resource={_assessment}
                        resourceType={RESOURCE_TYPES.ASSESSMENT}
                    />
                    <ShareToMSTeamsMenuItem
                        resource={_assessment}
                        resourceType={RESOURCE_TYPES.ASSESSMENT}
                    />
                    <ShareToSlackMenuItem
                        resource={_assessment}
                        resourceType={RESOURCE_TYPES.ASSESSMENT}
                    />
                    <ShareToWorkplaceMenuItem
                        resource={_assessment}
                        resourceType={RESOURCE_TYPES.ASSESSMENT}
                    />
                </ResourceContextMenu.Menu>
            );
        },

        getTakeAssessmentCardContextMenu(assessment) {
            if (!isContextMenuAvailable()) {
                return null;
            }
            return (
                <ResourceContextMenu context={CONTEXT_TYPES.ASSESSMENT_LIST_PAGE}>
                    {this._getAssessmentContextMenu(assessment)}
                </ResourceContextMenu>
            );
        },

        getActiveAssessmentCardContextMenu(assessment) {
            if (!isContextMenuAvailable()) {
                return null;
            }
            return (
                <ResourceContextMenu context={CONTEXT_TYPES.LOGGED_IN_HOMEPAGE}>
                    {this._getAssessmentContextMenu(assessment)}
                </ResourceContextMenu>
            );
        },

        getAssessmentTakingPageCardShareContextMenu(assessment) {
            const _assessment = {...assessment, id: assessment.id};

            if (!isContextMenuAvailable()) {
                return null;
            }
            // not reusing _getAssessmentContextMenu because we are using ResourceContextMenu.Actions
            // instead of ResourceContextMenu.Menu (display inside of Share button)
            return (
                <ResourceContextMenu
                    context={CONTEXT_TYPES.ASSESSMENT_OVERVIEW_PAGE}
                    placement="top"
                    udStyle="secondary"
                    size="large"
                >
                    <ResourceContextMenu.Actions>
                        <RecommendResourceMenuItem
                            resource={_assessment}
                            resourceType={RESOURCE_TYPES.ASSESSMENT}
                        />
                        <ShareToMSTeamsMenuItem
                            resource={_assessment}
                            resourceType={RESOURCE_TYPES.ASSESSMENT}
                        />
                        <ShareToSlackMenuItem
                            resource={_assessment}
                            resourceType={RESOURCE_TYPES.ASSESSMENT}
                        />
                        <ShareToWorkplaceMenuItem
                            resource={_assessment}
                            resourceType={RESOURCE_TYPES.ASSESSMENT}
                        />
                    </ResourceContextMenu.Actions>
                </ResourceContextMenu>
            );
        },

        getCourseUserDetailsPage(course, userLicenseStatus) {
            return getCourseTableRowContextMenu(
                course,
                {
                    context: CONTEXT_TYPES.COURSE_USER_DETAILS_PAGE,
                    udStyle: 'secondary',
                },
                true,
                userLicenseStatus,
            );
        },

        getLearningPathUserDetailsPage(learningPath, userLicenseStatus) {
            if (!isContextMenuAvailable()) {
                return null;
            }

            const assignment = learningPath.assignment;
            const learningPathModel = new LearningPath(learningPath);

            return (
                <ResourceContextMenu
                    context={CONTEXT_TYPES.LEARNING_PATH_USER_DETAILS_PAGE}
                    udStyle="secondary"
                >
                    <ResourceContextMenu.Menu>
                        <UnassignResourceMenuItem
                            assignment={assignment}
                            userLicenseStatus={userLicenseStatus}
                            addDivider={!!learningPathModel.isPublic}
                        />
                        <AssignLearningPathMenuItem learningPath={learningPathModel} />
                        <RecommendLearningPathMenuItem learningPath={learningPathModel} />
                        <ShareLearningPathToMSTeamsMenuItem learningPath={learningPathModel} />
                        <ShareLearningPathToSlackMenuItem learningPath={learningPathModel} />
                        <ShareLearningPathToWorkplaceMenuItem learningPath={learningPathModel} />
                        <ViewActivityLearningPathMenuItem
                            learningPath={learningPathModel}
                            addDivider={true}
                        />
                    </ResourceContextMenu.Menu>
                </ResourceContextMenu>
            );
        },
    };
}
