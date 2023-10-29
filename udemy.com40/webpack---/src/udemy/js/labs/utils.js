import 'utils/composed-path';
import {Tracker} from '@udemy/event-tracking';
import React from 'react';

import {EVENT_LABEL} from 'lab-taking/tasks/structured/automated-lab-review/constants';
import {
    AutomatedLabReviewCheckOutputViewEvent,
    AutomatedLabReviewEvent,
} from 'labs/events/automated-lab-review-action-event';
import {
    LabLoadingNotification,
    LabLoadingTimeAccuracyEvent,
} from 'labs/events/lab-loading-notification-action-event';
import {LabReportIssueEvent} from 'labs/events/lab-report-issue-event';
import {NOTIFICATION_EVENT_LABEL} from 'labs/workspace-notification/constants';
import {getVariantValueFromUdRequest} from 'utils/get-experiment-data';
import getRequestData from 'utils/get-request-data';
import udApi from 'utils/ud-api';
import udLink from 'utils/ud-link';

import {jwtForLabInstanceApiUrl, labBaseApiUrl, labInstanceApiUrl} from './apis';
import {
    LAB_TRACKING_SELECTED_UI_REGION_MAPPING,
    LAB_TYPE,
    LAB_PROVIDER,
    LAB_VERSIONING_ENABLED_IN_LAB_MANAGE_EXPERIMENT_DEFAULT,
    LAB_VERSIONING_ENABLED_IN_LAB_MANAGE_EXPERIMENT_SET,
    LAB_VERSIONING_ENABLED_IN_LAB_MANAGE_EXPERIMENT_VARIANT,
    LAB_VERTICAL,
    LAB_TRACKING_EVENTS,
    STATUS_CHECK_TIMEOUT,
    AWS_PRIVACY_POLICY_URL,
    AZURE_PRIVACY_POLICY_URL,
    DS_PRIVACY_POLICY_URL,
    UDEMY_HOSTED_PRIVACY_POLICY_URL,
    LABS_SUPPORT_ARTICLES,
    LAB_INSTANCE_STATUS,
    LAB_INSTANCE_UNSTARTABLE_STATUS,
    LAB_INIT_ERROR,
    LAB_CONTAINER_VERTICALS,
    LAB_STATUS,
    LAB_TIME_LIMIT_MINUTES,
    LAB_TIME_LIMIT_MS,
    LAB_EXTENDED_WORKSPACE_TIME_LIMIT_MINUTES,
    LAB_EXTENDED_WORKSPACE_TIME_LIMIT_MS,
    LAB_EVENT_MODE,
    LAB_MODES_WITH_ALR,
    LAB_VERTICALS_WITHOUT_PAUSE_RESUME,
} from './constants';
import {LabEntity} from './events/lab-entity';
import {LabTakingSessionEntity} from './events/lab-taking-session-entity';
import {LabTaskEntity} from './events/lab-task-entity';
import {LabWorkspaceEntity} from './events/lab-workspace-entity';
import {
    DEFAULT_ALLOWED_SPEND_FOR_INSTRUCTOR,
    HIGH_CONSUMPTION_LIMIT_RATIO,
    MAX_ALLOWED_SPEND,
} from './lab-launcher/constants';

export const checkLabInstanceStatus = async (labId, labUuid) => {
    const res = await udApi.get(labInstanceApiUrl(labId, labUuid));

    return res.data.status;
};

export const getLabDetails = async (labId, labStatus) => {
    const res = await udApi.get(labBaseApiUrl(labId), {
        params: {
            'fields[lab]': [
                'title',
                'lab_type',
                'vertical',
                'provider',
                'spec',
                'my_latest_instance',
            ].join(','),
            ...(labStatus === LAB_STATUS.draft && {version: 'head'}),
        },
    });
    return res.data;
};

export const checkStatusAndInit = async (labId, labUuid, labStatus, init) => {
    try {
        const status = await checkLabInstanceStatus(labId, labUuid);
        if (LAB_INSTANCE_UNSTARTABLE_STATUS.includes(status)) {
            init(await getLabDetails(labId, labStatus), LAB_INIT_ERROR.UNSTARTABLE);
        } else if (status === LAB_INSTANCE_STATUS.running) {
            init(await getLabDetails(labId, labStatus));
        } else {
            setTimeout(
                () => checkStatusAndInit(labId, labUuid, labStatus, init),
                STATUS_CHECK_TIMEOUT,
            );
        }
    } catch (e) {
        if (e.response.status === 404) {
            init(null, LAB_INIT_ERROR.NOT_FOUND);
        } else {
            throw e;
        }
    }
};

