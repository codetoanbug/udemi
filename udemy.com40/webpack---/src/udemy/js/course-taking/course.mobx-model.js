import {parsePrimaryCourseLabel} from 'organization-common/utils';

import Instructor from './instructor.mobx-model';

export default class Course {
    constructor(apiData) {
        this.id = apiData.id;
        this.title = apiData.title;
        this.headline = apiData.headline;
        this.description = apiData.description;
        this.prerequisites = apiData.prerequisites;
        this.objectives = apiData.objectives;
        this.targetAudiences = apiData.target_audiences;
        this.url = apiData.url;
        this.isPublished = apiData.is_published;
        this.isApproved = apiData.is_approved;
        this.isPaid = apiData.is_paid;
        this.isPrivate = apiData.is_private;
        this.giftUrl = apiData.gift_url;
        this.isCourseAvailableInOrg = apiData.is_course_available_in_org;

        this.numPracticeTestQuestions = apiData.content_length_practice_test_questions;
        this.contentLengthText = apiData.content_info;
        this.numSubscribers = apiData.num_subscribers;
        this.isPracticeTestCourse = apiData.is_practice_test_course;
        this.hasCertificate = apiData.has_certificate;
        this.features = apiData.features;
        this.locale = apiData.locale;
        this.hasClosedCaptions = apiData.has_closed_caption;
        this.instructionalLevel = apiData.instructional_level;
        this.visibleInstructors = (apiData.visible_instructors || []).map(
            (instructor) => new Instructor(instructor),
        );
        this.isOwnedByInstructorTeam = apiData.is_owned_by_instructor_team;
        this.isOwnerTermsBanned = apiData.is_owner_terms_banned;
        this.image240x135 = apiData.image_240x135;
        this.instructorStatus = apiData.instructor_status;
        this.isCpeCompliant = apiData.is_cpe_compliant;
        this.cpeFieldOfStudy = apiData.cpe_field_of_study;
        this.cpeProgramLevel = apiData.cpe_program_level;
        this.numCpeCredits = apiData.num_cpe_credits;
        this.availableFeatures = apiData.available_features;
        this.isSaved = apiData.is_saved;
        this.is_in_user_subscription = apiData.is_in_user_subscription;
        this.primaryCourseLabel = apiData.course_has_labels
            ? parsePrimaryCourseLabel(apiData.course_has_labels)
            : [];
        this.courseLabels = apiData.course_has_labels
            ? apiData.course_has_labels.map((courseHasLabel) => courseHasLabel.label.title)
            : [];
        this.hasLabsInCoursePromptSetting = apiData.has_labs_in_course_prompt_setting;
    }

    get isGiftable() {
        return this.isPaid && !this.isPrivate;
    }
}
