import CopyIcon from '@udemy/icons/dist/copy.ud-icon';
import {Button} from '@udemy/react-core-components';
import {AlertBannerProps, ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import {Panel} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import Clipboard from 'clipboard';
import {observer} from 'mobx-react';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {CLIPBOARD_ELEMENTS} from './constants';

import './aws-credentials.less';

interface AwsCredentialsProps {
    labInstance: {
        awsAccessKeyId: string;
        awsSecretAccessKey: string;
        awsSessionToken: string;
    };
}

@observer
export class AwsCredentials extends React.Component<AwsCredentialsProps> {
    constructor(props: AwsCredentialsProps) {
        super(props);
        this.unixClipboard = new Clipboard(CLIPBOARD_ELEMENTS.UNIX_CLIPBOARD);
        this.unixClipboard.on('success', this.onCopySuccess);
        this.winClipboard = new Clipboard(CLIPBOARD_ELEMENTS.WIN_CLIPBOARD);
        this.winClipboard.on('success', this.onCopySuccess);
    }

    unixClipboard: Clipboard;
    winClipboard: Clipboard;

    @autobind
    onCopySuccess() {
        const bannerProps = {
            udStyle: 'success',
            title: gettext('Copied to clipboard'),
            ctaText: gettext('Dismiss'),
            dismissButtonProps: false,
        } as AlertBannerProps;
        toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
    }

    buildKeyText(command: string, lineDelimiter: string, {labInstance}: AwsCredentialsProps) {
        const {awsAccessKeyId, awsSecretAccessKey, awsSessionToken} = labInstance;
        let text = `${command} AWS_ACCESS_KEY_ID=${awsAccessKeyId}${lineDelimiter}`;
        text += `${command} AWS_SECRET_ACCESS_KEY=${awsSecretAccessKey}${lineDelimiter}`;
        text += `${command} AWS_SESSION_TOKEN=${awsSessionToken}${lineDelimiter}`;
        return text;
    }

    render() {
        const labInstance = this.props.labInstance;
        const unixKeyText = this.buildKeyText('export', '\n', {labInstance});
        const unixKeyHtml = this.buildKeyText('export', '<br />', {labInstance});
        const winKeyText = this.buildKeyText('set', '\n', {labInstance});
        const winKeyHtml = this.buildKeyText('set', '<br />', {labInstance});
        return (
            <div>
                <p>
                    {gettext(
                        'Use these AWS Credentials in the AWS CLI or other AWS command line tools.',
                    )}
                </p>
                <p>{gettext('Copy and paste the following to your terminal:')}</p>
                <div styleName="os-header">
                    <h4 className="ud-text-bold">{gettext('Linux/MacOS')}</h4>
                    <Button
                        id="unix-keys"
                        data-clipboard-text={unixKeyText}
                        udStyle="secondary"
                        size="xsmall"
                    >
                        <CopyIcon styleName="copy-icon" label={false} />
                        <span>{gettext('Copy')}</span>
                    </Button>
                </div>
                <Panel
                    className="ud-text-sm"
                    styleName="multi-line-code"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'lab-aws-key-script-unix',
                        html: unixKeyHtml,
                    })}
                />
                <div styleName="os-header">
                    <h4 className="ud-text-bold">{gettext('Windows')}</h4>
                    <Button
                        id="win-keys"
                        data-clipboard-text={winKeyText}
                        udStyle="secondary"
                        size="xsmall"
                    >
                        <CopyIcon styleName="copy-icon" label={false} />
                        <span>{gettext('Copy')}</span>
                    </Button>
                </div>
                <Panel
                    className="ud-text-sm"
                    styleName="multi-line-code"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'lab-aws-key-script-win',
                        html: winKeyHtml,
                    })}
                />
                <p styleName="additional-notes">
                    {gettext(
                        'These settings will be available until the end of your shell session. If you switch to a new terminal you will need to copy and paste these settings again.',
                    )}
                </p>
            </div>
        );
    }
}
