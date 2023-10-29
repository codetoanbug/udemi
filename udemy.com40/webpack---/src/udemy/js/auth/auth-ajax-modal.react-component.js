import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import AjaxModal from 'base-components/dialog/ajax-modal.react-component';
import {noop} from 'utils/noop';

/* istanbul ignore next */
const preloadAuthApps = (url) => {
    if (url.includes('forgot-password')) {
        return import(
            /* webpackChunkName: "forgot-password-udlite-app" */ 'forgot-password/udlite-app'
        );
    }
    return import(/* webpackChunkName: "auth-udlite-app" */ 'auth/udlite-app');
};

export default function AuthAjaxModal(props) {
    return (
        <AjaxModal
            labelledById="auth-to-udemy-title"
            preloader={preloadAuthApps}
            shouldInterceptContent={true}
            {...props}
            className={classNames('ud-auth-modal', props.className)}
        />
    );
}

AuthAjaxModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    url: PropTypes.string.isRequired,
    preloader: PropTypes.func,
    className: PropTypes.string,
};

AuthAjaxModal.defaultProps = {
    onClose: noop,
    preloader: null,
    className: '',
};
