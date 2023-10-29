import {Tracker} from '@udemy/event-tracking';
import {udExpiringLocalStorage} from '@udemy/shared-utils';
import {noticesBackend, NoticesBackendApiResponseResult} from '@udemy/smart-bar';
import {
    UDDataConfig,
    UDDataMe,
    UDDataRequest,
    UDDataUserAgnosticTrackingParams,
} from '@udemy/ud-data';
import {action, observable, runInAction} from 'mobx';

import {
    MediaModalPopupClickEvent,
    MediaModalPopupHideEvent,
    MediaModalPopupImpressionEvent,
} from './events';

export interface MediaModalMembership {
    end_time: Date;
    opt_in: boolean;
    use_case: string;
}

export interface MediaModalData {
    landing_page: string;
    cta_url: string;
    cta_label: string;
    id: number;
    title: string;
    subtitle: string;
    title_responsive: string;
    subtitle_responsive: string;
    target_group_id: number;
    video: string;
    image: string;
    image_responsive: string;
}

export interface CreateTargetedMediaModalStoreArgs {
    isPersonalPlanSubscriber?: boolean;
    page: string;
    features: {[key: string]: boolean};
    udConfig: UDDataConfig;
    udRequest: UDDataRequest;
    udMe: UDDataMe;
    userAgnosticTrackingParams: UDDataUserAgnosticTrackingParams;
}

const defaultDaysToHide = 14;

const MODAL_POPUP_NOTICE = 'modal_popup';

const landingPages = (page: string, features: {[key: string]: boolean}) => {
    const pages = [];
    if (page === 'course_taking_page') {
        if (features?.coding_exercise === true) {
            pages.push('course_taking_page_with_ce');
        }
    }
    return pages;
};

export class ApiClass {
    params: Record<string, unknown> = {};
    isPersonalPlanSubscriber?: boolean;
    userAgnosticTrackingParams?: UDDataUserAgnosticTrackingParams;
    noticeType = MODAL_POPUP_NOTICE;
    videoPlayerId: string | null = null;
    videoDuration: number | null = null;
    videoCurrentTime: number | null = null;
    @observable isLoaded = false;
    @observable data?: MediaModalData;
    @observable membership?: MediaModalMembership;
    isAuthenticated = false;
    @observable storage: null | ReturnType<typeof udExpiringLocalStorage> = null;

    @action
    initialize({
        isPersonalPlanSubscriber = false,
        page,
        features,
        udConfig,
        udMe,
        udRequest,
        userAgnosticTrackingParams,
    }: {
        isPersonalPlanSubscriber?: boolean;
        page: string;
        features: {[key: string]: boolean};
        mobileLayout?: boolean;
        udConfig: UDDataConfig;
        udMe: UDDataMe;
        udRequest: UDDataRequest;
        userAgnosticTrackingParams: UDDataUserAgnosticTrackingParams;
    }) {
        this.isPersonalPlanSubscriber = isPersonalPlanSubscriber;
        this.userAgnosticTrackingParams = userAgnosticTrackingParams;
        this.isAuthenticated = udMe.is_authenticated;

        const params = {
            type: MODAL_POPUP_NOTICE,
            limit: 1,
            isPersonalPlanSubscriber: this.isPersonalPlanSubscriber,
            params: this.params,
            udConfig,
            udRequest,
            udMe,
        };
        noticesBackend.getNoticesOfType(params).then(
            action((data: NoticesBackendApiResponseResult[]) => {
                if (!data.length) {
                    return;
                }

                const landings = landingPages(page, features);

                const notice = data.find((d) => {
                    return landings.includes(d.data.landing_page as string);
                });
                if (notice) {
                    this.data = notice.data as MediaModalData;
                    this.membership = notice.membership as MediaModalMembership;
                } else {
                    return;
                }

                let expirationDate;
                const now = new Date();
                const endTime = this.membership.end_time;
                if (endTime) {
                    expirationDate = new Date(endTime);
                } else {
                    expirationDate = new Date(now.setDate(now.getDate() + defaultDaysToHide));
                }
                this.storage = udExpiringLocalStorage(
                    'mediaModalStorage',
                    `${this.data.id}`,
                    expirationDate,
                );

                this.isLoaded = true;
            }),
        );
    }

    hide() {
        this.storage?.set('hidden', true); // for user and visitors

        if (this.isAuthenticated && this.data?.id) {
            return noticesBackend.storeHidden(this.data.id);
        }
        return Promise.resolve();
    }

    get isHidden() {
        return !this.isLoaded || this.storage?.get('hidden');
    }

    @action
    updateVideoPlayerId(videoPlayerId: string) {
        this.videoPlayerId = videoPlayerId;
    }

    @action
    updateVideoDuration(videoDuration: number) {
        this.videoDuration = videoDuration;
    }

    get videoAttributes() {
        let currentTime = null;
        let duration = null;
        if (this.data?.video && this.videoPlayerId) {
            /**
             * The <video> element is identified by the videoPlayerId. In our case there are multiple HTML elements
             * that have the videoPlayerId string as part of its id.
             *  1. a <div> element for controls list.
             *  2. The actual <video> element of interest.
             *  So we look into the HTML elements and pick the video element. There will be only video element in our case.
             */
            const videoPlayerElements = document.querySelectorAll(`[id*=${this.videoPlayerId}]`);
            for (const element of videoPlayerElements) {
                if (element instanceof HTMLVideoElement) {
                    currentTime = Math.floor(element.currentTime);
                    duration = Math.floor(element.duration);
                }
            }
        }
        return {
            videoCurrentTime: currentTime,
            videoDuration: duration,
        };
    }

    sendImpressionsEvent() {
        if (this.data?.id && this.data?.target_group_id) {
            Tracker.publishEvent(
                new MediaModalPopupImpressionEvent({
                    noticeId: this.data.id,
                    noticeType: this.noticeType,
                    topMembershipTargetGroupId: this.data.target_group_id,
                }),
            );
        }
    }

    sendClickEvent() {
        if (this.data?.id && this.data?.target_group_id) {
            const {videoCurrentTime, videoDuration} = this.videoAttributes;
            Tracker.publishEvent(
                new MediaModalPopupClickEvent({
                    noticeId: this.data.id,
                    noticeType: this.noticeType,
                    topMembershipTargetGroupId: this.data.target_group_id,
                    link: this.data?.cta_url !== '' ? this.data?.cta_url : null,
                    videoDuration,
                    videoCurrentTime,
                }),
            );
        }
    }

    sendHideEvent() {
        if (this.data?.id !== undefined && this.data?.target_group_id !== undefined) {
            const {videoCurrentTime, videoDuration} = this.videoAttributes;
            Tracker.publishEvent(
                new MediaModalPopupHideEvent({
                    noticeId: this.data.id,
                    noticeType: this.noticeType,
                    topMembershipTargetGroupId: this.data.target_group_id,
                    videoDuration,
                    videoCurrentTime,
                }),
            );
        }
    }
}

export function createTargetedMediaModalStore({
    isPersonalPlanSubscriber,
    page,
    features,
    udConfig,
    udMe,
    udRequest,
    userAgnosticTrackingParams,
}: CreateTargetedMediaModalStoreArgs): ApiClass {
    const apiClass = new ApiClass();
    runInAction(() => {
        apiClass.initialize({
            isPersonalPlanSubscriber,
            page,
            features,
            udConfig,
            udMe,
            udRequest,
            userAgnosticTrackingParams,
        });
    });
    return apiClass;
}
