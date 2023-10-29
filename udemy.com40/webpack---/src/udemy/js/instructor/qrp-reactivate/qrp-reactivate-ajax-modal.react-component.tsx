import React from 'react';

import AjaxModal from 'base-components/dialog/ajax-modal.react-component';

type AjaxModalProps = React.ComponentProps<typeof AjaxModal>;

/* istanbul ignore next */
const preloadQRPReactivateApp = () => {
    return import(
        /* webpackChunkName: "instructor-qrp-reactivate-udlite-app" */ 'instructor/qrp-reactivate/udlite-app'
    );
};

export function QRPReactivateAjaxModal(props: AjaxModalProps) {
    return (
        <AjaxModal
            labelledById="qrp-reactivate-title"
            preloader={preloadQRPReactivateApp}
            requireExplicitAction={true}
            skipCache={true}
            {...props}
        />
    );
}
