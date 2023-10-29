import udLink from 'utils/ud-link';

export default class SetupAndTestvideoStore {
    courseManageInfoSeenLabel = 'seen_setup';
    content = {
        title: gettext('Setup & test video'),
        headerData: {
            name: 'setUp',
            title: gettext('Arrange your ideal studio and get early feedback'),
            text: gettext(
                "It's important to get your audio and video set up correctly now, because " +
                    "it's much more difficult to fix your videos after you’ve recorded. There are many creative" +
                    ' ways to use what you have to create professional looking video. ',
            ),
            ctaImage: udLink.toStorageStaticAsset('instructor/manage/video-help.jpg'),
            ctaImage2x: udLink.toStorageStaticAsset('instructor/manage/video-help-2x.jpg'),
            ctaHeader: gettext('Free expert video help'),
            ctaSentence: gettext('Get personalized advice on your audio and video'),
            ctaButtonText: gettext('Create a test video'),
            ctaUrl: '/home/teaching/test-video?ref=setup_and_tv',
        },
        tipsData: {
            name: 'tips',
            title: gettext('Tips'),
            tips: [
                {
                    title: gettext('Equipment can be easy.'),
                    text: gettext(
                        'You don’t need to buy fancy equipment. Most smartphone cameras can capture ' +
                            'video in HD, and you can record audio on another phone or external microphone.',
                    ),
                },
                {
                    title: gettext('Students need to hear you.'),
                    text: gettext(
                        'A good microphone is the most important piece of equipment you will choose. ' +
                            'There are lot of affordable options.. Make sure it’s correctly plugged in and 6-12 inches (15-30 cm) from you.',
                    ),
                },
                {
                    title: gettext('Make a studio.'),
                    text: gettext(
                        'Clean up your background and arrange props. Almost any small space ' +
                            'can be transformed with a backdrop made of colored paper or an ironed bed sheet.',
                    ),
                },
                {
                    title: gettext('Light the scene and your face.'),
                    text: gettext(
                        'Turn off overhead lights. Experiment with three point lighting by ' +
                            'placing two lamps in front of you and one behind aimed on the background.',
                    ),
                },
                {
                    title: gettext('Reduce noise and echo.'),
                    text: gettext(
                        'Turn off fans or air vents, and record at a time when it’s quiet. Place ' +
                            'acoustic foam or blankets on the walls, and bring in rugs or furniture to dampen echo.',
                    ),
                },
                {
                    title: gettext('Be creative.'),
                    text: gettext(
                        'Students won’t see behind the scenes. No one will know if you’re ' +
                            'surrounded by pillows for soundproofing...unless you tell other instructors in the community!',
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
                    title: gettext('Teaching Center: Guide to equipment'),
                    text: gettext('Make a home studio on a budget'),
                    link: '/udemy-teach-hub/course_creation_filming/',
                },
                {
                    title: gettext('Udemy Trust & Safety'),
                    text: gettext('Our policies for instructors and students'),
                    link: '/udemy-teach-hub/trust_safety/',
                },
                {
                    title: gettext('Join the community'),
                    text: gettext('A place to talk with other instructors'),
                    link: udLink.toInstructorCommunity(),
                },
            ],
        },
    };
}
