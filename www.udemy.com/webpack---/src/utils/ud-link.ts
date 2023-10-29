import qs from 'qs';

import {getConfigData, getRequestData} from '@udemy/shared-utils';

import {UDData} from '../types';
import {useUDData} from '../use-ud-data';

const SUPPORT_LINKS = {
    assessment_benchmarking: {id: 10250264424471},
    course_image_quality: {id: 229232347},
    course_quality_checklist: {id: 229604988},
    course_taking__course_player__downloading: {id: 229231167},
    terms_subscriptions: {id: 360037136254},
    subscription_faq: {id: 360037461154},
    certificate_of_completion: {id: 229603868},
    video_audio_issues_troubleshooting: {id: 229231227},
    downloading_supplemental_resources: {id: 229604708},
    free_course_experience: {id: 360040701614},
    free_preview: {id: 229604168},
    course_removal: {id: 360046264693},
    course_material_basics: {id: 360001167193},
    course_title_quality_standards: {id: 229232467},
    history_log: {id: 360053657313},
    system_requirements: {id: 229231047},
    student_taxes: {id: 229233627},
    manage_subscription: {id: 1500002916481},
    marketplace_maintenance_program: {id: 4403234024855},
    adding_co_instructors: {id: 229604308},
    labs_alr_support_article: {id: 14454050814103},
    labs_web_development_support_article: {id: 8026238181399},
    adding_captions_to_video: {id: 229605428},
    ncc_official_rules: {id: 115012790188},
    how_to_create_coding_exercise: {id: 115002883587},
    certification_prep: {id: 13809847570071},
};

type SupportLinkId = keyof typeof SUPPORT_LINKS;

const UFB_SUPPORT_LINKS = Object.assign({}, SUPPORT_LINKS, {
    certificate_of_completion: {id: 115005370507},
    create_user_group: {id: 115005396148},
    video_audio_issues_troubleshooting: {id: 115005369487},
    downloading_supplemental_resources: {id: 115005537648},
    course_insights_enterprise_plan_only: {id: 115010907447},
    user_activity: {id: 115011062868},
    user_activity_active_users: {id: 360044845993},
    ratings_reviews_dashboard: {id: 360056074933},
    learner_feedback: {id: 360057021414},
    sso_documentation_azure: {id: 115009490608},
    sso_documentation_google: {id: 115007944287},
    sso_documentation_okta: {id: 360035681493},
    sso_documentation_onelogin: {id: 115007942207},
    sso_documentation_adfs: {id: 115007945527},
    sso_documentation_general: {id: 115008213828},
    skills_insights_dashboard: {id: 4874004165271},
    when_is_data_updated: {id: 360044845893},
    lms_integration_documentation: {id: 360060315253},
    auto_assign_rule_info: {id: 1500001196281},
    system_requirements: {id: 115005533888},
    learning_challenges: {id: 1500011171982},
    group_insights: {id: 1500010830622},
    my_groups: {id: 1500010862021},
    pro_insights: {id: 4404566692759},
    export_reports: {id: 115005251587},
    inviting_users: {id: 115005395268},
    course_retirements: {id: 115005650668},
    scheduler_learning_event: {id: 4498682272279},
    assessment_benchmarking: {id: 4412308049175},
    labs_alr_support_article: {id: 10934961421975},
    labs_aws_support_article: {id: 360056038774},
    labs_azure_support_article: {id: 4586061730199},
    labs_data_science_support_article: {id: 360058699133},
    labs_web_development_support_article: {id: 4410623949463},
    labs_devops_support_article: {id: 6806664783639},
    labs_select_mode_support_article: {id: 1500011210921},
    adding_more_licenses: {id: 115005396128},
    learning_culture_webinar_link: {id: 115013724427},
    team_plan_receipts: {id: 360015876213},
    approving_course: {id: 115006844788},
    importing_course: {id: 115005228607},
    creating_course: {id: 115005523008},
    adding_removing_courses: {id: 360000325728},
    review_group_membership: {id: 360052222154},
    editing_custom_topics: {id: 115005228687},
    what_is_pro: {id: 9248706921879},
    how_to_access_courses_with_workspaces: {id: 4407705124375},
    certification_prep: {id: 13811038872471},
});

type UfbSupportLinkId = keyof typeof UFB_SUPPORT_LINKS;

export class UDLinkApi {
    constructor(private udData?: Pick<UDData, 'Config' | 'request'>) {}

    private get config() {
        return this.udData?.Config ?? getConfigData();
    }

    private get request() {
        return this.udData?.request ?? getRequestData();
    }

    toImages(filePath: string) {
        return this.config.url.to_images + filePath;
    }

    toJs(filePath: string) {
        return `${this.config.url.to_js + filePath}?v=${this.config.version}`;
    }

