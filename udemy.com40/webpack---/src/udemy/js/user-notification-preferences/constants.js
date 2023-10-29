export const SETTINGS = {
    PROMOTIONAL: 'udemy-promotional',
    UFB_PROMOTIONAL: 'ufb-promotional',
    DISABLE_ALL: 'disableAllEmails',
    INSTRUCTOR_ANNOUNCEMENT: 'instructor-announcement',
};

export const SETTING_VALUES = {
    OFF: 'off',
    ON: 'on',
};

export const NOTIFICATION_OPTIONS = {
    disabledForInstructors: {
        name: 'disabledForInstructors',
        disabled: true,
        primaryText: gettext(
            'Promotions, course recommendations, and helpful resources from Udemy. ',
        ),
        secondaryText: gettext(
            'Because you are an instructor, you will not receive course' +
                ' promotional emails from Udemy.',
        ),
    },
    forStudents: {
        name: 'forStudents',
        primaryText: gettext(
            'Promotions, course recommendations, and helpful resources from Udemy.',
        ),
    },
    forOrganizationStudents: {
        name: 'forStudents',
        primaryText: gettext(
            'Personalized learning recommendations, tips to accelerate my progress' +
                ' and helpful reminders.',
        ),
    },
    instructorAnnouncements: {
        name: 'instructorAnnouncements',
        primaryText: gettext('Announcements from instructors whose course(s) I’m enrolled in.'),
        secondaryText: gettext(
            'To adjust this preference by course, leave this box checked and go to' +
                ' the  course dashboard and click on "Options" to opt in or out of specific announcements.',
        ),
    },
    instructorAnnouncementsDisabled: {
        name: 'instructorAnnouncements',
        disabled: true,
        primaryText: gettext('Announcements from instructors whose course(s) I’m enrolled in.'),
        secondaryText: gettext(
            "Instructor announcements have been disabled for your organization's account",
        ),
    },
    forInstructors: {
        name: 'forInstructors',
        primaryText: gettext(
            'Helpful resources and important updates related to being an instructor on Udemy.',
        ),
        secondaryText: gettext(
            'To adjust this preference by course, leave this box checked' +
                ' and go to ‘Course Settings’ on the course management dashboard to opt in or out' +
                ' of specific notifications.',
        ),
    },
    disableAll: {
        name: 'disableAll',
        primaryText: gettext("Don't send me any promotional emails."),
        secondaryText: gettext(
            'If this box is checked, please note that you will' +
                ' continue to receive important transactional emails like purchase receipts.',
        ),
    },
};
