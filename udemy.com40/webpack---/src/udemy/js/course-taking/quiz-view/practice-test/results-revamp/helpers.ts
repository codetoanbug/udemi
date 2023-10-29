import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {tokens} from '@udemy/styles';

export const ANSWER_STATUS = {
    CORRECT: {
        COLOR: tokens['color-green-200'],
        ICON: TickIcon,
        ICON_COLOR: tokens['color-green-500'],
        get label() {
            return gettext('Correct');
        },
    },
    INCORRECT: {
        COLOR: tokens['color-red-200'],
        ICON: CloseIcon,
        ICON_COLOR: tokens['color-red-500'],
        get label() {
            return gettext('Incorrect');
        },
    },
    SKIPPED: {
        COLOR: tokens['color-gray-200'],
        ICON: CloseIcon,
        ICON_COLOR: tokens['color-gray-200'],
        get label() {
            return gettext('Skipped');
        },
    },
};

export function getAnswerStatus(isCorrect: boolean, isSkipped: boolean) {
    if (isCorrect) {
        return ANSWER_STATUS.CORRECT;
    }
    if (isSkipped) {
        return ANSWER_STATUS.SKIPPED;
    }
    return ANSWER_STATUS.INCORRECT;
}
