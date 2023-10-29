/* eslint-disable import/prefer-default-export */
export const CHECKLISTS_DATA = [
    {
        setting: 'are_captions_provided',
        title: gettext('Closed captions accessibility checklist'),
        tips: [
            gettext(
                'All auto-generated captions should be reviewed to check for accuracy. Captions must meet a 99% rate of accuracy.',
            ),
            gettext(
                'Any relevant sound effects pertinent to the course must be noted in the captions, example: (Beeps).',
            ),
            gettext(
                'Any non-speech elements such as music are captured in the captions, example: (Jazzy music).',
            ),
            gettext(
                'Verbal delivery style indicators are captured in the captions, example: (Exclaims).',
            ),
            gettext('Captions identify speakers on and off camera.'),
        ],
        learnMoreText: gettext(
            'Learn more about providing <a className="teachLink">accessible closed captions</a> in the Udemy Teaching Center.',
        ),
        learnMoreLink: 'https://teach.udemy.com/accessible-video-content-considerations/',
        checkboxTitle: gettext('Captions in this course meet these guidelines'),
    },
    {
        setting: 'is_audio_description_included',
        title: gettext('Audio content accessibility checklist'),
        tips: [
            gettext('Audio can stand on its own, like an audiobook.'),
            gettext('Visual content (when not just for decoration) is explained.'),
            gettext('Interactions shown on screen are fully explained, without skipping steps.'),
            gettext('Spoken content uses plain language, at a measured (not too quick) pace.'),
            gettext(
                'Figures of speech, idioms, jargon, or slang are avoided, and unfamiliar terms or acronyms are defined.',
            ),
            gettext(
                'Captions for all spoken content have been reviewed for accuracy - especially proper names, acronyms, abbreviations, and technical terms.',
            ),
        ],
        learnMoreText: gettext(
            'Learn more about <a className="teachLink">accessible audio content</a> in the Udemy Teaching Center.',
        ),
        learnMoreLink:
            'https://teach.udemy.com/accessible-video-content-considerations/#Audio-content',
        checkboxTitle: gettext('Audio content in this course meets these guidelines'),
    },
    {
        setting: 'is_course_content_accessible',
        title: gettext('Course materials accessibility checklist'),
        tips: [
            gettext('A table of contents for long documents and a glossary of terms are provided.'),
            gettext(
                'Semantic markup for headings, bulleted lists, or numbered lists has been applied to all documents.',
            ),
            gettext('Content is organized in short paragraphs and/or simple tables.'),
            gettext('Links to external resources use descriptive language.'),
            gettext(
                'Alternative text is provided for all images in documents or slide presentations.',
            ),
            gettext('Strong color contrast has been used for text and images.'),
        ],
        learnMoreText: gettext(
            'Learn more about <a className="teachLink">accessible course materials</a> in the Udemy Teaching Center.',
        ),
        learnMoreLink: 'https://teach.udemy.com/resources-on-accessibility-inclusivity/',
        checkboxTitle: gettext('Materials attached to this course meet these guidelines'),
    },
];
