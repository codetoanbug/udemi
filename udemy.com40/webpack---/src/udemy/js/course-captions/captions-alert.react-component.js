import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {ALERTS, COURSE_TRANSLATION_TYPE_NAME} from './constants';
import './captions-alert.less';

@inject('store')
@observer
export default class CaptionsAlert extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        alertCode: PropTypes.string.isRequired,
    };

    @autobind
    dismissSystemMessageAlert() {
        this.props.store.dismissSystemMessageAlertNotifyingServer(
            this._alert.systemMessageId,
            this.props.store.translationRecord.id,
            COURSE_TRANSLATION_TYPE_NAME,
        );
    }

    get _alert() {
        return ALERTS[this.props.alertCode];
    }

    render() {
        const {level, title, body, systemMessageId, footerLink} = this._alert;
        const interpolations = {
            locale: this.props.store.localeTitles[this.props.store.currentLocaleId],
        };

        const props = {
            udStyle: level || 'information',
            showCta: false,
            title: interpolate(title, interpolations, true),
            body:
                !body && !footerLink ? null : (
                    <>
                        {body && <p styleName="body">{interpolate(body, interpolations, true)}</p>}
                        {footerLink && (
                            <div className="ud-text-with-links" styleName="footer">
                                <a className="ud-heading-md" href={footerLink.href}>
                                    {interpolate(footerLink.title, interpolations, true)}
                                </a>
                            </div>
                        )}
                    </>
                ),
        };

        if (systemMessageId) {
            return this.props.store.hasSeenAlert(systemMessageId) ? null : (
                <AlertBanner
                    {...props}
                    data-purpose="caption-dismissible-alert"
                    styleName="alert-banner"
                    showCta={true}
                    ctaText={gettext('Dismiss')}
                    onAction={this.dismissSystemMessageAlert}
                    dismissButtonProps={false}
                />
            );
        }
        return <AlertBanner {...props} data-purpose="caption-alert" styleName="alert-banner" />;
    }
}
