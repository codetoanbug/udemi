import udActionLogs from 'utils/ud-action-logs';

function isQueryableElement(element) {
    return element instanceof HTMLElement;
}

// eslint-disable-next-line import/prefer-default-export
export function userTracker(courseLandingAppElement) {
    if (!isQueryableElement(courseLandingAppElement)) {
        return;
    }

    const trackedElements = [...courseLandingAppElement.querySelectorAll('.js-user-tracker-click')];
    trackedElements.forEach((element) => {
        const {dataset} = element;
        const {userTrackerSchema: schema} = dataset;
        const eventData = {};

        switch (schema) {
            case 'clp-activity':
                Object.entries({
                    courseId: dataset.userTrackerObjectId,
                    action: dataset.userTrackerAction,
                    detail: dataset.userTrackerDetail,
                }).forEach(([key, value]) => {
                    if (value) {
                        eventData[key] = value;
                    }
                });
                break;
            case 'action-logs':
                eventData.action = dataset.userTrackerAction;
                eventData.course_id = dataset.userTrackerObjectId;
                break;
            default:
                return;
        }

        if (dataset.userTrackerTargetSelectorClass) {
            element = element.querySelector(`.${dataset.userTrackerTargetSelectorClass}`);
        }

        if (element) {
            element.addEventListener('click', () => {
                if (schema === 'action-logs') {
                    udActionLogs.postEvents([eventData]);
                }
            });
        }
    });
}
