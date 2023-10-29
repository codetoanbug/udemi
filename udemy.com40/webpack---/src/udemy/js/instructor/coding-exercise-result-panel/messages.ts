import {NotificationType} from './types';

export const correctSolution: NotificationType = {
    color: 'green',
    status: gettext('Success 🎉'),
};

export const inCorrectSolution: NotificationType = {
    color: 'red',
    status: gettext('Fail'),
};

export const sqlCompileError: NotificationType = {
    color: 'red',
    status: gettext('Compile error'),
    message: {
        title: gettext("Your code can't run against tests."),
        desc: gettext(
            'There might be something wrong with syntax usage in your code. You can use error details to fix it.',
        ),
    },
};

export const generalCompileError: NotificationType = {
    color: 'red',
    status: gettext('Compile error'),
    message: {
        title: gettext("Your code can't run against tests."),
        desc: gettext(
            'There might be something wrong with syntax usage in your code. You can use error details to fix it.',
        ),
    },
};

export const timeoutErrorMessage: NotificationType = {
    color: 'red',
    status: gettext('Time out error'),
    message: {
        title: gettext('Your code took too long to execute.'),
        desc: gettext('Review the logic in your code might cause it and try again. '),
    },
};

export const systemErrorMessage: NotificationType = {
    color: 'orange',
    status: gettext('System error'),
    message: {
        title: gettext('Something is wrong in our systems.'),
        desc: gettext('Please try again later.'),
    },
};
