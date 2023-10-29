import {showReloadPageErrorToast} from 'instructor/toasts';

// eslint-disable-next-line import/prefer-default-export
export function handleUnexpectedAPIError(error) {
    error.detail && showReloadPageErrorToast(error.detail);
    if (error.JSError) {
        // Throw JS errors so that they show up in the console.
        throw error.JSError;
    }
}
