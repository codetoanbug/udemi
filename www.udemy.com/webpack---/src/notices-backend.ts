import {udExpiringLocalStorage} from '@udemy/shared-utils';
import {udApi} from '@udemy/ud-api';
import {UDDataConfig, UDDataMe, UDDataRequest} from '@udemy/ud-data';

// notices api local storage keys
export const NOTICES_API_RELOAD_KEY = 'reload';
export const NOTICES_API_P13N_NOTICE_SET_NAME_KEY = 'personalized_notice_set_name';
export const DEFAULT_USE_CASE_GROUP = 'cmp_marketplace';
export const PP_USE_CASE_GROUP = 'pp_request_targeting';
export const UB_USE_CASE_GROUP = 'ub_request_targeting';

const noticeSetsEligibleForCacheReload = [
    '220401_MXLFC_Intent_Cart-Abandon_V1',
    '220401_MXLFC_Intent_Wishlist_V1',
];

export function getNoticesApiLocalStorage() {
    const NOTICE_REFRESH_EXPIRATION_DATE = new Date(Date.now() + 10 * 60 * 1000);
    return udExpiringLocalStorage('notices', 'api', NOTICE_REFRESH_EXPIRATION_DATE);
}

export interface NoticesBackendApiResponseResult {
    data: {
        action_url: string;
        body?: string;
        clp_sticky_reset_timer_in_minutes: string;
        cta_1_url?: string;
        cta_2_url?: string;
        cta_applied_text: string;
        cta_label?: string;
        cta_text: string;
        cta_url?: string;
        days_to_show_timer: number;
        enable_clp_sticky: false;
        enable_seconds_in_timer: boolean;
        enable_timer: boolean;
        icon: string | null;
        id: number;
        image_responsive_udlite?: string;
        image_responsive?: string;
        image_udlite?: string;
        image?: string;
        imageUrl?: string;
        landing_page?: string;
        mobile_deeplink_url: string;
        mobile_title: string;
        notice_set_name?: string;
        personalized_notice_set_id: unknown;
        personalized_notice_set_name: unknown;
        should_constrain_text_width?: boolean;
        subtitle_responsive?: string;
        subtitle: string;
        target_group_id: number;
        theme: string;
        title_responsive?: string;
        title: string;
        url?: string;
        validation_rule_id?: string;
        video?: string;
    };
    membership: {
        use_case: string;
        end_time: unknown;
        opt_in: boolean;
    };
}

export interface NoticesBackendApiResponse {
    results: NoticesBackendApiResponseResult[];
}

function getUseCaseGroup(isPersonalPlanSubscriber?: boolean, isUdemyBusinessSubscriber?: boolean) {
    if (isPersonalPlanSubscriber) {
        return PP_USE_CASE_GROUP;
    }
    if (isUdemyBusinessSubscriber) {
        return UB_USE_CASE_GROUP;
    }
    return DEFAULT_USE_CASE_GROUP;
}

/**
 * getNoticesOfType()
 * Given parameters, returns eligible banner notices
 * @param {arguments}
 * @returns
 */
export function getNoticesOfType({
    type,
    limit,
    isPersonalPlanSubscriber,
    isUdemyBusinessSubscriber,
    params = {},
    udConfig = {} as UDDataConfig,
    udRequest = {} as UDDataRequest,
    udMe = {} as UDDataMe,
}: {
    type: string;
    limit?: number;
    isPersonalPlanSubscriber?: boolean;
    isUdemyBusinessSubscriber?: boolean;
    params?: Record<string, unknown>;
    udConfig: UDDataConfig;
    udRequest: UDDataRequest;
    udMe: UDDataMe;
}) {
    const currency = udConfig.price_country?.currency;
    const locale = udRequest.locale;
    const supportedParams = ['assigned_notice_set_name', 'validate_assigned_notice_set'];
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([param]) => supportedParams.includes(param)),
    );

    const noticesApiLocalStorage = getNoticesApiLocalStorage();
    const noticeSetName = noticesApiLocalStorage.get(NOTICES_API_P13N_NOTICE_SET_NAME_KEY);
    const eligibleForCacheReload =
        noticeSetName === undefined || noticeSetsEligibleForCacheReload.includes(noticeSetName); // always reload if missing local storage

    const useCaseGroup = getUseCaseGroup(isPersonalPlanSubscriber, isUdemyBusinessSubscriber);

    return (
        udApi
            .get('notices/me/', {
                headers: {
                    'cache-control':
                        eligibleForCacheReload && noticesApiLocalStorage.get(NOTICES_API_RELOAD_KEY)
                            ? 'no-cache'
                            : '',
                },
                params: {
                    type,
                    limit,
                    locale,
                    currency,
                    user: udMe.is_authenticated,
                    use_case_group: useCaseGroup,
                    ...filteredParams,
                },
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((response: {status: number; data: NoticesBackendApiResponse}) => {
                if (response.status === 204) {
                    return [];
                }
                if (response.data.results && response.data.results.length > 0) {
                    noticesApiLocalStorage.set(
                        NOTICES_API_P13N_NOTICE_SET_NAME_KEY,
                        response.data.results[0].data?.personalized_notice_set_name,
                    );
                    if (eligibleForCacheReload) {
                        noticesApiLocalStorage.delete(NOTICES_API_RELOAD_KEY);
                    }
                }
                return response.data.results || [];
            })
            .catch(() => [])
    );
}

/**
 * postTargetingOptIn()
 * Given noticeId, posts opt-in to tracking api
 * @param noticeId
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function postTargetingOptIn(noticeId: any) {
    return udApi.post('targeting/opt-in/', {notice_id: noticeId, opt_in: true});
}

/**
 * forceReload()
 * Forces notices api to reload
 */
export function forceReload() {
    const noticesApiLocalStorage = getNoticesApiLocalStorage();
    noticesApiLocalStorage.delete(NOTICES_API_P13N_NOTICE_SET_NAME_KEY);
    noticesApiLocalStorage.set(NOTICES_API_RELOAD_KEY, true);
}

/**
 * storeHidden()
 * Given noticeId, stores noticeId in hidden notices api
 * @param noticeId
 * @returns
 */
export function storeHidden(noticeId: number) {
    return udApi.post('notices/me/hide/', {notice_id: noticeId});
}

// legacy support
export const noticesBackend = {
    forceReload,
    getNoticesApiLocalStorage,
    getNoticesOfType,
    postTargetingOptIn,
    storeHidden,
};
