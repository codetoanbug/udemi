import {SOURCE_PAGES} from './constants';

const getStrings = (gettext) => {
    return {
        [SOURCE_PAGES.CLP]: {
            shareableText: gettext('Thought you might enjoy this course on @Udemy: %(title)s'),
        },
        [SOURCE_PAGES.CLP_POST_ENROLL]: {
            shareableText: gettext('Thought you might enjoy this course on @Udemy: %(title)s'),
        },
        [SOURCE_PAGES.COURSE_TAKING]: {
            shareableText: gettext('Thought you might enjoy this course on @Udemy: %(title)s'),
        },
        [SOURCE_PAGES.HIGH_RATING]: {
            shareableText: gettext('I love this course on @Udemy: %(title)s'),
        },
        [SOURCE_PAGES.INVITE]: {
            shareableText: gettext('Thought you might enjoy learning on @Udemy'),
        },
        [SOURCE_PAGES.MY_COURSES_DROPDOWN]: {
            shareableText: gettext('Thought you might enjoy this course on @Udemy: %(title)s'),
        },
        [SOURCE_PAGES.POST_ENROLL]: {
            shareableText: gettext(
                'Want to join me? I just signed up for this course on @Udemy: %(title)s',
            ),
        },
        [SOURCE_PAGES.FREE_RESOURCE]: {
            shareableText: gettext('Thought you might enjoy the @Udemy Free Resource Center'),
        },
    };
};

export default getStrings;
