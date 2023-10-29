export const SD_GENERIC_TAG_ACTION_URL = '/structured-data/generic-tag/action/';

export const SectionHasTopicsActions = {
    ASSIGN_TOPIC: 'assign_topic_to_chapter',
    UNASSIGN_TOPIC: 'unassign_topic_from_chapter',
    PROPOSE_TOPIC: 'create_proposed_section_topic',
};

export const GT_ASSIGNMENT_TYPE_PRIMARY = 2;

export const GT_INSTANCE_TYPE_NAME = 'gtinstance';

export const SECTION_ENTITY = {
    model: 'chapter',
    app: 'curriculum',
};

export const PROPOSE_TOPIC_NAME_LOCATION = 'section-topic-testing';

export const MAXIMUM_TOPICS_PER_SECTION = 2;

export const ASSIGN_TOPIC_ERROR_MESSAGE = gettext(
    'Something went wrong when adding the topic "%(topic)s". Please try again.',
);

export const UNASSIGN_TOPIC_ERROR_MESSAGE = gettext(
    'Something went wrong when removing the topic "%(topic)s". Please try again',
);

export const ERROR_FETCHING_TOPICS_FOR_SECTION_MESSAGE = gettext(
    'Something went wrong fetching topics for section. Please try again',
);

export const PROPOSED_TOPIC_ERROR_MESSAGE = gettext(
    'Something went wrong when proposing new topic "%(topic)s". Please try again.',
);

export const IS_SECTION_TOPICS_ENABLED_COURSE_LIST = [653820, 3533646];

export const IS_SECTION_TOPICS_ENABLED_USER_ID_LIST = [
    198371844, // troy.thompson@udemy.com
    195994762, // tara.lanphar@udemy.com
    190557120, // marni.deshong@udemy.com
    190695250, // amonty.parsons@udemy.com
    190695320, // eloise.marszalek@udemy.com
    188757700, // veronica.espizona@udemy.com
    178302914, // lynda.arnold@udemy.com
    // 4466306, // removed Colt Steele - instructor curriculum load time was too high
    5487312,
    9685726,
    8280056,
    27592028,
    16122994,
    16122994,
    16122994,
    58935,
    14088122,
    23565832,
    8280056,
    13363166,
];
