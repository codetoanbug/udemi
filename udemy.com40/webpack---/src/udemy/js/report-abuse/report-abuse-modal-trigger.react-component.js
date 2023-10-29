import {ModalTrigger} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AuthAjaxModal from 'auth/auth-ajax-modal.react-component';
import AjaxModal from 'base-components/dialog/ajax-modal.react-component';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';

import {CATEGORY} from './constants';
import {reportAbuseLink} from './urls';

/* istanbul ignore next */
const preloadReportAbuseApp = () => {
    return import(/* webpackChunkName: "report-abuse-udlite-app" */ 'report-abuse/udlite-app');
};

export default class ReportAbuseModalTrigger extends Component {
    static propTypes = {
        objectId: PropTypes.number.isRequired,
        objectType: PropTypes.string.isRequired,
        category: PropTypes.oneOf(Object.values(CATEGORY)),
        modalProps: PropTypes.object,
    };

    static defaultProps = {
        category: undefined,
        modalProps: undefined,
    };

    @autobind renderModal(givenModalProps) {
        const url = reportAbuseLink(this.props);
        const modalProps = {...givenModalProps, ...this.props.modalProps};
        if (!udMe.is_authenticated) {
            return (
                <AuthAjaxModal
                    {...modalProps}
                    url={udLink.toAuth({showLogin: true, nextUrl: url})}
                />
            );
        }
        return (
            <AjaxModal
                url={url}
                labelledById="report-abuse-title"
                preloader={preloadReportAbuseApp}
                {...modalProps}
            />
        );
    }

    render() {
        const {category, objectId, objectType, ...props} = this.props;
        return <ModalTrigger {...props} renderModal={this.renderModal} />;
    }
}