export const getJWTForLabInstance = async (labId, labUuid) => {
    const response = await udApi.post(jwtForLabInstanceApiUrl(labId, labUuid));
    return response.data.token;
};

export const getLabTypeLabelForKey = (key) => {
    return Object.values(LAB_TYPE).find((item) => item.key === key)?.label;
};

export const getLabVerticalLabelForKey = (key) => {
    return Object.values(LAB_VERTICAL).find((item) => item.key === key)?.label;
};

export const getLabVerticalGlyphForKey = (key) => {
    return Object.values(LAB_VERTICAL).find((item) => item.key === key)?.glyph;
};

export const getLabVerticalIconForKey = (key) => {
    return Object.values(LAB_VERTICAL).find((item) => item.key === key)?.iconComponent;
};

export const getAdditionalFeatureDescriptionForVertical = (vertical) => {
    if (vertical === LAB_VERTICAL.aws.key) {
        return gettext(
            'Please note that while Workspaces allows you to interact with most AWS services, there are a few that are currently not supported, including IAM.',
        );
    } else if (vertical === LAB_VERTICAL.azure.key) {
        return gettext(
            'Please note that while Workspaces allows you to interact with most Azure services, there are a few that are currently not supported.',
        );
    } else if (vertical === LAB_VERTICAL.data_science.key) {
        return gettext(
            'Workspaces can take up anything from a few seconds to two minutes to load.',
        );
    }
    return ''; // default to blank text
};

export const getOptimizeUsageMessageForVertical = (vertical) => {
    if (vertical === LAB_VERTICAL.aws.key) {
        return interpolate(
            gettext(
                'Workspaces have a budget limit that provide sufficient opportunity to practice. ' +
                    'We will suspend access as soon as the limit is reached. ' +
                    "Please remember to stop resources in the AWS console when you're not practicing. " +
                    '<a href="%(aws_support_article)s" rel="noopener,noreferrer">Learn more</a>.',
            ),
            {
                aws_support_article: LABS_SUPPORT_ARTICLES.AWS,
            },
            true,
        );
    } else if (vertical === LAB_VERTICAL.azure.key) {
        return interpolate(
            gettext(
                'Workspaces have a budget limit that provide sufficient opportunity to practice. ' +
                    'We will suspend access as soon as the limit is reached. ' +
                    "Please remember to stop resources in the Azure console when you're not practicing. " +
                    '<a href="%(azure_support_article)s" rel="noopener,noreferrer">Learn more</a>.',
            ),
            {
                azure_support_article: LABS_SUPPORT_ARTICLES.AZURE,
            },
            true,
        );
    } else if (vertical === LAB_VERTICAL.data_science.key) {
        return gettext(
            'We want you to use the Workspaces to learn and have set the limits to provide sufficient opportunity to practice. ' +
                'Remember to end the Workspace when done with an exercise and pause it when not in use. ' +
                'Your Workspace will be automatically paused and ended after a period of inactivity.',
        );
    }
    return ''; // default to blank text
};

