import {action, observable} from 'mobx';

import {udSentry} from '@udemy/sentry';
import {udApi} from '@udemy/ud-api';

import {
    NOTIFICATION_EVENTS,
    NO_REFRESH_EVENTS,
    API_ROUTES,
    LIMITS,
    ALLOWED_ASSET_TYPES,
    CONTENT_LOCKED_EVENT,
    LECTURES_VIEWED_EVENT,
    INITIAL_FREE_LECTURES_AVAILABLE,
    MAX_FREE_LECTURES_AVAILABLE,
} from '../constants';
import {GetTooltipPropsFn} from '../tooltips/tooltip-hooks';
import {TooltipContent} from '../tooltips/tooltip-wrapper.react-component';

export interface GetStatusResponseData {
    active_remaining_days: number;
    available_count: number;
    used_count: number;
    owner_name: string;
    is_owner: boolean;
    trial_limit_reached?: boolean;
}

interface NotificationEventDetail {
    assetType: string;
    itemType: string;
    isFree?: boolean;
}

interface NotificationEvent extends Event {
    detail: NotificationEventDetail;
}

export class LimitedConsumptionTrialStore {
    private readonly limits;
    @observable availableLectures = 1;
    @observable usedLectures = 0;
    @observable notificationEvent: string | null = null;
    @observable notificationEventDetail: NotificationEventDetail | null = null;
    @observable ownerName = '';
    @observable activeRemainingDays = 0;
    @observable currentTooltip?: TooltipContent;

    @observable isLoading = true;
    @observable isOwner = false;
    @observable isOrgLimitReached = false;
    @observable isNudgeOwnerModalVisible = false;
    @observable isLockedLectureModalVisible = false;

    constructor(
        private readonly getTooltipProps: GetTooltipPropsFn,
        private readonly getOrgNumericSiteStat: (name: string) => string,
    ) {
        this.toggleOverlay();
        this.limits = LIMITS;
        this.limits.minLectures = INITIAL_FREE_LECTURES_AVAILABLE;
        this.limits.maxLectures = MAX_FREE_LECTURES_AVAILABLE;
    }

    /**
     * Main method for refreshing the state of trial bar using the API endpoint
     * @param tooltip - trigger an event tooltip or not
     */
    getStatus(tooltip = false) {
        return udApi
            .get(API_ROUTES.status)
            .then(
                action((response: {data: GetStatusResponseData}) => {
                    this.activeRemainingDays = response.data.active_remaining_days;
                    this.availableLectures = response.data.available_count;
                    this.usedLectures = response.data.used_count;
                    this.ownerName = response.data.owner_name;
                    this.isOwner = response.data.is_owner;
                    this.isLoading = false;
                    this.isOrgLimitReached = !!response.data.trial_limit_reached;

                    if (tooltip) {
                        this.handleNotificationEvent();
                    }
                }),
            )
            .catch((e) => {
                udSentry.captureException(e);
            });
    }

    /**
     * Show / hide page overlay for `Get started` state
     * @param show - desired state
     */
    @action
    toggleOverlay(show = false) {
        if (!show) {
            // hide tooltip with overlay
            this.currentTooltip = undefined;
        }
    }

    /**
     * Handle Event to show Notification tooltip and refresh the state from API if needed
     * @param type - event name
     * @param detail - event detail
     */
    @action
    handleEvent = async (event: Event) => {
        const {type, detail} = event as NotificationEvent;
        if (NOTIFICATION_EVENTS.indexOf(type) !== -1) {
            this.notificationEvent = type;
            // save detail in store to be able to use it for tooltips
            this.notificationEventDetail = detail;
            // reset current tooltip
            this.currentTooltip = undefined;
            // refresh the status
            if (!NO_REFRESH_EVENTS.includes(type)) {
                await this.getStatus(true);
            }
        }
    };

    /**
     * Handle notification events and generate tooltip content data based on the relevant event
     */
    handleNotificationEvent() {
        let tooltip: TooltipContent | undefined = undefined;
        switch (this.notificationEvent) {
            case CONTENT_LOCKED_EVENT:
                if (
                    !this.isOrgLimitReached &&
                    this.notificationEventDetail &&
                    this.notificationEventDetail.itemType === 'lecture' &&
                    ALLOWED_ASSET_TYPES.includes(this.notificationEventDetail.assetType)
                ) {
                    this.showLockedLecturesModal();
                } else {
                    tooltip = this._lockedTooltip();
                }
                break;
            case LECTURES_VIEWED_EVENT:
                tooltip = this._viewedTooltip();
                break;
            default:
                tooltip = undefined;
        }
        this.currentTooltip = tooltip;
    }

    @action
    showNudgeOwnerModal = () => {
        this.isNudgeOwnerModalVisible = true;
    };

    @action
    hideNudgeOwnerModal = () => {
        this.isNudgeOwnerModalVisible = false;
    };

    @action
    showLockedLecturesModal = () => {
        this.isLockedLectureModalVisible = true;
    };

    @action
    hideLockedLecturesModal = () => {
        this.isLockedLectureModalVisible = false;
    };

    _lockedTooltip() {
        if (!this.notificationEventDetail) {
            return undefined;
        }
        if (this.isOrgLimitReached) {
            // global org limit reached  - currently 30 lectures per organization
            return this.getTooltipProps('limit_reached', {
                isOwner: this.isOwner,
                numCourses: this.getOrgNumericSiteStat('num_courses'),
            });
        }
        return this.getTooltipProps('non_video_content_locked', {
            item: this.notificationEventDetail,
            isOwner: this.isOwner,
        });
    }

    _viewedTooltip() {
        const {isFree} = this.notificationEventDetail || {};
        if (isFree) {
            return this.getTooltipProps('preview_lecture_viewed', {
                numAvailable: this.availableLectures,
            });
        }
        return undefined;
    }
}
