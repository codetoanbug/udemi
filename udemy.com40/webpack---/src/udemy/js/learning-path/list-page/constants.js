import {ProBadge} from '@udemy/learning-path';
import React from 'react';

import getConfigData from 'utils/get-config-data';

import ProHeaderDescription from './pro-header-description.react-component';

export const FOLDER_TAG_TYPE = 'learning_path_folder';

export const LIST_TYPES = Object.freeze({
    all: {
        get title() {
            return gettext('All paths');
        },
        get description() {
            const udConfig = getConfigData();
            return interpolate(
                gettext('Browse and find all public %(org)s paths here.'),
                {org: udConfig.brand.title},
                true,
            );
        },
        path: '',
    },
    my: {
        get title() {
            return gettext('My edited paths');
        },
        get description() {
            return gettext('This page lists all the paths you have edited.');
        },
        path: 'my',
    },
});

export const LIST_TYPES_WITH_PRO = Object.freeze({
    ...LIST_TYPES,
    pro: {
        get title() {
            return (
                <span>
                    {gettext('Udemy paths')} <ProBadge />
                </span>
            );
        },
        get description() {
            return <ProHeaderDescription />;
        },
        path: 'pro',
    },
});

export const LEARNING_PATH_FIELDS =
    '@default,is_user_enrolled,estimated_content_length,num_enrollments,folder_ids,is_owner_in_group,is_pro_path,url';

export const DEFAULT_LIST_TYPE = 'all';

export const FOLDER_LIST_TYPE = 'folder';

export const LIST_PAGE_EMPTY_STATE_MESSAGES = {
    get NO_PATHS() {
        return gettext('Create a learning path to share knowledge and encourage learning.');
    },
    get NO_FOLDERS() {
        return gettext(
            'Group paths into folders (e.g. Onboarding) so that it’s easier for users to find' +
                ' meaningful learning paths.',
        );
    },

    get NO_RESULTS_TITLE() {
        return gettext("Sorry, we couldn't find any results for '%s'");
    },

    get NO_RESULTS_INFO() {
        return gettext('Your search did not match any path titles');
    },
};

export const LIST_PAGE_INFO_MESSAGES = {
    get LEARNING_PATH_OPTIONS() {
        return gettext('Learning path options');
    },

    get PRO_LEARNING_PATH_ENROLLED_FILTER() {
        return gettext('Learning path enrolled filter');
    },

    get SEARCH_PLACEHOLDER() {
        return gettext('Search learning paths');
    },

    get SEARCH_SUBMIT() {
        return gettext('Submit');
    },

    get SEARCH_FORM_GROUP() {
        return gettext('Search options');
    },
};

export const LIST_PAGE_ERROR_MESSAGES = Object.freeze({
    // TODO - update with actual copies when design is ready
    get UNABLE_TO_DELETE() {
        return gettext('An error occurred while deleting the learning path.');
    },
    get UNABLE_TO_LOAD_LIST() {
        return gettext('Unable to load learning path list.');
    },
    get UNABLE_TO_LOAD_FOLDERS() {
        return gettext('Unable to load learning path folders.');
    },
    get UNABLE_TO_CREATE_FOLDER() {
        return gettext('Unable to create a learning path folder.');
    },
    get UNABLE_TO_DELETE_FOLDER() {
        return gettext('Unable to delete the learning path folder.');
    },
    get UNABLE_TO_ADD_PATH_TO_FOLDERS() {
        return gettext('Unable to add learning path to folder(s).');
    },
    get UNABLE_TO_REMOVE_FROM_FOLDER() {
        return gettext('Unable to remove the learning path from folder.');
    },
});

export const LIST_PAGE_SUCCESS_MESSAGES = Object.freeze({
    get DELETED_PATH() {
        return gettext('You successfully deleted the learning path.');
    },
    get DELETED_FOLDER() {
        return gettext('You successfully deleted the folder.');
    },
    get ADDED_TO_FOLDER() {
        return gettext("'%(pathTitle)s' has been added to the selected folder(s).");
    },
    get REMOVED_FROM_FOLDER() {
        return gettext("'%(pathTitle)s' has been removed from this folder.");
    },
});

export const CARD_IMAGE_SIZE = 32;

export const EMPTY_STATE_IMAGE_SIZE = 110;

export const CREATE_PATH_BUTTON = {
    get TEXT() {
        return gettext('Create path');
    },
};

export const CREATE_LEARNING_PATH = {
    get TEXT() {
        return gettext('Create a learning path');
    },
};

export const CREATE_LEARNING_PATH_BUTTON = {
    get TEXT() {
        return gettext('Create learning path');
    },
};

export const OPTIONAL = {
    get TEXT() {
        return gettext('Optional');
    },
};

export const FOLDER_ACTIONS = Object.freeze({
    CREATE: 'create_lp_folder',
    EDIT: 'edit_lp_folder',
    DELETE: 'delete_lp_folder',
    ASSIGN_LP_TO_FOLDERS: 'assign_lp_folders',
    REMOVE_PATH: 'remove_lp_folder_item',
});

// there is max of 100 SDNavigationList items to keep Redis request time low.
export const FOLDERS_PAGE_SIZE = 100;

export const LIST_PAGE_SIZE = 20;

export const SORT_OPTIONS = Object.freeze({
    newest: {
        value: '-created',
        get title() {
            return gettext('Newest');
        },
    },
    oldest: {
        value: 'created',
        get title() {
            return gettext('Oldest');
        },
    },
    title_asc: {
        value: 'title',
        get title() {
            return gettext('A-Z');
        },
    },
    title_desc: {
        value: '-title',
        get title() {
            return gettext('Z-A');
        },
    },
});

export const PRO_ENROLLED_FILTERING_OPTIONS = Object.freeze({
    all: {
        value: 'all',
        get title() {
            return gettext('All');
        },
    },
    enrolled: {
        value: 'enrolled',
        get title() {
            return gettext('Enrolled');
        },
    },
});

export const SEARCH_PARAMS = Object.freeze({
    PAGE: 'p',
    SEARCH: 'search',
    SORT: 'sort',
    ENROLLED: 'enrolled',
});
