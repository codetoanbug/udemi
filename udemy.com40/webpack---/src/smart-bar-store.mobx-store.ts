import {action, observable, runInAction} from 'mobx';

import {Tracker} from '@udemy/event-tracking';
import {udExpiringLocalStorage} from '@udemy/shared-utils';
import {
    UDDataConfig,
    UDDataRequest,
    UDDataMe,
    UDDataUserAgnosticTrackingParams,
} from '@udemy/ud-data';

import {NoticeType, noticeTypes} from './bar-types';
import {
    DealOptInEvent,
    SmartbarHideEvent,
    SmartbarImpressionEvent,
    SmartbarClickEvent,
} from './events';
import {
    forceReload,
    getNoticesOfType,
    storeHidden,
    postTargetingOptIn,
    NoticesBackendApiResponseResult,
} from './notices-backend';

export const SMART_BAR_NOTICE_TYPE = 'smart_bar';
export const OPT_IN_NOT_APPLIED = 'not_applied';
export const OPT_IN_APPLYING = 'applying';
export const OPT_IN_APPLIED = 'applied';

export interface BarMembership {
    end_time: Date;
    opt_in: boolean;
    use_case: string;
}

export interface BarData {
    action_url: string;
    clp_sticky_reset_timer_in_minutes: string;
    cta_applied_text: string;
    cta_text: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    days_to_show_timer: number;
    enable_clp_sticky: boolean;
    enable_seconds_in_timer: boolean;
    enable_timer: boolean;
    icon: null;
    id: number;
    membership: BarMembership;
    mobile_deeplink_url: string;
    mobile_title: string;
    personalized_notice_set_id: null;
    personalized_notice_set_name: null;
    subtitle: string;
    target_group_id: number;
    theme: string;
    title: string;
}
export interface SmartBarStoreState {
    activeStorageKey: 'storage' | 'storageForStickyExpiration';
    clicked: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    loaded: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    membership: any;
    noticeType: null | NoticeType;
    opt_in_stage: string;
    seen: boolean;
    storage: null | ReturnType<typeof udExpiringLocalStorage>;
    storageForStickyExpiration: null | ReturnType<typeof udExpiringLocalStorage>;
    isInStickyPosition: boolean;
    isStickyPositionHidden: boolean;
}

function isBarTypeEnabled(type: {noticeFeatureFlag: string | number}, udConfig: UDDataConfig) {
    return udConfig.features.notice?.[type.noticeFeatureFlag];
}

export class ApiClass {
    @observable state!: SmartBarStoreState;
    params: Record<string, unknown> = {};
    isPersonalPlanSubscriber?: boolean;
    isUdemyBusinessSubscriber?: boolean;
    userAgnosticTrackingParams?: UDDataUserAgnosticTrackingParams;

    reset() {
        this.state = observable({
            activeStorageKey: 'storage',
            data: observable.map(),
            membership: observable.map(),
            seen: false,
            clicked: false,
            opt_in_stage: OPT_IN_NOT_APPLIED,
            storage: null,
            storageForStickyExpiration: null,
            noticeType: null,
            loaded: false,
            isInStickyPosition: false,
            isStickyPositionHidden: false,
            mobileLayout: false,
        });
        this.params = {};
        this.isPersonalPlanSubscriber = undefined;
        this.isPersonalPlanSubscriber = undefined;
        this.userAgnosticTrackingParams = undefined;
    }

    constructor() {
        this.reset();
    }

    get data() {
        return this.state?.data;
    }
    get membership() {
        return this.state?.membership;
    }

    @action
    hide() {
        if (
            !this.state.membership.get('opt_in') &&
            !this.state.isStickyPositionHidden &&
            this.state.isInStickyPosition
        ) {
            const now = new Date();
            const expirationDate = new Date(
                now.setMinutes(
                    now.getMinutes() +
                        parseInt(this.state.data.get('clp_sticky_reset_timer_in_minutes'), 10),
                ),
            );
            this.state.storageForStickyExpiration = udExpiringLocalStorage(
                'smartBarStorage',
                `${this.state.data.get('id')}.sticky`,
                expirationDate,
            );
            this.state.activeStorageKey = 'storageForStickyExpiration';
        } else {
            this.state.activeStorageKey = 'storage';
            if (this.isPersonalPlanSubscriber) {
                this.storeHidden();
            }
        }

        if (!this.state[this.state.activeStorageKey]?.get('hidden')) {
            this.sendHideEvent();
        }

        if (this.state.isInStickyPosition) {
            this.state.isStickyPositionHidden = true;
        }

        this.state[this.state.activeStorageKey]?.set('hidden', true);
    }

