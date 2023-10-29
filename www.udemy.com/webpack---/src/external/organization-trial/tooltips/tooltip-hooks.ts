import {useI18n} from '@udemy/i18n';

import {TooltipContent} from './tooltip-wrapper.react-component';

interface Item {
    itemType: 'practice' | 'lecture';
    quizType: 'simple-quiz' | 'coding-exercise' | 'practice-test';
    assetType: 'Article' | 'Presentation';
}

export type TooltipTemplates = ReturnType<typeof useTooltipTemplates>;

/**
 * Messages and titles for translation
 */
export function useTooltipTemplates() {
    const {gettext, interpolate, ninterpolate} = useI18n();

    const NON_VIDEO_ITEMS_TITLES = {
        practice: gettext('Assignments are not available to trial users'),
        lecture: gettext('This lecture type is not available'), // for all non-video lectures
    };

    const NON_VIDEO_ITEMS_DESCRIPTIONS = {
        practice: gettext(
            'Assignments are a great way to test the application of what you have learned.',
        ),
        lecture: gettext('This is a non-video lecture which is unavailable to trial users.'), // non video lectures
    };

    const QUIZZES_TITLES = {
        'simple-quiz': gettext('Quizzes are not available to trial users'),
        'coding-exercise': gettext('Coding exercises are not available to trial users'),
        'practice-test': gettext('Practice Tests are not available to trial users'),
    };

    const ASSETS_TITLES = {
        Article: gettext('Articles are not available to trial users'),
        Presentation: gettext('Presentations are not available to trial users'),
    };

    const ASSETS_DESCRIPTIONS = {
        Article: gettext(
            'Some instructors use articles to complement their video content, ' +
                'but these are unavailable to trial users.',
        ),
        Presentation: gettext(
            'Some instructors use presentations to complement their video content, ' +
                'but these are unavailable to trial users.',
        ),
    };

    const QUIZZES_DESCRIPTIONS = {
        'simple-quiz': gettext(
            'Quizzes are a great way to test your recall of the lessons you have taken.',
        ),
        'coding-exercise': gettext(
            'Coding Exercises are the best way to learn and apply programming lessons.',
        ),
        'practice-test': gettext('Practice tests are a wonderful way to prepare for exams.'),
    };

    /**
     * Config object for tooltip content properties - used to generate an object with tooltip properties
     * based on passed parameters - some properties are constants some are functions
     * Used by tooltipsContentFactory function
     */
    return {
        get_started: {
            position: 'first_available',
            title({numStart}: {numStart: number}) {
                return ninterpolate(
                    'Your trial starts with %s free video',
                    'Your trial starts with %s free videos',
                    numStart,
                );
            },
            text({isOwner}: {isOwner: boolean}) {
                if (isOwner) {
                    return gettext('Unlock more at any time.');
                }
                return '';
            },
            // cannot close get_started
            noClose: true,
            type: 'get_started',
        },
        preview_lecture_viewed: {
            position({numAvailable}: {numAvailable: number}) {
                return numAvailable ? 'first_available' : 'first_used';
            },
            title() {
                return gettext('No limits on preview videos');
            },
            text() {
                return gettext(
                    'This is a ‘preview’ video which isn’t deducted from your allowance of free videos. ' +
                        'Watch as many of these as you want. Enjoy!',
                );
            },
            type: 'preview_lecture_viewed',
        },
        admin_invitation_v2: {
            position: 'licenses_left',
            title() {
                return gettext('Get your team involved');
            },
            text({lectureCount}: {lectureCount: number}) {
                return interpolate(
                    gettext(
                        'Invite people to participate in this trial. Each member will have access to %(count)s videos.',
                    ),
                    {count: lectureCount},
                    true,
                );
            },
            type: 'admin_invitation_v2',
        },
        limit_reached: {
            position({isOwner}: {isOwner: boolean}) {
                if (isOwner) {
                    return 'buy_button';
                }
                return 'unlock_button';
            },
            title() {
                return gettext('You need unlimited access!');
            },
            text({numCourses}: {numCourses: number}) {
                return interpolate(
                    gettext(
                        'Your team has watched all 30 videos included in this trial. Drive a culture of learning and ' +
                            'buy Udemy Business for your team. Get unlimited access to thousands of videos and %s+ courses.',
                    ),
                    [numCourses],
                );
            },
            type: 'limit_reached',
        },
        non_video_content_locked: {
            position({isOwner}: {isOwner: boolean}) {
                if (isOwner) {
                    return 'buy_button';
                }
                return 'unlock_button';
            },
            title({item}: {item: Item}) {
                let title = NON_VIDEO_ITEMS_TITLES.lecture;
                const assetType = item.assetType;
                if (item.quizType) {
                    title = QUIZZES_TITLES[item.quizType];
                } else if (assetType && ASSETS_TITLES[assetType]) {
                    title = ASSETS_TITLES[assetType];
                } else {
                    title = NON_VIDEO_ITEMS_TITLES[item.itemType];
                }
                return title;
            },
            text({item}: {item: Item}) {
                // That's mad but we have so many different cases
                let firstPart = '';
                const assetType = item.assetType;
                const secondPart = gettext('Buy Udemy Business to start taking them today.');
                if (item.quizType) {
                    firstPart = QUIZZES_DESCRIPTIONS[item.quizType];
                } else if (assetType && ASSETS_DESCRIPTIONS[assetType]) {
                    firstPart = ASSETS_DESCRIPTIONS[assetType];
                } else {
                    firstPart = NON_VIDEO_ITEMS_DESCRIPTIONS[item.itemType];
                }
                return `${firstPart} ${secondPart}`;
            },
            type: 'non_video_content_locked',
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetTooltipPropsFn = (type: keyof TooltipTemplates, params: any) => TooltipContent;

export function useGetTooltipProps() {
    const templates = useTooltipTemplates();

    /**
     * Function to generate tooltip props
     * @param string type - type to pick from tpl object passed
     * @param object params - params for variable/conditon rendering functions
     * @returns object
     */
    const getTooltipProps: GetTooltipPropsFn = (type, params = {}) => {
        const tooltipProps: Partial<TooltipContent> = {};
        const template = templates[type];
        if (!template) {
            throw new Error('Unsupported tooltip type');
        }

        for (const _prop in template) {
            const prop = _prop as keyof typeof template;
            const value = template[prop];
            tooltipProps[prop] = typeof value === 'function' ? value(params) : value;
        }

        return tooltipProps as TooltipContent;
    };

    return getTooltipProps;
}
