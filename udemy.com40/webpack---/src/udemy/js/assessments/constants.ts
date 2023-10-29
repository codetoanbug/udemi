export const SORT_OPTIONS = {
    title_asc: {
        value: 'title',
        get title() {
            return gettext('A-Z');
        },
    },
    title_desc: {
        value: '-title',
        get title() {
            return gettext('Z-A');
        },
    },
    newest: {
        value: '-created',
        get title() {
            return gettext('Newest');
        },
    },
    oldest: {
        value: 'created',
        get title() {
            return gettext('Oldest');
        },
    },
} as const;

export const ASSESSMENTS_STEPS = [
    {
        get title() {
            return gettext('1. Pick an assessment');
        },
        get description() {
            return gettext(
                'Select a topic you have some level of experience in from the list below.',
            );
        },
        get expressiveIconName() {
            return 'choosing-hand';
        },
    },
    {
        get title() {
            return gettext('2. Assess your skills');
        },
        get description() {
            return gettext(
                'Most assessments take 25 to 35 minutes to complete and cover a variety of areas for each topic. Each assessment allows two new attempts every 24 hours.',
            );
        },
        get expressiveIconName() {
            return 'assessment-test';
        },
    },
    {
        get title() {
            return gettext('3. Review your results');
        },
        get description() {
            return gettext(
                'Identify knowledge gaps and see explanations for why you got a question wrong to fill those gaps.',
            );
        },
        get expressiveIconName() {
            return 'signs';
        },
    },
];

// Below constant is very similar to ASSESSMENTS_STEPS,
// It was using the spread operator, which causes the gettext error on the isomorphic level. Therefore, we duplicate the properties.
// https://udemywiki.atlassian.net/wiki/spaces/PDEUX/pages/1177911860/Isomorphic+rendering+guide#Do-not-call-gettext,-getConfigData,-getExperimentData,-getRequestData-at-module-level
export const ASSESSMENTS_STEPS_ORGANIZATION_VARIANT = [
    ASSESSMENTS_STEPS[0],
    {
        get title() {
            return gettext('2. Assess your skills');
        },
        get expressiveIconName() {
            return 'assessment-test';
        },
        get description() {
            return gettext(
                'Take the assessment. Most assessments will take 25-35 minutes to complete, and will cover a wide range of topics. Each assessment allows two new attempts every 24 hours.',
            );
        },
    },
    {
        get title() {
            return gettext('3. Get content recommendations');
        },
        get description() {
            return gettext("You'll get guidance to content based on our assessment results.");
        },
        get expressiveIconName() {
            return 'signs';
        },
    },
];
export const CONSUMER_SUBS_COLLECTION_ID = 'Q29sbGVjdGlvbjozMDU2';
export const UB_COLLECTION_ID = 'Q29sbGVjdGlvbjozMDUy';
