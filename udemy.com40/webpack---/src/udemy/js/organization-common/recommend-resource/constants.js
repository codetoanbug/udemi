export const PAGE = 1;
export const PAGE_SIZE = 20;

export const getGeneralErrorText = (gettext) =>
    gettext('Something went wrong, please try again later');

export const getRecommendResourceModalFields = (gettext) => {
    return {
        course: {
            modalTitle: gettext('Recommend course'),
            formLabel: gettext('Who do you want to recommend this course to?'),
        },
        learning_path: {
            modalTitle: gettext('Recommend learning path'),
            formLabel: gettext('Who do you want to recommend this learning path to?'),
        },
        lab: {
            modalTitle: gettext('Recommend lab'),
            formLabel: gettext('Who do you want to recommend this lab to?'),
        },
        adaptive_assessment_assessment: {
            modalTitle: gettext('Recommend assessment'),
            formLabel: gettext('Who do you want to recommend this assessment to?'),
        },
    };
};

export const getNumberOfUsersErrorMessage = (gettext) =>
    gettext('An error occurred when getting the number of users for the organization');
