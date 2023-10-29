import EmailIcon from '@udemy/icons/dist/email.ud-icon';
import FacebookMessengerIcon from '@udemy/icons/dist/facebook-messenger.ud-icon';
import FacebookIcon from '@udemy/icons/dist/facebook.ud-icon';
import TwitterIcon from '@udemy/icons/dist/twitter.ud-icon';
import WhatsAppIcon from '@udemy/icons/dist/whatsapp.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import Clipboard from 'clipboard';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './social-share-button.less';

const networkToIconMap = {
    facebook: FacebookIcon,
    mailto: EmailIcon,
    mail_ref: EmailIcon,
    twitter: TwitterIcon,
    whatsapp: WhatsAppIcon,
    messenger: FacebookMessengerIcon,
};

export default class SocialShareButton extends Component {
    static propTypes = {
        network: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        shareUrl: PropTypes.string.isRequired,
    };

    componentDidMount() {
        if (this.props.network === 'clipboard') {
            this.clipboard = new Clipboard('.js-social-share-clipboard button[type="submit"]', {
                text: () => {
                    return this.props.shareUrl;
                },
            });
        }
    }

    @autobind
    handleClick(event) {
        event && event.preventDefault();
        this.props.onClick(this.props.network);
    }

    renderClipboard() {
        return (
            <FormGroup
                label={gettext('Copy share link')}
                labelProps={{className: 'ud-sr-only'}}
                className="js-social-share-clipboard"
                styleName="text-input-form"
            >
                <TextInputForm
                    submitButtonContent={gettext('Copy')}
                    defaultValue={this.props.shareUrl}
                    onSubmit={this.handleClick}
                    readOnly={true}
                />
            </FormGroup>
        );
    }

    render() {
        const {network} = this.props;
        if (network === 'clipboard') {
            return this.renderClipboard();
        }

        return (
            <IconButton
                onClick={this.handleClick}
                round={true}
                styleName="icon-button"
                udStyle="secondary"
            >
                {React.createElement(networkToIconMap[network], {
                    label: false,
                })}
            </IconButton>
        );
    }
}