    get isHidden() {
        return !this.state.loaded || this.state[this.state.activeStorageKey]?.get('hidden');
    }

    get isLoaded() {
        return this.state.loaded;
    }

    get noticeType() {
        return this.state.noticeType;
    }

    get pageKey() {
        return this.userAgnosticTrackingParams?.page_key;
    }

    get isSticky() {
        return this.state.data.get('enable_clp_sticky') && this.pageKey === 'course_landing_page';
    }

    get isInStickyPosition() {
        return this.isSticky && !this.isStickyPositionHidden && this.state.isInStickyPosition;
    }

    @action
    setIsInStickyPosition(value: boolean) {
        this.state.isInStickyPosition = value;
    }

    get isStickyPositionHidden() {
        return (
            !this.state.loaded ||
            !this.isSticky ||
            this.state[this.state.activeStorageKey]?.get('hidden') ||
            this.state.membership.get('opt_in')
        );
    }

    get hideButtonHidden() {
        return !this.membership.get('opt_in') && !this.isInStickyPosition;
    }

    get shouldRenderHideButton() {
        return (
            this.state.membership.get('opt_in') ||
            (this.isSticky && !this.state.membership.get('opt_in')) ||
            !this.isStickyPositionHidden
        );
    }

    storeHidden() {
        storeHidden(this.state.data.get('id'));
    }

    @action
    initialize({
        currentType,
        isPersonalPlanSubscriber = false,
        isUdemyBusinessSubscriber = false,
        params = {},
        udConfig,
        udMe,
        udRequest,
        userAgnosticTrackingParams,
    }: {
        currentType: NoticeType;
        isPersonalPlanSubscriber?: boolean;
        isUdemyBusinessSubscriber?: boolean;
        params: Record<string, unknown>;
        mobileLayout?: boolean;
        udConfig: UDDataConfig;
        udMe: UDDataMe;
        udRequest: UDDataRequest;
        userAgnosticTrackingParams: UDDataUserAgnosticTrackingParams;
    }) {
        runInAction(() => {
            this.state.noticeType = currentType;
            this.isPersonalPlanSubscriber = isPersonalPlanSubscriber;
            this.isUdemyBusinessSubscriber = isUdemyBusinessSubscriber;
            this.params = params;
            this.userAgnosticTrackingParams = userAgnosticTrackingParams;
            getNoticesOfType({
                type: currentType.name,
                limit: 1,
                isPersonalPlanSubscriber: this.isPersonalPlanSubscriber,
                isUdemyBusinessSubscriber: this.isUdemyBusinessSubscriber,
                params: this.params,
                udConfig,
                udRequest,
                udMe,
            }).then(
                action((smartBars: NoticesBackendApiResponseResult[]) => {
                    if (!smartBars.length) {
                        return;
                    }
                    const barData = smartBars[0];
                    this.state.membership.merge(barData.membership);

                    let expirationDate;
                    const now = new Date();
                    const endTime = this.state.membership.get('end_time');
                    if (endTime) {
                        expirationDate = new Date(endTime);
                    } else {
                        expirationDate = new Date(
                            now.setDate(now.getDate() + currentType.defaultDaysToHide),
                        );
                    }
                    this.state.data.merge(barData.data);
                    this.state.data.merge({actionUrl: barData.data.action_url});

                    // Set storage for normal notice
                    this.state.storage = udExpiringLocalStorage(
                        'smartBarStorage',
                        `${barData.data.id}`,
                        expirationDate,
                    );

                    // Set storage for sticky expiration
                    expirationDate = new Date(
                        now.setMinutes(
                            now.getMinutes() +
                                parseInt(barData.data.clp_sticky_reset_timer_in_minutes, 10),
                        ),
                    );
                    this.state.storageForStickyExpiration = udExpiringLocalStorage(
                        'smartBarStorage',
                        `${barData.data.id}.sticky`,
                        null, // this storage is for reads only
                    );
                    this.state.loaded = true;
                }),
            );
        });
    }