    toStorageStaticAsset(filePath: string, globalOverrides: Partial<UDData> = {}) {
        const udConfigWithOverrides = globalOverrides.Config ?? this.config;
        return udConfigWithOverrides.third_party.storage_static_asset_base_url + filePath;
    }

    toSupportContact(formId: string, type: string) {
        return this.to('support', 'requests/new', {ticket_form_id: formId, type});
    }

    toSupportHome() {
        return this.to('support');
    }

    toSupportSystemCheck() {
        return this.to('support', 'system-check');
    }

    toSupportLink(
        // The (string & {}) is a workaround to prevent the entire type being widened to string
        // See https://stackoverflow.com/a/61048124/5732806
        // eslint-disable-next-line @typescript-eslint/ban-types
        linkName: SupportLinkId | UfbSupportLinkId | 'default' | (string & {}),
        isUfb = false,
        subPath = 'articles',
        globalOverrides: Partial<UDData> = {},
    ) {
        // This is a lighter version of get_support_link method that is on the server end. It
        // does NOT support zendesk SSO.
        // Pass isUfb as true for ufb support articles
        // Example output: https://support.udemy.com/hc/en-us/articles/229232347

        const udConfigWithOverrides = globalOverrides.Config ?? this.config;
        const udRequestWithOverrides = globalOverrides.request ?? this.request;

        const WEIRD_LANG = {
            en: 'en-us',
            de: 'de',
            es: 'es',
            fr: 'fr-fr',
            pt: 'pt',
            ja: 'ja',
            it: 'it',
            pl: 'pl',
            tr: 'tr',
            ko: 'ko',
        };

        const isUbChina =
            isUfb &&
            udConfigWithOverrides.brand.has_organization &&
            udConfigWithOverrides.brand.organization.is_enterprise_china &&
            udConfigWithOverrides.features.organization.is_ub_china_support_redirection_enabled;
        if (isUbChina) {
            return '/support/';
        }

        const baseUrl = isUfb
            ? 'https://business-support.udemy.com/hc/'
            : 'https://support.udemy.com/hc/';
        const locale = udRequestWithOverrides.locale;
        let langCode = (locale || '').replace('_', '-').toLowerCase();
        const weirdLangCode = WEIRD_LANG[langCode.substring(0, 2) as keyof typeof WEIRD_LANG];
        if (weirdLangCode) {
            langCode = weirdLangCode;
        } else {
            // The server-side get_support_link defaults to 'en-us' if a language is NOT in WEIRD_LANG.
            langCode = 'en-us';
        }
        if (linkName === 'default') {
            return `${baseUrl}${langCode}`;
        }
        const link = isUfb
            ? UFB_SUPPORT_LINKS[linkName as keyof typeof UFB_SUPPORT_LINKS]
            : SUPPORT_LINKS[linkName as keyof typeof SUPPORT_LINKS];
        const id = (link && link.id) || '';
        return `${baseUrl}${langCode}/${subPath}/${id}`;
    }

    toMyCourses() {
        return this.to('home/my-courses');
    }