export const getAdditionalUsageTermsForVerticalAndProvider = (vertical, provider) => {
    if (vertical === LAB_VERTICAL.aws.key) {
        return interpolate(
            gettext(
                'Launching the Workspace will require you to leave the Udemy platform and interact with Amazon Web Services (AWS).' +
                    ' Labs and workspaces are practice environments and data loss may occur if there are operational problems.' +
                    ' Any personal data manually uploaded is subject to AWS privacy policy which can be accessed ' +
                    '<a href="%(privacy_policy_hyperlink)s" rel="noopener,noreferrer">here</a>.',
            ),
            {
                privacy_policy_hyperlink: AWS_PRIVACY_POLICY_URL,
            },
            true,
        );
    } else if (vertical === LAB_VERTICAL.azure.key) {
        return interpolate(
            gettext(
                'Launching the Workspace will require you to leave the Udemy platform and interact with Azure.' +
                    ' Labs and workspaces are practice environments and data loss may occur if there are operational problems.' +
                    ' Any personal data manually uploaded is subject to Azure privacy policy which can be accessed ' +
                    '<a href="%(privacy_policy_hyperlink)s" rel="noopener,noreferrer">here</a>.',
            ),
            {
                privacy_policy_hyperlink: AZURE_PRIVACY_POLICY_URL,
            },
            true,
        );
    } else if (vertical === LAB_VERTICAL.data_science.key && provider !== LAB_PROVIDER.udemy) {
        return interpolate(
            gettext(
                'Launching the Workspace will require you to leave the Udemy platform and interact with a third-party vendor.' +
                    ' Labs and workspaces are practice environments and data loss may occur if there are operational problems.' +
                    ' Any personal data manually uploaded is subject to the third-party’s privacy policy which can be accessed ' +
                    '<a href="%(privacy_policy_hyperlink)s" rel="noopener,noreferrer">here</a>.',
            ),
            {
                privacy_policy_hyperlink: DS_PRIVACY_POLICY_URL,
            },
            true,
        );
    } else if (
        LAB_CONTAINER_VERTICALS.includes(vertical) ||
        (vertical === LAB_VERTICAL.data_science.key && provider === LAB_PROVIDER.udemy)
    ) {
        return interpolate(
            gettext(
                'Labs and workspaces are practice environments and data loss may occur if there are operational problems.' +
                    ' Any personal data manually uploaded is subject to Udemy Business privacy policy which can be accessed ' +
                    '<a href="%(privacy_policy_hyperlink)s" rel="noopener,noreferrer">here</a>.',
            ),
            {
                privacy_policy_hyperlink: UDEMY_HOSTED_PRIVACY_POLICY_URL,
            },
            true,
        );
    }
    return ''; // default to blank text
};

export const getLearnMoreWorkspacesTextForVertical = (vertical) => {
    const SUPPORT_ARTICLE_MAP = {
        [LAB_VERTICAL.aws.key]: LABS_SUPPORT_ARTICLES.AWS,
        [LAB_VERTICAL.azure.key]: LABS_SUPPORT_ARTICLES.AZURE,
        [LAB_VERTICAL.data_science.key]: LABS_SUPPORT_ARTICLES.DATA_SCIENCE,
        [LAB_VERTICAL.web.key]: LABS_SUPPORT_ARTICLES.WEB_DEVELOPMENT,
        [LAB_VERTICAL.devops.key]: LABS_SUPPORT_ARTICLES.DEVOPS,
        [LAB_VERTICAL.security.key]: LABS_SUPPORT_ARTICLES.SECURITY,
    };

    const supportArticleHyperlink =
        SUPPORT_ARTICLE_MAP[vertical] || LABS_SUPPORT_ARTICLES.WEB_DEVELOPMENT;

    return interpolate(
        gettext(
            'Learn more about Workspaces <a href="%(support_article_hyperlink)s" rel="noopener,noreferrer">here</a>.',
        ),
        {
            support_article_hyperlink: supportArticleHyperlink,
        },
        true,
    );
};

