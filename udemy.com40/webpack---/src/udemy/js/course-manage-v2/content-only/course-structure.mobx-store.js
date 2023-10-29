import udLink from 'utils/ud-link';

export default class CourseStructureStore {
    courseManageInfoSeenLabel = 'seen_course_structure';
    content = {
        title: gettext('Course structure'),
        headerData: {
            name: 'courseStructure',
            title: gettext("There's a course in you.  Plan it out."),
            text: gettext(
                'Planning your course carefully will create a clear learning path for students and help ' +
                    'you once you film. Think down to the details of each lecture including the skill you’ll teach, estimated ' +
                    'video length, practical activities to include, and how you’ll create introductions and summaries.',
            ),
            ctaImage: udLink.toStorageStaticAsset('instructor/manage/library-help.jpg'),
            ctaImage2x: udLink.toStorageStaticAsset('instructor/manage/library-help-2x.jpg'),
            ctaHeader: gettext('Our library of resources'),
            ctaSentence: gettext('Tips and guides to structuring a course students love'),
            ctaButtonText: gettext('Teaching Center'),
            ctaUrl: '/udemy-teach-hub',
        },
        tipsData: {
            name: 'tips',
            title: gettext('Tips'),
            tips: [
                {
                    title: gettext('Start with your goals.'),
                    text: interpolate(
                        gettext(
                            'Setting goals for what learners will accomplish in your course (also known as' +
                                ' <a target="_blank" href="%(objectives_url)s">learning objectives</a>)' +
                                ' at the beginning will help you determine what content to include in ' +
                                'your course and how you will teach the content to help your learners achieve the goals.',
                        ),
                        {
                            objectives_url: '/udemy-teach-hub/course_creation_learning_objectives/',
                        },
                        true,
                    ),
                },
                {
                    title: gettext('Create an outline.'),
                    text: interpolate(
                        gettext(
                            'Decide what skills you’ll teach and how you’ll teach them. Group related ' +
                                'lectures into sections. Each section should have at least 3 lectures, ' +
                                'and include at least one assignment or practical activity. ' +
                                '<a target="_blank" href="%(outline_url)s">Learn more</a>.',
                        ),
                        {
                            outline_url: '/udemy-teach-hub/course_creation_outline_course/',
                        },
                        true,
                    ),
                },
                {
                    title: gettext('Introduce yourself and create momentum.'),
                    text: gettext(
                        'People online want to start learning quickly. Make an introduction ' +
                            'section that gives learners something to be excited about in the first 10 minutes.',
                    ),
                },
                {
                    title: gettext('Sections have a clear learning objective.'),
                    text: interpolate(
                        gettext(
                            "Introduce each section by describing the section's " +
                                '<a target="_blank" href="%(objectives_url)s">goal and why it’s important</a>.' +
                                ' Give lectures and sections titles that reflect their content and have a logical flow.',
                        ),
                        {
                            objectives_url: '/udemy-teach-hub/course_creation_learning_objectives/',
                        },
                        true,
                    ),
                },
                {
                    title: gettext('Lectures cover one concept.'),
                    text: gettext(
                        'A good lecture length is 2-7 minutes to keep students interested and help ' +
                            'them study in short bursts. Cover a single topic in each lecture so ' +
                            'learners can easily find and re-watch them later.',
                    ),
                },
                {
                    title: gettext('Mix and match your lecture types.'),
                    text: gettext(
                        'Alternate between filming yourself, your screen, and slides or ' +
                            'other visuals. Showing yourself can help learners feel connected.',
                    ),
                },
                {
                    title: gettext('Practice activities create hands-on learning.'),
                    text: interpolate(
                        gettext(
                            'Help learners <a target="_blank" href="%(practice_activities_url)s">apply your lessons</a>' +
                                ' to their real world with projects, assignments, coding exercises, or worksheets.',
                        ),
                        {
                            practice_activities_url:
                                '/udemy-teach-hub/course_creation_practice_activities/',
                        },
                        true,
                    ),
                },
            ],
        },
        requirementsData: {
            name: 'requirements',
            title: gettext('Requirements'),
            requirements: [
                {
                    text: interpolate(
                        gettext(
                            'See the <a target="_blank" href="%(checklist_url)s">complete list</a>' +
                                ' of course quality requirements',
                        ),
                        {checklist_url: udLink.toSupportLink('course_quality_checklist')},
                        true,
                    ),
                },
                {text: gettext('Your course must have at least five lectures')},
                {text: gettext('All lectures must add up to at least 30+ minutes of total video')},
                {
                    text: gettext(
                        'Your course is composed of valuable educational content and free of' +
                            ' promotional or distracting materials',
                    ),
                },
            ],
        },
        resourcesData: {
            name: 'resources',
            title: gettext('Resources'),
            resources: [
                {
                    title: gettext('Udemy Trust & Safety'),
                    text: gettext('Our policies for instructors and students'),
                    link: '/udemy-teach-hub/trust_safety/',
                },
                {
                    title: gettext('Join the instructor community'),
                    text: gettext('A place to connect with other instructors'),
                    link: udLink.toInstructorCommunity(),
                },
                {
                    title: gettext('Official Udemy Course: How to Create an Online Course'),
                    text: gettext(
                        'Learn about course creation from the Udemy Instructor Team and experienced instructors',
                    ),
                    link: '/course/official-udemy-create-course/',
                },
            ],
        },
    };
}
