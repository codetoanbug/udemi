import udLink from 'utils/ud-link';

export default class FilmAndEditStore {
    courseManageInfoSeenLabel = 'seen_film_and_edit';
    content = {
        title: gettext('Film & edit'),
        headerData: {
            name: 'filmAndEdit',
            title: gettext('You’re ready to share your knowledge.'),
            text: gettext(
                'This is your moment! If you’ve structured your course and used our guides, ' +
                    "you're well prepared for the actual shoot. Pace yourself, take time to make it just right, and fine-tune when you edit. ",
            ),
            ctaImage: udLink.toStorageStaticAsset('instructor/manage/video-help.jpg'),
            ctaImage2x: udLink.toStorageStaticAsset('instructor/manage/video-help-2x.jpg'),
            ctaHeader: gettext('You’re in good company'),
            ctaSentence: gettext('Chat and get production help with other Udemy instructors'),
            ctaButtonText: gettext(' Join the community'),
            ctaUrl: udLink.toInstructorCommunity(),
        },
        tipsData: {
            name: 'tips',
            title: gettext('Tips'),
            tips: [
                {
                    title: gettext('Take breaks and review frequently.'),
                    text: gettext(
                        'Check often for any changes such as new noises. Be aware of your' +
                            ' own energy levels--filming can tire you out and that translates ' +
                            'to the screen.',
                    ),
                },
                {
                    title: gettext('Build rapport.'),
                    text: gettext(
                        'Students want to know who’s teaching them. Even for a course that' +
                            ' is mostly screencasts, film yourself for your introduction. Or go the extra mile ' +
                            'and film yourself introducing each section!',
                    ),
                },
                {
                    title: gettext('Being on camera takes practice.'),
                    text: gettext(
                        'Make eye contact with the camera and speak clearly. Do as many retakes as you need to get it right. ',
                    ),
                },
                {
                    title: gettext('Set yourself up for editing success.'),
                    text: gettext(
                        'You can edit out long pauses, mistakes, and ums or ahs. Film a few ' +
                            'extra activities or images that you can add in later to cover those cuts.',
                    ),
                },
                {
                    title: gettext('Create audio marks.'),
                    text: gettext(
                        'Clap when you start each take to easily locate the audio spike during ' +
                            'editing. Use our guides to manage your recording day efficiently. ',
                    ),
                },
                {
                    title: gettext('For screencasts, clean up.'),
                    text: gettext(
                        'Move unrelated files and folders off your desktop and open any tabs ' +
                            'in advance. Make on-screen text at least 24pt and use zooming to highlight.',
                    ),
                },
            ],
        },
        requirementsData: {
            name: 'requirements',
            title: gettext('Requirements'),
            requirements: [
                {
                    text: gettext(
                        'Film and export in HD to create videos of at least 720p, or 1080p if possible',
                    ),
                },
                {
                    text: gettext(
                        'Audio should come out of both the left and right channels and be synced to your video',
                    ),
                },
                {
                    text: gettext(
                        'Audio should be free of echo and background noise so as not to be distracting to students',
                    ),
                },
            ],
        },
        resourcesData: {
            name: 'resources',
            title: gettext('Resources'),
            resources: [
                {
                    title: gettext('Create a test video'),
                    text: gettext('Get feedback before filming your whole course'),
                    link: '/home/teaching/test-video/?ref=film_and_edit',
                },
                {
                    title: gettext('Teaching Center: Guide to quality A/V'),
                    text: gettext('Film and edit with confidence'),
                    link: '/udemy-teach-hub/audio_video_quality/',
                },
                {
                    title: gettext('Udemy trust & safety'),
                    text: gettext('Our policies for instructors and students'),
                    link: '/udemy-teach-hub/trust_safety/',
                },
            ],
        },
    };
}