export const sendLabHeartbeatEvent = (uuid, startTimeMs, elapsedTimeMs, labCompletionMode) => {
    const eventData = {
        labInstanceUuid: uuid,
        startTime: startTimeMs,
        durationMs: elapsedTimeMs,
        labCompletionMode: labCompletionMode || null,
    };
    const eventObject = new LAB_TRACKING_EVENTS.HEARTBEAT(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendLabClickEvent = (
    lab,
    action,
    labTaskId,
    labTaskResourceId,
    inSessionTimeBetweenViewAndCtaClick,
    uiRegion,
    labCompletionMode,
    labTaskNumber,
    hasAutomatedLabReview = false,
) => {
    const eventData = {
        labId: lab.id.toString(),
        labVertical: lab.vertical,
        labInstanceUuid: lab.myLatestInstance?.uuid || null,
        labTaskId: labTaskId?.toString() || null,
        labTaskResourceId: labTaskResourceId?.toString() || null,
        inSessionTimeBetweenViewAndCtaClick: inSessionTimeBetweenViewAndCtaClick || null,
        labCompletionMode: labCompletionMode || lab.currentMode,
        action,
        uiRegion: uiRegion || null,
        hasAutomatedLabReview,
        labTaskNumber: labTaskNumber || null,
    };
    const eventObject = new LAB_TRACKING_EVENTS.CLICK(eventData);
    Tracker.publishEvent(eventObject);
};

export const generateLabEntity = (lab) => {
    const workspaceEntities = [];
    if (lab?.myLatestInstance) {
        workspaceEntities.push(
            new LabWorkspaceEntity(
                lab.myLatestInstance.id,
                lab.vertical,
                lab.myLatestInstance.uuid,
            ),
        );
    }
    const labEntity = new LabEntity(
        parseInt(lab.id, 10), // required for search and recommendation data where id is a string
        lab.title,
        !!lab.hasAutomatedReviewTests,
        lab.vertical,
        workspaceEntities,
    );
    return labEntity;
};

export const sendLabSelectedEvent = ({lab, uiRegion, trackingId, sourcePageId, sourcePageType}) => {
    const labEntity = generateLabEntity(lab);
    const eventData = {
        lab: labEntity,
        // Mapping from v1 to v2 UI region values
        uiRegion: LAB_TRACKING_SELECTED_UI_REGION_MAPPING[uiRegion],
        trackingId,
        sourcePageId,
        sourcePageType,
    };
    const eventObject = new LAB_TRACKING_EVENTS.LAB_SELECTED(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendLabStartedEvent = (lab, uiRegion, mode) => {
    const labEntity = generateLabEntity(lab);
    const eventData = {
        lab: labEntity,
        uiRegion: uiRegion || null,
        mode: LAB_EVENT_MODE[mode],
    };
    const eventObject = new LAB_TRACKING_EVENTS.LAB_STARTED(eventData);
    Tracker.publishEvent(eventObject);
};

export const generateLabTakingSessionEntity = (labInstance, sessionStartTime) => {
    if (!labInstance) {
        return null;
    }
    let sessionDuration = 0;
    const startTime = sessionStartTime || labInstance.startTime;
    if (startTime) {
        const startDateTime = new Date(startTime);
        const now = new Date();
        sessionDuration = Math.round((now.getTime() - startDateTime.getTime()) / 1000);
    }
    return new LabTakingSessionEntity(
        // remove microseconds and add Z to make it ISO 8601 compliant for both formats with and without ms
        startTime ? `${startTime.split('.')[0].replace('Z', '')}Z` : null,
        sessionDuration,
    );
};

export const sendLabExitedEvent = (lab, uiRegion, sessionStartTime, isLabInstancePaused) => {
    const labEntity = generateLabEntity(lab);
    const labTakingSession = generateLabTakingSessionEntity(
        lab?.myLatestInstance,
        sessionStartTime,
    );
    const eventData = {
        lab: labEntity,
        uiRegion,
        mode: LAB_EVENT_MODE[lab.currentMode],
        isLabInstancePaused,
        labTakingSession,
    };
    const eventObject = new LAB_TRACKING_EVENTS.LAB_EXITED(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendLabResumedEvent = (lab, uiRegion, sessionStartTime, isLabInstanceResumed) => {
    const labEntity = generateLabEntity(lab);
    const labTakingSession = generateLabTakingSessionEntity(
        lab?.myLatestInstance,
        sessionStartTime,
    );
    const eventData = {
        lab: labEntity,
        mode: LAB_EVENT_MODE[lab.currentMode],
        uiRegion,
        isLabInstanceResumed,
        labTakingSession,
    };
    const eventObject = new LAB_TRACKING_EVENTS.LAB_RESUMED(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendLabTaskCompletedEvent = (lab, labTask, taskNumber) => {
    const {id, title, hasAutomatedReviewTests} = labTask;
    const labTaskHasAlr = hasAutomatedReviewTests && LAB_MODES_WITH_ALR.includes(lab.currentMode);
    const labEntity = generateLabEntity(lab);
    const labTakingSession = generateLabTakingSessionEntity(
        lab?.myLatestInstance,
        lab?.myLatestInstance?.sessionStartTime,
    );
    const labTaskEntity = new LabTaskEntity(id, taskNumber, title, labTaskHasAlr);
    const eventData = {
        lab: labEntity,
        labTask: labTaskEntity,
        mode: LAB_EVENT_MODE[lab.currentMode],
        labTakingSession,
    };
    const eventObject = new LAB_TRACKING_EVENTS.LAB_TASK_COMPLETED(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendLabCompletedEvent = (lab, mode) => {
    const labTakingSession = generateLabTakingSessionEntity(
        lab?.myLatestInstance,
        lab?.myLatestInstance?.sessionStartTime,
    );
    const labEntity = generateLabEntity(lab);
    const eventData = {
        lab: labEntity,
        mode: LAB_EVENT_MODE[mode],
        labTakingSession,
    };
    const eventObject = new LAB_TRACKING_EVENTS.LAB_COMPLETED(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendLabWorkspaceLaunchedEvent = (
    lab,
    launchedInstance,
    uiRegion,
    sessionStartTime,
) => {
    const labEntity = generateLabEntity(lab);
    const workspace = new LabWorkspaceEntity(
        launchedInstance.id,
        lab.vertical,
        launchedInstance.uuid,
    );
    const labTakingSession = generateLabTakingSessionEntity(launchedInstance, sessionStartTime);
    const eventData = {
        lab: labEntity,
        workspace,
        uiRegion,
        mode: LAB_EVENT_MODE[lab.currentMode],
        labTakingSession,
    };
    const eventObject = new LAB_TRACKING_EVENTS.LAB_WORKSPACE_LAUNCHED(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendLabOverviewVisitEvent = (lab) => {
    const eventData = {
        labId: lab.id.toString(),
        isUnstartedVisit: !lab.enrollment,
    };
    const eventObject = new LAB_TRACKING_EVENTS.OVERVIEW_PAGE_VISIT(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendLabsSearchEvent = (
    sourceComponent,
    searchTerm,
    searchCategory,
    numResults,
    ordering,
    isPopularTopicPillSelected,
    features,
) => {
    const eventData = {
        sourceComponent,
        searchTerm,
        searchCategory,
        numResults,
        ordering,
        isPopularTopicPillSelected,
        features,
    };
    const eventObject = new LAB_TRACKING_EVENTS.SEARCH(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendLabsHeaderClickEvent = (sourceComponent) => {
    const eventObject = new LAB_TRACKING_EVENTS.HEADER_CLICK(sourceComponent);
    Tracker.publishEvent(eventObject);
};

export const sendLabInCoursePromptActionEvent = ({courseId, action}) => {
    Tracker.publishEvent(new LAB_TRACKING_EVENTS.LAB_IN_COURSE_PROMPT_ACTION({courseId, action}));
};

export const sendLabCardLandingPageClickEvent = (labId, page, index, uiRegion) => {
    const eventData = {labId: labId.toString(), page, index, uiRegion};
    const eventObject = new LAB_TRACKING_EVENTS.LAB_CARD_CLICK(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendLabsResumeBannerViewEvent = (lab) => {
    const eventData = {
        labId: lab.id,
        labInstanceUuid: lab.myLatestInstance?.uuid || null,
        labVertical: lab.vertical,
        labCompletionMode: lab.enrollment?.lastAttemptedMode || null,
    };
    Tracker.publishEvent(new LAB_TRACKING_EVENTS.RESUME_BANNER_VIEW(eventData));
};

export const sendLabsResumeBannerDismissClickEvent = (lab) => {
    const eventData = {
        labId: lab.id,
        labInstanceUuid: lab.myLatestInstance?.uuid || null,
        labVertical: lab.vertical,
        labCompletionMode: lab.enrollment?.lastAttemptedMode || null,
    };
    Tracker.publishEvent(new LAB_TRACKING_EVENTS.RESUME_BANNER_DISMISS_CLICK(eventData));
};

export const sendLabsResumeBannerEndLabClickEvent = (lab) => {
    const eventData = {
        labId: lab.id,
        labInstanceUuid: lab.myLatestInstance?.uuid || null,
        labVertical: lab.vertical,
        labCompletionMode: lab.enrollment?.lastAttemptedMode || null,
    };
    Tracker.publishEvent(new LAB_TRACKING_EVENTS.RESUME_BANNER_END_LAB_CLICK(eventData));
};

export const sendLabTaskReviewRequestedEvent = (lab, labTask, taskNumber, isFirstReviewRequest) => {
    const {id, title, hasAutomatedReviewTests} = labTask;
    const labEntity = generateLabEntity(lab);
    const labTakingSession = generateLabTakingSessionEntity(
        lab?.myLatestInstance,
        lab?.myLatestInstance?.sessionStartTime,
    );
    const labTaskEntity = new LabTaskEntity(id, taskNumber, title, hasAutomatedReviewTests);

    const eventData = {
        lab: labEntity,
        labTask: labTaskEntity,
        mode: LAB_EVENT_MODE[lab.currentMode],
        labTakingSession,
        isFirstReviewRequest,
    };
    Tracker.publishEvent(new LAB_TRACKING_EVENTS.LAB_TASK_REVIEW_REQUESTED(eventData));
};

export const sendAutomatedLabReviewEvent = (lab, action) => {
    const labHasALR = lab.tasks.some((task) => task.hasAutomatedReviewTests === true);
    const eventData = {
        labId: lab.id.toString(),
        labTaskId: lab.activeTask.id.toString(),
        labTaskNumber: lab.activeTaskNumber,
        labInstanceUuid: lab.myLatestInstance?.uuid || null,
        labCompletionMode: lab.currentMode,
        labLevel: labHasALR, // at least one task has automated review
        taskLevel: lab.activeTask.hasAutomatedReviewTests, // the task has automated review
    };
    Tracker.publishEvent(new AutomatedLabReviewEvent(EVENT_LABEL[action], eventData));
};

export const sendAutomatedLabReviewCheckOutputViewEvent = (lab, testId, outputMessageType) => {
    const eventData = {
        labId: lab.id.toString(),
        labTaskId: lab.activeTask.id.toString(),
        labTaskNumber: lab.activeTaskNumber,
        labCompletionMode: lab.currentMode,
        testId: testId?.toString() || null,
        outputMessageType,
    };
    Tracker.publishEvent(new AutomatedLabReviewCheckOutputViewEvent(eventData));
};

export const checkLabAlmostOutOfResources = (lab) => {
    const instance = lab.myLatestInstance;
    if (lab.vertical === LAB_VERTICAL.aws.key && instance) {
        return instance.totalSpend / instance.allowedSpend >= MAX_ALLOWED_SPEND;
    }
    return false;
};

export const checkLabHighlyConsumed = (lab) => {
    const instance = lab.myLatestInstance;
    if (instance && instance.totalSpend) {
        const allowedSpend = instance.allowedSpend || DEFAULT_ALLOWED_SPEND_FOR_INSTRUCTOR;
        return instance.totalSpend / allowedSpend >= HIGH_CONSUMPTION_LIMIT_RATIO;
    }
    return false;
};

export const downloadAssetByUrl = (url) => {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const checkUserLabAccessLevel = (suitableLevels) => {
    return suitableLevels.includes(UD.me.settings['lab-access-level']);
};

export const checkUserLabAccessLevelWithExperiment = (
    suitableLevels,
    experimentSet,
    variantName,
    defaultValue,
    expectedValue,
) => {
    const variantValue = getVariantValueFromUdRequest(experimentSet, variantName, defaultValue);
    return variantValue === expectedValue && checkUserLabAccessLevel(suitableLevels);
};

export const checkLabPauseResumeExperimentEnabled = () => {
    return getVariantValueFromUdRequest('lab_taking', 'lab_pause_resume_enabled', false);
};

export const checkLabVersioningLabManageExperimentEnabled = () => {
    return getVariantValueFromUdRequest(
        LAB_VERSIONING_ENABLED_IN_LAB_MANAGE_EXPERIMENT_SET,
        LAB_VERSIONING_ENABLED_IN_LAB_MANAGE_EXPERIMENT_VARIANT,
        LAB_VERSIONING_ENABLED_IN_LAB_MANAGE_EXPERIMENT_DEFAULT,
    );
};

export const checkLabPauseResumeExperimentEnabledForLab = (lab) => {
    return (
        lab.labType === LAB_TYPE.modular.key &&
        !LAB_VERTICALS_WITHOUT_PAUSE_RESUME.includes(lab.vertical) &&
        checkLabPauseResumeExperimentEnabled()
    );
};

export const getTimeLimitMsForLab = (lab) => {
    if (checkLabPauseResumeExperimentEnabledForLab(lab)) {
        return LAB_EXTENDED_WORKSPACE_TIME_LIMIT_MS;
    }
    return LAB_TIME_LIMIT_MS[lab.labType];
};

export const getTimeLimitMinutesForLab = (lab) => {
    if (checkLabPauseResumeExperimentEnabledForLab(lab)) {
        return LAB_EXTENDED_WORKSPACE_TIME_LIMIT_MINUTES;
    }
    return LAB_TIME_LIMIT_MINUTES[lab.labType];
};

export const toLabTaking = (url, subPath, params) => {
    return udLink.to(url, subPath ? `lab-overview/tasks/${subPath}` : 'lab-overview', params);
};

export const formatDateTime = () => {
    const udRequest = getRequestData();
    const userLocale = udRequest ? udRequest.locale.replace('_', '-') : 'en-US';
    const today = new Date();
    const date = today.toLocaleDateString(userLocale, {
        day: 'numeric',
        month: 'short',
    });
    const currTime = today.toLocaleString(userLocale, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
    return `${date}, ${currTime}`;
};

export const getLabDiscoveryCardExperimentContent = () => {
    const title = getVariantValueFromUdRequest('lab_taking', 'Title', 'Get hands-on practice');
    const desc = getVariantValueFromUdRequest(
        'lab_taking',
        'Desc',
        'Sharpen your technical skills with access to risk-free environments and real-world projects.',
    );
    const cta = getVariantValueFromUdRequest('lab_taking', 'CTA', 'Explore labs');

    return {title, desc, cta};
};

export const sendLabLoadingNotificationEvent = (labId, labVertical, action) => {
    Tracker.publishEvent(
        new LabLoadingNotification(NOTIFICATION_EVENT_LABEL[action], labId, labVertical),
    );
};

export const sendLabLoadingTimeAccuracyEvent = (
    labId,
    labVertical,
    estimatedLoadingTime,
    actualLoadingTime,
) => {
    const eventData = {
        labId,
        labVertical,
        estimatedLoadingTime,
        actualLoadingTime,
    };
    Tracker.publishEvent(new LabLoadingTimeAccuracyEvent(eventData));
};

export const sendLabReportIssueEvent = (
    labId,
    labVertical,
    labType,
    labMode,
    labTaskId,
    issueType,
    reportIssueId,
    withFile,
) => {
    const eventData = {
        labId,
        labVertical,
        labType,
        labMode,
        labTaskId,
        issueType,
        reportIssueId,
        withFile,
    };
    Tracker.publishEvent(new LabReportIssueEvent(eventData));
};

export const getVerticalIconComponent = (lab) => {
    const LabVerticalIconComponent = getLabVerticalIconForKey(lab.vertical);
    return LabVerticalIconComponent ? <LabVerticalIconComponent label={false} /> : null;
};

export const dateToFullDateString = (date) => {
    if (!date) {
        return '';
    }
    const dateFormatter = new Intl.DateTimeFormat(
        undefined, // default locale
        {dateStyle: 'full'},
    ); // Example: January 1, 1972
    const fullDateString = dateFormatter.format(date);
    return fullDateString;
};

export const dateToShortTimeString = (date) => {
    if (!date) {
        return '';
    }
    const timeFormatter = new Intl.DateTimeFormat(
        undefined, // default locale
        {hour: 'numeric', minute: '2-digit', timeZoneName: 'short'},
    ); // Example: 5:22 PM PST
    const shortTimeString = timeFormatter.format(date);
    return shortTimeString;
};

export const getSupportUrlForVertical = (vertical) => {
    const SUPPORT_ARTICLE_MAP = {
        [LAB_VERTICAL.aws.key]: LABS_SUPPORT_ARTICLES.AWS,
        [LAB_VERTICAL.azure.key]: LABS_SUPPORT_ARTICLES.AZURE,
        [LAB_VERTICAL.data_science.key]: LABS_SUPPORT_ARTICLES.DATA_SCIENCE,
        [LAB_VERTICAL.web.key]: LABS_SUPPORT_ARTICLES.WEB_DEVELOPMENT,
        [LAB_VERTICAL.devops.key]: LABS_SUPPORT_ARTICLES.DEVOPS,
        [LAB_VERTICAL.gcp.key]: LABS_SUPPORT_ARTICLES.GCP,
        [LAB_VERTICAL.security.key]: LABS_SUPPORT_ARTICLES.SECURITY,
    };

    return SUPPORT_ARTICLE_MAP[vertical] || LABS_SUPPORT_ARTICLES.WEB_DEVELOPMENT;
};
