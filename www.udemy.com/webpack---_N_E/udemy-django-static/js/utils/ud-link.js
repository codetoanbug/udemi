import qs from "qs";
import { toJS } from "mobx";

import getConfigData from "udemy-django-static/js/utils/get-config-data";
import getRequestData from "udemy-django-static/js/utils/get-request-data";
import udMe from "udemy-django-static/js/utils/ud-me";

// Note: we assume urls on udConfig have trailing slash, as verified by
// the test_config_urls_have_trailing_slash unit test. If you're adding a new url to udConfig,
// please update that unit test as well.
export default {
  toImages(filePath) {
    const udConfig = getConfigData();
    return udConfig.url.to_images + filePath;
  },

  toJs(filePath) {
    const udConfig = getConfigData();
    return `${udConfig.url.to_js + filePath}?v=${udConfig.version}`;
  },

  toStorageStaticAsset(filePath) {
    const udConfig = getConfigData();
    return udConfig.third_party.storage_static_asset_base_url + filePath;
  },

  toSupportContact(formId, type) {
    return this.to("support", "requests/new", { ticket_form_id: formId, type });
  },

  toSupportHome() {
    return this.to("support");
  },

  toSupportSystemCheck() {
    return this.to("support", "system-check");
  },

  toSupportLink(linkName, isUfb = false, subPath = "articles") {
    // This is a lighter version of get_support_link method that is on the server end. It
    // does NOT support zendesk SSO.
    // Pass isUfb as true for ufb support articles
    // Example output: https://support.udemy.com/hc/en-us/articles/229232347

    const udConfig = getConfigData();

    const SUPPORT_LINKS = {
      course_image_quality: { id: 229232347 },
      course_quality_checklist: { id: 229604988 },
      course_taking__course_player__downloading: { id: 229231167 },
      terms_subscriptions: { id: 360037136254 },
      subscription_faq: { id: 360037461154 },
      certificate_of_completion: { id: 229603868 },
      video_audio_issues_troubleshooting: { id: 229231227 },
      downloading_supplemental_resources: { id: 229604708 },
      free_course_experience: { id: 360040701614 },
      free_preview: { id: 229604168 },
      course_removal: { id: 360046264693 },
      course_material_basics: { id: 360001167193 },
      history_log: { id: 360053657313 },
      system_requirements: { id: 229231047 },
      student_taxes: { id: 229233627 },
      manage_subscription: { id: 1500002916481 },
      marketplace_maintenance_program: { id: 4403234024855 },
      adding_co_instructors: { id: 229604308 },
    };
    const UFB_SUPPORT_LINKS = Object.assign({}, SUPPORT_LINKS, {
      certificate_of_completion: { id: 115005370507 },
      create_user_group: { id: 115005396148 },
      video_audio_issues_troubleshooting: { id: 115005369487 },
      downloading_supplemental_resources: { id: 115005537648 },
      course_insights_enterprise_plan_only: { id: 115010907447 },
      user_activity: { id: 115011062868 },
      user_activity_active_users: { id: 360044845993 },
      ratings_reviews_dashboard: { id: 360056074933 },
      learner_feedback: { id: 360057021414 },
      sso_documentation_azure: { id: 115009490608 },
      sso_documentation_google: { id: 115007944287 },
      sso_documentation_okta: { id: 360035681493 },
      sso_documentation_onelogin: { id: 115007942207 },
      sso_documentation_adfs: { id: 115007945527 },
      sso_documentation_general: { id: 115008213828 },
      when_is_data_updated: { id: 360044845893 },
      lms_integration_documentation: { id: 360060315253 },
      auto_assign_rule_info: { id: 1500001196281 },
      system_requirements: { id: 115005533888 },
      learning_challenges: { id: 1500011171982 },
      group_insights: { id: 1500010830622 },
      my_groups: { id: 1500010862021 },
      pro_insights: { id: 4404566692759 },
      export_reports: { id: 115005251587 },
      inviting_users: { id: 115005395268 },
      course_retirements: { id: 115005650668 },
      scheduler_learning_event: { id: 4498682272279 },
      assessment_benchmarking: { id: 4412308049175 },
      labs_aws_support_article: { id: 360056038774 },
      labs_azure_support_article: { id: 4586061730199 },
      labs_data_science_support_article: { id: 360058699133 },
      labs_web_development_support_article: { id: 4410623949463 },
      adding_more_licenses: { id: 115005396128 },
      learning_culture_webinar_link: { id: 115013724427 },
      team_plan_receipts: { id: 360015876213 },
      approving_course: { id: 115006844788 },
      importing_course: { id: 115005228607 },
      creating_course: { id: 115005523008 },
      adding_removing_courses: { id: 360000325728 },
      review_group_membership: { id: 360052222154 },
      editing_custom_topics: { id: 115005228687 },
    });
    const WEIRD_LANG = {
      en: "en-us",
      de: "de",
      es: "es",
      fr: "fr-fr",
      pt: "pt",
      ja: "ja",
      it: "it",
      pl: "pl",
      tr: "tr",
      ko: "ko",
    };

    const isUbChina =
      isUfb &&
      udConfig.brand.has_organization &&
      udConfig.brand.organization.is_enterprise_china &&
      udConfig.features.organization.is_ub_china_support_redirection_enabled;
    if (isUbChina) {
      return "/support/";
    }

    const baseUrl = isUfb
      ? "https://business-support.udemy.com/hc/"
      : "https://support.udemy.com/hc/";
    const locale = udMe.isLoading ? "" : udMe.locale;
    let langCode = (locale || "").replace("_", "-").toLowerCase();
    if (WEIRD_LANG[langCode.substring(0, 2)]) {
      langCode = WEIRD_LANG[langCode.substring(0, 2)];
    } else {
      // The server-side get_support_link defaults to 'en-us' if a language is NOT in WEIRD_LANG.
      langCode = "en-us";
    }
    if (linkName === "default") {
      return `${baseUrl}${langCode}`;
    }
    const link = isUfb ? UFB_SUPPORT_LINKS[linkName] : SUPPORT_LINKS[linkName];
    const id = (link && link.id) || "";
    return `${baseUrl}${langCode}/${subPath}/${id}`;
  },

  toMyCourses() {
    return this.to("home/my-courses");
  },

  toCourseDashboard(courseId) {
    return this.to("course-dashboard-redirect", null, { course_id: courseId });
  },

  toCourseTaking(publishedTitle, subPath, params) {
    return this.to(
      publishedTitle,
      subPath ? `learn/${subPath}` : "learn",
      params
    );
  },

  toLearningPath(pathId) {
    return this.to("learning-paths", pathId);
  },

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
  }) {
    const udRequest = getRequestData();
    let urlAction = "signup-popup";
    if (showInstructorSignup) {
      urlAction = "instructor-signup";
    } else if (showLogin) {
      urlAction = "login-popup";
    }
    const urlParams = {
      locale: locale || udRequest.locale || "en_US",
      response_type: responseType || "json",
      return_link: returnUrl,
      source,

      // Checked by data-pipelines workflows for tracking purposes.
      ref: popupTrackingIdentifier,
    };

    if (typeof window !== "undefined") {
      urlParams.next =
        nextUrl || (nextPath ? this.to(nextPath) : window.location.href);
    }

    return this.to("join", urlAction, urlParams);
  },

  makeAbsolute(url) {
    const udConfig = getConfigData();

    if (url.charAt(0) === "/") {
      url = url.slice(1);
    }

    return `${udConfig.url.to_app}${url}`;
  },

  to(controller, action, params) {
    controller = controller ? String(controller) : "";

    // support using paths for controller by removing trailing slashes
    if (controller.charAt(controller.length - 1) === "/") {
      controller = controller.slice(0, controller.length - 1);
    }

    const relativeUrl = controller
      ? action
        ? `${controller}/${action}/`
        : `${controller}/`
      : "";
    const baseUrl = this.makeAbsolute(relativeUrl);

    return !params || Object.keys(params).length == 0
      ? baseUrl
      : `${baseUrl}?${qs.stringify(params)}`;
  },

  toInstructorCommunity() {
    return "https://community.udemy.com";
  },

  toHardLink(linkName) {
    const HARD_LINKS = {
      promo_video_content:
        "/udemy-teach-hub/promo_video/?use-localization-prefix=1",
      cpe_course_evaluation:
        "https://docs.google.com/forms/d/e/1FAIpQLSdFxtjbOd5QArS1pov8_eSwLuYXEDVdw9uHwC6lFv_MnCKUsQ/viewform",
      nasba_registry: "https://www.nasbaregistry.org/",
    };
    return HARD_LINKS[linkName] || "";
  },

  toLocalizedNewcomerChallenge() {
    const udRequest = getRequestData();
    const NEW_COMER_CHALLENGE_PREPEND =
      "https://email.udemy.com/pub/sf/ResponseForm?_ri_=X0Gzc2X%3DYQpglLjHJlYQG";
    const NEW_COMER_CHALLENGE_LANGAGE_POSTPEND_LINKS = {
      en:
        "hj92N5OWrGpFJYRvXvwmzfP6KE3qHemTLUCVXMtX%3DYQpglLjHJlYQGiFORUzdOOlMzb27WIGzbHl5zdRaL" +
        "H3Rk7ISwzfO&_ei_=EswUN1Css7mEpCoPhKN_87U",
      de:
        "mdX2FKSoulLSr8evczetSr2vRwGAgsD39za3VXMtX%3DYQpglLjHJlYQGgzbbgy3wzcgIstYUTzbTcM2NrkL" +
        "N2FjwIAvOza&_ei_=ErjwYIhJT8jgodxmScI9JVI",
      es:
        "zbatoTMuYC9wLdweazfoza9iJFOlkNCn8XrzcJVXMtX%3DYQpglLjHJlYQGmIkEMHKJEqigSUeFBOqLpyADu" +
        "6Ozavyzbzczab&_ei_=EoOwLlzi9SpP4xMqAKJxu8Q",
      ja:
        "rvrwaihyPCy58oPzfBCn7fzfMbOro0lBtPIGVXMtX%3DYQpglLjHJlYQGtWEBNDCybNtcazeRCWzetuj1zbM" +
        "LzaqsgU5zbyk&_ei_=Ep4pCt8Os2gyESfH-v7082I",
      pt:
        "jCTzae8bqAzauUeYkjzd8156yzbX8CEGGc8qXJVXMtX%3DYQpglLjHJlYQGjD2KjokNAzbGnB8YnqkW3Ta5D" +
        "Cl33zf5uYys&_ei_=EoKnW9bD376YcRJCeLsL9Lc",
      fr:
        "zbXRBSW8BbjiMlHzbnjOoesbeRNjESUOtcSkVXMtX%3DYQpglLjHJlYQGzbczdKvmODbSzbcrncOgmzgzdsP" +
        "OJTNMzcidmrzd5&_ei_=EmEfebZg5ZrBwlSba3OhohY.",
      it:
        "orXASzc4R9PuhfBDzcEzey4ulLh5FyKBzea2ofVXMtX%3DYQpglLjHJlYQGjJH5E3T8LtEe8hzcyzbGbRozd" +
        "iiE9zgc6R4u5f&_ei_=Elxd4mXlKUMUm7Isetz96gA",
      pl:
        "uzg6mY7pFzezdqjRaKLnGczftR75NSKzazeC2nfCVXMtX%3DYQpglLjHJlYQGlszazbvPC2qdwGNNHl07KuX" +
        "zfE9O3HiDzfCnLG&_ei_=EolWs-9nC4mhA9p3Fir37Rg",
      tr:
        "kuaDzeIBzbUH30Hzeq893Rf5uO1Ys4s2lBbUfVXMtX%3DYQpglLjHJlYQGgbmo43gh8qXE8pzepjzcK012za" +
        "HKhupzfHzdrA3&_ei_=EnfxfaJKFB7M_9wdA63da-E",
    };

    const userLang = udRequest.locale.substr(0, 2);
    if (!NEW_COMER_CHALLENGE_LANGAGE_POSTPEND_LINKS[userLang]) {
      return null;
    }
    return (
      NEW_COMER_CHALLENGE_PREPEND +
      NEW_COMER_CHALLENGE_LANGAGE_POSTPEND_LINKS[userLang]
    );
  },
  toUFBDataReports() {
    return this.to("organization-manage/reports");
  },
  toTapenUFBDataReports(organizationId) {
    return this.to(`tapen/organization/${organizationId}/data-export-reports`);
  },
  toUFBPathInsights() {
    return this.to("organization-manage/path-insights");
  },
  toCourseInsights(courseID) {
    return this.to(`organization-manage/insights/course/${courseID}`);
  },
  toUFBSettingsAPI() {
    return this.to("organization-manage/settings/api-integration");
  },
  toUFBSettingsAppearance() {
    return this.to("organization-manage/settings/appearance");
  },
  toUFBSettingsBilling() {
    return this.to("organization-manage/settings/billing");
  },
  toUFBSettingsCustomErrors() {
    return this.to("organization-manage/settings/custom-error-message");
  },
  toUFBSettingsEmails() {
    return this.to("organization-manage/settings/approved-email-domains");
  },
  toUFBSettingsIntegrations() {
    return this.to("organization-manage/settings/integration");
  },
  toUFBSettingsLMSIntegrations() {
    return this.to("organization-manage/settings/lms-integration");
  },
  toUFBSettingsSCIM() {
    return this.to("organization-manage/settings/provisioning-scim");
  },
  toUFBSettingsSSO() {
    return this.to("organization-manage/settings/single-sign-on");
  },
  toUFBUserActivity() {
    return this.to("organization-manage/insights/user-activity");
  },
  toTapenUFBUserActivity(organizationId) {
    return this.to(
      `tapen/organization/${organizationId}/insights/user-activity`
    );
  },
  toUFBUserAdoptionFunnel() {
    return this.to("organization-manage/adoption");
  },
  toUFBUserDetail(userId) {
    return this.to(`organization-manage/users/detail/${userId}/`);
  },
  toUFBManageUsers() {
    return this.to("organization-manage/users");
  },
  toUFBManageGroups() {
    return this.to("organization-manage/users/manage-groups");
  },
  toFreeCourseFAQLink(lang) {
    switch (lang) {
      case "zh":
        return "http://teach.udemy.com/free-changes-to-courses-zh-faq/";
      case "ru":
        return "http://teach.udemy.com/free-changes-to-courses-ru-faq/";
      default:
        return "/udemy-teach-hub/new_standard_free_courses/";
    }
  },
  toRefundRequestForm(courseId) {
    return this.to(`request-refund/${courseId}`);
  },
  toPurchaseHistoryDashboard() {
    return this.to("dashboard/purchase-history");
  },
  toCreditHistoryDashboard() {
    return this.to("dashboard/credit-history");
  },
};
