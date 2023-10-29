import React from 'react';

import AjaxModal from 'base-components/dialog/ajax-modal.react-component';

export const preloadInstructorVerificationApp = () => {
    return import(
        /* webpackChunkName: "instructor-verification-udlite-app" */ 'instructor-verification/udlite-app'
    );
};

export default function InstructorVerificationAjaxModal(props) {
    return (
        <AjaxModal
            url="/instructor/verification-popup/"
            labelledById="instructor-verification-title"
            shouldInterceptContent={true}
            skipCache={true}
            preloader={preloadInstructorVerificationApp}
            {...props}
        />
    );
}
