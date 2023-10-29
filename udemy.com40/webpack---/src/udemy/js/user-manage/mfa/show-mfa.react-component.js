import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {MFABannerImpressionEvent} from 'browse/events';
import serverOrClient from 'utils/server-or-client';
import udLink from 'utils/ud-link';

import DisableMFAModal from './disable-mfa-modal.react-component';
import EnableMFAModal from './enable-mfa-modal.react-component';
import MFADescriptionBody from './mfa-description.react-component';
import './show-mfa.less';

class EnableMFAButton extends Component {
    static propTypes = {
        modalText: PropTypes.string,
    };

    static defaultProps = {
        modalText:
            "You'll have to do this once to use labs. This will log you out from every device where you're currently logged into Udemy.",
    };

    render() {
        const nextURL = new URL(window.location.href);
        nextURL.searchParams.set('mfaEnabled', String(true));
        const postSignInURL = udLink.toAuth({
            showLogin: true,
            nextUrl: nextURL.href,
            returnUrl: window.location.href,
            responseType: 'html',
            showInstructorSignup: false,
            locale: null,
            source: null,
            popupTrackingIdentifier: null,
            nextPath: null,
        });
        const mfaModalText = this.props.modalText;

        return <EnableMFAModal postSignInURL={postSignInURL} mfaModalText={mfaModalText} />;
    }
}
export default class ShowMFA extends Component {
    static propTypes = {
        isUserMFAEnabled: PropTypes.bool,
        showMFAToggle: PropTypes.bool,
        showMFABanner: PropTypes.bool,
        window: PropTypes.object,
        bannerText: PropTypes.string,
        className: PropTypes.string,
    };

    static defaultProps = {
        isUserMFAEnabled: false,
        showMFAToggle: true,
        showMFABanner: false,
        window: serverOrClient.global,
        bannerText:
            "You'll have to enable multi-factor authentication to start your lab. You'll only have to do this once.",
        className: undefined,
    };

    @autobind
    trackImpression() {
        Tracker.publishEvent(new MFABannerImpressionEvent());
    }

    render = () => {
        const {isUserMFAEnabled, showMFAToggle, showMFABanner, window, bannerText} = this.props;
        const searchParams = new URLSearchParams(window.location.search);
        const showSuccessBanner = searchParams.has('mfaEnabled');

        if (isUserMFAEnabled && !showSuccessBanner && showMFABanner) {
            return null;
        } else if (showMFABanner && isUserMFAEnabled) {
            return (
                <AlertBanner
                    className={this.props.className}
                    styleName="mfa-banner"
                    showCta={false}
                    title={gettext('You have enabled multi-factor authentication')}
                    udStyle="success"
                />
            );
        } else if (showMFABanner) {
            return (
                <TrackImpression trackFunc={this.trackImpression}>
                    <div>
                        <AlertBanner
                            className={this.props.className}
                            styleName="mfa-banner"
                            title={gettext("Let's secure your account")}
                            body={bannerText}
                            ctaText={gettext('Enable')}
                            dismissButtonText={gettext('Do this later')}
                            actionButtonProps={{componentClass: EnableMFAButton}}
                            dismissButtonProps={{size: 'large'}}
                        />
                    </div>
                </TrackImpression>
            );
        } else if (showMFAToggle) {
            return (
                <div className={this.props.className} styleName="mfa-panel">
                    <MFADescriptionBody userType={'student'} />
                    <div styleName="mfa-button-container">
                        {isUserMFAEnabled ? <DisableMFAModal /> : <EnableMFAModal />}
                    </div>
                </div>
            );
        }
        return null;
    };
}