    sendImpressionsEvent() {
        Tracker.publishEvent(
            new SmartbarImpressionEvent({
                noticeId: this.state.data.get('id'),
                noticeType: `${this.state.noticeType?.name}`,
                personalizedNoticeSetId: this.state.data.get('personalized_notice_set_id'),
                personalizedNoticeSetName: this.state.data.get('personalized_notice_set_name'),
                topMembershipTargetGroupId: this.state.data.get('target_group_id'),
            }),
        );
    }

    @action
    sendClickEvent = (url: string, clickLocation = 'action_url') => {
        if (!this.state.clicked) {
            Tracker.publishEvent(
                new SmartbarClickEvent({
                    noticeId: this.state.data.get('id'),
                    noticeType: `${this.state.noticeType?.name}`,
                    url: url ?? this.state.data.get('action_url'),
                    location: clickLocation,
                    personalizedNoticeSetId: this.state.data.get('personalized_notice_set_id'),
                    personalizedNoticeSetName: this.state.data.get('personalized_notice_set_name'),
                    topMembershipTargetGroupId: this.state.data.get('target_group_id'),
                }),
            );
            this.state.clicked = true;
        }
    };

    sendHideEvent = () => {
        Tracker.publishEvent(
            new SmartbarHideEvent({
                noticeId: this.state.data.get('id'),
                noticeType: `${this.state.noticeType?.name}`,
                personalizedNoticeSetId: this.state.data.get('personalized_notice_set_id'),
                personalizedNoticeSetName: this.state.data.get('personalized_notice_set_name'),
                topMembershipTargetGroupId: this.state.data.get('target_group_id'),
            }),
        );
    };

    sendDealOptInEvent = () => {
        Tracker.publishEvent(new DealOptInEvent(this.state.data.get('id')));
    };

    @action
    optIn = () => {
        this.state.opt_in_stage = OPT_IN_APPLYING;
        forceReload();
        return postTargetingOptIn(this.state.data.get('id')).catch((error: unknown) => {
            runInAction(() => {
                this.state.opt_in_stage = OPT_IN_NOT_APPLIED;
            });
            throw error;
        });
    };

    @action
    optedIn = () => {
        this.state.opt_in_stage = OPT_IN_APPLIED;
    };

    @action
    optedOut = () => {
        this.state.opt_in_stage = OPT_IN_NOT_APPLIED;
    };

    optInNotApplied = () => {
        return this.state.opt_in_stage === OPT_IN_NOT_APPLIED;
    };

    optInApplying = () => {
        return this.state.opt_in_stage === OPT_IN_APPLYING;
    };

    optInJustApplied = () => {
        return this.state.opt_in_stage === OPT_IN_APPLIED;
    };
}

export interface getSmartBarStoreArgs {
    params?: Record<string, unknown>;
    isPersonalPlanSubscriber?: boolean;
    isUdemyBusinessSubscriber?: boolean;
    skipNoticeBackend?: boolean;
    forceNoticeType?: string;
    udConfig: UDDataConfig;
    udRequest: UDDataRequest;
    udMe: UDDataMe;
    userAgnosticTrackingParams: UDDataUserAgnosticTrackingParams;
}

let apiClass: ApiClass | null = null;

export function resetSmartBarStore() {
    apiClass?.reset();
}

export function getSmartBarStore({
    forceNoticeType = '',
    isPersonalPlanSubscriber,
    isUdemyBusinessSubscriber,
    params = {},
    skipNoticeBackend = false,
    udConfig,
    udMe,
    udRequest,
    userAgnosticTrackingParams,
}: getSmartBarStoreArgs): ApiClass | null {
    const currentType =
        noticeTypes.find((type) => type.name === forceNoticeType) ||
        noticeTypes.find((noticeType) => {
            return isBarTypeEnabled(noticeType, udConfig);
        });

    if (!currentType) {
        return null;
    }

    // Instantiate singleton
    if (!apiClass) {
        apiClass = new ApiClass();
    }

    // Initialize singleton if necessary
    if (!skipNoticeBackend) {
        runInAction(() => {
            apiClass?.initialize({
                currentType,
                isPersonalPlanSubscriber,
                isUdemyBusinessSubscriber,
                params,
                udConfig,
                udMe,
                udRequest,
                userAgnosticTrackingParams,
            });
        });
    }

    // Return singleton instance
    return apiClass;
}
