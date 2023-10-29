import {getUniqueId} from '@udemy/design-system-utils';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {FooterButtons} from '@udemy/react-structure-components';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

import './error-display.less';

const udConfig = getConfigData();

export const SYSTEM_REQUIREMENTS_LINK = udLink.toSupportLink(
    'system_requirements',
    udConfig.brand.has_organization,
);

export const SUPPORT_LINK = udLink.toSupportLink(
    'video_audio_issues_troubleshooting',
    udConfig.brand.has_organization,
);

export const CONTACT_FORM_LINK = udLink.toSupportContact();

export const ERROR_BODY = [
    <p key="apology">
        {gettext(
            'We tried several times to play your video but there was an unforeseen error. ' +
                'We have notified our engineers.',
        )}
    </p>,
    <p
        key="systemcheck"
        {...safelySetInnerHTML({
            descriptionOfCaller: 'error-display:system-check-link',
            html: interpolate(
                gettext(
                    'To check your system configuration, please visit our <a href="%(link)s" target="_blank">system check page</a>.',
                ),
                {
                    link: udLink.toSupportSystemCheck(),
                },
                true,
            ),
        })}
    />,
    <p key="codec">
        {gettext('For some devices, a basic codec pack may need to be added to view this content.')}
    </p>,
    <p
        key="tryagain"
        {...safelySetInnerHTML({
            descriptionOfCaller: 'error-display:support-link',
            html: interpolate(
                gettext(
                    'Please try again in a few minutes or <a %(hyperlink)s>contact support</a>.',
                ),
                {
                    hyperlink: `href="${SUPPORT_LINK}" target="_blank"`,
                },
                true,
            ),
        })}
    />,
];

export const WIDEVINE_ERROR_BODY = [
    <p key="widevine-error-message">
        <span key="widevine-error-message-opening">
            {gettext('There was a problem with your system settings. ')}
        </span>
        <span
            key="widevine-system-requirements"
            {...safelySetInnerHTML({
                descriptionOfCaller: 'error-display:system-requirements-link',
                html: interpolate(
                    gettext(
                        'To check your settings, visit our <a %(hyperlink)s>System Requirements</a> ',
                    ),
                    {
                        hyperlink: `href="${SYSTEM_REQUIREMENTS_LINK}" target="_blank"`,
                    },
                    true,
                ),
            })}
        />
        <span
            key="widevine-trouble-shooting"
            {...safelySetInnerHTML({
                descriptionOfCaller: 'error-display:trouble-shooting-link',
                html: interpolate(
                    gettext(
                        'and <a %(hyperlink)s>How to Troubleshoot Audio & Video Issues</a> pages. ',
                    ),
                    {
                        hyperlink: `href="${SUPPORT_LINK}" target="_blank"`,
                    },
                    true,
                ),
            })}
        />
        <span key="widevine-error-message-closing">
            {gettext('If the problem continues, contact our support team.')}
        </span>
    </p>,
];

export const WIDEVINE_ERROR_FOOTER = [
    <Button
        data-purpose="widevine-error-message-contact-support-button"
        key="widevine-error-message-contact-support-button"
        componentClass="a"
        href={`${CONTACT_FORM_LINK}`}
    >
        {gettext('Contact support')}
    </Button>,
];

export default class ErrorDisplay extends React.Component {
    static propTypes = {
        player: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
        errorBody: PropTypes.node,
        errorFooter: PropTypes.node,
    };

    static defaultProps = {
        errorBody: ERROR_BODY,
        errorFooter: null,
    };

    labelledById = getUniqueId('error-display');

    get footer() {
        if (!this.props.errorFooter) {
            return null;
        }
        const dismissButton = (
            <Button
                data-purpose="error-display-dismiss-error-button"
                udStyle="ghost"
                onClick={this.props.store.hideError}
            >
                {gettext('Dismiss')}
            </Button>
        );
        return (
            <FooterButtons>
                {dismissButton}
                {this.props.errorFooter}
            </FooterButtons>
        );
    }

    render() {
        const componentNode = (
            <div styleName="dialog-container">
                <div styleName="scroll-wrapper">
                    <div
                        role="dialog"
                        tabIndex="-1"
                        aria-labelledby={this.labelledById}
                        styleName="dialog"
                    >
                        <div styleName="title-spacer">
                            <h2 id={this.labelledById} className="ud-heading-lg" styleName="title">
                                {gettext('Video error')}
                            </h2>
                        </div>
                        {this.props.errorBody}
                        {this.footer}
                        <IconButton
                            onClick={this.props.store.hideError}
                            udStyle="ghost"
                            size="medium"
                            styleName="close-button"
                            data-purpose="close-popup"
                        >
                            <CloseIcon color="neutral" label={gettext('Close')} />
                        </IconButton>
                    </div>
                </div>
            </div>
        );

        return ReactDOM.createPortal(componentNode, this.props.player.el());
    }
}
