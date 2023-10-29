import udApi from 'utils/ud-api';

export default {
    ids: Object.freeze({
        autocaptionHeadsup: 'autocaption_headsup',
        adaptiveAssessmentCourseGuideModal: 'adaptive_assessment_course_guide_modal',
        assessmentCourseGuideModal: 'assessment_course_guide_modal',
        organizationEligibleFeatureAlert: 'organization_eligible_feature_alert',
        instructorCourseStatus: 'instructor_course_status_alert',
        captionEditorSurvey: 'caption_editor_survey',
        captionEditorSurveyPopup: 'caption_editor_survey_popup',
        captionManagePage: 'caption_manage_page',
        captionSearchTooltip: 'caption_search_tooltip',
        clpConversionHint: 'clp_conversion_hint',
        codingExerciseHint: 'coding_exercise_hint',
        conversionMigrationHint: 'conversion_migration_hint',
        mkinsightsDataChangeAlert: 'mkinsights_data_change_alert',
        courseFreePaid: 'course_free_paid',
        courseTranslationAutoCoverage: 'course_translation_auto_coverage',
        courseTranslationDisabledLanguageCat: 'course_translation_disabled_language_cat',
        courseTranslationLowConfidence: 'course_translation_low_confidence',
        courseTranslationManualCoverage: 'course_translation_manual_coverage',
        discoverabilityTranscriptTooltip: 'discoverability_transcript_tooltip',
        engagementBehaviorHint: 'engagement_behavior_hint',
        freeCourseLengthUpdate: 'show_free_course_length_update',
        hasSeenAndDismissedAssessmentViewResultsCard:
            'has_seen_and_dismissed_assessment_view_results_card',
        hasSeenStudentFeaturedQuestionsPrompt: 'has_seen_student_featured_questions_prompt',
        hasSeenInstructorFeaturedQuestionsPrompt: 'has_seen_instructor_featured_questions_prompt',
        hasSeenLabsFeaturePrompt: 'has_seen_labs_feature_prompt',
        hasSeenLabsAlmostOutOfResourcesNotification:
            'has_seen_labs_almost_out_of_resources_notification',
        hasSeenLabsSkipSetupNotification: 'has_seen_labs_skip_setup_notification',
        hasSeenReportIssuesBanner: 'has_seen_report_issues_banner',
        hasSeenLabsInCoursePrompt: 'has_seen_labs_in_course_prompt',
        hasSeenActiveLabBanner: 'has_seen_active_lab_banner',
        hasSeenWorkspaceEnabledLecturesPrompt: 'has_seen_workspace_enabled_lectures_prompt',
        hasSeenAndDismissedALRTooltip: 'has_seen_and_dismissed_alr_tooltip',
        instructorApiEula: 'instructor_api_eula',
        instructorOnboarding: 'instructor_onboarding',
        linksWarningQA: 'links_warning_qa',
        mtCaptionSurvey: 'mt_caption_survey',
        autoCaptionSurvey: 'auto_caption_survey',
        organizationEligibleReminder: 'organization_eligible_reminder',
        qrpReactivate: 'qrp_reactivate',
        reinforcementTooltipGettingThere: 'reinforcement_tooltip_getting_there',
        reinforcementTooltipKeepGoing: 'reinforcement_tooltip_keep_going',
        reinforcementTooltipNearlyThere: 'reinforcement_tooltip_nearly_there',
        showAppLinkCourses: 'show_app_link_courses',
        showAppLinkMessages: 'show_app_link_messages',
        showAppLinkQA: 'show_app_link_qa',
        showAppLinkRevenue: 'show_app_link_revenue',
        showAppLinkReviews: 'show_app_link_reviews',
        showAppLinkToast: 'show_app_link_toast',
        showCourseGrpDelay: 'show_course_grp_delay',
        showDirectMessageTurnedOff: 'direct_message_turned_off',
        surveyPrompt: 'survey_prompt',
        taxFaq2017: 'tax_faq_2017',
        testing: 'testing', // This is only used in tests and the Style Guide example.
        testVideoSurvey: 'test_video_survey',
        translationHowTo: 'translation_how_to',
        translationTooLate: 'translation_too_late',
        visitorChartUnique: 'visitor_chart_unique',
        modalInlineFirstTime: 'modal_inline_first_time',
        instructorCategoryMigrate: 'instructor_category_migrate',
        autoTranslatedCaptions: 'auto_translated_captions',
        // Udemy pro
        onBoardingForProgramsPopover: 'onboarding_for_programs_popover',
        // UFB
        seenTeamUpsellTooltip: 'seen_upsell_tooltip',
        seenUserManagePage: 'seen_user_manage_page',
        courseInsightsListDefinitionsFirstTime: 'course_insights_list_definitions_first_time',
        courseInsightsDetailDefinitionsFirstTime: 'course_insights_detail_definitions_first_time',
        courseUpdatesListDefinitionsFirstTime: 'course_updates_list_definitions_first_time',
        // Comply Exchange alerts
        complyFormUnderReview: 'comply_form_under_review',
        complyFormApproved: 'comply_form_approved',
        // Instructor
        aiTermsAndConditionsAccepted: 'ai_terms_and_conditions_accepted',
        engagementUBDataCollectDate: 'engagement_ub_data_collect_date',
        isInstructorTourPopoverClosed: 'is_instructor_tour_popover_closed',
        engagementDataDiscrepancy: 'engagement_data_discrepancy',
        ceCreationNewUIWelcomeModal: 'ce_creation_new_ui_welcome_modal',
        ceLearnerNewUIWelcomeModal: 'ce_learner_new_ui_welcome_modal',
        ceLearnerHintUnlockedPopoverDismissed: 'ce_learner_hint_unlocked_popover_dismissed',
        ceLearnerSolutionUnlockedPopoverDismissed: 'ce_learner_solution_unlocked_popover_dismissed',
        ubInsightsInstructorWelcomeModal: 'ub_insights_instructor_welcome_modal',
        deviceBreakdownPopover: 'device_breakdown_popover',
        courseEngagementAllTimeDataPopover: 'course_engagement_all_time_data_popover',
        courseEngagementAllTimeDataAlertBanner: 'course_engagement_all_time_data_alert_banner',
        inProductGuidanceForCodingExerciseInsightsSingle:
            'in_product_guidance_for_coding_exercise_insights_single',
        inProductGuidanceForCodingExerciseInsightsAll:
            'in_product_guidance_for_coding_exercise_insights_all',
        inProductGuidanceForMoMYoYTrendInsights: 'in_product_guidance_for_mom_yoy_trend_insights',
        ceCreationGuidedWelcomeModal: 'ce_creation_guided_welcome_modal',
        ceInstructorPlanExerciseTourSeen: 'ce_instructor_plan_exercise_tour_seen',
        ceInstructorAuthorSolutionTourSeen: 'ce_instructor_author_solution_tour_seen',
        ceInstructorGuideLearnersTourSeen: 'ce_instructor_guide_learners_tour_seen',
        ceBetaBannerOnCurriculumSeen: 'ce_beta_banner_on_curriculum_seen',
        ceBetaBannerOnCourseListSeen: 'ce_beta_banner_on_course_list_seen',
        ceBetaBannerForPracticeInsightsOnCourseListSeen:
            'ce_beta_banner_for_practice_insights_on_course_list_seen',
        ptAIBannerOnQuestionSeen: 'pt_ai_banner_on_question_seen',
        ptShareFeedbackPopoverSeen: 'pt_share_feedback_popover_seen',
        CertificationPopupInCourseOverviewSeen: 'certification_popup_course_overview_seen',
        ceOutputLearnerWelcomePopover: 'ce_output_learner_welcome_popover',
        ceInstructorAIGenerationPopover: 'ce_instructor_ai_generation_popover',
        supplyGapsInproductMessage: 'supply_gaps_in_product_message',
        supplyGapsLocalizationWarningMessage: 'supply_gaps_localization_warning_message',
    }),
    seen(messageId, postBody) {
        if (!Object.values(this.ids).includes(messageId)) {
            throw new Error(`Invalid system message id: ${messageId}`);
        }

        return udApi.post(`/users/me/system-messages/${messageId}/seen/`, postBody);
    },

    hasSeen(messageId, postBody) {
        return udApi.get(`/users/me/system-messages/${messageId}/seen/`, {params: postBody});
    },
};
