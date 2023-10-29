import {
    CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE,
    CONFIRMATION_BOTTOM_DRAWER_LOADING_STATE,
    CONFIRMATION_BOTTOM_DRAWER_FINISHED_STATE,
} from 'course-landing-page/components/confirmation-bottom-drawer/constants';

export const WISHLIST_DEFAULT_STATE = 'WISHLIST_DEFAULT_STATE';
export const WISHLIST_LOADING_STATE = 'WISHLIST_LOADING_STATE';
export const WISHLIST_FINISHED_STATE = 'WISHLIST_FINISHED_STATE';

export function getConfirmationBottomDrawerMessages() {
    return {
        title: {
            [CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE]: gettext('Add course to wishlist?'),
            [CONFIRMATION_BOTTOM_DRAWER_LOADING_STATE]: gettext('Add course to wishlist?'),
            [CONFIRMATION_BOTTOM_DRAWER_FINISHED_STATE]: gettext('Course added to wishlist'),
        },
        content: {
            [CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE]: gettext(
                'Please confirm that you want to add this course to your wishlist',
            ),
        },
        controls: {
            cancelText: gettext('Cancel'),
            closeText: gettext('Close'),
            confirmText: gettext('Add to wishlist'),
        },
    };
}
