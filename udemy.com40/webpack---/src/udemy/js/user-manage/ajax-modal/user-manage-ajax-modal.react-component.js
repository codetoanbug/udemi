import React from 'react';

import AjaxModal from 'base-components/dialog/ajax-modal.react-component';

export const preloadUserManageApps = () => {
    return import(
        /* webpackChunkName: "user-manage-ajax-modal-udlite-app" */ 'user-manage/ajax-modal/udlite-app'
    );
};

const UserManageAjaxModal = (props) => {
    return <AjaxModal preloader={preloadUserManageApps} {...props} />;
};

export default UserManageAjaxModal;