    toCourseDashboard(courseId: number | string) {
        return this.to('course-dashboard-redirect', undefined, {course_id: courseId});
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toCourseTaking(publishedTitle: string | null, subPath: string, params: any) {
        return this.to(publishedTitle, subPath ? `learn/${subPath}` : 'learn', params);
    }

    toLearningPath(pathId: string) {
        return this.to('learning-paths', pathId);
    }

    /**
     * Go to Auth
     */
    toAuth({
        showLogin,
        showInstructorSignup,
        locale,
        nextUrl,
        nextPath,
        returnUrl,
        source,
        popupTrackingIdentifier,
        responseType,
        globalOverrides = {},
    }: {
        showLogin?: boolean;
        showInstructorSignup?: boolean;
        locale?: string | null;
        nextUrl?: string | null;
        nextPath?: string | null;
        returnUrl?: string;
        source?: string | null;
        popupTrackingIdentifier?: string | null;
        responseType?: string | null;
        globalOverrides?: Partial<UDData>;
    }) {
        const udRequestWithOverrides = globalOverrides.request ?? this.request;
        let urlAction = 'signup-popup';
        if (showInstructorSignup) {
            urlAction = 'instructor-signup';
        } else if (showLogin) {
            urlAction = 'login-popup';
        }
        const urlParams: Record<string, unknown> = {
            locale: locale || udRequestWithOverrides.locale || 'en_US',
            response_type: responseType || 'json',
            return_link: returnUrl,
            source,
            // Checked by data-pipelines workflows for tracking purposes.
            ref: popupTrackingIdentifier,
        };

        if (typeof window !== 'undefined') {
            urlParams.next = nextUrl || (nextPath ? this.to(nextPath) : window.location.href);
        }

        return this.to('join', urlAction, urlParams);
    }

    makeAbsolute(url: string) {
        if (url.charAt(0) === '/') {
            url = url.slice(1);
        }

        return `${this.config.url.to_app}${url}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    to(controller: string | null, action?: string | null, params?: any) {
        controller = controller ? String(controller) : '';

        // support using paths for controller by removing trailing slashes
        if (controller.charAt(controller.length - 1) === '/') {
            controller = controller.slice(0, controller.length - 1);
        }

        const relativeUrl = controller
            ? action
                ? `${controller}/${action}/`
                : `${controller}/`
            : '';
        const baseUrl = this.makeAbsolute(relativeUrl);

        return !params || Object.keys(params).length == 0
            ? baseUrl
            : `${baseUrl}?${qs.stringify(params)}`;
    }

    toInstructorCommunity() {
        return 'https://community.udemy.com';
    }

    toHardLink(linkName: string) {
        const HARD_LINKS = {
            promo_video_content: '/udemy-teach-hub/promo_video/?use-localization-prefix=1',
            cpe_course_evaluation:
                'https://docs.google.com/forms/d/e/1FAIpQLSdFxtjbOd5QArS1pov8_eSwLuYXEDVdw9uHwC6lFv_MnCKUsQ/viewform',
            nasba_registry: 'https://www.nasbaregistry.org/',
        };
        return HARD_LINKS[linkName as keyof typeof HARD_LINKS] || '';
    }

    toUFBDataReports() {
        return this.to('organization-manage/reports');
    }

    toTapenUFBDataReports(organizationId: number | string) {
        return this.to(`tapen/organization/${organizationId}/data-export-reports`);
    }

    toUFBPathInsights() {
        return this.to('organization-manage/path-insights');
    }

    toCourseInsights(courseId: number | string) {
        return this.to(`organization-manage/insights/course/${courseId}`);
    }

    toUFBSettingsAPI() {
        return this.to('organization-manage/settings/api-integration');
    }

    toUFBSettingsAppearance() {
        return this.to('organization-manage/settings/appearance');
    }

    toUFBSettingsBilling() {
        return this.to('organization-manage/settings/billing');
    }

    toUFBSettingsSubscription() {
        return this.to('organization-manage/settings/subscription');
    }

    toUFBSettingsCustomErrors() {
        return this.to('organization-manage/settings/custom-error-message');
    }

    toUFBSettingsEmails() {
        return this.to('organization-manage/settings/approved-email-domains');
    }

    toUFBSettingsIntegrations() {
        return this.to('organization-manage/settings/integration');
    }

    toUFBSettingsLMSIntegrations() {
        return this.to('organization-manage/settings/lms-integration');
    }

    toUFBSettingsSCIM() {
        return this.to('organization-manage/settings/provisioning-scim');
    }

    toUFBSettingsSSO() {
        return this.to('organization-manage/settings/single-sign-on');
    }

    toUFBUserActivity() {
        return this.to('organization-manage/insights/user-activity');
    }

    toTapenUFBUserActivity(organizationId: number | string) {
        return this.to(`tapen/organization/${organizationId}/insights/user-activity`);
    }

    toUFBUserDetail(userId: number | string) {
        return this.to(`organization-manage/users/detail/${userId}/`);
    }

    toUFBManageUsers() {
        return this.to('organization-manage/users');
    }

    toUFBManageGroups() {
        return this.to('organization-manage/users/manage-groups');
    }

    toFreeCourseFAQLink(lang: string) {
        switch (lang) {
            case 'zh':
                return 'http://teach.udemy.com/free-changes-to-courses-zh-faq/';
            case 'ru':
                return 'http://teach.udemy.com/free-changes-to-courses-ru-faq/';
            default:
                return '/udemy-teach-hub/new_standard_free_courses/';
        }
    }

    toRefundRequestForm(courseId: number | string) {
        return this.to(`request-refund/${courseId}`);
    }

    toPurchaseHistoryDashboard() {
        return this.to('dashboard/purchase-history');
    }

    toCreditHistoryDashboard() {
        return this.to('dashboard/credit-history');
    }
}

/**
 * @deprecated Use `new UDLinkApi()` instead
 */
export function createUDLinkApi(udData?: Pick<UDData, 'Config' | 'request'>) {
    // If `udData` is not provided, fallback to reading global scope for interoperabilty with Monolith.
    // Do not call `get***Data()` functions here because it could cause parse errors
    // since `createAPI()` is called as part of an export and the globally scoped udData
    // may not be available yet.  Instead, resolve UD data just in time.
    return new UDLinkApi(udData);
}

export const udLink = new UDLinkApi();

export function useUDLink() {
    const udData = useUDData();
    return new UDLinkApi(udData);
}
