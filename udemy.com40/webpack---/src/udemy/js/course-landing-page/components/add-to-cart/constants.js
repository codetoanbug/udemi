import {
    CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE,
    CONFIRMATION_BOTTOM_DRAWER_LOADING_STATE,
    CONFIRMATION_BOTTOM_DRAWER_FINISHED_STATE,
} from 'course-landing-page/components/confirmation-bottom-drawer/constants';

export const CONFIRMATION_BOTTOM_DRAWER_MESSAGES = {
    title: {
        get [CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE]() {
            return gettext('Add course to cart?');
        },
        get [CONFIRMATION_BOTTOM_DRAWER_LOADING_STATE]() {
            return gettext('Add course to cart?');
        },
        get [CONFIRMATION_BOTTOM_DRAWER_FINISHED_STATE]() {
            return gettext('Course added to cart');
        },
    },
    content: {
        get [CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE]() {
            return gettext('Please confirm that you want to add this course to your cart');
        },
    },
    controls: {
        get cancelText() {
            return gettext('Cancel');
        },
        get closeText() {
            return gettext('Close');
        },
        get confirmText() {
            return gettext('Add to cart');
        },
    },
};

export default CONFIRMATION_BOTTOM_DRAWER_MESSAGES;
